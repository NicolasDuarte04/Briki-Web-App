import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from './web-platform';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './utils/theme';

// Import the WeatherRiskScreen content
import { weatherRiskData } from './data/weatherRiskData';

// Web-friendly implementation of the Weather Risk screen
function WeatherRiskWebView() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundLight }}>
      <ScrollView 
        contentContainerStyle={{ padding: theme.spacing.medium }}
      >
        <View style={{ marginBottom: theme.spacing.large }}>
          <Text style={{ 
            fontSize: theme.fontSizes.headline, 
            fontWeight: 'bold',
            color: theme.colors.primary,
            marginBottom: theme.spacing.medium
          }}>
            Weather Risk Analyzer
          </Text>
          
          <Text style={{ 
            fontSize: theme.fontSizes.medium, 
            color: theme.colors.textLight,
            marginBottom: theme.spacing.large
          }}>
            Evaluate weather-related risks for your travel destinations and find the right insurance coverage.
          </Text>
          
          {/* Destination Cards */}
          <View style={{ 
            marginVertical: theme.spacing.medium,
            display: 'flex', 
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing.medium,
          }}>
            {weatherRiskData.destinations.map((destination, index) => (
              <View key={index} style={{
                backgroundColor: theme.colors.white,
                borderRadius: 8,
                padding: theme.spacing.medium,
                width: 'calc(50% - 8px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: theme.spacing.medium
              }}>
                <Text style={{ 
                  fontSize: theme.fontSizes.large, 
                  fontWeight: 'bold',
                  marginBottom: theme.spacing.small
                }}>
                  {destination.name}
                </Text>
                <Text style={{ color: theme.colors.textLight }}>
                  {destination.country}
                </Text>
                
                <View style={{ 
                  marginTop: theme.spacing.medium,
                  padding: theme.spacing.xs,
                  backgroundColor: getRiskColorForWeb(destination.riskLevel),
                  borderRadius: 4,
                  alignSelf: 'flex-start'
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: theme.fontSizes.small,
                    fontWeight: 'bold',
                    padding: 4
                  }}>
                    {getRiskLevelText(destination.riskLevel)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          
          {/* Risk Factors */}
          <View style={{ marginTop: theme.spacing.xl }}>
            <Text style={{ 
              fontSize: theme.fontSizes.xl, 
              fontWeight: 'bold',
              marginBottom: theme.spacing.medium
            }}>
              Common Weather Risk Factors
            </Text>
            
            {weatherRiskData.riskFactors.map((factor, index) => (
              <View key={index} style={{
                backgroundColor: theme.colors.white,
                borderRadius: 8,
                padding: theme.spacing.medium,
                marginBottom: theme.spacing.medium,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <Text style={{ 
                  fontSize: theme.fontSizes.large, 
                  fontWeight: 'bold',
                  marginBottom: theme.spacing.small,
                  color: theme.colors.text
                }}>
                  {factor.name}
                </Text>
                <Text style={{ color: theme.colors.textLight }}>
                  {factor.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper functions for the weather risk screen
function getRiskLevelText(level) {
  switch (level) {
    case 1: return 'Very Low Risk';
    case 2: return 'Low Risk';
    case 3: return 'Moderate Risk';
    case 4: return 'High Risk';
    case 5: return 'Very High Risk';
    default: return 'Unknown Risk';
  }
}

function getRiskColorForWeb(level) {
  switch (level) {
    case 1: return theme.colors.riskVeryLow;
    case 2: return theme.colors.riskLow;
    case 3: return theme.colors.riskModerate;
    case 4: return theme.colors.riskHigh;
    case 5: return theme.colors.riskVeryHigh;
    default: return theme.colors.textMuted;
  }
}

// Main app component for Web
export default function WebApp() {
  return (
    <AuthProvider>
      <View style={{ 
        height: '100vh', 
        width: '100vw',
        backgroundColor: theme.colors.backgroundLight 
      }}>
        <View style={{ 
          backgroundColor: theme.colors.primary,
          padding: theme.spacing.medium,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{ 
            color: theme.colors.white, 
            fontSize: theme.fontSizes.xl,
            fontWeight: 'bold'
          }}>
            Briki Travel Insurance
          </Text>
          <View style={{ marginLeft: 'auto' }}>
            <Text style={{ color: theme.colors.white }}>
              Web Preview
            </Text>
          </View>
        </View>
        
        {/* Main content area */}
        <WeatherRiskWebView />
        
        {/* Web-specific footer */}
        <View style={{ 
          padding: theme.spacing.medium, 
          backgroundColor: theme.colors.text,
          alignItems: 'center'
        }}>
          <Text style={{ color: theme.colors.white }}>
            Briki Travel Insurance © 2025 - Replit Web Preview
          </Text>
        </View>
      </View>
    </AuthProvider>
  );
}