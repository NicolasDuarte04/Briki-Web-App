# Briki Travel Insurance Platform Architecture

## 1. Overview

Briki is a travel insurance comparison platform targeting travelers in Colombia and Mexico. The platform allows users to compare insurance plans, assess weather-related risks for destinations, and purchase travel insurance. It's built as a full-stack application with a shared backend supporting both web and mobile clients.

Key features include:
- User authentication and account management
- Trip information collection and storage
- Insurance plan comparison and recommendation
- Weather risk assessment
- Secure checkout with Stripe integration
- Multi-language support

## 2. System Architecture

Briki follows a modern full-stack architecture with clear separation between frontend and backend components:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                     │
│                                                             │
│  ┌───────────────┐            ┌────────────────────────┐   │
│  │  React Web    │            │  React Native Mobile   │   │
│  │  Application  │            │  Application (Expo)    │   │
│  └───────────────┘            └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/REST API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend Server                        │
│                                                             │
│  ┌───────────────┐    ┌────────────┐    ┌───────────────┐  │
│  │  Express.js   │    │  Business  │    │  Stripe       │  │
│  │  REST API     │───▶│  Logic     │───▶│  Integration  │  │
│  └───────────────┘    └────────────┘    └───────────────┘  │
│           │                 │                               │
│           │                 │                               │
│  ┌────────▼─────────────────▼──────────────────────────┐   │
│  │                  Data Access Layer                  │   │
│  │             (Drizzle ORM with PostgreSQL)           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │   Users    │  │   Trips    │  │  Insurance Plans   │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
│                                                             │
│  ┌────────────┐                                             │
│  │   Orders   │                                             │
│  └────────────┘                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions:

1. **Unified Backend**: A single Express.js backend serves both web and mobile clients, promoting code reuse and consistent API behavior.

2. **Shared Types**: Types are shared between frontend and backend using a shared directory, ensuring type safety across the stack.

3. **Responsive Design**: The web application uses responsive design with Tailwind CSS, while the mobile app is built with React Native and Expo.

4. **ORM Abstraction**: Drizzle ORM is used to interact with the PostgreSQL database, providing type safety and migration support.

5. **Token-based Authentication**: Simple token-based authentication is implemented for both web and mobile clients.

## 3. Key Components

### 3.1 Frontend Components

#### Web Application (React)
- **Technology Stack**: React, TypeScript, TanStack Query, Shadcn UI, Tailwind CSS
- **State Management**: React Context for global state (authentication, language)
- **API Communication**: TanStack Query for data fetching and caching
- **UI Components**: Shadcn UI component library with Tailwind CSS styling
- **Routing**: Wouter for lightweight client-side routing

#### Mobile Application (React Native/Expo)
- **Technology Stack**: React Native, Expo, TypeScript
- **UI Components**: React Native Paper for consistent UI components
- **Navigation**: React Navigation for screen management
- **Animations**: React Native Reanimated for fluid animations
- **Platform Compatibility**: Web fallback for development in environments like Replit

### 3.2 Backend Components

#### API Server (Express.js)
- **Core Technology**: Express.js with TypeScript
- **Middleware**: CORS, JSON body parsing, error handling
- **Authentication**: Token-based authentication with session management
- **Routes**: REST endpoints for users, trips, insurance plans, and orders

#### Database Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Users, trips, insurance plans, and orders tables with relationships
- **Migrations**: Drizzle Kit for database migrations

#### External Services Integration
- **Payment Processing**: Stripe for secure payment handling
- **Database Hosting**: Support for Neon serverless PostgreSQL

### 3.3 Shared Components

- **Schema Definitions**: Shared schema types between frontend and backend
- **Type Definitions**: Common TypeScript interfaces for domain models
- **Validation**: Zod schemas for request/response validation

## 4. Data Flow

### 4.1 User Authentication Flow

1. User submits login credentials (username/password)
2. Backend validates credentials and generates a session token
3. Token is returned to the client and stored
4. Subsequent requests include the token in Authorization header
5. Protected routes verify the token before processing requests

### 4.2 Trip and Insurance Purchase Flow

1. User inputs trip details (destination, dates, travelers)
2. System stores trip information and generates insurance recommendations
3. User compares and selects insurance plans
4. User enters payment information via Stripe integration
5. After successful payment, order is created and confirmation is sent

### 4.3 Weather Risk Assessment Flow

1. User selects or enters destination
2. System retrieves weather risk data for the destination
3. Risk factors are displayed with severity ratings and recommendations
4. Insurance recommendations are provided based on risk assessment

## 5. External Dependencies

### 5.1 Frontend Dependencies

- **UI Frameworks**: Shadcn UI (web), React Native Paper (mobile)
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Payment UI**: Stripe React components

### 5.2 Backend Dependencies

- **Database**: PostgreSQL via Neon Serverless (@neondatabase/serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Payment Processing**: Stripe API
- **Authentication**: Custom token-based implementation

### 5.3 Development Dependencies

- **Build Tools**: Vite, ESBuild
- **TypeScript Support**: TSX, TypeScript compiler
- **Development Server**: Replit-specific configurations

## 6. Deployment Strategy

The application is configured for deployment on Replit with the following strategy:

### 6.1 Build Process

1. Frontend (React): Built with Vite into static assets
2. Backend (Express): Bundled with ESBuild
3. Combined distribution placed in a single output directory

### 6.2 Environment Configuration

- Environment variables for database connections, API keys
- Different configurations for development and production environments
- Replit-specific configuration via .replit file

### 6.3 Deployment Targets

- **Web Application**: Served as static assets through Express.js
- **API Server**: Express.js application deployed on Replit
- **Mobile Application**: 
  - Development: Expo development server
  - Production: Expo Application Services (EAS) for native builds
  - Web fallback for Replit environment

### 6.4 Database Deployment

- PostgreSQL database using Neon Serverless
- Connection via connection string in environment variables
- Migrations managed through Drizzle Kit

## 7. Security Considerations

- **Authentication**: Token-based authentication with secure password hashing
- **CORS**: Configured for secure cross-origin requests
- **Payment Security**: Stripe integration for PCI-compliant payment processing
- **Input Validation**: Zod validation for all user inputs
- **Environment Isolation**: Separate development and production environments