import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
// Removed passport and custom auth imports - using Supabase Auth instead
import { loadKnowledgeBase } from "./data-loader";
import aiRoutes from './routes/ai';
import apiRoutes from './routes/api';
import vehicleRoutes from './routes/vehicle';
import stripeRoutes from './routes/stripe';

const app = express();

// Quick sanity check: confirm OPENAI_API_KEY env variable is loaded
console.log("[ENV] OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);



// Setup CORS with proper credentials support
const corsOptions = {
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5001',
      'https://brikiapp.com',
      'https://www.brikiapp.com',
      process.env.FRONTEND_URL // Allow custom frontend URL from environment
    ].filter(Boolean); // Remove undefined values
    
    // Check if the origin is allowed
    if (allowedOrigins.some(allowed => allowed && origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Session management removed - using Supabase Auth instead
console.log("Using Supabase Auth for authentication");

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

// Mount routes (auth routes removed - using Supabase Auth)
app.use('/api/ai', aiRoutes);
app.use('/api', apiRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/stripe', stripeRoutes);

(async () => {
  // Load knowledge base at startup
  console.log("Initializing knowledge base...");
  loadKnowledgeBase();
  
  // Initialize database connection with retry logic
  console.log("Initializing database connection...");
  const { initializeDb } = await import('./db');
  const dbInstance = await initializeDb();
  
  if (!dbInstance) {
    console.warn("⚠️  Failed to connect to database. The server will start but database features may not work.");
    console.warn("⚠️  This is expected during cold starts on serverless platforms.");
  } else {
    console.log("✅ Database connection established successfully");
  }
  
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

  // Use PORT from environment or default to 5050 for development
  // This matches the Google OAuth callback URL configuration
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5050;
  server.listen(port, () => {
    log(`✅ Server is running on http://localhost:${port}`);
  });
})();
