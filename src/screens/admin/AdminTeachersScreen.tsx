import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../contexts/AppContext';
import { useAdminData } from '../../hooks/useAdminData';
import { Teacher, Subject } from '../../services/models';

export default function AdminTeachersScreen() {
  const { userProfile } = useApp();
  const { teachers, subjects, isLoading } = useAdminData(userProfile?.schoolId);

  const teacherName = (t: Teacher) => `${t.firstName} ${t.lastName}`.trim();
  const subjectMap = new Map(subjects.map(s => [s.id, s.name]));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}><Text style={styles.title}>Teachers</Text><Text style={styles.subtitle}>{teachers.length} teachers</Text></View>
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {teachers.length === 0 && <Text style={styles.empty}>No teachers found for this school.</Text>}
        {teachers.map(t => {
          const subjectNames = (t.subjects || []).map(id => subjectMap.get(id) || id);
          return (
            <View key={t.id} style={styles.card}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{(teacherName(t).split(' ').map(n => n[0]).join('') || '?').slice(0, 2)}</Text></View>
              <View style={styles.info}>
                <Text style={styles.name}>{teacherName(t) || '—'}</Text>
                <Text style={styles.email}>{t.email}</Text>
                {subjectNames.length > 0 && (
                  <View style={styles.tags}>{subjectNames.map(s => (<View key={s} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>))}</View>
                )}
              </View>
              <View style={styles.classBadge}><Text style={styles.classNum}>{(t.classIds || []).length}</Text><Text style={styles.classLabel}>classes</Text></View>
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.borderLight },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  email: { fontSize: 12, color: Colors.textTertiary, marginTop: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  tag: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 4 },
  tagText: { fontSize: 11, fontWeight: '500', color: '#10B981' },
  classBadge: { alignItems: 'center' },
  classNum: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  classLabel: { fontSize: 11, color: Colors.textTertiary },
});