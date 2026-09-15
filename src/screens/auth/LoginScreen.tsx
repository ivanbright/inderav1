import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../contexts/AppContext';
import AnimatedButton from '../../components/AnimatedButton';
import LoadingAnimation from '../../components/LoadingAnimation';
import { offlineService } from '../../services/offlineService';
import { createFadeAnimation, createSlideAnimation, ANIMATION_DURATIONS } from '../../utils/animations';

export default function LoginScreen() {
  const { signIn, clearError, isLoading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const formSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();

    // Start entrance animations
    const entranceAnimation = Animated.parallel([
      createFadeAnimation(fadeAnim, 1, ANIMATION_DURATIONS.entrance),
      createSlideAnimation(slideAnim, 0, ANIMATION_DURATIONS.entrance),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    const staggeredAnimation = Animated.stagger(100, [
      entranceAnimation,
      createSlideAnimation(formSlideAnim, 0, ANIMATION_DURATIONS.medium),
    ]);

    staggeredAnimation.start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both your email and password');
      return;
    }

    try {
      clearError();
      await signIn(email.trim(), password);
      // If we get here, login was successful
    } catch (e: any) {
      console.error('Login error:', e);
      const errorMessage = e?.message || 'Please check your credentials and try again';
      Alert.alert('Login Failed', errorMessage);
    }
  };



  const handleGoogleSignIn = () => {
    Alert.alert(
      'Google Sign-In',
      'Google sign-in requires additional configuration.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryLight, Colors.background, Colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Logo Section */}
            <Animated.View style={StyleSheet.flatten([styles.topSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }])}>
              <Animated.View style={StyleSheet.flatten([styles.logoBadge, { transform: [{ scale: logoScaleAnim }] }])}>
                <Ionicons name="school" size={36} color={Colors.primary} />
              </Animated.View>
              <Text style={styles.title}>Welcome to Indera</Text>
              <Text style={styles.subtitle}>Primary School Management System</Text>
            </Animated.View>

            {/* Glassmorphic Form Card */}
            <Animated.View style={StyleSheet.flatten([styles.cardShadow, { opacity: fadeAnim, transform: [{ translateY: formSlideAnim }] }])}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Sign In</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={StyleSheet.flatten([styles.input, emailFocused && styles.inputFocused])}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.textTertiary}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={StyleSheet.flatten([styles.passwordContainer, passwordFocused && styles.inputFocused])}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor={Colors.textTertiary}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ paddingHorizontal: 16 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={Colors.textTertiary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <AnimatedButton
                  style={StyleSheet.flatten([styles.loginButton, isLoading && styles.loginButtonDisabled])}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <LoadingAnimation size={16} color={Colors.white} type="spinner" />
                      <Text style={StyleSheet.flatten([styles.loginButtonText, { marginLeft: 8 }])}>
                        Signing In...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </AnimatedButton>

                <AnimatedButton
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                >
                  <Ionicons name="logo-google" size={18} color={Colors.textPrimary} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </AnimatedButton>
              </View>
            </Animated.View>

            {/* Project Info */}
            <Animated.View style={StyleSheet.flatten([styles.projectInfo, { opacity: fadeAnim }])}>
              <View style={styles.statusContainer}>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, {
                    backgroundColor: offlineService.isOffline()
                      ? Colors.attendanceAbsent
                      : Colors.attendancePresent
                  }]} />
                  <Text style={styles.statusText}>
                    {offlineService.isOffline() ? 'Demo Mode' : 'Connected'}
                  </Text>
                </View>
                <Text style={styles.projectText}>Firebase Project: indera-574de</Text>
                {offlineService.isOffline() && (
                  <Text style={StyleSheet.flatten([styles.helpText, { color: Colors.attendanceAbsent }])}>
                    Enable Firebase Auth & Firestore in console for live data
                  </Text>
                )}
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topSection: { alignItems: 'center', paddingTop: 20, paddingBottom: 20, paddingHorizontal: 24 },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },



  cardShadow: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  formCard: { backgroundColor: Colors.white, borderRadius: 32, padding: 24 },
  formTitle: { ...Typography.h2, color: Colors.textPrimary, marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { ...Typography.bodySmall, color: Colors.textSecondary, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  inputFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight + '30' },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  passwordInput: { flex: 1, paddingVertical: 16, paddingLeft: 16, fontSize: 16, color: Colors.textPrimary },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 16,
    gap: 8,
  },
  googleButtonText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },

  projectInfo: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  statusContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white + '90',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  projectText: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  helpText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    fontStyle: 'italic',
  },
});