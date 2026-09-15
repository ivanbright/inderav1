import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { authService } from '../../services/authService';
import { UserProfile } from '../../services/authService';

export default function SignupScreen({ navigation }: { navigation?: any }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserProfile['role']>('parent');
    const [inviteCode, setInviteCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }
        if (role !== 'parent' && !inviteCode.trim()) {
            Alert.alert('Invite Code Required', 'Teacher and Admin accounts require an invite code from the school.');
            return;
        }
        setIsLoading(true);
        try {
            const result = await authService.registerUser(email.trim(), password, role, inviteCode.trim());
            if ('pendingApproval' in result) {
                Alert.alert(
                    'Registration Submitted',
                    'Your account must be approved by a school administrator before you can sign in. Please check your email to verify your address.',
                    [{ text: 'OK', onPress: () => navigation?.goBack() }]
                );
            } else {
                Alert.alert('Account Created', 'Your account is ready. Please sign in.', [
                    { text: 'OK', onPress: () => navigation?.goBack() }
                ]);
            }
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message || 'Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions: { key: UserProfile['role']; label: string; icon: string }[] = [
        { key: 'parent', label: 'Parent', icon: 'people' },
        { key: 'teacher', label: 'Teacher', icon: 'school' },
        { key: 'admin', label: 'Admin', icon: 'shield' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.primaryLight, Colors.background, Colors.background]}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} showsVerticalScrollIndicator={false}>
                        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Choose your role to get started</Text>

                        <View style={styles.roleContainer}>
                            {roleOptions.map((item) => (
                                <TouchableOpacity
                                    key={item.key}
                                    style={[styles.roleOption, role === item.key && styles.roleOptionActive]}
                                    onPress={() => setRole(item.key)}
                                >
                                    <Ionicons name={item.icon as any} size={22} color={role === item.key ? Colors.primary : Colors.textSecondary} />
                                    <Text style={[styles.roleLabel, role === item.key && styles.roleLabelActive]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {role !== 'parent' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Invite Code</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter school invite code"
                                    value={inviteCode}
                                    onChangeText={setInviteCode}
                                    autoCapitalize="characters"
                                    placeholderTextColor={Colors.textTertiary}
                                />
                                <Text style={styles.hint}>Staff accounts require an invite code from your school administrator.</Text>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@school.edu"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={Colors.textTertiary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor={Colors.textTertiary}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            <Text style={styles.registerButtonText}>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.loginLink}>
                            <Text style={styles.loginLinkText}>Already have an account? Sign in</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    backButton: { marginBottom: 24, alignSelf: 'flex-start' },
    title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: 6 },
    subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: 32 },
    roleContainer: { flexDirection: 'row', gap: 12, marginBottom: 28 },
    roleOption: {
        flex: 1, backgroundColor: Colors.white, borderRadius: 16, paddingVertical: 16, alignItems: 'center',
        borderWidth: 1.5, borderColor: Colors.border, gap: 6,
    },
    roleOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
    roleLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
    roleLabelActive: { color: Colors.primary },
    inputGroup: { marginBottom: 18 },
    inputLabel: { ...Typography.body, color: Colors.textSecondary, marginBottom: 8 },
    input: {
        backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
        borderWidth: 1, borderColor: Colors.border, fontSize: 16, color: Colors.textPrimary,
    },
    hint: { ...Typography.caption, color: Colors.textTertiary, marginTop: 8 },
    registerButton: {
        backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center',
        marginTop: 8, shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6,
    },
    registerButtonDisabled: { opacity: 0.6 },
    registerButtonText: { fontSize: 16, fontWeight: '700', color: Colors.white },
    loginLink: { alignItems: 'center', marginTop: 24 },
    loginLinkText: { ...Typography.body, color: Colors.primary, fontWeight: '600' },
});
