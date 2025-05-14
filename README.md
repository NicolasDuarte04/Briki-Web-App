# Briki Travel Insurance Platform

Briki is a cutting-edge travel insurance comparison platform that leverages AI and cross-platform technologies to deliver intelligent, personalized travel protection for travelers in Colombia and Mexico.

## Project Structure

This repository contains both the backend and frontend components of the Briki travel insurance platform:

- `/server`: Express.js backend with PostgreSQL database integration
- `/client`: React web application frontend
- `/mobile-app`: React Native mobile application with Expo
- `/shared`: Shared types and utilities between frontend and backend

## Key Technologies

- **Backend**: 
  - TypeScript and Express.js
  - PostgreSQL with Drizzle ORM
  - Token-based authentication
  - Stripe payment integration

- **Web Frontend**:
  - React with TypeScript
  - TanStack Query for data fetching
  - Shadcn UI components
  - Tailwind CSS for styling

- **Mobile App**:
  - React Native with Expo
  - React Navigation
  - React Native Paper UI components
  - Expo Application Services (EAS) for deployment

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/briki-travel-insurance.git
   cd briki-travel-insurance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/briki
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

This will start both the backend server and frontend development server concurrently.

### Mobile App

See the [mobile app README](./mobile-app/README.md) for instructions on setting up and deploying the mobile application.

## Features

- **User Authentication**: Secure login, registration, and profile management
- **Trip Information**: Input and storage of trip details for insurance quotes
- **Insurance Plan Comparison**: Compare multiple insurance plans with detailed coverage information
- **Weather Risk Analysis**: AI-powered weather risk assessment for destinations
- **Checkout Process**: Secure payment processing with Stripe
- **Mobile Integration**: Seamless experience across web and mobile platforms

## API Documentation

### Authentication Endpoints

- `POST /api/register`: Register a new user
- `POST /api/login`: Authenticate a user
- `POST /api/logout`: Log out a user
- `GET /api/user`: Get current user information

### Trip Endpoints

- `POST /api/trips`: Create a new trip
- `GET /api/trips`: Get all trips for the current user
- `GET /api/trips/:id`: Get a specific trip

### Insurance Plan Endpoints

- `GET /api/plans`: Get all insurance plans
- `GET /api/plans/:id`: Get a specific insurance plan
- `POST /api/plans/filter`: Filter plans based on criteria

### Order Endpoints

- `POST /api/orders`: Create a new insurance order
- `GET /api/orders`: Get all orders for the current user

### Payment Endpoints

- `POST /api/create-payment-intent`: Create a Stripe payment intent

## Deployment

### Web Application

The web application is deployed on Replit and can be accessed at [https://briki-travel.replit.app](https://briki-travel.replit.app).

### Mobile Application

The mobile app can be deployed using Expo Application Services (EAS). See the [mobile app README](./mobile-app/README.md) for detailed instructions.

## Development Roadmap

- Add support for additional countries beyond Colombia and Mexico
- Implement AI-driven personalized insurance recommendations
- Add travel alerts and notifications for policy holders
- Integrate with travel booking platforms

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is proprietary and confidential.

## Acknowledgements

- [React](https://reactjs.org/)
- [React Native](https://reactnative.dev/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [Expo](https://expo.dev/)
- [Stripe](https://stripe.com/)