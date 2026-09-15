import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import ParentHomeScreen from '../screens/parent/ParentHomeScreen';
import ChildStack from './ChildStack';
import AnnouncementsScreen from '../screens/parent/AnnouncementsScreen';
import CalendarScreen from '../screens/parent/CalendarScreen';
import ProfileScreen from '../screens/parent/ProfileScreen';
import { createScaleAnimation, ANIMATION_DURATIONS } from '../utils/animations';

const Tab = createBottomTabNavigator();

// Animated Tab Icon Component
function AnimatedTabIcon({
  focused,
  iconName,
  size = 22,
  color
}: {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  color: string;
}) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.8)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      // Scale up and bounce when focused
      Animated.sequence([
        createScaleAnimation(scaleAnim, 1.1, ANIMATION_DURATIONS.fast),
        createScaleAnimation(scaleAnim, 1, ANIMATION_DURATIONS.fast),
      ]).start();

      // Subtle bounce effect
      Animated.sequence([
        createScaleAnimation(bounceAnim, 1.15, ANIMATION_DURATIONS.veryFast),
        createScaleAnimation(bounceAnim, 1, ANIMATION_DURATIONS.fast),
      ]).start();
    } else {
      // Scale down when unfocused
      createScaleAnimation(scaleAnim, 0.9, ANIMATION_DURATIONS.fast).start();
    }
  }, [focused]);

  return (
    <Animated.View
      style={[
        focused ? styles.activeIconContainer : styles.inactiveIconContainer,
        {
          transform: [
            { scale: scaleAnim },
            { scale: bounceAnim },
          ],
        },
      ]}
    >
      <Ionicons name={iconName} size={size} color={color} />
    </Animated.View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingTop: 8,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ChildrenTab':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Announcements':
              iconName = focused ? 'megaphone' : 'megaphone-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return (
            <AnimatedTabIcon
              focused={focused}
              iconName={iconName}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={ParentHomeScreen} />
      <Tab.Screen
        name="ChildrenTab"
        component={ChildStack}
        options={{ tabBarLabel: 'Children' }}
      />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Announcements" component={AnnouncementsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
