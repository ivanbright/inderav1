import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { mockChildren } from '../../data/mockData';

export default function AssessmentDetailScreen({ route, navigation }: any) {
  const { childId, subjectId, assessmentId } = route.params;
  const child = mockChildren.find(c => c.id === childId);
  const subject = child?.subjects.find(s => s.id === subjectId);
  const assessment = subject?.assessments.find(a => a.id === assessmentId);

  if (!child || !subject || !assessment) return null;

  const pct = Math.round((assessment.score / assessment.maxScore) * 100);

  const getColor = (p: number) => {
    if (p >= 80) return Colors.gradeExcellent;
    if (p >= 60) return Colors.gradeGood;
    if (p >= 50) return Colors.gradeAverage;
    return Colors.gradePoor;
  };

  const color = getColor(pct);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Hero */}
        <View style={styles.scoreCard}>
          <View style={[styles.scoreCircle, { borderColor: color }]}>
            <Text style={[styles.scoreValue, { color }]}>{pct}%</Text>
          </View>
          <Text style={styles.assessmentName}>{assessment.name}</Text>
          <View style={[styles.typeBadge, { backgroundColor: color + '15' }]}>
            <Text style={[styles.typeText, { color }]}>{assessment.type}</Text>
          </View>
          <Text style={styles.scoreBreakdown}>{assessment.score} out of {assessment.maxScore}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="book" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Subject</Text>
              <Text style={styles.detailValue}>{subject.name}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="person" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Teacher</Text>
              <Text style={styles.detailValue}>{assessment.teacher}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{assessment.date}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="person-circle" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Student</Text>
              <Text style={styles.detailValue}>{child.name}</Text>
            </View>
          </View>
        </View>

        {/* Teacher Feedback */}
        {assessment.feedback && (
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <Ionicons name="chatbubble-ellipses" size={18} color="#8B5CF6" />
              <Text style={styles.feedbackTitle}>Teacher's Comment</Text>
            </View>
            <Text style={styles.feedbackText}>{assessment.feedback}</Text>
            <Text style={styles.feedbackTeacher}>— {assessment.teacher}</Text>
          </View>
        )}
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  scoreCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  assessmentName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scoreBreakdown: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  feedbackCard: {
    backgroundColor: '#F3F0FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E0FF',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  feedbackText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  feedbackTeacher: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
