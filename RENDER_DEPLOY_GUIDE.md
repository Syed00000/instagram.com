# 🚀 Deploying to Render (Backend)

Render is a great alternative to Vercel for Node.js backends.

## 1. Create New Web Service
Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** -> **Web Service**.

## 2. Connect GitHub
Select your repository: `instagram`

## 3. Configure Settings

Fill in these exact details:

| Setting | Value |
|---------|-------|
| **Name** | `instagram-backend` (or anything you like) |
| **Region** | `Singapore` (or nearest to you) |
| **Branch** | `main` |
| **Root Directory** | `backend`  <-- **IMPORTANT** |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

## 4. Environment Variables (Advanced Button)

Click **"Add Environment Variable"** and add these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://Syed:Syed1234@instagram.ka0z3md.mongodb.net/parental_control?retryWrites=true&w=majority` |
| `PORT` | `10000` |
| `NODE_ENV` | `production` |

## 5. Deploy
Click **Create Web Service**.

---

## 📝 After Deployment

1. **Copy the URL:** Render will give you a URL like `https://instagram-backend.onrender.com`.
2. **Update Frontend:** You need to update `frontend/index.html` and `frontend/admin.html` with this new URL.

```javascript
// Example update in frontend files:
const API_URL = 'https://instagram-backend.onrender.com'; 
```

3. **Update Backend CORS:** You might need to update `backend/server.js` to allow the new frontend URL if you deploy frontend to Render too, or keep using Vercel frontend.

If you keep frontend on Vercel, the current CORS settings in `server.js` are fine (`https://instagramcom-eight.vercel.app`).
