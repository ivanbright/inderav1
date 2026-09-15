import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import AdminOverviewScreen from '../screens/admin/AdminOverviewScreen';
import AcademicStructureScreen from '../screens/admin/AcademicStructureScreen';
import SchoolSettingsScreen from '../screens/admin/SchoolSettingsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import AdminClassesScreen from '../screens/admin/AdminClassesScreen';
import AdminSubjectsScreen from '../screens/admin/AdminSubjectsScreen';
import AdminTeachersScreen from '../screens/admin/AdminTeachersScreen';
import AdminStudentsScreen from '../screens/admin/AdminStudentsScreen';
import AdminParentsScreen from '../screens/admin/AdminParentsScreen';
import AdminAnnouncementsScreen from '../screens/admin/AdminAnnouncementsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AdminStructureStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StructureHome" component={AcademicStructureScreen} />
    </Stack.Navigator>
  );
}

export default function AdminTabs() {
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
            case 'Overview':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Structure':
              iconName = focused ? 'business' : 'business-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Overview" component={AdminOverviewScreen} />
      <Tab.Screen name="Structure" component={AdminStructureStack} />
      <Tab.Screen name="Settings" component={SchoolSettingsScreen} />
      <Tab.Screen name="Profile" component={AdminProfileScreen} />
      
      {/* Hidden tabs pushed from Overview */}
      <Tab.Screen name="AdminTeachers" component={AdminTeachersScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="AdminStudents" component={AdminStudentsScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="AdminClasses" component={AdminClassesScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="AdminAnnouncements" component={AdminAnnouncementsScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="AdminSubjects" component={AdminSubjectsScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="AdminParents" component={AdminParentsScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
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
