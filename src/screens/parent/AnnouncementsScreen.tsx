import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { mockAnnouncements, Announcement } from '../../data/mockData';
import AnnouncementCard from '../../components/AnnouncementCard';
import ScreenHeader from '../../components/ScreenHeader';

export default function AnnouncementsScreen({ navigation }: any) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const newCount = mockAnnouncements.filter(a => a.isNew).length;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Announcements"
        subtitle={`${newCount} new updates`}
        showBack={navigation?.canGoBack ? navigation.canGoBack() : false}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockAnnouncements.map(announcement => (
          <AnnouncementCard
            key={announcement.id}
            title={announcement.title}
            content={announcement.content}
            date={announcement.date}
            category={announcement.category}
            isNew={announcement.isNew}
            onPress={() => setSelectedAnnouncement(announcement)}
          />
        ))}
      </ScrollView>

      {/* Announcement Detail Modal */}
      <Modal
        visible={!!selectedAnnouncement}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAnnouncement(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.categoryBadge}>
                <Ionicons name="megaphone" size={14} color={Colors.primary} />
                <Text style={styles.categoryText}>
                  {selectedAnnouncement?.category.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedAnnouncement(null)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{selectedAnnouncement?.title}</Text>
            <Text style={styles.modalDate}>{selectedAnnouncement?.date}</Text>

            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalContent}>{selectedAnnouncement?.content}</Text>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.closeModalBtn}
              onPress={() => setSelectedAnnouncement(null)}
            >
              <Text style={styles.closeModalBtnText}>Done</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
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
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
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
    lineHeight: 26,
    marginBottom: 6,
  },
  modalDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 16,
    fontWeight: '500',
  },
  contentScroll: {
    maxHeight: 280,
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  closeModalBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeModalBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
