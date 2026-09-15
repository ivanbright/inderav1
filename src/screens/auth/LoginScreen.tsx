import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../contexts/AppContext';

export default function LoginScreen({ navigation }: { navigation?: any }) {
    const { signIn, error, clearError, isLoading } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both your email and password');
            return;
        }
        try {
            clearError();
            await signIn(email.trim(), password);
        } catch (e: any) {
            console.error('Login error:', e);
            Alert.alert('Login Failed', e?.message || 'Please check your credentials and try again');
        }
    };

    const handleGoogleSignIn = () => {
        Alert.alert(
            'Google Sign-In',
            'Google sign-in requires configuration in the Firebase console. Use email/password to sign in now.',
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
                        <View style={styles.topSection}>
                            <View style={styles.logoBadge}>
                                <Ionicons name="shield" size={36} color={Colors.primary} />
                            </View>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue your educational journey</Text>
                        </View>

                        {/* Glassmorphic Form Card */}
                        <View style={styles.cardShadow}>
                            <View style={styles.formCard}>
                                <Text style={styles.formTitle}>Sign In</Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Email</Text>
                                    <TextInput
                                        style={[styles.input, emailFocused && styles.inputFocused]}
                                        placeholder="user@school.edu"
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
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            placeholder="********"
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

                                <View style={styles.optionsContainer}>
                                    <View style={styles.checkboxContainer}>
                                        <Text style={styles.checkboxLabel}>Remember me</Text>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => navigation?.navigate('ForgotPassword')}
                                    >
                                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.loginButtonText}>
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.googleButton}
                                    onPress={handleGoogleSignIn}
                                >
                                    <Ionicons name="logo-google" size={18} color={Colors.textPrimary} />
                                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                                </TouchableOpacity>

                                <View style={styles.signupContainer}>
                                    <Text style={styles.signupPrompt}>Don't have an account?</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => navigation?.navigate('SignUp')}
                                    >
                                        <Text style={styles.signupLink}> Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    topSection: { alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 },
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
        marginBottom: 40,
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
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
    checkboxLabel: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
    forgotPassword: { fontSize: 13, fontWeight: '600', color: Colors.primary },
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
    signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    signupPrompt: { ...Typography.body, color: Colors.textSecondary },
    signupLink: { ...Typography.body, color: Colors.primary, fontWeight: '700' },
});
