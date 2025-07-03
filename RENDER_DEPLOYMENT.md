# 🚀 Render Deployment Guide

## Required Environment Variables

Configure these environment variables in your Render dashboard under **Environment** tab:

### 🔑 **Core Database**
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

### 🤖 **AI Services** 
```bash
# Required for AI features
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o

# Optional: Document summaries (PDF analysis)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### 🔐 **Authentication**
```bash
# Required for sessions
SESSION_SECRET=your-super-secure-session-secret-at-least-32-chars

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 🌐 **Application Settings**
```bash
# Environment
NODE_ENV=production

# Optional: Custom domain
PUBLIC_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# Optional: Port (Render sets this automatically)
PORT=5051
```

### 💳 **Optional Services**
```bash
# Stripe payments (if using)
STRIPE_SECRET_KEY=sk_live_your-stripe-key

# RUNT vehicle data (Colombia)
RUNT_API_URL=your-runt-api-url
RUNT_API_KEY=your-runt-api-key
USE_MOCK_RUNT=true
```

---

## 🎯 **Minimal Setup (Quick Start)**

For basic functionality, you only need:

```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
SESSION_SECRET=your-32-char-secret
NODE_ENV=production
```

**Note:** PDF analysis will be disabled without Supabase, but all other features work.

---

## 🔧 **Render Configuration**

### **Build Settings**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** Use default (22.x)

### **Auto-Deploy**
- Connect your GitHub repository
- Enable auto-deploy from `main` branch
- Set environment variables in Render dashboard

---

## ✅ **Deployment Checklist**

- [ ] Database configured and accessible
- [ ] OpenAI API key valid and has credits
- [ ] Session secret is 32+ characters
- [ ] Environment variables saved in Render
- [ ] Repository connected to Render
- [ ] Build succeeds without errors
- [ ] Application starts and serves on assigned port

---

## 🐛 **Troubleshooting**

### **"supabaseUrl is required" Error**
✅ **Fixed**: Supabase is now optional. PDF features disabled if not configured.

### **Database Connection Issues**
```bash
# Check your DATABASE_URL format:
postgresql://user:password@host:port/database
```

### **OpenAI API Errors**
- Verify API key is valid
- Check OpenAI account has credits
- Ensure no rate limits exceeded

### **Build Failures**
- Check Node version compatibility
- Verify all dependencies install correctly
- Review build logs for specific errors

---

## 📞 **Support**

If deployment fails:
1. Check Render logs for specific errors
2. Verify all required environment variables are set
3. Test locally with same environment variables
4. Review this deployment guide for missing steps

**Environment Variables Status:**
- ✅ **Database**: Required - App won't start
- ✅ **OpenAI**: Required - AI features won't work  
- ⚠️ **Supabase**: Optional - PDF analysis disabled
- ✅ **Session**: Required - Auth won't work
- ⚠️ **Google OAuth**: Optional - Google login disabled
- ⚠️ **Stripe**: Optional - Payments disabled 