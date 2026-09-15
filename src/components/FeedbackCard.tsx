import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface FeedbackCardProps {
  teacher: string;
  subject: string;
  date: string;
  content: string;
  type: 'positive' | 'observation' | 'concern';
  onPress?: () => void;
}

const typeConfig = {
  positive: { icon: 'thumbs-up' as const, color: '#10B981', bg: '#ECFDF5', label: 'Positive' },
  observation: { icon: 'eye' as const, color: '#3B82F6', bg: '#EBF5FF', label: 'Observation' },
  concern: { icon: 'alert-circle' as const, color: '#F59E0B', bg: '#FFF8EB', label: 'Concern' },
};

export default function FeedbackCard({ teacher, subject, date, content, type, onPress }: FeedbackCardProps) {
  const config = typeConfig[type];

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.teacherRow}>
          <View style={[styles.typeIcon, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon} size={16} color={config.color} />
          </View>
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherName}>{teacher}</Text>
            <Text style={styles.subject}>{subject}</Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{date}</Text>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.content} numberOfLines={3}>{content}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subject: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
