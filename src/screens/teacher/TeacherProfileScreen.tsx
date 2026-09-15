import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherProfile, teacherClasses } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export default function TeacherProfileScreen() {
  const { signOut } = useApp();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{teacherProfile.name.split(' ').map(n => n[0]).join('')}</Text></View>
        <Text style={styles.name}>{teacherProfile.name}</Text>
        <Text style={styles.email}>{teacherProfile.email}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{teacherProfile.subject}</Text></View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>My Classes</Text>
        <View style={styles.menuCard}>
          {teacherClasses.map((cls, i) => (
            <React.Fragment key={cls.id}>
              <View style={styles.menuItem}><View style={styles.menuIcon}><Ionicons name="school" size={18} color={Colors.primary} /></View><View style={styles.menuInfo}><Text style={styles.menuText}>{cls.name}</Text><Text style={styles.menuSub}>{cls.subject} · {cls.studentCount} students</Text></View></View>
              {i < teacherClasses.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}><View style={[styles.menuIconSmall, { backgroundColor: '#EBF5FF' }]}><Ionicons name="person" size={18} color="#3B82F6" /></View><Text style={styles.menuItemText}>Edit Profile</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}><View style={[styles.menuIconSmall, { backgroundColor: '#FFF8EB' }]}><Ionicons name="lock-closed" size={18} color="#F59E0B" /></View><Text style={styles.menuItemText}>Change Password</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.logoutBtn} onPress={async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        }}><Ionicons name="log-out" size={20} color={Colors.gradePoor} /><Text style={styles.logoutText}>Log Out</Text></TouchableOpacity>
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
  email: { fontSize: 14, color: Colors.textLight },
  badgeRow: { flexDirection: 'row', marginTop: 8 },
  badge: { backgroundColor: Colors.primary + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuCard: { backgroundColor: Colors.white, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuInfo: { flex: 1 },
  menuText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  menuSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  menuIconSmall: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuItemText: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 66 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.gradePoor + '30' },
  logoutText: { fontSize: 16, fontWeight: '600', color: Colors.gradePoor, marginLeft: 8 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textTertiary },
});
