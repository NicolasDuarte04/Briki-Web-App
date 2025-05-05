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

const MIN_PASSWORD_LENGTH = 6;

export default function ChangePasswordScreen() {
  const { user } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ 
    currentPassword: '', 
    newPassword: '',
    confirmPassword: '' 
  });
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      currentPassword: '', 
      newPassword: '',
      confirmPassword: '' 
    };

    // Validate current password
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      newErrors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validateForm() || !user) return;

    setLoading(true);
    try {
      // Get stored users
      const usersData = await AsyncStorage.getItem('users_data');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Find current user
      const currentUser = users.find(storedUser => storedUser.id === user.id);
      
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      // Verify current password
      if (currentUser.password !== currentPassword) {
        setErrors(prev => ({ ...prev, currentPassword: 'Current password is incorrect' }));
        setLoading(false);
        return;
      }
      
      // Update password
      const updatedUsers = users.map(storedUser => {
        if (storedUser.id === user.id) {
          return {
            ...storedUser,
            password: newPassword
          };
        }
        return storedUser;
      });
      
      // Save updated users
      await AsyncStorage.setItem('users_data', JSON.stringify(updatedUsers));
      
      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully.',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert(
        'Update Failed',
        'Failed to change your password. Please try again.',
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
            
            <ThemedText style={styles.title}>Change Password</ThemedText>
            
            <View style={styles.placeholderView} />
          </View>

          <View style={styles.formContainer}>
            <ThemedText style={styles.subtitle}>
              Please enter your current password and a new password to update your account security.
            </ThemedText>

            <View style={styles.inputContainer}>
              <TextInput
                label="Current Password"
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  if (errors.currentPassword) {
                    setErrors(prev => ({ ...prev, currentPassword: '' }));
                  }
                }}
                secureTextEntry={!isCurrentPasswordVisible}
                mode="outlined"
                style={styles.input}
                outlineColor={errors.currentPassword ? "#FF3B30" : "#CCCCCC"}
                activeOutlineColor={errors.currentPassword ? "#FF3B30" : "#4B76E5"}
                left={<TextInput.Icon icon="lock" color={errors.currentPassword ? "#FF3B30" : "#4B76E5"} />}
                right={
                  <TextInput.Icon
                    icon={isCurrentPasswordVisible ? "eye-off" : "eye"}
                    color="#4B76E5"
                    onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
                  />
                }
                theme={{ roundness: 12 }}
                error={!!errors.currentPassword}
              />
              {errors.currentPassword ? (
                <ThemedText style={styles.errorText}>{errors.currentPassword}</ThemedText>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errors.newPassword) {
                    setErrors(prev => ({ ...prev, newPassword: '' }));
                  }
                }}
                secureTextEntry={!isNewPasswordVisible}
                mode="outlined"
                style={styles.input}
                outlineColor={errors.newPassword ? "#FF3B30" : "#CCCCCC"}
                activeOutlineColor={errors.newPassword ? "#FF3B30" : "#4B76E5"}
                left={<TextInput.Icon icon="lock-reset" color={errors.newPassword ? "#FF3B30" : "#4B76E5"} />}
                right={
                  <TextInput.Icon
                    icon={isNewPasswordVisible ? "eye-off" : "eye"}
                    color="#4B76E5"
                    onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  />
                }
                theme={{ roundness: 12 }}
                error={!!errors.newPassword}
              />
              {errors.newPassword ? (
                <ThemedText style={styles.errorText}>{errors.newPassword}</ThemedText>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                secureTextEntry={!isConfirmPasswordVisible}
                mode="outlined"
                style={styles.input}
                outlineColor={errors.confirmPassword ? "#FF3B30" : "#CCCCCC"}
                activeOutlineColor={errors.confirmPassword ? "#FF3B30" : "#4B76E5"}
                left={<TextInput.Icon icon="lock-check" color={errors.confirmPassword ? "#FF3B30" : "#4B76E5"} />}
                right={
                  <TextInput.Icon
                    icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    color="#4B76E5"
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  />
                }
                theme={{ roundness: 12 }}
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword ? (
                <ThemedText style={styles.errorText}>{errors.confirmPassword}</ThemedText>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleChangePassword}
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
                  <ThemedText style={styles.buttonText}>Update Password</ThemedText>
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
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 22,
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