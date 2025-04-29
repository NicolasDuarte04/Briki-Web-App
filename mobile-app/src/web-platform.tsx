/**
 * Web platform compatibility layer for Briki Travel Insurance App
 * 
 * This file provides web-compatible substitutes for React Native components
 * to allow running the app in a browser environment (especially for Replit).
 */

import React, { ReactNode } from 'react';

// Web-compatible View component (DIV with flex styling)
export const View = ({ 
  style, 
  children,
  ...props 
}: { 
  style?: any, 
  children?: ReactNode,
  [key: string]: any 
}) => {
  // Extract React Native style properties and convert to CSS
  const cssStyle = convertStyleToCSS(style || {});
  
  return (
    <div style={cssStyle} {...props}>
      {children}
    </div>
  );
};

// Web-compatible Text component (SPAN with text styling)
export const Text = ({ 
  style, 
  children,
  ...props 
}: { 
  style?: any, 
  children?: ReactNode,
  [key: string]: any 
}) => {
  // Convert React Native text styles to web CSS
  const cssStyle = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '16px',
    ...convertStyleToCSS(style || {})
  };
  
  return (
    <span style={cssStyle} {...props}>
      {children}
    </span>
  );
};

// Web-compatible ScrollView (DIV with overflow)
export const ScrollView = ({ 
  style, 
  contentContainerStyle,
  children,
  horizontal,
  ...props 
}: { 
  style?: any, 
  contentContainerStyle?: any,
  children?: ReactNode,
  horizontal?: boolean,
  [key: string]: any 
}) => {
  // Set appropriate overflow and direction styles
  const containerStyle = {
    overflow: 'auto',
    display: 'flex',
    flexDirection: horizontal ? 'row' : 'column',
    ...convertStyleToCSS(style || {})
  };
  
  const contentStyle = convertStyleToCSS(contentContainerStyle || {});
  
  return (
    <div style={containerStyle} {...props}>
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

// Web-compatible TouchableOpacity (button with hover effects)
export const TouchableOpacity = ({ 
  style, 
  children,
  onPress,
  activeOpacity = 0.7,
  ...props 
}: { 
  style?: any, 
  children?: ReactNode,
  onPress?: () => void,
  activeOpacity?: number,
  [key: string]: any 
}) => {
  // Convert to button with hover state
  const cssStyle = {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    display: 'inline-block',
    textAlign: 'left' as const,
    ...convertStyleToCSS(style || {})
  };
  
  return (
    <button 
      style={cssStyle} 
      onClick={onPress}
      {...props}
    >
      {children}
    </button>
  );
};

// Web-compatible Image component
export const Image = ({ 
  source, 
  style,
  ...props 
}: { 
  source: { uri: string } | number, 
  style?: any,
  [key: string]: any 
}) => {
  const cssStyle = {
    maxWidth: '100%',
    ...convertStyleToCSS(style || {})
  };
  
  // Handle different source types (uri vs require)
  const src = typeof source === 'number' 
    ? `./assets/image-${source}.png` // Placeholder for required images 
    : source.uri;
  
  return (
    <img 
      src={src} 
      style={cssStyle}
      {...props}
    />
  );
};

// Helper function to convert React Native styles to CSS
function convertStyleToCSS(style: Record<string, any>) {
  const cssStyle: Record<string, any> = {};
  
  // Process each style property
  Object.entries(style).forEach(([key, value]) => {
    // Handle special cases
    switch (key) {
      case 'flex':
        cssStyle.flex = value;
        break;
      case 'flexDirection':
        cssStyle.flexDirection = value;
        break;
      case 'backgroundColor':
        cssStyle.backgroundColor = value;
        break;
      case 'padding':
        cssStyle.padding = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'margin':
        cssStyle.margin = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'fontSize':
        cssStyle.fontSize = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'fontWeight':
        cssStyle.fontWeight = value;
        break;
      case 'color':
        cssStyle.color = value;
        break;
      case 'borderRadius':
        cssStyle.borderRadius = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'width':
        cssStyle.width = typeof value === 'number' ? `${value}px` : value;
        break;
      case 'height':
        cssStyle.height = typeof value === 'number' ? `${value}px` : value;
        break;
      // Add more cases as needed
      default:
        // Convert camelCase to kebab-case for CSS properties
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        cssStyle[cssKey] = typeof value === 'number' ? `${value}px` : value;
    }
  });
  
  return cssStyle;
}

// Web-compatible SafeAreaView (just a div with padding)
export const SafeAreaView = ({ 
  style, 
  children,
  ...props 
}: { 
  style?: any, 
  children?: ReactNode,
  [key: string]: any 
}) => {
  const cssStyle = {
    padding: '16px',
    ...convertStyleToCSS(style || {})
  };
  
  return (
    <div style={cssStyle} {...props}>
      {children}
    </div>
  );
};

// Web-compatible ActivityIndicator (loading spinner)
export const ActivityIndicator = ({ 
  size = 'small',
  color = '#4B76E5',
  ...props 
}: { 
  size?: 'small' | 'large' | number,
  color?: string,
  [key: string]: any 
}) => {
  // Determine size based on option
  const spinnerSize = size === 'small' ? 24 : size === 'large' ? 48 : size;
  
  const spinnerStyle = {
    border: `4px solid rgba(0, 0, 0, 0.1)`,
    borderTopColor: color,
    borderRadius: '50%',
    width: typeof spinnerSize === 'number' ? `${spinnerSize}px` : spinnerSize,
    height: typeof spinnerSize === 'number' ? `${spinnerSize}px` : spinnerSize,
    animation: 'spin 1s linear infinite',
  };
  
  // Define the rotation animation
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleElement);
  
  return <div style={spinnerStyle} {...props} />;
};

// Platform module replacement
export const Platform = {
  OS: 'web',
  select: (options: Record<string, any>) => options.web || options.default || null
};

// Constants for commonly used values
export const Constants = {
  statusBarHeight: 0,
  platform: {
    web: true
  }
};

// Export unified components 
export default {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Constants
};