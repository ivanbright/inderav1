import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { parentProfile, mockChildren } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export default function ProfileScreen({ navigation }: any) {
  const { signOut } = useApp();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{parentProfile.name.split(' ').map(n => n[0]).join('')}</Text>
        </View>
        <Text style={styles.name}>{parentProfile.name}</Text>
        <Text style={styles.email}>{parentProfile.email}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#EBF5FF' }]}>
              <Ionicons name="person" size={18} color="#3B82F6" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="notifications" size={18} color="#10B981" />
            </View>
            <Text style={styles.menuText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#FFF8EB' }]}>
              <Ionicons name="lock-closed" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.menuText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Children Section */}
        <Text style={styles.sectionTitle}>Linked Children</Text>
        <View style={styles.menuCard}>
          {mockChildren.map((child, index) => (
            <React.Fragment key={child.id}>
              <View style={styles.childItem}>
                <View style={styles.childAvatar}>
                  <Text style={styles.childAvatarText}>{child.avatar}</Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childGrade}>{child.grade}</Text>
                </View>
              </View>
              {index < mockChildren.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#F3F0FF' }]}>
              <Ionicons name="help-circle" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.menuText}>Help & FAQ</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#EBF5FF' }]}>
              <Ionicons name="chatbubble" size={18} color="#3B82F6" />
            </View>
            <Text style={styles.menuText}>Contact School</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton} onPress={async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        }}>
          <Ionicons name="log-out" size={20} color={Colors.gradePoor} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Indera V1.0.0</Text>
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
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textWhite,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 66,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  childAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  childGrade: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gradePoor + '30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gradePoor,
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 20,
  },
});
