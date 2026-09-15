import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { mockAnnouncements, Announcement } from '../../data/mockData';
import AnnouncementCard from '../../components/AnnouncementCard';
import ScreenHeader from '../../components/ScreenHeader';
import AnimatedModal from '../../components/AnimatedModal';
import AnimatedList from '../../components/AnimatedList';
import {
  createScreenEntranceAnimation,
  createFadeAnimation,
  createScaleAnimation,
  ANIMATION_DURATIONS,
} from '../../utils/animations';

export default function AnnouncementsScreen({ navigation }: any) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.9)).current;

  const newCount = mockAnnouncements.filter(a => a.isNew).length;

  useEffect(() => {
    // Start screen entrance animation
    const entranceAnimation = Animated.parallel([
      createScreenEntranceAnimation(fadeAnim, slideAnim),
      createScaleAnimation(headerScaleAnim, 1, ANIMATION_DURATIONS.entrance),
    ]);

    entranceAnimation.start();
  }, []);

  const handleAnnouncementPress = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedAnnouncement(null);
    }, 300);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: headerScaleAnim },
          ],
        }}
      >
        <ScreenHeader
          title="Announcements"
          subtitle={`${newCount} new updates`}
          showBack={navigation?.canGoBack ? navigation.canGoBack() : false}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedList staggerDelay={80}>
            {mockAnnouncements.map((announcement, index) => (
              <AnnouncementCard
                key={announcement.id}
                title={announcement.title}
                content={announcement.content}
                date={announcement.date}
                category={announcement.category}
                isNew={announcement.isNew}
                onPress={() => handleAnnouncementPress(announcement)}
              />
            ))}
          </AnimatedList>
        </ScrollView>
      </Animated.View>

      {/* Enhanced Animated Modal */}
      <AnimatedModal
        visible={showModal}
        onClose={handleCloseModal}
        animationType="scale"
      >
        <View style={styles.modalHeader}>
          <View style={styles.categoryBadge}>
            <Ionicons name="megaphone" size={14} color={Colors.primary} />
            <Text style={styles.categoryText}>
              {selectedAnnouncement?.category.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCloseModal}
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
          onPress={handleCloseModal}
        >
          <Text style={styles.closeModalBtnText}>Done</Text>
        </TouchableOpacity>
      </AnimatedModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
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
