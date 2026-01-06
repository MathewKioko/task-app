# Task App Deployment Guide

## Complete Full-Stack Deployment

This guide will help you deploy your Task App so it works on all devices (phones, tablets, etc.) with full functionality.

### Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app) and sign up
2. Connect your GitHub repository
3. Import the `backend` directory as a new service
4. Railway will automatically use the `Dockerfile` and `railway.json` for deployment
5. Set environment variables in Railway:
   - `DATABASE_URL`: Your database connection string
   - `PORT`: `3000` (default)
6. Deploy the backend service

### Step 2: Configure Cloudflare Worker

1. Go to your Cloudflare Workers dashboard
2. Add a new environment variable:
   - **Name**: `BACKEND_URL`
   - **Value**: Your Railway backend URL (e.g., `https://your-app.up.railway.app`)
3. Redeploy your Worker

### Step 3: Test the Application

Your app should now be fully functional:
- Frontend: https://task-app.mathewkioko2006.workers.dev/
- Backend API: Your Railway URL

### Alternative: Use Render for Backend

If you prefer Render:
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Select the `backend` directory
5. Set build command: `npm run build`
6. Set start command: `node dist/server.js`
7. Add environment variables (DATABASE_URL, PORT)

### Database Setup

For the database, you can use:
- **Neon.tech** (PostgreSQL, free tier)
- **PlanetScale** (MySQL, free tier)
- **Railway** (PostgreSQL, included)

### Environment Variables

**Frontend (Cloudflare Worker):**
- `BACKEND_URL`: Your backend service URL

**Backend (Railway/Render):**
- `DATABASE_URL`: Database connection string
- `PORT`: `3000` (default)

### Troubleshooting

1. **CORS Issues**: Ensure your backend allows requests from your Cloudflare domain
2. **Database Connection**: Verify your DATABASE_URL is correct
3. **API Not Working**: Check that BACKEND_URL is set in Cloudflare Worker environment variables

### Full Functionality

Once deployed:
- ✅ Create, edit, delete tasks
- ✅ Mark tasks as complete
- ✅ View tasks by status
- ✅ Works on phones, tablets, and desktop
- ✅ Data persists in database
- ✅ Real-time updates