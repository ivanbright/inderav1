import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/contexts/AppContext';

// Hide the Android system 3-button navigation bar so the app's
// own bottom tab bar is used (swipe up from the bottom to reveal it).
if (Platform.OS === 'android') {
  NavigationBar.setHidden(true);
}

export default function App() {
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
