import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { mockChildren } from '../../data/mockData';

export default function SubjectDetailScreen({ route, navigation }: any) {
  const { childId, subjectId } = route.params;
  const child = mockChildren.find(c => c.id === childId);
  const subject = child?.subjects.find(s => s.id === subjectId);

  if (!child || !subject) return null;

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return Colors.gradeExcellent;
    if (pct >= 60) return Colors.gradeGood;
    if (pct >= 50) return Colors.gradeAverage;
    return Colors.gradePoor;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <Text style={styles.teacherName}>{subject.teacher}</Text>
        </View>
        <View style={styles.percentageBadge}>
          <Text style={[styles.percentageText, { color: getScoreColor(subject.currentPercentage) }]}>
            {subject.currentPercentage}%
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Performance Trend */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance Trend</Text>
          <View style={styles.trendContainer}>
            {subject.assessments.slice().reverse().map((assessment, index) => {
              const pct = (assessment.score / assessment.maxScore) * 100;
              const barHeight = Math.max(pct * 1.2, 10);
              return (
                <View key={assessment.id} style={styles.trendBar}>
                  <Text style={styles.trendPct}>{Math.round(pct)}%</Text>
                  <View style={[styles.bar, { height: barHeight, backgroundColor: getScoreColor(pct) }]} />
                  <Text style={styles.trendLabel} numberOfLines={1}>
                    {assessment.type.slice(0, 4)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Assessments */}
        <Text style={styles.sectionTitle}>Assessments</Text>
        {subject.assessments.map(assessment => {
          const pct = Math.round((assessment.score / assessment.maxScore) * 100);
          return (
            <TouchableOpacity
              key={assessment.id}
              activeOpacity={0.85}
              style={styles.assessmentCard}
              onPress={() => navigation.navigate('AssessmentDetail', {
                childId,
                subjectId,
                assessmentId: assessment.id,
              })}
            >
              <View style={styles.assessmentLeft}>
                <View style={[styles.typeBadge, { backgroundColor: getScoreColor(pct) + '15' }]}>
                  <Text style={[styles.typeText, { color: getScoreColor(pct) }]}>{assessment.type}</Text>
                </View>
                <Text style={styles.assessmentName}>{assessment.name}</Text>
                <Text style={styles.assessmentDate}>{assessment.date}</Text>
              </View>
              <View style={styles.assessmentRight}>
                <Text style={[styles.scoreText, { color: getScoreColor(pct) }]}>
                  {assessment.score}/{assessment.maxScore}
                </Text>
                <Text style={[styles.scorePct, { color: getScoreColor(pct) }]}>{pct}%</Text>
              </View>
            </TouchableOpacity>
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
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  teacherName: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  percentageBadge: {
    backgroundColor: Colors.darkSecondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '700',
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
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 140,
  },
  trendBar: {
    alignItems: 'center',
    flex: 1,
  },
  trendPct: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  bar: {
    width: 28,
    borderRadius: 6,
  },
  trendLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  assessmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  assessmentLeft: {
    flex: 1,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  assessmentName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  assessmentDate: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  assessmentRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
  },
  scorePct: {
    fontSize: 13,
    fontWeight: '500',
  },
});
