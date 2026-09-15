import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { mockChildren } from '../../data/mockData';

const statusConfig = {
  present: { color: Colors.attendancePresent, icon: 'checkmark-circle' as const, label: 'Present' },
  absent: { color: Colors.attendanceAbsent, icon: 'close-circle' as const, label: 'Absent' },
  late: { color: Colors.attendanceLate, icon: 'time' as const, label: 'Late' },
  excused: { color: Colors.attendanceExcused, icon: 'shield-checkmark' as const, label: 'Excused' },
};

export default function AttendanceScreen({ route, navigation }: any) {
  const { childId } = route.params;
  const child = mockChildren.find(c => c.id === childId);

  if (!child) return null;

  const presentCount = child.attendance.filter(a => a.status === 'present').length;
  const absentCount = child.attendance.filter(a => a.status === 'absent').length;
  const lateCount = child.attendance.filter(a => a.status === 'late').length;
  const excusedCount = child.attendance.filter(a => a.status === 'excused').length;
  const total = child.attendance.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <Text style={styles.headerSubtitle}>{child.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: Colors.attendancePresent }]}>
            <Text style={[styles.statNumber, { color: Colors.attendancePresent }]}>{presentCount}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.attendanceAbsent }]}>
            <Text style={[styles.statNumber, { color: Colors.attendanceAbsent }]}>{absentCount}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.attendanceLate }]}>
            <Text style={[styles.statNumber, { color: Colors.attendanceLate }]}>{lateCount}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: Colors.attendanceExcused }]}>
            <Text style={[styles.statNumber, { color: Colors.attendanceExcused }]}>{excusedCount}</Text>
            <Text style={styles.statLabel}>Excused</Text>
          </View>
        </View>

        {/* Rate */}
        <View style={styles.rateCard}>
          <Text style={styles.rateLabel}>Attendance Rate</Text>
          <Text style={[styles.rateValue, { color: Colors.attendancePresent }]}>{child.attendanceRate}%</Text>
          <View style={styles.rateBar}>
            <View style={[styles.rateBarFill, { width: `${child.attendanceRate}%` }]} />
          </View>
          <Text style={styles.rateSubtext}>{presentCount} of {total} school days attended</Text>
        </View>

        {/* Records */}
        <Text style={styles.sectionTitle}>Recent Records</Text>
        {child.attendance.map(record => {
          const config = statusConfig[record.status];
          return (
            <View key={record.id} style={styles.recordRow}>
              <View style={[styles.recordIcon, { backgroundColor: config.color + '15' }]}>
                <Ionicons name={config.icon} size={20} color={config.color} />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordDate}>{record.date}</Text>
                {record.note && <Text style={styles.recordNote}>{record.note}</Text>}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: config.color + '15' }]}>
                <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.dark,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 3,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  rateCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rateLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
  },
  rateBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
    marginBottom: 8,
  },
  rateBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.attendancePresent,
  },
  rateSubtext: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordDate: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  recordNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
