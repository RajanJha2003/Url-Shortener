# Frontend Deployment Guide

## Vercel Deployment

### Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Create a Vercel account at [vercel.com](https://vercel.com)

### Environment Variables
Set up environment variables in Vercel dashboard:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:

```
VITE_API_URL=https://your-backend-vercel-app.vercel.app
VITE_APP_NAME=URL Shortener
```

### Deployment Steps

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy from the client directory:**
   ```bash
   cd client
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new one
   - Set the project name
   - Deploy

### Build Configuration

The `vercel.json` is configured to:
- Use `@vercel/static-build` for React apps
- Output to `dist` directory (Vite default)
- Handle client-side routing with fallback to `index.html`
- Serve static assets from `/assets/`

### Environment Setup

**Development:**
```bash
# .env (local development)
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=URL Shortener
```

**Production:**
```bash
# Vercel Environment Variables
VITE_API_URL=https://your-backend.vercel.app
VITE_APP_NAME=URL Shortener
```

### File Structure
```
client/
├── vercel.json          # Vercel configuration
├── vite.config.js       # Vite build configuration
├── package.json         # Dependencies and scripts
├── .env                 # Local environment variables
├── .env.example         # Environment template
└── src/                 # React source code
```

### Build Optimization

The Vite config includes:
- **Code splitting**: Separate chunks for vendor, router, and redux
- **Source maps**: Disabled in production for smaller builds
- **Asset optimization**: Automatic optimization of images and assets

### Testing Deployment

After deployment, verify:
1. **Home page** loads correctly
2. **Authentication** works with backend
3. **URL shortening** functionality
4. **Dashboard** displays user URLs
5. **Routing** works for all pages

### Troubleshooting

**Common Issues:**
- **CORS errors**: Ensure backend CORS is configured for your frontend URL
- **API calls fail**: Check `VITE_API_URL` environment variable
- **Routing issues**: Verify `vercel.json` routes configuration
- **Build errors**: Check for missing dependencies or syntax errors

**Debug Steps:**
1. Check Vercel function logs
2. Verify environment variables are set
3. Test API endpoints directly
4. Check browser console for errors

### Performance Tips

- Use lazy loading for routes
- Optimize images and assets
- Enable compression in Vercel
- Use CDN for static assets
- Monitor Core Web Vitals in Vercel Analytics