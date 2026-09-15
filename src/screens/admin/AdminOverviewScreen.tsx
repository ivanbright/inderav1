import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { adminProfile } from '../../data/mockData';
import SectionHeader from '../../components/SectionHeader';
import { useApp } from '../../contexts/AppContext';
import { useAdminData } from '../../hooks/useAdminData';

export default function AdminOverviewScreen({ navigation }: any) {
  const { userProfile, user } = useApp();
  const { teachers, students, classes, parents, isLoading } = useAdminData(userProfile?.schoolId);

  const stats = [
    { label: 'Students', value: students.length, icon: 'people' as const, color: '#3B82F6', bg: '#EBF5FF' },
    { label: 'Teachers', value: teachers.length, icon: 'school' as const, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Classes', value: classes.length, icon: 'layers' as const, color: '#8B5CF6', bg: '#F3F0FF' },
    { label: 'Parents', value: parents.length, icon: 'people-circle' as const, color: '#F59E0B', bg: '#FFF8EB' },
  ];

  const quickActions = [
    { label: 'Teachers', icon: 'person' as const, screen: 'AdminTeachers', color: '#10B981' },
    { label: 'Students', icon: 'people' as const, screen: 'AdminStudents', color: '#3B82F6' },
    { label: 'Classes', icon: 'layers' as const, screen: 'AdminClasses', color: '#8B5CF6' },
    { label: 'Announce', icon: 'megaphone' as const, screen: 'AdminAnnouncements', color: '#EF4444' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <View>
          <Text style={styles.schoolName}>{userProfile?.displayName || adminProfile.name}</Text>
          <Text style={styles.role}>{userProfile?.role || adminProfile.role}</Text>
        </View>
        <View style={styles.adminAvatar}><Text style={styles.adminAvatarText}>{(userProfile?.displayName || adminProfile.name).split(' ').map(n => n[0]).join('')}</Text></View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading school data...</Text>
          </View>
        ) : (
        <View style={styles.statsGrid}>
          {stats.map(s => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}><Ionicons name={s.icon} size={22} color={s.color} /></View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
        )}

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" showSeeAll={false} />
        <View style={styles.actionsRow}>
          {quickActions.map(a => (
            <TouchableOpacity key={a.label} activeOpacity={0.8} style={styles.actionCard} onPress={() => navigation.navigate(a.screen)}>
              <View style={[styles.actionIcon, { backgroundColor: a.color + '15' }]}><Ionicons name={a.icon} size={22} color={a.color} /></View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent System Activity */}
        <SectionHeader title="System Overview" showSeeAll={false} />
        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}><Text style={styles.overviewLabel}>Academic Year</Text><Text style={styles.overviewValue}>2026</Text></View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewRow}><Text style={styles.overviewLabel}>Current Term</Text><Text style={[styles.overviewValue, { color: Colors.attendancePresent }]}>Term 3</Text></View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewRow}><Text style={styles.overviewLabel}>Term Ends</Text><Text style={styles.overviewValue}>Sep 26, 2026</Text></View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewRow}><Text style={styles.overviewLabel}>Avg Attendance</Text><Text style={[styles.overviewValue, { color: Colors.attendancePresent }]}>92%</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  schoolName: { fontSize: 22, fontWeight: '700', color: Colors.textWhite },
  role: { fontSize: 14, color: Colors.primary, marginTop: 2 },
  adminAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  adminAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  statIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  actionCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 14, alignItems: 'center', marginHorizontal: 3, borderWidth: 1, borderColor: Colors.borderLight },
  actionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  overviewCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.borderLight },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  overviewLabel: { fontSize: 15, color: Colors.textSecondary },
  overviewValue: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  overviewDivider: { height: 1, backgroundColor: Colors.borderLight },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 12, fontSize: 14, color: Colors.textSecondary },
});
