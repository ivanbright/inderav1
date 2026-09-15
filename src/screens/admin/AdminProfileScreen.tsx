import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { adminProfile } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export default function AdminProfileScreen() {
  const { userProfile, signOut } = useApp();

  const displayName = userProfile?.displayName || adminProfile.name;
  const role = userProfile?.role || adminProfile.role;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{(displayName || '?').split(' ').map(n => n[0]).join('') || '?'}</Text></View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.school}>{userProfile?.schoolId ? userProfile.schoolId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : adminProfile.schoolName}</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity activeOpacity={0.7} style={styles.row}><View style={[styles.icon, { backgroundColor: '#EBF5FF' }]}><Ionicons name="person" size={18} color="#3B82F6" /></View><Text style={styles.rowText}>Edit Profile</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.row}><View style={[styles.icon, { backgroundColor: '#FFF8EB' }]}><Ionicons name="lock-closed" size={18} color="#F59E0B" /></View><Text style={styles.rowText}>Change Password</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.row}><View style={[styles.icon, { backgroundColor: '#ECFDF5' }]}><Ionicons name="notifications" size={18} color="#10B981" /></View><Text style={styles.rowText}>Notifications</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.logoutBtn} onPress={handleLogout}><Ionicons name="log-out" size={20} color={Colors.gradePoor} /><Text style={styles.logoutText}>Log Out</Text></TouchableOpacity>
        <Text style={styles.version}>Indera V1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 56, paddingBottom: 28, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 24, fontWeight: '700', color: Colors.primary },
  name: { fontSize: 22, fontWeight: '700', color: Colors.textWhite, marginBottom: 4 },
  role: { fontSize: 14, color: Colors.primary },
  school: { fontSize: 14, color: Colors.textLight, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: Colors.white, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowText: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 66 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.gradePoor + '30' },
  logoutText: { fontSize: 16, fontWeight: '600', color: Colors.gradePoor, marginLeft: 8 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textTertiary },
});
