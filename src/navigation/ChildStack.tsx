import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChildrenListScreen from '../screens/parent/ChildrenListScreen';
import ChildOverviewScreen from '../screens/parent/ChildOverviewScreen';
import SubjectDetailScreen from '../screens/parent/SubjectDetailScreen';
import AssessmentDetailScreen from '../screens/parent/AssessmentDetailScreen';
import AttendanceScreen from '../screens/parent/AttendanceScreen';
import TeacherFeedbackScreen from '../screens/parent/TeacherFeedbackScreen';
import ReportAbsenceScreen from '../screens/parent/ReportAbsenceScreen';
import BehaviorReportsScreen from '../screens/parent/BehaviorReportsScreen';
import PickupManagementScreen from '../screens/parent/PickupManagementScreen';

const Stack = createNativeStackNavigator();

export default function ChildStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChildrenList" component={ChildrenListScreen} />
      <Stack.Screen name="ChildOverview" component={ChildOverviewScreen} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      <Stack.Screen name="AssessmentDetail" component={AssessmentDetailScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="TeacherFeedback" component={TeacherFeedbackScreen} />
      <Stack.Screen name="ReportAbsence" component={ReportAbsenceScreen} />
      <Stack.Screen name="BehaviorReports" component={BehaviorReportsScreen} />
      <Stack.Screen name="PickupManagement" component={PickupManagementScreen} />
    </Stack.Navigator>
  );
}
