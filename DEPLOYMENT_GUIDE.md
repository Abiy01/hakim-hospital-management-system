# Deployment Guide for Hakim Hospital Management System

This guide will help you deploy the frontend to Vercel and the backend to Render.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- MongoDB Atlas account (or your MongoDB connection string)
- Cloudinary account (for image uploads)

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment

1. **Update Environment Variables**
   - Navigate to `Backend/config/config.env`
   - Update the following values:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET_KEY`: A strong, random secret key
     - `FRONTEND_URL`: Your Vercel frontend URL (you'll update this after frontend deployment)
     - `DASHBOARD_URL`: Your Vercel dashboard URL (if deploying separately)
     - `CLOUDINARY_*`: Your Cloudinary credentials

### Step 2: Deploy Backend to Render

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create a New Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the Service**
   - **Name**: `hakim-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`
   - **Root Directory**: Leave empty (or set to `Backend` if needed)

4. **Set Environment Variables in Render**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_strong_secret_key
   JWT_EXPIRES=7d
   COOKIE_EXPIRE=7
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app
   DASHBOARD_URL=https://your-dashboard.vercel.app (optional)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Wait for deployment to complete
   - **Copy the service URL** (e.g., `https://hakim-backend.onrender.com`)

### Step 3: Update CORS Settings

After deployment, update the `FRONTEND_URL` and `DASHBOARD_URL` in Render's environment variables with your actual Vercel URLs.

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Deployment

1. **Create Environment File**
   - In the `frontend` directory, create a `.env` file (or use `.env.production`)
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL

2. **Update Navbar Admin Dashboard Link** (if needed)
   - The admin dashboard link in `frontend/src/components/Navbar.jsx` currently points to `http://localhost:5174`
   - You may want to make this configurable or update it to your deployed dashboard URL

### Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional, you can also use the web interface)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```
   - Replace with your actual Render backend URL

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - **Copy the deployment URL** (e.g., `https://hakim-frontend.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel frontend URL
3. Redeploy the backend (or it will auto-redeploy)

---

## Part 3: Dashboard Deployment (Optional - if deploying separately)

If you want to deploy the admin dashboard separately:

1. **Create Environment File**
   - In the `dashboard` directory, create a `.env` file
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```

2. **Deploy to Vercel**
   - Create a new Vercel project
   - Root Directory: `dashboard`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add environment variable: `VITE_API_URL`

3. **Update Backend CORS**
   - Add the dashboard URL to `DASHBOARD_URL` in Render

---

## Part 4: Post-Deployment Checklist

- [ ] Backend is accessible and responding
- [ ] Frontend can connect to backend (check browser console for errors)
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] MongoDB connection is working
- [ ] Cloudinary image uploads are working
- [ ] Authentication (login/register) works
- [ ] All API endpoints are accessible
- [ ] Cookies are being set correctly (check browser DevTools)

---

## Troubleshooting

### Backend Issues

1. **Build Fails**
   - Check that `package.json` has correct `start` script
   - Verify all dependencies are listed
   - Check Render build logs

2. **Server Crashes**
   - Check Render logs for errors
   - Verify environment variables are set
   - Ensure MongoDB connection string is correct

3. **CORS Errors**
   - Verify `FRONTEND_URL` and `DASHBOARD_URL` in backend environment variables
   - Check that URLs don't have trailing slashes
   - Ensure backend is allowing credentials

### Frontend Issues

1. **API Calls Fail**
   - Verify `VITE_API_URL` is set correctly
   - Check browser console for errors
   - Ensure backend URL is accessible

2. **Build Fails**
   - Check that all dependencies are installed
   - Verify `vite.config.js` is correct
   - Check Vercel build logs

3. **Authentication Issues**
   - Verify cookies are being set (check browser DevTools)
   - Ensure `withCredentials: true` is set in axios calls
   - Check CORS settings on backend

### Common Environment Variable Issues

- **Missing Variables**: Ensure all required variables are set
- **Wrong Values**: Double-check URLs don't have trailing slashes
- **Case Sensitivity**: Environment variable names are case-sensitive

---

## Important Notes

1. **Render Free Tier**: 
   - Services may spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading for production use

2. **Vercel Free Tier**:
   - Generous limits for most use cases
   - Automatic HTTPS
   - Global CDN

3. **Security**:
   - Never commit `.env` files to Git
   - Use strong JWT secrets
   - Keep MongoDB connection strings secure
   - Regularly update dependencies

4. **Performance**:
   - Enable caching where appropriate
   - Optimize images before upload
   - Consider using a CDN for static assets

---

## Support

If you encounter issues:
1. Check the deployment logs in Render/Vercel
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure backend is running and accessible

---

## Quick Reference

### Backend (Render)
- **Service Type**: Web Service
- **Build Command**: `cd Backend && npm install`
- **Start Command**: `cd Backend && npm start`
- **Port**: Set via `PORT` environment variable (Render assigns automatically)

### Frontend (Vercel)
- **Framework**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables Needed

**Backend (Render)**:
- `MONGO_URI`
- `JWT_SECRET_KEY`
- `JWT_EXPIRES`
- `COOKIE_EXPIRE`
- `PORT`
- `FRONTEND_URL`
- `DASHBOARD_URL` (optional)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NODE_ENV=production`

**Frontend (Vercel)**:
- `VITE_API_URL`

**Dashboard (Vercel - if separate)**:
- `VITE_API_URL`

