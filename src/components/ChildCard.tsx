import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface ChildCardProps {
  name: string;
  grade: string;
  avatar: string;
  overallAverage: number;
  attendanceRate: number;
  onPress: () => void;
  variant?: 'horizontal' | 'vertical';
}

export default function ChildCard({ name, grade, avatar, overallAverage, attendanceRate, onPress, variant = 'horizontal' }: ChildCardProps) {
  const getGradeColor = (avg: number) => {
    if (avg >= 80) return Colors.gradeExcellent;
    if (avg >= 60) return Colors.gradeGood;
    if (avg >= 50) return Colors.gradeAverage;
    return Colors.gradePoor;
  };

  if (variant === 'vertical') {
    return (
      <TouchableOpacity activeOpacity={0.85} style={styles.verticalCard} onPress={onPress}>
        <View style={styles.verticalAvatar}>
          <Text style={styles.avatarText}>{avatar}</Text>
        </View>
        <Text style={styles.verticalName}>{name}</Text>
        <Text style={styles.verticalGrade}>{grade}</Text>
        <View style={styles.verticalStats}>
          <View style={styles.verticalStat}>
            <Text style={[styles.statValue, { color: getGradeColor(overallAverage) }]}>{overallAverage}%</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.verticalStat}>
            <Text style={[styles.statValue, { color: Colors.attendancePresent }]}>{attendanceRate}%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.horizontalCard} onPress={onPress}>
      <View style={styles.horizontalAvatar}>
        <Text style={styles.avatarText}>{avatar}</Text>
      </View>
      <View style={styles.horizontalInfo}>
        <Text style={styles.horizontalName}>{name}</Text>
        <Text style={styles.horizontalGrade}>{grade}</Text>
      </View>
      <View style={styles.horizontalStats}>
        <Text style={[styles.horizontalAvg, { color: getGradeColor(overallAverage) }]}>{overallAverage}%</Text>
        <Text style={styles.horizontalAvgLabel}>Avg</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Horizontal (ParentHome)
  horizontalCard: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  horizontalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  horizontalInfo: {
    marginBottom: 12,
  },
  horizontalName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  horizontalGrade: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  horizontalStats: {
    alignItems: 'flex-start',
  },
  horizontalAvg: {
    fontSize: 22,
    fontWeight: '700',
  },
  horizontalAvgLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },

  // Vertical (ChildrenList)
  verticalCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  verticalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  verticalName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  verticalGrade: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  verticalStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalStat: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
});
