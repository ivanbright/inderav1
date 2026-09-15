import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { adminProfile } from '../../data/mockData';

export default function SchoolSettingsScreen() {
  const settings = [
    { label: 'School Name', value: adminProfile.schoolName, icon: 'business' as const },
    { label: 'Address', value: adminProfile.schoolAddress, icon: 'location' as const },
    { label: 'Phone', value: adminProfile.schoolPhone, icon: 'call' as const },
    { label: 'Email', value: adminProfile.email, icon: 'mail' as const },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}><Text style={styles.title}>School Settings</Text></View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>School Information</Text>
        <View style={styles.card}>
          {settings.map((s, i) => (
            <React.Fragment key={s.label}>
              <TouchableOpacity activeOpacity={0.7} style={styles.row}>
                <View style={styles.icon}><Ionicons name={s.icon} size={18} color={Colors.primary} /></View>
                <View style={styles.rowInfo}><Text style={styles.rowLabel}>{s.label}</Text><Text style={styles.rowValue}>{s.value}</Text></View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
              {i < settings.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Academic</Text>
        <View style={styles.card}>
          <TouchableOpacity activeOpacity={0.7} style={styles.row}><View style={[styles.icon, { backgroundColor: '#F3F0FF' }]}><Ionicons name="calendar" size={18} color="#8B5CF6" /></View><Text style={styles.rowText}>Academic Terms</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.row}><View style={[styles.icon, { backgroundColor: '#FFF8EB' }]}><Ionicons name="time" size={18} color="#F59E0B" /></View><Text style={styles.rowText}>School Hours</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.row}><View style={[styles.icon, { backgroundColor: '#ECFDF5' }]}><Ionicons name="star" size={18} color="#10B981" /></View><Text style={styles.rowText}>Grading Scale</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>System</Text>
        <View style={styles.card}>
          <TouchableOpacity activeOpacity={0.7} style={styles.row}><View style={[styles.icon, { backgroundColor: '#FEF2F2' }]}><Ionicons name="shield" size={18} color="#EF4444" /></View><Text style={styles.rowText}>Admin Permissions</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.row}><View style={[styles.icon, { backgroundColor: '#EBF5FF' }]}><Ionicons name="cloud-download" size={18} color="#3B82F6" /></View><Text style={styles.rowText}>Data Export</Text><Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} /></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textWhite },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: Colors.white, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 12, color: Colors.textTertiary },
  rowValue: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary, marginTop: 1 },
  rowText: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 66 },
});
