import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "briki-travel-insurance-secret",
    resave: true,
    saveUninitialized: true,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax', // Works in both development and production
      secure: false, // Set to false in development to allow cookie to be sent over http
      httpOnly: true,
      path: '/'
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log('POST /api/login - Login attempt for username:', req.body.username);
    
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) {
        console.log('POST /api/login - Authentication error:', err);
        return next(err);
      }
      
      if (!user) {
        console.log('POST /api/login - Authentication failed: Invalid credentials');
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      console.log('POST /api/login - Authentication successful for user:', user.username);
      
      req.login(user, (loginErr: any) => {
        if (loginErr) {
          console.log('POST /api/login - Login session error:', loginErr);
          return next(loginErr);
        }
        
        console.log('POST /api/login - Login successful, saving session');
        
        // Save the session before sending the response to ensure the cookie is set properly
        req.session.save((saveErr) => {
          if (saveErr) {
            console.log('POST /api/login - Session save error:', saveErr);
            return next(saveErr);
          }
          
          console.log('POST /api/login - Session saved successfully, session ID:', req.sessionID);
          return res.status(200).json(user);
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log('GET /api/user - Session ID:', req.sessionID);
    console.log('GET /api/user - Is authenticated:', req.isAuthenticated());
    
    if (!req.isAuthenticated()) {
      console.log('GET /api/user - Not authenticated, returning 401');
      return res.sendStatus(401);
    }
    
    console.log('GET /api/user - Authenticated user:', req.user.username);
    res.json(req.user);
  });
}
