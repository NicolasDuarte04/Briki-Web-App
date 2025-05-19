import express, { type Express } from 'express';
import { createServer, type Server } from 'http';
import cors from 'cors';
import path from 'path';
import aiRouter from './routes/ai';

export function registerRoutes(app: Express): Server {
  // Configure middleware
  app.use(express.json());
  app.use(cors());

  // Register API routes
  app.use('/api/ai', aiRouter);

  // Add more API routes as needed
  // app.use('/api/other-route', otherRouter);

  // Catch-all handler for the SPA
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }
    res.sendFile(path.resolve('client/dist/index.html'));
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}