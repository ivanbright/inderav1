import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface NotificationItemProps {
  title: string;
  message: string;
  timestamp: string;
  type: 'assessment' | 'attendance' | 'feedback' | 'announcement' | 'assignment';
  isRead: boolean;
  childName?: string;
  onPress: () => void;
}

const iconMap: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  assessment: { name: 'school', color: '#3B82F6' },
  attendance: { name: 'calendar', color: '#10B981' },
  feedback: { name: 'chatbubble-ellipses', color: '#8B5CF6' },
  assignment: { name: 'document-text', color: '#F59E0B' },  
  announcement: { name: 'megaphone', color: '#EF4444' },
};

export default function NotificationItem({ title, message, timestamp, type, isRead, childName, onPress }: NotificationItemProps) {
  const icon = iconMap[type] || iconMap.announcement;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.container, !isRead && styles.unread]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: icon.color + '15' }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, !isRead && styles.titleUnread]} numberOfLines={1}>{title}</Text>
          {!isRead && <View style={styles.dot} />}
        </View>
        <Text style={styles.message} numberOfLines={1}>{message}</Text>
        <View style={styles.metaRow}>
          {childName && <Text style={styles.childName}>{childName}</Text>}
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  unread: {
    backgroundColor: Colors.primaryLight,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1,
  },
  titleUnread: {
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  message: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  childName: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
