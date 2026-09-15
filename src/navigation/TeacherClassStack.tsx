import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherClassesScreen from '../screens/teacher/TeacherClassesScreen';
import ClassStudentsScreen from '../screens/teacher/ClassStudentsScreen';
import TeacherStudentViewScreen from '../screens/teacher/TeacherStudentViewScreen';
import RecordAttendanceScreen from '../screens/teacher/RecordAttendanceScreen';
import CreateAssessmentScreen from '../screens/teacher/CreateAssessmentScreen';
import ResultEntryScreen from '../screens/teacher/ResultEntryScreen';

const Stack = createNativeStackNavigator();

export default function TeacherClassStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClassesList" component={TeacherClassesScreen} />
      <Stack.Screen name="ClassStudents" component={ClassStudentsScreen} />
      <Stack.Screen name="TeacherStudentView" component={TeacherStudentViewScreen} />
      <Stack.Screen name="RecordAttendance" component={RecordAttendanceScreen} />
      <Stack.Screen name="CreateAssessment" component={CreateAssessmentScreen} />
      <Stack.Screen name="ResultEntry" component={ResultEntryScreen} />
    </Stack.Navigator>
  );
}
