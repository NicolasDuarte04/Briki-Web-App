# Briki Insurance Platform - Documentation

## Project Overview
Briki is an AI-powered insurance recommendation platform delivering personalized insurance experiences.

## Architecture
- **Web Frontend**: React.js with TypeScript, TanStack Query, Shadcn UI
- **Backend**: Express.js with PostgreSQL and Drizzle ORM
- **Mobile App**: React Native with Expo (separate from web app)

## Recent Changes (Phase 1 Cleanup)
- Removed duplicate `/api` folder
- Moved mobile app files to `/mobile-app`
- Cleaned up obsolete files and development artifacts
- Organized project structure for better maintainability

## Getting Started
```bash
npm run dev  # Start development server
npm run build  # Build for production
npm run db:push  # Update database schema
```