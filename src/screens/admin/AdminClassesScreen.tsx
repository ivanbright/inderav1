import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../contexts/AppContext';
import { useAdminData } from '../../hooks/useAdminData';
import { Class, Teacher, Subject } from '../../services/models';

export default function AdminClassesScreen() {
  const { userProfile } = useApp();
  const { classes, teachers, subjects, isLoading } = useAdminData(userProfile?.schoolId);

  const teacherMap = new Map(teachers.map(t => [t.id, `${t.firstName} ${t.lastName}`.trim()]));
  const subjectMap = new Map(subjects.map(s => [s.id, s.name]));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}><Text style={styles.title}>Classes</Text><Text style={styles.subtitle}>{classes.length} classes</Text></View>
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {classes.length === 0 && <Text style={styles.empty}>No classes found for this school.</Text>}
        {classes.map(cls => {
          const classTeacher = (cls.teacherIds || []).map(id => teacherMap.get(id)).filter(Boolean).join(', ');
          const subjectNames = (cls.subjects || []).map(id => subjectMap.get(id)).filter(Boolean) as string[];
          return (
            <View key={cls.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.icon}><Ionicons name="layers" size={20} color={Colors.primary} /></View>
                <View style={styles.info}><Text style={styles.name}>{cls.name}</Text><Text style={styles.teacher}>{classTeacher || 'No teacher assigned'}</Text></View>
                <View style={styles.countBadge}><Text style={styles.countText}>{(cls.studentIds || []).length}</Text></View>
              </View>
              <View style={styles.gradeRow}>
                <Ionicons name="school" size={14} color={Colors.textSecondary} />
                <Text style={styles.gradeText}>Grade {cls.grade} · {cls.academicYear}</Text>
              </View>
              {subjectNames.length > 0 && (
                <View style={styles.subjects}>
                  {subjectNames.map(s => (<View key={s} style={styles.subjectChip}><Text style={styles.subjectText}>{s}</Text></View>))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textWhite, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14, color: Colors.textSecondary },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.borderLight },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  teacher: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  countBadge: { backgroundColor: Colors.primaryLight, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  gradeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  gradeText: { fontSize: 13, color: Colors.textSecondary, marginLeft: 6 },
  subjects: { flexDirection: 'row', flexWrap: 'wrap' },
  subjectChip: { backgroundColor: Colors.borderLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 6, marginBottom: 4 },
  subjectText: { fontSize: 12, color: Colors.textSecondary },
});