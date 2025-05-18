import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { v4 as uuidv4 } from "uuid";

export async function configureLocalAuth() {
  // Local Strategy for username/password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: "identifier", // email or username
        passwordField: "password",
      },
      async (identifier, password, done) => {
        try {
          // Check if the identifier is an email or username
          const isEmail = identifier.includes("@");
          
          // Find user by email or username
          const user = isEmail 
            ? await storage.getUserByEmail(identifier)
            : await storage.getUserByUsername(identifier);

          if (!user) {
            return done(null, false, { message: "Invalid credentials" });
          }

          if (!user.password) {
            return done(null, false, { message: "Account requires social login" });
          }

          // Validate password
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            return done(null, false, { message: "Invalid credentials" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Email is now required, we'll use it as the main identifier
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user with this email already exists
    const existingUser = await storage.getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ 
        message: "Email already in use" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user - generate a username from email if needed
    const username = email.split('@')[0]; // Simple username from email
    
    const user = await storage.createUser({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      profileImageUrl: null,
      googleId: null,
      role: "user",
    });

    // Log user in after registration
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error during login after registration" });
      }
      return res.status(201).json({ user: { 
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
      }});
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}

export function loginUser(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message || "Authentication failed" });
    }
    
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      return res.status(200).json({ user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
      }});
    });
  })(req, res, next);
}

export function logoutUser(req: Request, res: Response) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}