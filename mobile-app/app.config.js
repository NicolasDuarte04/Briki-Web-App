const config = {
  name: "Briki Travel Insurance",
  slug: "briki-travel-insurance",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#4B76E5"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.briki.travelinsurance",
    buildNumber: "1.0.0"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#4B76E5"
    },
    package: "com.briki.travelinsurance",
    versionCode: 1
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "briki-travel-insurance"
    },
    apiUrl: "https://api.briki.insurance"
  },
  description: "Intelligent travel insurance comparison platform for Colombia and Mexico markets"
};

// Default configuration with required expo-updates config for development environment
module.exports = ({ config: _, ...props }) => {
  if (props.mode === 'development') {
    // For development, use a simplified config without expo-updates
    return {
      ...config,
      // Explicitly set no plugins for development mode
      plugins: []
    };
  } else {
    // For production builds, include the expo-updates plugin with proper configuration
    return {
      ...config,
      plugins: [
        [
          "expo-updates",
          {
            username: "briki"
          }
        ]
      ]
    };
  }
};