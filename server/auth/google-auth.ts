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

  const callbackURL = process.env.NODE_ENV === "production"
    ? `${process.env.PUBLIC_URL}/api/auth/google/callback`
    : "http://localhost:5000/api/auth/google/callback";

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
            return done(null, user);
          }
          
          // If user doesn't exist, but email matches, link accounts
          if (profile.emails && profile.emails.length > 0) {
            const email = profile.emails[0].value;
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Link Google ID to existing account
              user = await storage.updateUser(user.id, { googleId: profile.id });
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
          let username = profile.displayName?.replace(/\s+/g, '').toLowerCase() || email?.split('@')[0] || '';
          
          // Ensure username is unique by appending random string if needed
          const existingUser = await storage.getUserByUsername(username);
          if (existingUser) {
            username = `${username}${Math.floor(Math.random() * 10000)}`;
          }
          
          // Create new user with Google info
          const newUser = await storage.createUser({
            id: uuidv4(),
            username,
            email,
            password: null, // No password for Google auth
            firstName,
            lastName,
            profileImageUrl,
            googleId: profile.id,
            role: "user",
          });
          
          return done(null, newUser);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

export function googleAuthRedirect(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

export function googleAuthCallback(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  })(req, res, next);
}