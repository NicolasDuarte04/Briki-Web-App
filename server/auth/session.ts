import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';

// Define the session configuration
export function configureSession() {
  // Ensure we have a session secret
  if (!process.env.SESSION_SECRET) {
    console.warn('No SESSION_SECRET provided. Using a generated secret (not recommended for production)');
  }
  
  const sessionSecret = process.env.SESSION_SECRET || uuidv4();
  
  // Session configuration with secure cookies in production
  return session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    }
  });
}

// Middleware to check if a user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Return 401 for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // Store the requested URL for redirecting after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth');
}

// Helper to get safe user data (no sensitive info)
export function getSafeUser(user: any) {
  if (!user) return null;
  
  // Only return non-sensitive user data
  const { password, ...safeUser } = user;
  return safeUser;
}