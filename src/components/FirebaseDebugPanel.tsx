import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { auth, db } from '../services/firebase';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { seedService } from '../services/seedService';
import { offlineService } from '../services/offlineService';

const SCHOOL_ID = 'oakridge-academy';

const demoUserSpecs: {
    email: string;
    password: string;
    displayName: string;
    role: 'parent' | 'teacher' | 'admin';
    profile: () => Record<string, any>;
}[] = [
        {
            email: 'parent@demo.com',
            password: 'demo123',
            displayName: 'Nomsa Mbeki',
            role: 'parent',
            profile: () => ({
                parentProfile: {
                    childrenIds: ['student-1', 'student-2'],
                    phone: '+27 82 123 4567',
                    emergencyContact: '+27 83 987 6543',
                },
            }),
        },
        {
            email: 'teacher@demo.com',
            password: 'demo123',
            displayName: 'Sarah Johnson',
            role: 'teacher',
            profile: () => ({
                teacherProfile: {
                    subjects: ['mathematics'],
                    classIds: ['class-8a'],
                    employeeId: 'T001',
                },
            }),
        },
        {
            email: 'admin@demo.com',
            password: 'demo123',
            displayName: 'Principal Mokoena',
            role: 'admin',
            profile: () => ({
                adminProfile: {
                    permissions: ['full_access'],
                    managedSchoolIds: [SCHOOL_ID],
                },
            }),
        },
    ];

export default function FirebaseDebugPanel() {
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
    const [testResults, setTestResults] = useState<string[]>([]);

    const addTestResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testFirebaseConnection = async () => {
        addTestResult('Starting Firebase tests...');

        try {
            // Test 1: Firestore connection
            addTestResult('Testing Firestore connection...');
            const testCollection = collection(db, 'test');
            const testDoc = await addDoc(testCollection, {
                message: 'Firebase connection test for indera-574de',
                timestamp: new Date().toISOString()
            });
            addTestResult(`✅ Firestore working - Doc ID: ${testDoc.id}`);

            // Test 2: Read from Firestore
            const snapshot = await getDocs(testCollection);
            addTestResult(`✅ Firestore read working - Found ${snapshot.size} docs`);

            setConnectionStatus('connected');
            addTestResult('🎉 All Firebase tests passed!');

            // Disable offline mode if tests pass
            if (offlineService.isOffline()) {
                offlineService.setOfflineMode(false);
                addTestResult('✅ Offline mode disabled - Firebase is available');
            }
        } catch (error: any) {
            setConnectionStatus('error');
            addTestResult(`❌ Firebase Error: ${error.message}`);

            if (error.code === 'permission-denied' ||
                error.code === 'unavailable' ||
                error.message?.includes('network-request-failed')) {
                addTestResult('⚠️ Firebase services not enabled - switching to offline mode');
                offlineService.setOfflineMode(true);
            }
        }
    };

    const testAuth = async () => {
        try {
            addTestResult('Testing Auth with demo user creation...');

            // Try to create demo parent user
            await createUserWithEmailAndPassword(auth, 'parent@demo.com', 'demo123');
            addTestResult('✅ Demo parent user created successfully');
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                addTestResult('✅ Demo users already exist');

                // Test login
                try {
                    const { user } = await signInWithEmailAndPassword(auth, 'parent@demo.com', 'demo123');
                    await ensureUserProfile(user.uid, 'parent@demo.com', 'Nomsa Mbeki', 'parent');
                    addTestResult('✅ Demo login successful');
                } catch (loginError: any) {
                    addTestResult(`❌ Login failed: ${loginError.message}`);
                }
            } else {
                addTestResult(`❌ Auth Error: ${error.message}`);
            }
        }
    };

    const ensureUserProfile = async (uid: string, email: string, displayName: string, role: 'parent' | 'teacher' | 'admin') => {
        const spec = demoUserSpecs.find(s => s.email === email);
        await setDoc(doc(db, 'users', uid), {
            uid,
            email,
            displayName,
            role,
            schoolId: SCHOOL_ID,
            profileComplete: true,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            ...(spec ? spec.profile() : {}),
        }, { merge: true });
    };

    const createAllDemoUsers = async () => {
        for (const user of demoUserSpecs) {
            try {
                const { user: created } = await createUserWithEmailAndPassword(auth, user.email, user.password);
                await ensureUserProfile(created.uid, user.email, user.displayName, user.role);
                addTestResult(`✅ ${user.role} user created: ${user.email}`);
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    try {
                        const { user: existing } = await signInWithEmailAndPassword(auth, user.email, user.password);
                        await ensureUserProfile(existing.uid, user.email, user.displayName, user.role);
                        addTestResult(`ℹ️ ${user.role} user exists, profile ensured: ${user.email}`);
                    } catch (loginError: any) {
                        addTestResult(`❌ ${user.role}: account exists but login failed: ${loginError.message}`);
                    }
                } else {
                    addTestResult(`❌ Failed to create ${user.role}: ${error.message}`);
                }
            }
        }
    };

    const seedDemoData = async () => {
        addTestResult('Seeding demo data...');
        try {
            await seedService.seedDemoData();
            addTestResult('✅ Demo data seeded successfully (school, classes, students, teachers, assessments, etc.)');
        } catch (error: any) {
            addTestResult(`❌ Seed failed: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons
                    name={connectionStatus === 'connected' ? 'checkmark-circle' :
                        connectionStatus === 'error' ? 'alert-circle' : 'time'}
                    size={24}
                    color={connectionStatus === 'connected' ? Colors.attendancePresent :
                        connectionStatus === 'error' ? Colors.attendanceAbsent : Colors.textTertiary}
                />
                <Text style={styles.title}>Firebase Debug Panel</Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={testFirebaseConnection}>
                    <Text style={styles.buttonText}>Test Connection</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={testAuth}>
                    <Text style={styles.buttonText}>Test Auth</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={createAllDemoUsers}>
                    <Text style={styles.buttonText}>Create Demo Users</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={seedDemoData}>
                    <Text style={styles.buttonText}>Seed Demo Data</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.results}>
                <Text style={styles.resultsTitle}>Test Results:</Text>
                {testResults.slice(-10).map((result, index) => (
                    <Text key={index} style={styles.resultText}>{result}</Text>
                ))}
            </View>

            <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setTestResults([])}
            >
                <Text style={styles.clearButtonText}>Clear Results</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        margin: 20,
        padding: 20,
        borderRadius: 12,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginLeft: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    results: {
        backgroundColor: Colors.background,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        minHeight: 120,
        maxHeight: 200,
    },
    resultsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    resultText: {
        fontSize: 11,
        color: Colors.textSecondary,
        fontFamily: 'monospace',
        lineHeight: 14,
    },
    clearButton: {
        backgroundColor: Colors.background,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    clearButtonText: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontWeight: '500',
    },
});