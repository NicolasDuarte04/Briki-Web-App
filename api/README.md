# Briki Travel Insurance API

Backend API service for the Briki Travel Insurance mobile application.

## Overview

This API provides insurance plan data and interaction tracking for the Briki mobile app. It allows users to:

- Browse available insurance plans
- Filter plans by destination, coverage requirements, etc.
- Track user interactions with plans (views, selections, etc.)

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Hosting**: Cloud-based (Supabase preferred)

## API Endpoints

### Insurance Plans

- `GET /api/plans` - Get all insurance plans
- `GET /api/plans/:id` - Get a specific plan by ID
- `GET /api/plans/filter` - Filter plans by criteria
- `GET /api/plans/popular` - Get popular plans based on interactions

### Interactions

- `POST /api/interactions` - Record a new user interaction with a plan
- `GET /api/interactions/plan/:planId` - Get interactions for a specific plan
- `GET /api/interactions/user` - Get interactions for a user/device

## Environment Variables

Required environment variables:

```
PORT=8000
NODE_ENV=development
DATABASE_URL=postgres://username:password@host:port/database
DATABASE_SSL=true/false
CORS_ORIGIN=http://localhost:3000,https://app.example.com
LOG_LEVEL=debug
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure variables
4. Run in development mode: `npm run dev`

## Deployment

The API is designed to be easily deployable on Supabase or similar hosting services.

1. Build the project: `npm run build`
2. Deploy to your preferred hosting service
3. Set environment variables on the hosting platform

## Data Model

### Insurance Plan

Insurance plans with comprehensive coverage details:

- Medical coverage amounts
- Trip cancellation terms
- Baggage protection
- Adventure activity coverage
- Rental car coverage
- etc.

### Interaction

User interactions with insurance plans:

- View events
- Selection events
- Comparison events
- Checkout start/complete events