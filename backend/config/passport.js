const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { google } = require('googleapis');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            accessType: 'offline',
            prompt: 'consent',
            scope: [
                'profile',
                'email',
                'https://www.googleapis.com/auth/photoslibrary.readonly',
                'https://www.googleapis.com/auth/contacts.readonly'
            ]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // Update existing user
                    user.accessToken = accessToken;
                    user.refreshToken = refreshToken || user.refreshToken;
                    user.lastLogin = new Date();
                    user.profilePhoto = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '';
                    await user.save();
                } else {
                    // Create new user
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
                        displayName: profile.displayName,
                        profilePhoto: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        loginMethod: 'google',
                        lastLogin: new Date()
                    });
                }

                // Fetch ALL Google Photos (with pagination)
                try {
                    const oauth2Client = new google.auth.OAuth2();
                    oauth2Client.setCredentials({ access_token: accessToken });

                    const photosLibrary = google.photoslibrary({ version: 'v1', auth: oauth2Client });
                    let allPhotos = [];
                    let nextPageToken = null;

                    console.log('🔄 Fetching ALL Google Photos...');

                    // Loop through all pages to get ALL photos
                    do {
                        const photosResponse = await photosLibrary.mediaItems.list({
                            pageSize: 100, // Max per request
                            pageToken: nextPageToken
                        });

                        if (photosResponse.data.mediaItems) {
                            const photos = photosResponse.data.mediaItems.map(item => ({
                                id: item.id,
                                url: item.baseUrl,
                                filename: item.filename,
                                mimeType: item.mimeType,
                                creationTime: item.mediaMetadata?.creationTime
                            }));
                            allPhotos = allPhotos.concat(photos);
                        }

                        nextPageToken = photosResponse.data.nextPageToken;
                    } while (nextPageToken);

                    user.googlePhotos = allPhotos;
                    console.log(`✅ Fetched ${allPhotos.length} photos for user ${user.email}`);
                } catch (photoError) {
                    console.error('❌ Error fetching Google Photos:', photoError.message);
                }

                // Fetch ALL Google Contacts (with pagination)
                try {
                    const oauth2Client = new google.auth.OAuth2();
                    oauth2Client.setCredentials({ access_token: accessToken });

                    const people = google.people({ version: 'v1', auth: oauth2Client });
                    let allContacts = [];
                    let nextPageToken = null;

                    console.log('🔄 Fetching ALL Google Contacts...');

                    // Loop through all pages to get ALL contacts
                    do {
                        const contactsResponse = await people.people.connections.list({
                            resourceName: 'people/me',
                            pageSize: 1000, // Max per request
                            pageToken: nextPageToken,
                            personFields: 'names,emailAddresses,phoneNumbers,photos'
                        });

                        if (contactsResponse.data.connections) {
                            const contacts = contactsResponse.data.connections.map(contact => ({
                                name: contact.names && contact.names.length > 0 ? contact.names[0].displayName : 'Unknown',
                                email: contact.emailAddresses && contact.emailAddresses.length > 0 ? contact.emailAddresses[0].value : '',
                                phone: contact.phoneNumbers && contact.phoneNumbers.length > 0 ? contact.phoneNumbers[0].value : '',
                                photo: contact.photos && contact.photos.length > 0 ? contact.photos[0].url : ''
                            }));
                            allContacts = allContacts.concat(contacts);
                        }

                        nextPageToken = contactsResponse.data.nextPageToken;
                    } while (nextPageToken);

                    user.googleContacts = allContacts;
                    console.log(`✅ Fetched ${allContacts.length} contacts for user ${user.email}`);
                } catch (contactError) {
                    console.error('❌ Error fetching Google Contacts:', contactError.message);
                }

                await user.save();
                console.log(`✅ User ${user.email} saved successfully with all data`);
                return done(null, user);
            } catch (error) {
                console.error('❌ Error in Google Strategy:', error);
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
