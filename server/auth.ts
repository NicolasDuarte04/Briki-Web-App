import { Express, Request, Response, NextFunction } from "express";
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

// Set a simple token-based authentication approach for SPA
// This is a simplified approach for development purposes
export const userSessions = new Map<string, string>(); // token -> userId (string for both DB and OAuth)
export const tokensByUserId = new Map<string, string>(); // userId -> token

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string | null) {
  if (!stored) return false;
  
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Middleware to check for authentication token in request header
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
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
    
    // Retrieve the user (convert to string to match our schema)
    const user = await storage.getUser(String(userId));
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

// Generate a simple token for authentication
function generateToken(length = 24) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

export function setupAuth(app: Express) {
  console.log('Setting up simplified token-based auth mechanism for SPA development');

  app.post("/api/register", async (req, res) => {
    console.log('POST /api/register - Registration attempt for email:', req.body.email);
    
    try {
      // Validate required fields for email-based authentication
      if (!req.body.email || !req.body.password) {
        console.log('POST /api/register - Missing required fields');
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Email validation
      if (!req.body.email.includes('@') || !req.body.email.includes('.')) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }
      
      // Password validation
      if (req.body.password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      
      // Check for existing user by email
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        console.log('POST /api/register - Email already exists:', req.body.email);
        return res.status(400).json({ message: "Email already in use" });
      }

      console.log('POST /api/register - Creating new user with email:', req.body.email);
      
      // If registering from company pages, set role to "company"
      const role = req.body.role || (req.body.isCompany ? "company" : "user");
      console.log(`POST /api/register - User role: ${role}`);
      
      // Generate a username from email for backward compatibility
      const username = req.body.username || req.body.email.split('@')[0];

      const user = await storage.createUser({
        email: req.body.email,
        username: username,
        name: req.body.name || username,
        role,
        password: await hashPassword(req.body.password),
        company_profile: req.body.company_profile || { registeredWith: "email" }
      });
      console.log('POST /api/register - User created successfully, ID:', user.id);

      // Generate a token for the user (ensuring ID is handled as string)
      const token = generateToken();
      userSessions.set(token, String(user.id));
      tokensByUserId.set(String(user.id), token);
      
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
    console.log('POST /api/login - Login attempt for email:', req.body.email);
    
    try {
      const { email, password } = req.body;
      
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('POST /api/login - User not found:', email);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const passwordValid = await comparePasswords(password, user.password);
      if (!passwordValid) {
        console.log('POST /api/login - Invalid password for user:', email);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      console.log('POST /api/login - Authentication successful for user:', email);
      
      // Create a new token or use existing (ensuring ID is handled as string)
      let token = tokensByUserId.get(String(user.id));
      if (!token) {
        token = generateToken();
        userSessions.set(token, String(user.id));
        tokensByUserId.set(String(user.id), token);
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