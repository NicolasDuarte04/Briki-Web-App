import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { v4 as uuidv4 } from "uuid";

export async function configureLocalAuth() {
  // Local Strategy for email-based authentication only
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // Only use email as identifier
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          console.log("Attempting login with email:", email);
          
          if (!email) {
            return done(null, false, { message: "Email is required" });
          }
          
          // Find user by email only
          const user = await storage.getUserByEmail(email);

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
    const { email, password, confirmPassword, name } = req.body;

    // Email validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    
    // Password validation
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    
    // Check password length
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    
    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return res.status(400).json({ 
        message: "Password must include at least one uppercase letter, one lowercase letter, and one number" 
      });
    }
    
    // Confirm passwords match
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user with this email already exists
    const existingUser = await storage.getUserByEmail(email);

    if (existingUser) {
      // Check if this email was used with a social login
      // Use type assertion for company_profile
      const companyProfile = existingUser.company_profile as Record<string, any> | null | undefined;
      const isSocialUser = companyProfile && companyProfile.registeredWith === 'google';
      
      if (isSocialUser) {
        return res.status(400).json({
          message: "This email is registered with Google. Please use Google Sign In"
        });
      }
      
      return res.status(400).json({ 
        message: "Email already in use" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a username from email for backward compatibility
    const username = email.split('@')[0];
    
    console.log("Creating user with email:", email);
    
    // Create user with our updated schema fields
    const user = await storage.createUser({
      email,
      password: hashedPassword,
      name: name || username, // Use provided name or default to email username
      username,
      role: "user",
      firstName: name || null, // Store name as firstName for consistency
      lastName: null,
      profileImageUrl: null,
      // Keep track of registration method
      company_profile: {
        registeredWith: "email"
      }
    });

    // Log user in after registration
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error during login after registration" });
      }
      // Return only fields that exist in our actual database schema
      return res.status(201).json({ user: { 
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      }});
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}

export function loginUser(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (err: Error | null, user: any, info: { message?: string } = {}) => {
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
      
      // Return only fields that exist in our actual database schema
      return res.status(200).json({ user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
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