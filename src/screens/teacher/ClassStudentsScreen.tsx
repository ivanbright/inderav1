import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherClasses } from '../../data/mockData';

export default function ClassStudentsScreen({ route, navigation }: any) {
  const { classId } = route.params;
  const cls = teacherClasses.find(c => c.id === classId);
  if (!cls) return null;

  const getColor = (g: number) => { if (g >= 80) return Colors.gradeExcellent; if (g >= 60) return Colors.gradeGood; if (g >= 50) return Colors.gradeAverage; return Colors.gradePoor; };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={24} color={Colors.textWhite} /></TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{cls.name}</Text>
          <Text style={styles.subtitle}>{cls.subject} · {cls.studentCount} students</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity activeOpacity={0.8} style={styles.actionBtn} onPress={() => navigation.navigate('RecordAttendance', { classId })}>
          <Ionicons name="calendar" size={18} color="#10B981" /><Text style={styles.actionText}>Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.actionBtn} onPress={() => navigation.navigate('CreateAssessment', { classId })}>
          <Ionicons name="school" size={18} color="#3B82F6" /><Text style={styles.actionText}>Assessment</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cls.students.map(student => (
          <TouchableOpacity key={student.id} activeOpacity={0.85} style={styles.studentCard} onPress={() => navigation.navigate('TeacherStudentView', { classId, studentId: student.id })}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{student.avatar}</Text></View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentMeta}>{student.recentScores.length > 0 ? `Last: ${student.recentScores[0].score}/${student.recentScores[0].maxScore}` : 'No assessments yet'}</Text>
            </View>
            <Text style={[styles.grade, { color: getColor(student.currentGrade) }]}>{student.currentGrade}%</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.darkSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  headerInfo: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textWhite },
  subtitle: { fontSize: 14, color: Colors.textLight, marginTop: 2 },
  actionBar: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, borderWidth: 1, borderColor: Colors.borderLight },
  actionText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginLeft: 6 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderLight },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  studentMeta: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  grade: { fontSize: 18, fontWeight: '700' },
});
