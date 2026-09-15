import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../contexts/AppContext';
import { useAdminData } from '../../hooks/useAdminData';

const subjectColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#EF4444', '#06B6D4'];

export default function AdminSubjectsScreen() {
  const { userProfile } = useApp();
  const { subjects, teachers, isLoading } = useAdminData(userProfile?.schoolId);

  const teacherMap = new Map(teachers.map(t => [t.id, `${t.firstName} ${t.lastName}`.trim()]));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}><Text style={styles.title}>Subjects</Text><Text style={styles.subtitle}>{subjects.length} subjects offered</Text></View>
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {subjects.length === 0 && <Text style={styles.empty}>No subjects found for this school.</Text>}
        {subjects.map((sub, i) => {
          const color = subjectColors[i % subjectColors.length];
          const teacherNames = (sub.teacherIds || []).map(id => teacherMap.get(id)).filter(Boolean).join(', ');
          return (
            <View key={sub.id} style={styles.card}>
              <View style={[styles.colorBar, { backgroundColor: color }]} />
              <View style={styles.content}>
                <Text style={styles.name}>{sub.name} <Text style={styles.code}>{sub.code}</Text></Text>
                <View style={styles.metaRow}>
                  <Ionicons name="person" size={14} color={Colors.textSecondary} /><Text style={styles.meta}>{teacherNames || 'No teacher assigned'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="layers" size={14} color={Colors.textSecondary} /><Text style={styles.meta}>{(sub.classIds || []).length} classes</Text>
                </View>
              </View>
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
  card: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight },
  colorBar: { width: 4 },
  content: { flex: 1, padding: 16 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  code: { fontSize: 12, fontWeight: '500', color: Colors.textTertiary },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  meta: { fontSize: 13, color: Colors.textSecondary, marginLeft: 6 },
});