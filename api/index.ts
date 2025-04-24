import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import planRoutes from './routes/planRoutes';
import interactionRoutes from './routes/interactionRoutes';
import { PlanRepository } from './models/planRepository';

// Initialize Express app
const app = express();
const port = config.port;

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Routes
app.use('/api/plans', planRoutes);
app.use('/api/interactions', interactionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'insurance-api',
    version: '1.0.0',
    environment: config.env,
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database tables
    await PlanRepository.initializeDb();
    
    // Start Express server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port} in ${config.env} mode`);
      console.log(`Health check available at http://localhost:${port}/health`);
      console.log(`API endpoints available at http://localhost:${port}/api/plans and http://localhost:${port}/api/interactions`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startServer();