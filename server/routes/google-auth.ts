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
        const updatedUser = await storage.updateUser({
          id: existingUser.id,
          username: existingUser.username,
          googleId: id,
          profileImageUrl: photos?.[0]?.value || existingUser.profileImageUrl,
        });
        
        return done(null, updatedUser);
      } else {
        // Create new user from Google profile
        // Split display name into first name and last name if possible
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const username = email.split('@')[0];
        
        // Generate a unique ID for the new user
        const userId = uuidv4();
        
        const newUser = await storage.createUser({
          id: userId,
          username: username,
          googleId: id,
          email: email,
          firstName: firstName,
          lastName: lastName,
          profileImageUrl: photos?.[0]?.value,
          role: "user", // Default role
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
passport.deserializeUser(async (id, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google auth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/login',
    successRedirect: '/dashboard',
  })
);

// Get current user information
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    // Only return safe user fields
    const { id, username, email, firstName, lastName, profileImageUrl, role } = req.user;
    res.json({ id, username, email, firstName, lastName, profileImageUrl, role });
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