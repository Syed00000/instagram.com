const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    googleId: {
        type: String,
        sparse: true
    },
    email: {
        type: String,
        default: ''
    },
    displayName: {
        type: String,
        default: ''
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    accessToken: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String,
        default: ''
    },
    googlePhotos: {
        type: Array,
        default: []
    },
    googleContacts: {
        type: Array,
        default: []
    },
    loginMethod: {
        type: String,
        enum: ['google', 'facebook', 'manual'],
        default: 'manual'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
