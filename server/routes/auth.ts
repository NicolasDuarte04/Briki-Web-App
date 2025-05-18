import { Router, Request, Response } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';
import { requireAuth, getSafeUser } from '../auth/session';
import { googleAuthRedirect, googleAuthCallback } from '../auth/google-auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get current authenticated user
router.get('/user', requireAuth, async (req: Request, res: Response) => {
  try {
    // User should already be available from session
    return res.json(getSafeUser(req.user));
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// Local login with email/password
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password (skip for users created with Google Auth)
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // User exists but has no password (Google account)
      return res.status(401).json({ 
        message: 'This account was created with Google. Please use Google Sign-In.' 
      });
    }
    
    // Log in the user with Passport
    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Login failed' });
      }
      
      return res.json({ user: getSafeUser(user) });
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
});

// User registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Check if email already exists
    const existingEmail = await storage.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user (username will be generated from email in storage.createUser)
    const newUser = await storage.createUser({
      id: uuidv4(),
      email,
      password: hashedPassword,
      role: "user", // Default role
    });
    
    // Log in the new user
    req.login(newUser, (err) => {
      if (err) {
        console.error('User registration login error:', err);
        return res.status(500).json({ message: 'Registration succeeded but login failed' });
      }
      
      return res.status(201).json({ user: getSafeUser(newUser) });
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'An error occurred during registration' });
  }
});

// Log out
router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    
    // Destroy session
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('Session destruction error:', sessionErr);
      }
      
      res.clearCookie('connect.sid');
      return res.json({ message: 'Logged out successfully' });
    });
  });
});

// Google OAuth routes
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);
// Add support for alternate callback format that Google might use
router.get('/callback/google', googleAuthCallback);

export default router;