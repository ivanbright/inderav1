import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';
import { useApp } from '../../contexts/AppContext';
import { useAdminData } from '../../hooks/useAdminData';
import { Student, Class } from '../../services/models';

export default function AdminStudentsScreen({ navigation }: any) {
  const { userProfile } = useApp();
  const { students, classes, isLoading } = useAdminData(userProfile?.schoolId);

  const classMap = new Map(classes.map((c: Class) => [c.id, c]));

  const studentName = (s: Student) => s.displayName || `${s.firstName} ${s.lastName}`.trim();

  const handleStudentPress = (student: Student) => {
    const studentClass = classMap.get(student.classId);
    navigation.navigate('AdminStudentDetail', {
      student: {
        id: student.id,
        name: studentName(student),
        className: studentClass?.name || `Grade ${student.grade}`,
        avatar: student.avatar || studentName(student).split(' ').map(n => n[0]).join('').slice(0, 2),
        parentLinked: (student.parentIds || []).length > 0,
        email: '',
        dateOfBirth: student.dateOfBirth || '',
        enrollmentDate: student.enrollmentDate || '',
        studentId: student.studentId || '',
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Students"
        subtitle={`${students.length} students`}
        showBack={false}
      />
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {students.length === 0 && <Text style={styles.empty}>No students found for this school.</Text>}
        {students.map(s => {
          const studentClass = classMap.get(s.classId);
          const linked = (s.parentIds || []).length > 0;
          return (
            <TouchableOpacity
              key={s.id}
              style={styles.card}
              onPress={() => handleStudentPress(s)}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}><Text style={styles.avatarText}>{s.avatar || studentName(s).split(' ').map(n => n[0]).join('').slice(0, 2)}</Text></View>
              <View style={styles.info}>
                <Text style={styles.name}>{studentName(s)}</Text>
                <Text style={styles.className}>{studentClass ? `${studentClass.name} · Grade ${studentClass.grade}` : `Grade ${s.grade}`}</Text>
              </View>
              <View style={styles.linkStatus}>
                <Ionicons name={linked ? 'link' : 'unlink'} size={16} color={linked ? Colors.attendancePresent : Colors.textTertiary} />
                <Text style={[styles.linkText, { color: linked ? Colors.attendancePresent : Colors.textTertiary }]}>{linked ? 'Linked' : 'No link'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14, color: Colors.textSecondary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  avatar: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  className: { fontSize: 13, color: Colors.textSecondary },
  linkStatus: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  linkText: { fontSize: 11, fontWeight: '600', marginLeft: 4 },
});