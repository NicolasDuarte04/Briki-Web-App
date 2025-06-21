import 'express-session';

declare module 'express-session' {
  interface SessionData {
    returnTo?: string;
    user?: {
      id: string;
      email?: string;
      role?: string;
    }
  }
}