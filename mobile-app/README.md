# Briki Travel Insurance Mobile App

A React Native mobile application for the Briki Travel Insurance platform, built with Expo.

## Features

- Browse and compare travel insurance plans from multiple providers
- Weather risk analysis for popular destinations
- User authentication and profile management
- Trip information management
- Insurance plan checkout and payment processing
- Mobile-friendly UI with support for both iOS and Android

## Prerequisites

- Node.js 14 or later
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device for testing

## Installation

1. Clone the repository
2. Navigate to the mobile-app directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

## Development

To start the development server:

```bash
npm start
# or
yarn start
```

This will start the Expo development server. You can then:

- Scan the QR code with the Expo Go app on your Android device
- Scan the QR code with your camera app on your iOS device
- Press 'a' to open on an Android emulator
- Press 'i' to open on an iOS simulator

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
API_URL=https://api.briki.insurance
```

## Building for Production

### Prerequisites

- An Expo account
- EAS CLI installed (`npm install -g eas-cli`)
- Logged in to EAS (`eas login`)

### Build Steps

1. Configure your app.json and eas.json files
2. Run the build command:

```bash
# For iOS
npm run build:ios
# or
yarn build:ios

# For Android
npm run build:android
# or
yarn build:android
```

### Submitting to App Stores

1. Make sure you have the necessary credentials set up in eas.json
2. Run the submit command:

```bash
# For iOS
npm run submit:ios
# or
yarn submit:ios

# For Android
npm run submit:android
# or
yarn submit:android
```

## Project Structure

```
mobile-app/
├── assets/           # Static assets like images
├── src/              # Source code
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React contexts
│   ├── data/         # Static data files
│   ├── hooks/        # Custom React hooks
│   ├── navigation/   # Navigation configuration
│   ├── screens/      # Screen components
│   ├── services/     # API services
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── App.tsx           # Main app component
├── app.json          # Expo configuration
├── babel.config.js   # Babel configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Dependencies and scripts
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

© 2025 Briki Insurance. All rights reserved.