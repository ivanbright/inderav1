import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useApp } from '../../contexts/AppContext';
import { useAdminData } from '../../hooks/useAdminData';
import { Student } from '../../services/models';

export default function AdminParentsScreen() {
  const { userProfile } = useApp();
  const { parents, students, isLoading } = useAdminData(userProfile?.schoolId);

  const studentMap = new Map(students.map((s: Student) => [s.id, s.displayName || `${s.firstName} ${s.lastName}`.trim()]));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}><Text style={styles.title}>Parents</Text><Text style={styles.subtitle}>{parents.length} parents registered</Text></View>
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {parents.length === 0 && <Text style={styles.empty}>No parents found for this school.</Text>}
        {parents.map(p => {
          const childNames = (p.childrenIds || []).map(id => studentMap.get(id)).filter(Boolean).join(', ') || 'No children linked';
          const initials = `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase();
          return (
            <View key={p.id} style={styles.card}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
              <View style={styles.info}>
                <Text style={styles.name}>{`${p.firstName} ${p.lastName}`.trim()}</Text>
                <Text style={styles.email}>{p.email}</Text>
                <Text style={styles.children}>{childNames}</Text>
              </View>
              <View style={styles.countBadge}><Text style={styles.countText}>{(p.childrenIds || []).length}</Text></View>
            </View>
          );
        })}
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textWhite, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14, color: Colors.textSecondary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderLight },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF8EB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#F59E0B' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  email: { fontSize: 12, color: Colors.textTertiary, marginTop: 1 },
  children: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  countBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF8EB', alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 14, fontWeight: '700', color: '#F59E0B' },
});