import { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { configureLocalAuth, registerUser, loginUser, logoutUser, isAuthenticated } from "./local-auth";
import { configureGoogleAuth, googleAuthRedirect, googleAuthCallback } from "./google-auth";
import { storage } from "../storage";
import { pool } from "../db";

export async function setupAuth(app: Express) {
  // Set up session store with PostgreSQL
  const pgSession = connectPg(session);
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const sessionStore = new pgSession({
    pool,
    tableName: "sessions",
    createTableIfMissing: true
  });
  
  console.log('Using PostgreSQL session store for auth sessions');
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "briki-secret-key-change-in-production",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: sessionTtl,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true
      }
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  // Configure authentication strategies
  await configureLocalAuth();
  await configureGoogleAuth();
  
  // Authentication routes
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.post("/api/auth/logout", logoutUser);
  
  // Google OAuth routes
  app.get("/api/auth/google", googleAuthRedirect);
  app.get("/api/auth/google/callback", googleAuthCallback);
  
  // Get current user
  app.get("/api/auth/user", isAuthenticated, (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}