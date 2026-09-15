import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface ActivityCardProps {
  type: 'assessment' | 'attendance' | 'feedback' | 'assignment' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  onPress?: () => void;
}

const iconMap: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  assessment: { name: 'school', color: '#3B82F6', bg: '#EBF5FF' },
  attendance: { name: 'calendar', color: '#10B981', bg: '#ECFDF5' },
  feedback: { name: 'chatbubble-ellipses', color: '#8B5CF6', bg: '#F3F0FF' },
  assignment: { name: 'document-text', color: '#F59E0B', bg: '#FFF8EB' },
  announcement: { name: 'megaphone', color: '#EF4444', bg: '#FEF2F2' },
};

export default function ActivityCard({ type, title, description, timestamp, onPress }: ActivityCardProps) {
  const icon = iconMap[type] || iconMap.announcement;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
      </View>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
