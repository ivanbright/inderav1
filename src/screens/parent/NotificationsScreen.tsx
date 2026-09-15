import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { mockNotifications, Notification } from '../../data/mockData';
import NotificationItem from '../../components/NotificationItem';
import ScreenHeader from '../../components/ScreenHeader';

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  const handleOpenDetail = (notif: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setSelectedNotif({ ...notif, isRead: true });
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNavigateFromNotif = () => {
    if (!selectedNotif) return;
    const notif = selectedNotif;
    setSelectedNotif(null);

    if (notif.type === 'assessment') {
      navigation.navigate('MainTabs', {
        screen: 'ChildrenTab',
        params: {
          screen: 'AssessmentDetail',
          params: { childId: 'c1', subjectId: 's1', assessmentId: 'a1' },
        },
      });
    } else if (notif.type === 'attendance') {
      navigation.navigate('MainTabs', {
        screen: 'ChildrenTab',
        params: {
          screen: 'Attendance',
          params: { childId: 'c1' },
        },
      });
    } else if (notif.type === 'feedback') {
      navigation.navigate('MainTabs', {
        screen: 'ChildrenTab',
        params: {
          screen: 'TeacherFeedback',
          params: { childId: 'c1' },
        },
      });
    } else if (notif.type === 'announcement') {
      navigation.navigate('MainTabs', { screen: 'Announcements' });
    }
  };

  const todayNotifs = notifications.filter(
    n => n.timestamp.includes('hour') || n.timestamp === 'Today'
  );
  const earlierNotifs = notifications.filter(
    n => !n.timestamp.includes('hour') && n.timestamp !== 'Today'
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        subtitle={`${notifications.filter(n => !n.isRead).length} unread`}
        rightAction={
          <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {todayNotifs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TODAY</Text>
            {todayNotifs.map(notif => (
              <NotificationItem
                key={notif.id}
                title={notif.title}
                message={notif.message}
                timestamp={notif.timestamp}
                type={notif.type}
                isRead={notif.isRead}
                childName={notif.childName}
                onPress={() => handleOpenDetail(notif)}
              />
            ))}
          </View>
        )}

        {earlierNotifs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EARLIER</Text>
            {earlierNotifs.map(notif => (
              <NotificationItem
                key={notif.id}
                title={notif.title}
                message={notif.message}
                timestamp={notif.timestamp}
                type={notif.type}
                isRead={notif.isRead}
                childName={notif.childName}
                onPress={() => handleOpenDetail(notif)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Notification Detail Modal */}
      <Modal
        visible={!!selectedNotif}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNotif(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTypeBadge}>
                <Ionicons
                  name={
                    selectedNotif?.type === 'assessment'
                      ? 'school'
                      : selectedNotif?.type === 'attendance'
                      ? 'calendar'
                      : selectedNotif?.type === 'feedback'
                      ? 'chatbubble-ellipses'
                      : 'megaphone'
                  }
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.modalTypeText}>
                  {selectedNotif?.type.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedNotif(null)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{selectedNotif?.title}</Text>
            
            <View style={styles.modalMetaRow}>
              {selectedNotif?.childName && (
                <View style={styles.modalChildBadge}>
                  <Text style={styles.modalChildText}>{selectedNotif.childName}</Text>
                </View>
              )}
              <Text style={styles.modalTimestamp}>{selectedNotif?.timestamp}</Text>
            </View>

            <View style={styles.messageBox}>
              <Text style={styles.modalMessage}>{selectedNotif?.message}</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionButtonPrimary}
                onPress={handleNavigateFromNotif}
              >
                <Text style={styles.actionButtonText}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginHorizontal: 24,
    marginBottom: 8,
    marginTop: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 6,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    lineHeight: 26,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalChildBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },
  modalChildText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalTimestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  messageBox: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 6,
  },
});
