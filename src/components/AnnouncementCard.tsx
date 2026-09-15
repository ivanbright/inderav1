import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface AnnouncementCardProps {
  title: string;
  content: string;
  date: string;
  category: 'event' | 'notice' | 'exam' | 'general';
  isNew: boolean;
  onPress?: () => void;
}

const categoryConfig = {
  event: { icon: 'calendar' as const, color: Colors.categoryEvent, label: 'Event' },
  notice: { icon: 'information-circle' as const, color: Colors.categoryNotice, label: 'Notice' },
  exam: { icon: 'school' as const, color: Colors.categoryExam, label: 'Exam' },
  general: { icon: 'megaphone' as const, color: Colors.categoryGeneral, label: 'General' },
};

export default function AnnouncementCard({ title, content, date, category, isNew, onPress }: AnnouncementCardProps) {
  const config = categoryConfig[category];

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: config.color + '15' }]}>
          <Ionicons name={config.icon} size={14} color={config.color} />
          <Text style={[styles.categoryText, { color: config.color }]}>{config.label}</Text>
        </View>
        <View style={styles.dateRow}>
          {isNew && <View style={styles.newDot} />}
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content} numberOfLines={2}>{content}</Text>
      <View style={styles.footer}>
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.notificationDot,
    marginRight: 6,
  },
  date: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'flex-end',
  },
});
