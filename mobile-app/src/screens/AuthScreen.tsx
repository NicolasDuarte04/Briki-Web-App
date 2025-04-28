import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Snackbar, 
  Surface,
  Divider
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../utils/theme';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  // Login or Register mode
  const [isLogin, setIsLogin] = useState(true);
  
  // Animation values
  const formOpacity = useRef(new Animated.Value(1)).current;
  const formPosition = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const socialButtonsPosition = useRef(new Animated.Value(50)).current;
  const socialButtonsOpacity = useRef(new Animated.Value(0)).current;
  
  // Form values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  const [snackVisible, setSnackVisible] = useState(false);
  
  // Form validation
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  
  // Auth context
  const { login, register, isLoading } = useAuth();
  
  // Animate social buttons on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(socialButtonsOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(socialButtonsPosition, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setUsernameError(null);
    setPasswordError(null);
    setEmailError(null);
    setConfirmPasswordError(null);
    
    // Username validation
    if (!username.trim()) {
      setUsernameError('El nombre de usuario es requerido');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('El nombre de usuario debe tener al menos 3 caracteres');
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    }
    
    // Additional validation for registration
    if (!isLogin) {
      // Email validation
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!email) {
        setEmailError('El correo electrónico es requerido');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        setEmailError('Por favor ingresa un correo electrónico válido');
        isValid = false;
      }
      
      // Confirm password validation
      if (password !== confirmPassword) {
        setConfirmPasswordError('Las contraseñas no coinciden');
        isValid = false;
      }
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await login(username, password);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión. Por favor intenta de nuevo.';
      setError(errorMessage);
      setSnackVisible(true);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      await register(username, password, email);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse. Por favor intenta de nuevo.';
      setError(errorMessage);
      setSnackVisible(true);
    }
  };

  const toggleAuthMode = () => {
    // Animate form transition
    Animated.sequence([
      // Fade out and move form
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(formPosition, {
          toValue: isLogin ? 50 : -50,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(logoScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true
        })
      ]),
      // Switch mode and fade in form
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(formPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ])
    ]).start();
    
    // Switch mode
    setIsLogin(!isLogin);
    
    // Reset errors and fields when switching modes
    setError(null);
    setUsernameError(null);
    setPasswordError(null);
    setEmailError(null);
    setConfirmPasswordError(null);
    
    if (isLogin) {
      // Clear registration-specific fields
      setEmail('');
      setConfirmPassword('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Animated Logo */}
          <Animated.View 
            style={[
              styles.header, 
              { transform: [{ scale: logoScale }] }
            ]}
          >
            <Text style={styles.logo}>BRIKI</Text>
            <Text style={styles.tagline}>Seguro de viaje inteligente</Text>
          </Animated.View>
          
          {/* Animated Form Container */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: formOpacity,
                transform: [{ translateX: formPosition }]
              }
            ]}
          >
            <Text style={styles.title}>
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Text>
            
            <TextInput
              label="Nombre de usuario"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              error={!!usernameError}
              disabled={isLoading}
              left={<TextInput.Icon icon="account" />}
            />
            {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
            
            {!isLogin && (
              <>
                <TextInput
                  label="Correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!emailError}
                  disabled={isLoading}
                  left={<TextInput.Icon icon="email" />}
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}
              </>
            )}
            
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              error={!!passwordError}
              disabled={isLoading}
              left={<TextInput.Icon icon="lock" />}
            />
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            
            {!isLogin && (
              <>
                <TextInput
                  label="Confirmar contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry
                  error={!!confirmPasswordError}
                  disabled={isLoading}
                  left={<TextInput.Icon icon="lock-check" />}
                />
                {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
              </>
            )}
            
            <Button
              mode="contained"
              onPress={isLogin ? handleLogin : handleRegister}
              style={styles.button}
              disabled={isLoading}
              loading={isLoading}
              contentStyle={{ paddingVertical: 6 }}
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
            
            <Divider style={styles.divider} />
            
            {/* Social Login Buttons */}
            <Animated.View 
              style={{
                opacity: socialButtonsOpacity,
                transform: [{ translateY: socialButtonsPosition }]
              }}
            >
              <Text style={styles.socialText}>O continuar con</Text>
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#4267B2' }]}>
                  <FontAwesome name="facebook" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
                  <FontAwesome name="google" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000000' }]}>
                  <FontAwesome name="apple" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
    textAlign: 'center',
  },
  input: {
    marginBottom: 5,
    backgroundColor: COLORS.surface,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    marginTop: 15,
    padding: 5,
    backgroundColor: COLORS.primary,
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  snackbar: {
    backgroundColor: COLORS.error,
  },
});

export default AuthScreen;