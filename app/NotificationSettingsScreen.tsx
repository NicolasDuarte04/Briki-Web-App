import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

export default function NotificationSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [specialOffersEnabled, setSpecialOffersEnabled] = useState(true);
  const [policyUpdatesEnabled, setPolicyUpdatesEnabled] = useState(true);
  const [travelAlertsEnabled, setTravelAlertsEnabled] = useState(true);
  const [weatherAlertsEnabled, setWeatherAlertsEnabled] = useState(true);
  
  const toggleSetting = async (key, value, setter) => {
    setter(value);
    
    try {
      // Get current settings or create default
      const settingsString = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      const settings = settingsString ? JSON.parse(settingsString) : {};
      
      // Update the specific setting
      settings[key] = value;
      
      // Save back to storage
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save notification setting:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#4B76E5" />
        </TouchableOpacity>
        
        <ThemedText style={styles.title}>Notification Settings</ThemedText>
        
        <View style={styles.placeholderView} />
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>General Notifications</ThemedText>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingTitle}>Push Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Receive push notifications on your device
                </ThemedText>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={(value) => toggleSetting('push', value, setPushEnabled)}
                trackColor={{ false: "#E5E5EA", true: "rgba(75, 118, 229, 0.4)" }}
                thumbColor={pushEnabled ? "#4B76E5" : "#F8F8FA"}
                ios_backgroundColor="#E5E5EA"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingTitle}>Email Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Receive important updates via email
                </ThemedText>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={(value) => toggleSetting('email', value, setEmailEnabled)}
                trackColor={{ false: "#E5E5EA", true: "rgba(75, 118, 229, 0.4)" }}
                thumbColor={emailEnabled ? "#4B76E5" : "#F8F8FA"}
                ios_backgroundColor="#E5E5EA"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Marketing & Offers</ThemedText>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingTitle}>Special Offers</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Receive discounts and special insurance offers
                </ThemedText>
              </View>
              <Switch
                value={specialOffersEnabled}
                onValueChange={(value) => toggleSetting('specialOffers', value, setSpecialOffersEnabled)}
                trackColor={{ false: "#E5E5EA", true: "rgba(75, 118, 229, 0.4)" }}
                thumbColor={specialOffersEnabled ? "#4B76E5" : "#F8F8FA"}
                ios_backgroundColor="#E5E5EA"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Travel Updates</ThemedText>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingTitle}>Policy Updates</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Get notified about important policy changes
                </ThemedText>
              </View>
              <Switch
                value={policyUpdatesEnabled}
                onValueChange={(value) => toggleSetting('policyUpdates', value, setPolicyUpdatesEnabled)}
                trackColor={{ false: "#E5E5EA", true: "rgba(75, 118, 229, 0.4)" }}
                thumbColor={policyUpdatesEnabled ? "#4B76E5" : "#F8F8FA"}
                ios_backgroundColor="#E5E5EA"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingTitle}>Travel Alerts</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Receive alerts about travel restrictions or advisories
                </ThemedText>
              </View>
              <Switch
                value={travelAlertsEnabled}
                onValueChange={(value) => toggleSetting('travelAlerts', value, setTravelAlertsEnabled)}
                trackColor={{ false: "#E5E5EA", true: "rgba(75, 118, 229, 0.4)" }}
                thumbColor={travelAlertsEnabled ? "#4B76E5" : "#F8F8FA"}
                ios_backgroundColor="#E5E5EA"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingTitle}>Weather Alerts</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Get alerts about severe weather at your destinations
                </ThemedText>
              </View>
              <Switch
                value={weatherAlertsEnabled}
                onValueChange={(value) => toggleSetting('weatherAlerts', value, setWeatherAlertsEnabled)}
                trackColor={{ false: "#E5E5EA", true: "rgba(75, 118, 229, 0.4)" }}
                thumbColor={weatherAlertsEnabled ? "#4B76E5" : "#F8F8FA"}
                ios_backgroundColor="#E5E5EA"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Changes to notification settings are saved automatically
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8FA',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(75, 118, 229, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholderView: {
    width: 40,
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
    paddingLeft: 8,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    width: '100%',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});