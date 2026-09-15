import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { mockChildren } from '../../data/mockData';
import SectionHeader from '../../components/SectionHeader';
import SubjectProgressBar from '../../components/SubjectProgressBar';
import AttendanceRing from '../../components/AttendanceRing';
import ActivityCard from '../../components/ActivityCard';
import FeedbackCard from '../../components/FeedbackCard';

export default function ChildOverviewScreen({ route, navigation }: any) {
  const { childId } = route.params;
  const child = mockChildren.find(c => c.id === childId);

  if (!child) return null;

  const presentCount = child.attendance.filter(a => a.status === 'present').length;
  const absentCount = child.attendance.filter(a => a.status === 'absent').length;
  const lateCount = child.attendance.filter(a => a.status === 'late').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{child.avatar}</Text>
          </View>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childGrade}>{child.grade}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.overallBadge}>
            <Text style={styles.overallValue}>{child.overallAverage}%</Text>
            <Text style={styles.overallLabel}>Overall</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.card}>
          <SectionHeader title="Quick Actions" showSeeAll={false} />
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ReportAbsence', { childId: child.id, childName: child.name })}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="medical-outline" size={20} color="#EF4444" />
              </View>
              <Text style={styles.actionLabel}>Report Absence</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('BehaviorReports', { childId: child.id })}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="happy-outline" size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.actionLabel}>Behavior Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('PickupManagement', { childId: child.id })}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#EBF5FF' }]}>
                <Ionicons name="people-outline" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.actionLabel}>Pickup People</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Attendance', { childId: child.id })}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="calendar-outline" size={20} color="#10B981" />
              </View>
              <Text style={styles.actionLabel}>View Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Academic Progress */}
        <View style={styles.card}>
          <SectionHeader
            title="Academic Progress"
            showSeeAll={false}
          />
          {child.subjects.map(subject => (
            <TouchableOpacity
              key={subject.id}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SubjectDetail', { childId, subjectId: subject.id })}
            >
              <SubjectProgressBar
                subject={subject.name}
                percentage={subject.currentPercentage}
                color={subject.color}
                teacher={subject.teacher}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Attendance */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => navigation.navigate('Attendance', { childId })}
        >
          <SectionHeader title="Attendance" onSeeAll={() => navigation.navigate('Attendance', { childId })} />
          <View style={styles.attendanceRow}>
            <AttendanceRing presentRate={child.attendanceRate} />
            <View style={styles.attendanceStats}>
              <View style={styles.attendanceStat}>
                <View style={[styles.statusDot, { backgroundColor: Colors.attendancePresent }]} />
                <Text style={styles.attendanceLabel}>Present</Text>
                <Text style={styles.attendanceValue}>{presentCount}</Text>
              </View>
              <View style={styles.attendanceStat}>
                <View style={[styles.statusDot, { backgroundColor: Colors.attendanceAbsent }]} />
                <Text style={styles.attendanceLabel}>Absent</Text>
                <Text style={styles.attendanceValue}>{absentCount}</Text>
              </View>
              <View style={styles.attendanceStat}>
                <View style={[styles.statusDot, { backgroundColor: Colors.attendanceLate }]} />
                <Text style={styles.attendanceLabel}>Late</Text>
                <Text style={styles.attendanceValue}>{lateCount}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Recent Activity */}
        <View style={styles.card}>
          <SectionHeader title="Recent Activity" showSeeAll={false} />
          {child.recentActivity.slice(0, 3).map(activity => (
            <ActivityCard
              key={activity.id}
              type={activity.type}
              title={activity.title}
              description={activity.description}
              timestamp={activity.timestamp}
            />
          ))}
        </View>

        {/* Teacher Feedback */}
        <View style={styles.section}>
          <SectionHeader
            title="Teacher Feedback"
            onSeeAll={() => navigation.navigate('TeacherFeedback', { childId })}
          />
          {child.feedback.slice(0, 2).map(fb => (
            <FeedbackCard
              key={fb.id}
              teacher={fb.teacher}
              subject={fb.subject}
              date={fb.date}
              content={fb.content}
              type={fb.type}
            />
          ))}
        </View>
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
    paddingBottom: 24,
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
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  childName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textWhite,
    marginBottom: 2,
  },
  childGrade: {
    fontSize: 14,
    color: Colors.textLight,
  },
  headerRight: {
    width: 40,
  },
  overallBadge: {
    alignItems: 'center',
  },
  overallValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gradeGood,
  },
  overallLabel: {
    fontSize: 11,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  section: {
    marginBottom: 16,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceStats: {
    flex: 1,
    marginLeft: 24,
  },
  attendanceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  attendanceLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  attendanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
