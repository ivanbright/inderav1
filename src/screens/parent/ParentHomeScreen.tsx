import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { mockChildren, parentProfile, mockNotifications } from '../../data/mockData';
import ChildCard from '../../components/ChildCard';
import ActivityCard from '../../components/ActivityCard';
import SectionHeader from '../../components/SectionHeader';

export default function ParentHomeScreen({ navigation }: any) {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  // Combine all children's recent activity and sort
  const allActivity = mockChildren.flatMap(child =>
    child.recentActivity.map(a => ({ ...a, childName: child.name }))
  ).slice(0, 5);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.parentName}>{parentProfile.name}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.notifButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={Colors.textWhite} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Children at a Glance */}
        <SectionHeader
          title="Your Children"
          onSeeAll={() => navigation.navigate('ChildrenTab')}
        />
        <FlatList
          horizontal
          data={mockChildren}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.childrenList}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <ChildCard
              name={item.name}
              grade={item.grade}
              avatar={item.avatar}
              overallAverage={item.overallAverage}
              attendanceRate={item.attendanceRate}
              onPress={() => navigation.navigate('ChildrenTab', {
                screen: 'ChildOverview',
                params: { childId: item.id }
              })}
            />
          )}
        />

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EBF5FF' }]}>
              <Ionicons name="school" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statNumber}>{mockChildren.length}</Text>
            <Text style={styles.statLabel}>Children</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{Math.round(mockChildren.reduce((a, c) => a + c.attendanceRate, 0) / mockChildren.length)}%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="notifications" size={20} color="#EF4444" />
            </View>
            <Text style={styles.statNumber}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <SectionHeader title="Recent Activity" showSeeAll={false} />
        {allActivity.map(activity => (
          <ActivityCard
            key={activity.id}
            type={activity.type}
            title={activity.title}
            description={activity.description}
            timestamp={activity.timestamp}
          />
        ))}
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
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 15,
    color: Colors.textLight,
    marginBottom: 4,
  },
  parentName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.darkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.notificationDot,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  childrenList: {
    paddingBottom: 4,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
