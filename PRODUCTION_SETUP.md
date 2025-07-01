# Production Setup Guide for Briki

## Environment Variables

### Frontend (Vercel)

Add these environment variables in your Vercel project settings:

```env
# Backend API URL (your Replit backend URL)
VITE_API_URL=https://your-backend-name.replit.app

# Optional: Google Analytics
VITE_GA_MEASUREMENT_ID=your-ga-id
```

### Backend (Replit)

Add these environment variables in your Replit secrets:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o

# Database Configuration  
DATABASE_URL=your-postgres-connection-string

# Session Configuration
SESSION_SECRET=your-session-secret-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (optional)
STRIPE_SECRET_KEY=your-stripe-secret-key

# Frontend URL (for CORS)
FRONTEND_URL=https://brikiapp.com

# Port (Replit usually sets this automatically)
PORT=5000
```

## Debugging the "string did not match the expected pattern" Error

This error typically occurs when:

1. **Missing VITE_API_URL**: The frontend doesn't know where to send API requests
   - Solution: Set `VITE_API_URL` in Vercel to your Replit backend URL

2. **CORS Issues**: The backend is blocking requests from your frontend domain
   - Solution: Ensure `FRONTEND_URL` is set in Replit to match your Vercel domain

3. **URL Format Issues**: The API URL might have formatting problems
   - Make sure the URL doesn't have trailing slashes
   - Example: `https://backend.replit.app` (NOT `https://backend.replit.app/`)

## Testing the Setup

1. Check if the backend is accessible:
   ```bash
   curl https://your-backend.replit.app/api/health
   ```

2. Check CORS headers:
   ```bash
   curl -H "Origin: https://brikiapp.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://your-backend.replit.app/api/ai/chat -v
   ```

3. Monitor browser console for specific errors when using the chat feature

## Common Issues

### Issue: API requests fail with CORS errors
- Ensure the backend is running and accessible
- Check that FRONTEND_URL environment variable matches your Vercel domain
- Verify CORS configuration in server/index.ts

### Issue: OpenAI API errors
- Verify OPENAI_API_KEY is set correctly in Replit
- Check OpenAI API quota and billing status
- Ensure the API key has the necessary permissions

### Issue: Database connection errors  
- Verify DATABASE_URL is correctly formatted
- Check database is accessible from Replit
- Ensure database SSL settings match your provider's requirements 