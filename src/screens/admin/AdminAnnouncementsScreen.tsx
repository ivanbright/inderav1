import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import AnnouncementCard from '../../components/AnnouncementCard';
import { useApp } from '../../contexts/AppContext';
import { useAdminData } from '../../hooks/useAdminData';
import { databaseService } from '../../services/databaseService';

export default function AdminAnnouncementsScreen() {
  const { userProfile, user } = useApp();
  const { announcements, isLoading, refresh } = useAdminData(userProfile?.schoolId);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  const publish = async () => {
    if (!title.trim()) { Alert.alert('Missing', 'Please enter a title'); return; }
    if (!user) return;

    setPublishing(true);
    try {
      await databaseService.createAnnouncement({
        schoolId: userProfile?.schoolId || 'oakridge-academy',
        authorId: user.uid,
        title: title.trim(),
        content: content.trim() || title.trim(),
        category: 'general',
        priority: 'medium',
        targetAudience: ['all_parents'],
        publishDate: new Date().toISOString().split('T')[0],
        isPublished: true,
        viewedBy: [],
      });
      await refresh();
      setShowForm(false);
      setTitle('');
      setContent('');
      Alert.alert('Published!', 'Announcement has been sent to parents and staff.');
    } catch (error: any) {
      console.error('Error publishing announcement:', error);
      Alert.alert('Failed', error.message || 'Could not publish the announcement.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <View><Text style={styles.headerTitle}>Announcements</Text><Text style={styles.subtitle}>{announcements.length} published</Text></View>
        <TouchableOpacity activeOpacity={0.8} style={styles.addBtn} onPress={() => setShowForm(!showForm)}><Ionicons name={showForm ? 'close' : 'add'} size={24} color={Colors.textWhite} /></TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Announcement</Text>
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} placeholderTextColor={Colors.textTertiary} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Content..." value={content} onChangeText={setContent} multiline numberOfLines={4} textAlignVertical="top" placeholderTextColor={Colors.textTertiary} />
            <TouchableOpacity activeOpacity={0.8} style={[styles.publishBtn, publishing && { opacity: 0.6 }]} disabled={publishing} onPress={publish}>
              {publishing ? (
                <ActivityIndicator size="small" color={Colors.textWhite} />
              ) : (
                <><Ionicons name="paper-plane" size={18} color={Colors.textWhite} /><Text style={styles.publishText}>Publish</Text></>
              )}
            </TouchableOpacity>
          </View>
        )}
        {announcements.length === 0 && !showForm && <Text style={styles.empty}>No announcements yet. Tap + to publish one.</Text>}
        {[...announcements].sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || '')).map(a => (
          <AnnouncementCard key={a.id} title={a.title} content={a.content} date={a.publishDate} category={a.category} isNew={(a.viewedBy || []).length === 0} />
        ))}
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.textWhite, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14, color: Colors.textSecondary },
  formCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 2, borderColor: Colors.primary },
  formTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 16 },
  input: { backgroundColor: Colors.borderLight, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, marginBottom: 12, color: Colors.textPrimary },
  textArea: { minHeight: 80, paddingTop: 12 },
  publishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14 },
  publishText: { fontSize: 15, fontWeight: '600', color: Colors.textWhite, marginLeft: 8 },
});