import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/contexts/AppContext';
import { initializationService } from './src/services/initializationService';
import { Colors } from './src/theme/colors';

// Hide the Android system 3-button navigation bar so the app's
// own bottom tab bar is used (swipe up from the bottom to reveal it).
if (Platform.OS === 'android') {
  NavigationBar.setHidden(true);
}

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializationService.initializeApp();
      } catch (error) {
        console.error('App initialization failed:', error);
        // Continue anyway - app should work with or without demo data
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 16, fontSize: 16, color: Colors.textSecondary }}>
            Loading Indera...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
