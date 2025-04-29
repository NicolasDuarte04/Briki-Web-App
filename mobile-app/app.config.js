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
  // Disable updates in base config
  updates: null,
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

// Default configuration without expo-updates for Replit compatibility
module.exports = ({ config: _, ...props }) => {
  return {
    ...config,
    // Completely remove plugins to avoid expo-updates issues
    disablePlugins: ['expo-updates'],
    // Add web-specific configuration for Replit compatibility
    web: {
      ...config.web,
      favicon: './assets/favicon.png',
      name: 'Briki Travel Insurance',
      shortName: 'Briki',
      backgroundColor: '#4B76E5',
      themeColor: '#4B76E5',
      lang: 'es',
      bundler: 'metro'
    }
  };
}