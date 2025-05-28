import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { useAuth } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditProfileScreen() {
  const { user, logout } = useAuth();
  
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ fullName: '', email: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: '', email: '' };

    // Validate name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Validate email
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm() || !user) return;

    setLoading(true);
    try {
      // Get stored users
      const usersData = await AsyncStorage.getItem('users_data');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Find current user and update
      const updatedUsers = users.map(storedUser => {
        if (storedUser.id === user.id) {
          return {
            ...storedUser,
            name: fullName,
            email: email
          };
        }
        return storedUser;
      });
      
      // Save updated users
      await AsyncStorage.setItem('users_data', JSON.stringify(updatedUsers));
      
      // Update auth data
      const authData = await AsyncStorage.getItem('auth_data');
      if (authData) {
        const parsedAuthData = JSON.parse(authData);
        parsedAuthData.user = {
          ...parsedAuthData.user,
          name: fullName,
          email: email
        };
        await AsyncStorage.setItem('auth_data', JSON.stringify(parsedAuthData));
      }
      
      Alert.alert(
        'Profile Updated',
        'Your profile information has been updated successfully.',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert(
        'Update Failed',
        'Failed to update your profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#4B76E5" />
            </TouchableOpacity>
            
            <ThemedText style={styles.title}>Edit Profile</ThemedText>
            
            <View style={styles.placeholderView} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) {
                    setErrors(prev => ({ ...prev, fullName: '' }));
                  }
                }}
                mode="outlined"
                style={styles.input}
                outlineColor={errors.fullName ? "#FF3B30" : "#CCCCCC"}
                activeOutlineColor={errors.fullName ? "#FF3B30" : "#4B76E5"}
                left={<TextInput.Icon icon="account" color={errors.fullName ? "#FF3B30" : "#4B76E5"} />}
                theme={{ roundness: 12 }}
                error={!!errors.fullName}
              />
              {errors.fullName ? (
                <ThemedText style={styles.errorText}>{errors.fullName}</ThemedText>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineColor={errors.email ? "#FF3B30" : "#CCCCCC"}
                activeOutlineColor={errors.email ? "#FF3B30" : "#4B76E5"}
                left={<TextInput.Icon icon="email" color={errors.email ? "#FF3B30" : "#4B76E5"} />}
                theme={{ roundness: 12 }}
                error={!!errors.email}
              />
              {errors.email ? (
                <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateProfile}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4B76E5', '#3D68D8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 56,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  updateButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4B76E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});