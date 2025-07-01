import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import passport from "passport";
import { configureSession } from "./auth/session";
import { configureGoogleAuth } from "./auth/google-auth";
import authRoutes from "./routes/auth";
import { loadKnowledgeBase } from "./data-loader";
import aiRoutes from './routes/ai';
import apiRoutes from './routes/api';
import vehicleRoutes from './routes/vehicle';

const app = express();

// Quick sanity check: confirm OPENAI_API_KEY env variable is loaded
console.log("[ENV] OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

// Setup CORS with proper credentials support
// In development, use this more permissive CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true); // Allow requests from any origin in development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// Setup session management before routes
let sessionConfig;
try {
  sessionConfig = configureSession();
  app.use(sessionConfig);
  console.log("Using PostgreSQL session store for auth sessions");
} catch (error) {
  console.warn("Unable to configure PostgreSQL session, using memory session store for auth sessions");
  const session = require('express-session');
  const MemoryStore = require('memorystore')(session);
  
  // Fallback to memory store
  app.use(session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'briki-dev-secret'
  }));
}

// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure passport serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // Use the storage module to fetch user by ID
    const { storage } = require('./storage');
    const user = await storage.getUser(id);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

// Setup Google OAuth if credentials are available
configureGoogleAuth().catch(err => {
  console.error("Failed to configure Google Auth:", err);
});

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set security headers for consistent behavior
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'same-site');
  next();
});

// Log API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', apiRoutes);
app.use('/api/vehicle', vehicleRoutes);

(async () => {
  // Load knowledge base at startup
  console.log("Initializing knowledge base...");
  loadKnowledgeBase();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5051
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5051;
  server.listen(port, () => {
    log(`✅ Server is running on http://localhost:${port}`);
  });
})();
