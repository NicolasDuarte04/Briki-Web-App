import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import express, { Express, Request, Response, NextFunction } from "express";
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
  // Set a simple token-based authentication approach for SPA
  // This is a simplified approach for development purposes
  const userSessions = new Map<string, number>(); // token -> userId
  const tokensByUserId = new Map<number, string>(); // userId -> token
  
  console.log('Setting up simplified token-based auth mechanism for SPA development');

  // Generate a simple token for authentication
  function generateToken(length = 24) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  // Middleware to check for authentication token in request header
  const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Auth middleware - No token provided');
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const token = authHeader.split(' ')[1];
      const userId = userSessions.get(token);
      
      if (!userId) {
        console.log('Auth middleware - Invalid token');
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      // Retrieve the user
      const user = await storage.getUser(userId);
      if (!user) {
        console.log('Auth middleware - User not found for token');
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Set user in request
      (req as any).user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Authentication error' });
    }
  };

  app.post("/api/register", async (req, res) => {
    console.log('POST /api/register - Registration attempt for username:', req.body.username);
    
    try {
      // Validate required fields
      if (!req.body.username || !req.body.password) {
        console.log('POST /api/register - Missing required fields');
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        console.log('POST /api/register - Username already exists:', req.body.username);
        return res.status(400).json({ message: "Username already exists" });
      }

      console.log('POST /api/register - Creating new user:', req.body.username);
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });
      console.log('POST /api/register - User created successfully, ID:', user.id);

      // Generate a token for the user
      const token = generateToken();
      userSessions.set(token, user.id);
      tokensByUserId.set(user.id, token);
      
      console.log('POST /api/register - Generated authentication token for user');
      
      // Return the user data and token
      return res.status(201).json({
        user,
        token
      });
    } catch (err) {
      console.error('POST /api/register - Error during registration:', err);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", async (req, res) => {
    console.log('POST /api/login - Login attempt for username:', req.body.username);
    
    try {
      const { username, password } = req.body;
      
      // Check if user exists
      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log('POST /api/login - User not found:', username);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Verify password
      const passwordValid = await comparePasswords(password, user.password);
      if (!passwordValid) {
        console.log('POST /api/login - Invalid password for user:', username);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      console.log('POST /api/login - Authentication successful for user:', username);
      
      // Create a new token or use existing
      let token = tokensByUserId.get(user.id);
      if (!token) {
        token = generateToken();
        userSessions.set(token, user.id);
        tokensByUserId.set(user.id, token);
        console.log('POST /api/login - Generated new token for user');
      } else {
        console.log('POST /api/login - Using existing token for user');
      }
      
      // Return the user data and token
      return res.status(200).json({
        user,
        token
      });
    } catch (err) {
      console.error('POST /api/login - Error during login:', err);
      return res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const userId = userSessions.get(token);
      
      if (userId) {
        userSessions.delete(token);
        tokensByUserId.delete(userId);
        console.log(`POST /api/logout - Logged out user ID: ${userId}`);
      }
    }
    
    return res.status(200).json({ message: "Logged out successfully" });
  });

  app.get("/api/user", requireAuth, (req, res) => {
    // The requireAuth middleware has already verified the token and attached the user
    const user = (req as any).user;
    console.log('GET /api/user - User authenticated:', user.username);
    return res.status(200).json(user);
  });
}
