import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure Google OAuth
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("Google OAuth credentials not found. Google authentication will be disabled.");
} else {
  // Set up production or development callback URL
  const callbackURL = process.env.NODE_ENV === "production"
    ? `${process.env.PUBLIC_URL || 'https://brikiapp.com'}/api/auth/callback/google`
    : "http://localhost:5000/api/auth/callback/google";

  // Configure Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract profile information
      const { id, displayName, emails, photos } = profile;
      
      if (!emails || emails.length === 0) {
        return done(new Error('No email found in Google profile'), false);
      }
      
      // Create or update user in our database
      const email = emails[0].value;
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        // Update existing user with latest Google profile information
        // Merge Google profile info into existing company_profile
        const currentProfile = existingUser.company_profile || {};
        const updatedProfile = {
          ...currentProfile,
          googleId: id,
          profileImageUrl: photos?.[0]?.value,
          registeredWith: "google"
        };
        
        const updatedUser = await storage.updateUser({
          id: existingUser.id,
          company_profile: updatedProfile
        });
        
        return done(null, updatedUser);
      } else {
        // Create new user from Google profile
        // Generate a username and name from email
        const username = email.split('@')[0];
        const name = displayName || username;
        
        const newUser = await storage.createUser({
          email: email,
          username: username,
          name: name,
          role: "user", // Default role
          // Store Google profile info in company_profile field (JSON)
          company_profile: {
            googleId: id,
            profileImageUrl: photos?.[0]?.value,
            registeredWith: "google"
          },
          // Add null password since it's required by the schema but not used with Google auth
          password: null
        });
        
        return done(null, newUser);
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      return done(error, false);
    }
  }));
}

// Serialize user to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    // Make sure we're parsing IDs correctly - our database uses numeric IDs
    if (!id) {
      return done(new Error('Invalid user ID'), null);
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return done(new Error('User not found'), null);
    }
    
    return done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    return done(error, null);
  }
});

// Google auth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth',
    failureMessage: true
  }), 
  (req, res) => {
    // Handle successful authentication
    console.log('Google authentication successful, redirecting to home');
    
    // Get user role to determine where to redirect
    const user = req.user as any;
    const role = user?.role;
    
    // Redirect based on user role
    if (role === 'company') {
      res.redirect('/company-dashboard');
    } else {
      res.redirect('/home');
    }
  }
);

// Get current user information
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    // Only return safe user fields - using the actual fields in our database schema
    const { 
      id, 
      username, 
      email, 
      name, 
      role, 
      company_profile,
      profileImageUrl,
      firstName,
      lastName 
    } = req.user;
    
    res.json({ 
      id, 
      username, 
      email, 
      name,
      role,
      profileImageUrl,
      firstName,
      lastName
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;