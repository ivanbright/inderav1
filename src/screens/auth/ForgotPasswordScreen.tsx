import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');

  // Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI State
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const otpRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const handleNext = () => {
    if (step === 'email') {
      if (!email) { Alert.alert('Error', 'Please enter your email'); return; }
      setStep('otp');
    } else if (step === 'otp') {
      if (otp.join('').length < 4) { Alert.alert('Error', 'Please enter the complete OTP'); return; }
      setStep('password');
    } else if (step === 'password') {
      if (!newPassword || newPassword !== confirmPassword) { Alert.alert('Error', 'Passwords must match'); return; }
      Alert.alert('Success', 'Your password has been reset successfully!', [
        { text: 'Log In', onPress: () => navigation.goBack() }
      ]);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) otpRefs[index + 1].current?.focus();
  };

  const renderContent = () => {
    if (step === 'email') {
      return (
        <View style={styles.bottomSection}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            placeholder="e.g. user@school.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textTertiary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <TouchableOpacity activeOpacity={0.8} style={styles.resetButton} onPress={handleNext}>
            <Text style={styles.resetButtonText}>Send Code</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (step === 'otp') {
      return (
        <View style={styles.bottomSection}>
          <Text style={styles.inputLabel}>Enter 4-digit code sent to {email}</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={otpRefs[idx]}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, idx)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !digit && idx > 0) otpRefs[idx - 1].current?.focus();
                }}
              />
            ))}
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.resetButton} onPress={handleNext}>
            <Text style={styles.resetButtonText}>Verify Code</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (step === 'password') {
      return (
        <View style={styles.bottomSection}>
          <Text style={styles.inputLabel}>New Password</Text>
          <View style={[styles.passwordContainer, isFocused && styles.inputFocused]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="*******"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={Colors.textTertiary}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingHorizontal: 16 }}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="*******"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <TouchableOpacity activeOpacity={0.8} style={[styles.resetButton, { marginTop: 32 }]} onPress={handleNext}>
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={Platform.OS === 'ios'} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => step === 'email' ? navigation.goBack() : setStep(step === 'password' ? 'otp' : 'email')}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="shield" size={24} color={Colors.primary} />
              <Text style={styles.logoText}>Logoipsum</Text>
            </View>
            <Text style={styles.title}>{step === 'password' ? 'New Password' : 'Reset Password'}</Text>
            <Text style={styles.subtitle}>
              {step === 'email' ? 'Enter your email address to receive an OTP code.' :
                step === 'otp' ? 'Check your email for the verification code.' :
                  'Create a strong new password.'}
            </Text>
          </View>
          {renderContent()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40, backgroundColor: Colors.dark },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.darkSecondary, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  logoText: { color: Colors.white, fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  title: { color: Colors.white, fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: Colors.textLight, fontSize: 16, lineHeight: 24 },
  bottomSection: { flex: 1, backgroundColor: Colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 40 },
  inputLabel: { fontSize: 14, color: Colors.textPrimary, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: Colors.textPrimary, marginBottom: 32 },
  inputFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight + '20' },
  passwordContainer: { flexDirection: 'row', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, alignItems: 'center' },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: Colors.textPrimary },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  otpInput: { width: '22%', aspectRatio: 1, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, fontSize: 24, fontWeight: '700', textAlign: 'center', color: Colors.textPrimary, backgroundColor: Colors.background },
  resetButton: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  resetButtonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});
