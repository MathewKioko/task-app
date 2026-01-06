# Task App Deployment Guide

## Complete Full-Stack Deployment

This guide will help you deploy your Task App so it works on all devices (phones, tablets, etc.) with full functionality.

### Your Database Connection

You already have a PostgreSQL database set up with Neon.tech:
```
DATABASE_URL="postgresql://neondb_owner:npg_7CQkMpS6qGYF@ep-noisy-butterfly-aduts8yj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Step 1: Deploy Backend to Render

1. Go to [Render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Create a new **Web Service**
4. Select the `backend` directory from your repository
5. Set the following configuration:
   - **Build Command**: `npm run build`
   - **Start Command**: `node dist/server.js`
   - **Region**: Choose closest to your users
6. Add environment variables:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_7CQkMpS6qGYF@ep-noisy-butterfly-aduts8yj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `PORT`: `3000`
7. Deploy the service

### Step 2: Configure Cloudflare Worker

1. Go to your Cloudflare Workers dashboard
2. Add a new environment variable:
   - **Name**: `BACKEND_URL`
   - **Value**: Your Render backend URL (e.g., `https://task-app-backend.onrender.com`)
3. Redeploy your Worker

### Step 3: Test the Application

Your app should now be fully functional:
- Frontend: https://task-app.mathewkioko2006.workers.dev/
- Backend API: Your Render URL (e.g., `https://task-app-backend.onrender.com`)

### Database Setup

✅ **Already Set Up!** You have PostgreSQL on Neon.tech with:
- Connection string ready to use
- Free tier with 10GB storage
- SSL enabled for security

### Environment Variables

**Frontend (Cloudflare Worker):**
- `BACKEND_URL`: Your Render backend URL

**Backend (Render):**
- `DATABASE_URL`: `postgresql://neondb_owner:npg_7CQkMpS6qGYF@ep-noisy-butterfly-aduts8yj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- `PORT`: `3000` (default)

### Render Configuration Files

✅ **Already Included!** The repository contains:
- [`backend/Dockerfile`](./backend/Dockerfile:1) - Container setup
- [`backend/render.yaml`](./backend/render.yaml:1) - Render deployment configuration

### Troubleshooting

1. **CORS Issues**: Ensure your backend allows requests from your Cloudflare domain
2. **Database Connection**: Your Neon.tech connection is already configured
3. **API Not Working**: Check that BACKEND_URL is set in Cloudflare Worker environment variables
4. **Render Build Failures**: Make sure you're selecting the `backend` directory, not the root

### Full Functionality

Once deployed:
- ✅ Create, edit, delete tasks
- ✅ Mark tasks as complete
- ✅ View tasks by status
- ✅ Works on phones, tablets, and desktop
- ✅ Data persists in your Neon.tech PostgreSQL database
- ✅ Real-time updates