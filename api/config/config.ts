import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Environment-specific configuration
const environment = process.env.NODE_ENV || 'development';

// Configuration structure
interface Config {
  env: string;
  port: number;
  api: {
    prefix: string;
  };
  cors: {
    origin: string | string[];
  };
  database: {
    url: string;
    ssl: boolean;
  };
  logging: {
    level: string;
  };
}

// Default configuration values
const defaultConfig: Config = {
  env: environment,
  port: parseInt(process.env.PORT || '8000'),
  api: {
    prefix: '/api',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  database: {
    url: process.env.DATABASE_URL || '',
    ssl: process.env.DATABASE_SSL === 'true',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Development environment configuration
const developmentConfig: Partial<Config> = {
  logging: {
    level: 'debug',
  },
};

// Production environment configuration
const productionConfig: Partial<Config> = {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'https://app.brikitravelsecurity.com',
      'https://briki-app.vercel.app',
    ],
  },
  logging: {
    level: 'error',
  },
};

// Testing environment configuration
const testingConfig: Partial<Config> = {
  database: {
    url: process.env.TEST_DATABASE_URL || '',
    ssl: false,
  },
};

// Environment-specific overrides
const environmentConfig: Record<string, Partial<Config>> = {
  development: developmentConfig,
  production: productionConfig,
  test: testingConfig,
};

// Merge default config with environment-specific config
export const config: Config = {
  ...defaultConfig,
  ...environmentConfig[environment] || {},
};

// Validate required configuration
if (!config.database.url) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Output configuration on startup (excluding sensitive data)
console.log(`🔧 Application Configuration (${environment}):`, {
  ...config,
  database: {
    ...config.database,
    url: '[REDACTED]', // Don't log the connection string
  },
});