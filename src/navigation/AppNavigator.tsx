import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import MainTabs from './MainTabs';
import TeacherTabs from './TeacherTabs';
import AdminTabs from './AdminTabs';
import NotificationsScreen from '../screens/parent/NotificationsScreen';
import NotificationDetailScreen from '../screens/parent/NotificationDetailScreen';
import AnnouncementDetailScreen from '../screens/parent/AnnouncementDetailScreen';
import AdminStudentDetailScreen from '../screens/admin/AdminStudentDetailScreen';
import ReportAbsenceScreen from '../screens/parent/ReportAbsenceScreen';
import BehaviorReportsScreen from '../screens/parent/BehaviorReportsScreen';
import PickupManagementScreen from '../screens/parent/PickupManagementScreen';
import CreateAssignmentScreen from '../screens/teacher/CreateAssignmentScreen';
import GiveFeedbackScreen from '../screens/teacher/GiveFeedbackScreen';
import RecordAttendanceScreen from '../screens/teacher/RecordAttendanceScreen';
import ResultEntryScreen from '../screens/teacher/ResultEntryScreen';
import { useApp } from '../contexts/AppContext';
import { Colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, userProfile, isLoading } = useApp();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated || !userProfile) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  // Show main app based on user role
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userProfile.role === 'parent' && <Stack.Screen name="MainTabs" component={MainTabs} />}
      {userProfile.role === 'teacher' && <Stack.Screen name="TeacherTabs" component={TeacherTabs} />}
      {userProfile.role === 'admin' && <Stack.Screen name="AdminTabs" component={AdminTabs} />}

      {/* Global screens accessible from any role */}
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
      <Stack.Screen name="AdminStudentDetail" component={AdminStudentDetailScreen} />
      <Stack.Screen name="ReportAbsence" component={ReportAbsenceScreen} />
      <Stack.Screen name="BehaviorReports" component={BehaviorReportsScreen} />
      <Stack.Screen name="PickupManagement" component={PickupManagementScreen} />
      <Stack.Screen name="CreateAssignment" component={CreateAssignmentScreen} />
      <Stack.Screen name="GiveFeedback" component={GiveFeedbackScreen} />
      <Stack.Screen name="RecordAttendance" component={RecordAttendanceScreen} />
      <Stack.Screen name="ResultEntry" component={ResultEntryScreen} />
    </Stack.Navigator>
  );
}
