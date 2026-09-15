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
import LoadingAnimation from '../components/LoadingAnimation';
import { useApp } from '../contexts/AppContext';
import { Colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

// Screen animation options
const slideFromRight = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  animationDuration: 300,
};

const fadeIn = {
  headerShown: false,
  animation: 'fade' as const,
  animationDuration: 250,
};

const modalPresentation = {
  headerShown: false,
  presentation: 'modal' as const,
  animation: 'slide_from_bottom' as const,
  animationDuration: 300,
};

export default function AppNavigator() {
  const { isAuthenticated, userProfile, isLoading } = useApp();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <LoadingAnimation size={32} color={Colors.primary} type="spinner" />
      </View>
    );
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated || !userProfile) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={fadeIn} />
        <Stack.Screen name="SignUp" component={SignupScreen} options={slideFromRight} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={slideFromRight} />
      </Stack.Navigator>
    );
  }

  // Show main app based on user role
  return (
    <Stack.Navigator>
      {userProfile.role === 'parent' && <Stack.Screen name="MainTabs" component={MainTabs} options={fadeIn} />}
      {userProfile.role === 'teacher' && <Stack.Screen name="TeacherTabs" component={TeacherTabs} options={fadeIn} />}
      {userProfile.role === 'admin' && <Stack.Screen name="AdminTabs" component={AdminTabs} options={fadeIn} />}

      {/* Global screens accessible from any role */}
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={slideFromRight} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} options={slideFromRight} />
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} options={slideFromRight} />
      <Stack.Screen name="AdminStudentDetail" component={AdminStudentDetailScreen} options={slideFromRight} />
      <Stack.Screen name="ReportAbsence" component={ReportAbsenceScreen} options={modalPresentation} />
      <Stack.Screen name="BehaviorReports" component={BehaviorReportsScreen} options={slideFromRight} />
      <Stack.Screen name="PickupManagement" component={PickupManagementScreen} options={slideFromRight} />
      <Stack.Screen name="CreateAssignment" component={CreateAssignmentScreen} options={modalPresentation} />
      <Stack.Screen name="GiveFeedback" component={GiveFeedbackScreen} options={modalPresentation} />
      <Stack.Screen name="RecordAttendance" component={RecordAttendanceScreen} options={slideFromRight} />
      <Stack.Screen name="ResultEntry" component={ResultEntryScreen} options={slideFromRight} />
    </Stack.Navigator>
  );
}
