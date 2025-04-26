# Briki Travel Insurance Mobile App

This is the mobile application for Briki Travel Insurance, an intelligent travel insurance comparison platform targeting the Colombia and Mexico markets.

## Features

- User authentication and profile management
- Trip information input and management
- Insurance plan comparison with detailed coverage information
- Weather risk analysis for destinations
- Secure checkout with Stripe integration
- Multilingual support (Spanish and English)

## Installation and Setup

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device for testing

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/briki-travel-insurance.git
   cd briki-travel-insurance/mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Update API endpoint:
   
   Edit `src/services/api.ts` and update the `BASE_URL` constant to point to your API server. 
   
   When testing on a physical device, make sure to use your local network IP instead of `localhost`.

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Scan the QR code with Expo Go app on your mobile device or press 'a' to open in an Android emulator, or 'i' for iOS simulator.

## Building and Deploying

### Expo EAS Build

We use Expo Application Services (EAS) for building and deploying the app.

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure the build:
   
   The `eas.json` file is already configured for development, preview, and production builds.

4. Start a build:
   ```bash
   # For Android
   npm run build:android
   # or
   eas build -p android

   # For iOS
   npm run build:ios
   # or
   eas build -p ios
   ```

5. Submit to app stores:
   ```bash
   # For Android
   npm run submit:android
   # or
   eas submit -p android

   # For iOS
   npm run submit:ios
   # or
   eas submit -p ios
   ```

### Environment Variables

You need to set up the following environment variables for production builds:

- `STRIPE_PUBLIC_KEY`: Your Stripe publishable key

For preview and production builds, you can update these values in the `eas.json` file.

## Development Guidelines

### Project Structure

- `/assets`: Contains images, fonts, and other static assets
- `/src/components`: Reusable UI components
- `/src/contexts`: React context providers
- `/src/hooks`: Custom React hooks
- `/src/navigation`: Navigation configuration
- `/src/screens`: App screens
- `/src/services`: API services and utilities
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions and constants

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Keep components small and focused
- Maintain proper typing for all components and functions

## Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Submit a pull request

## License

This project is proprietary and confidential.