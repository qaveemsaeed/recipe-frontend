# Railway Deployment Guide

This guide will help you deploy your React frontend and Node.js backend to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your backend code ready for deployment
3. Git repository with your code

## Backend Deployment

### 1. Prepare Your Backend

Make sure your backend has the following files:

```json
// package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Deploy Backend to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your backend repository
4. Railway will automatically detect it's a Node.js app
5. Set environment variables in Railway dashboard:
   - `DATABASE_URL` (if using database)
   - `JWT_SECRET`
   - `PORT` (Railway sets this automatically)
   - Any other environment variables your backend needs

### 3. Get Your Backend URL

After deployment, Railway will provide a URL like:
`https://your-backend-app-name.railway.app`

## Frontend Deployment

### 1. Update API Configuration

Update the API URL in `src/config/api.js` with your backend URL:

```javascript
// Replace 'your-backend-app-name' with your actual Railway app name
return import.meta.env.VITE_API_URL || 'https://your-backend-app-name.railway.app';
```

### 2. Deploy Frontend to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your frontend repository
4. Railway will use the `railway.json` and `nixpacks.toml` files for configuration

### 3. Set Environment Variables

In your frontend Railway project, set these environment variables:

- `VITE_API_URL`: Your backend Railway URL (e.g., `https://your-backend-app-name.railway.app`)

### 4. Deploy

Railway will automatically:
1. Install dependencies (`npm ci`)
2. Build the project (`npm run build`)
3. Start the preview server (`npm run preview`)

## Environment Variables

### Backend Environment Variables (set in Railway dashboard)

```bash
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=production
```

### Frontend Environment Variables (set in Railway dashboard)

```bash
VITE_API_URL=https://your-backend-app-name.railway.app
```

## Custom Domains (Optional)

1. In Railway dashboard, go to your project
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring and Logs

- View logs in Railway dashboard
- Monitor performance and errors
- Set up alerts for downtime

## Troubleshooting

### Common Issues

1. **Build fails**: Check the build logs in Railway dashboard
2. **API calls fail**: Verify `VITE_API_URL` is set correctly
3. **CORS errors**: Ensure your backend allows requests from your frontend domain
4. **Environment variables not working**: Make sure they're set in Railway dashboard, not in code

### CORS Configuration

In your backend, ensure CORS is configured to allow your frontend domain:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-app-name.railway.app',
    'http://localhost:5173' // for local development
  ],
  credentials: true
}));
```

## Security Considerations

1. Never commit sensitive environment variables to Git
2. Use Railway's environment variable system
3. Enable HTTPS (Railway does this automatically)
4. Set up proper CORS configuration
5. Use environment-specific API URLs

## Performance Optimization

1. Enable gzip compression in your backend
2. Use CDN for static assets
3. Implement proper caching headers
4. Monitor and optimize database queries

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway) 