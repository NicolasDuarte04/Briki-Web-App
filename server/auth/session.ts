import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import connectPgSimple from 'connect-pg-simple';
import { pool } from '../db';

// Define the session configuration
export function configureSession() {
  if (!process.env.SESSION_SECRET) {
    console.warn('No SESSION_SECRET provided. Using a default secret (not recommended for production)');
  }
  
  const sessionSecret = process.env.SESSION_SECRET || 'briki-secure-session-secret';
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use PostgreSQL for session storage (more reliable than memory store)
  const PgStore = connectPgSimple(session);
  const sessionStore = new PgStore({
    pool,
    tableName: 'sessions',
    createTableIfMissing: true,
    ttl: sessionTtl / 1000, // Convert from ms to seconds
  });
  
  // Session configuration with secure cookies in production
  return session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: sessionTtl,
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
  
  // For non-API routes, redirect to login
  res.redirect('/auth?redirectTo=' + encodeURIComponent(req.originalUrl));
}

// Helper to get safe user data (no sensitive info)
export function getSafeUser(user: any) {
  if (!user) return null;
  
  // Only return non-sensitive user data
  const { password, ...safeUser } = user;
  return safeUser;
}