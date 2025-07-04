# Google OAuth Configuration Fix

## Issue
Google OAuth is redirecting to `localhost:5050` instead of `https://brikiapp.com`.

## Solution
Update the Google Cloud Console OAuth 2.0 configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to APIs & Services > Credentials
4. Click on your OAuth 2.0 Client ID
5. Update the Authorized redirect URIs:

### Remove:
- `http://localhost:5050/api/auth/callback/google`
- `http://localhost:5050/api/auth/google/callback`

### Add:
- `https://brikiapp.com/api/auth/callback/google`
- `https://brikiapp.com/api/auth/google/callback`
- `https://www.brikiapp.com/api/auth/callback/google` (if using www)
- `https://www.brikiapp.com/api/auth/google/callback` (if using www)

### For Development (keep these):
- `http://localhost:5050/api/auth/callback/google`
- `http://localhost:5050/api/auth/google/callback`

6. Save the changes
7. Wait 5-10 minutes for changes to propagate

## Server Configuration
The server code is already correctly configured to use:
- Production: `https://brikiapp.com`
- Development: `http://localhost:5050`

Based on the `NODE_ENV` and `PUBLIC_URL` environment variables. 