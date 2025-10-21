# Backend Deployment Guide

## Vercel Deployment

### Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Create a Vercel account at [vercel.com](https://vercel.com)

### Environment Variables
Before deploying, you need to set up environment variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
BASE_URL=https://your-vercel-app.vercel.app
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Deployment Steps

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy from the server directory:**
   ```bash
   cd server
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new one
   - Set the project name
   - Deploy

### Important Notes

- **Database**: Make sure your MongoDB allows connections from Vercel's IP ranges
- **Redis**: Use a cloud Redis service like Redis Cloud or Upstash
- **BASE_URL**: Update this to your Vercel deployment URL
- **CORS**: The app is configured to allow your frontend URL in production

### File Structure
```
server/
├── vercel.json          # Vercel configuration
├── index.js            # Main server file (modified for Vercel)
├── package.json        # Dependencies and scripts
└── ...                 # Other server files
```

### Vercel Configuration (`vercel.json`)
- Routes all requests to `index.js`
- Sets up Node.js runtime
- Configures 30-second timeout for functions
- Sets production environment

### Testing Deployment
After deployment, test these endpoints:
- `GET /api/auth/login` - Authentication
- `POST /api/urls/create` - URL creation
- `GET /:shortId` - URL redirection

### Troubleshooting
- Check Vercel function logs for errors
- Ensure all environment variables are set
- Verify database connection strings
- Check CORS configuration for frontend integration