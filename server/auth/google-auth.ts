import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "../storage";
import { v4 as uuidv4 } from "uuid";

export async function configureGoogleAuth() {
  // Check if required environment variables exist
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth credentials not found. Google authentication will be disabled.");
    return;
  }

  // Use app domain for production or localhost for development
  const domain = process.env.NODE_ENV === "production"
    ? process.env.PUBLIC_URL || "https://brikiapp.com"
    : "http://localhost:5000";
    
  // Construct proper callback URL to match Google's expected format
  // Making sure this exactly matches what's configured in Google Developer Console
  const callbackURL = `${domain}/api/auth/callback/google`;

  console.log("Configuring Google OAuth with callback URL:", callbackURL);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with Google ID
          let user = await storage.getUserByGoogleId(profile.id);
          
          if (user) {
            // Update existing user with latest Google info
            // Combine firstName and lastName into name field since that's what exists in DB
            const name = profile.name 
              ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() 
              : user.name;
              
            user = await storage.updateUser(String(user.id), {
              name: name || user.name,
              // No profileImageUrl in the database schema
            });
            
            return done(null, user);
          }
          
          // If user doesn't exist, but email matches, link accounts
          if (profile.emails && profile.emails.length > 0) {
            const email = profile.emails[0].value;
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Link Google profile to existing account
              // Combine firstName and lastName into name field since that's what exists in DB
              const name = profile.name 
                ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() 
                : user.name;
              
              user = await storage.updateUser(String(user.id), {
                // No googleId in the database schema
                name: name || user.name,
                // Store Google connection in a property in company_profile
                company_profile: {
                  ...user.company_profile,
                  googleProfileId: profile.id
                }
              });
              return done(null, user);
            }
          }
          
          // Create new user if no existing account found
          const email = profile.emails && profile.emails.length > 0 
            ? profile.emails[0].value 
            : null;
            
          const firstName = profile.name?.givenName || null;
          const lastName = profile.name?.familyName || null;
          const profileImageUrl = profile.photos && profile.photos.length > 0 
            ? profile.photos[0].value 
            : null;
            
          // Generate a username based on display name or email
          let username = '';
          if (profile.displayName) {
            username = profile.displayName.replace(/\s+/g, '').toLowerCase();
          } else if (email) {
            username = email.split('@')[0];
          } else {
            username = `user${Math.floor(Math.random() * 10000)}`;
          }
          
          // Ensure username is unique by appending random string if needed
          const existingUser = await storage.getUserByUsername(username);
          if (existingUser) {
            username = `${username}${Math.floor(Math.random() * 10000)}`;
          }
          
          // Create new user with Google info - using only fields in actual DB
          const name = firstName && lastName 
            ? `${firstName} ${lastName}`.trim() 
            : firstName || lastName || username;
            
          // Must ensure email is not null before creating user since it's required in the schema
          if (!email) {
            return done(new Error("Email is required but not provided by Google"), false);
          }

          const newUser = await storage.createUser({
            // id is auto-generated in the DB as a number
            username,
            email, // Now guaranteed to be non-null
            password: null, // No password for Google auth
            name, // Using combined name field
            role: "user",
            // Store Google profile info in company_profile JSON field
            company_profile: {
              googleProfileId: profile.id,
              googleProfileImageUrl: profileImageUrl
            }
          });
          
          return done(null, newUser);
        } catch (error) {
          console.error("Google authentication error:", error);
          return done(error, null);
        }
      }
    )
  );
}

export function googleAuthRedirect(req: Request, res: Response, next: NextFunction) {
  // Store the returnTo URL if provided in query params
  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo as string;
  }
  
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account" // Always show account selection screen
  })(req, res, next);
}

export function googleAuthCallback(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("google", {
    failureRedirect: "/auth?error=google_auth_failed",
  }, (err: Error, user: any) => {
    if (err || !user) {
      console.error("Google authentication callback error:", err);
      return res.redirect('/auth?error=google_auth_failed');
    }
    
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error after Google auth:", loginErr);
        return res.redirect('/auth?error=login_failed');
      }
      
      // Successful authentication, redirect to the return URL or default dashboard
      const returnTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      
      // Redirect based on user role
      if (user.role === 'company') {
        return res.redirect('/company-dashboard');
      }
      
      return res.redirect(returnTo);
    });
  })(req, res, next);
}