import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface SubjectProgressBarProps {
  subject: string;
  percentage: number;
  color: string;
  teacher?: string;
}

export default function SubjectProgressBar({ subject, percentage, color, teacher }: SubjectProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={styles.subject}>{subject}</Text>
        </View>
        <Text style={[styles.percentage, { color }]}>{percentage}%</Text>
      </View>
      {teacher && <Text style={styles.teacher}>{teacher}</Text>}
      <View style={styles.trackOuter}>
        <View style={[styles.trackInner, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  subject: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  teacher: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 16,
    marginBottom: 6,
  },
  percentage: {
    fontSize: 15,
    fontWeight: '700',
  },
  trackOuter: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  trackInner: {
    height: 6,
    borderRadius: 3,
  },
});
