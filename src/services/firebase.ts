import { Platform } from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
// @ts-expect-error getReactNativePersistence exists in the RN bundle but not web type defs
import { initializeAuth, getAuth, connectAuthEmulator, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4sapSuUzbwfaJ0LNgd09ZfaTg1lpNfLQ",
    authDomain: "indera-574de.firebaseapp.com",
    projectId: "indera-574de",
    storageBucket: "indera-574de.firebasestorage.app",
    messagingSenderId: "651721331410",
    appId: "1:651721331410:web:6facf0ac640de8dd55130b",
    measurementId: "G-Z3QKFTDMP2"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const db = getFirestore(app);

let authInstance: ReturnType<typeof getAuth>;
try {
    if (Platform.OS === 'web') {
        authInstance = getAuth(app);
    } else {
        authInstance = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }
} catch {
    // Re-running during fast refresh triggers auth/already-initialized.
    authInstance = getAuth(app);
}
export const auth = authInstance;

export const functions = getFunctions(app);
export const storage = getStorage(app);

// Connect to emulators in development (optional - commented out for production Firebase)
const isDevelopment = __DEV__;

if (isDevelopment && false) { // Disabled emulators since we have real Firebase
    // Use Firebase emulators in development - NO CREDENTIALS NEEDED
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectStorageEmulator(storage, 'localhost', 9199);
}

export default app;