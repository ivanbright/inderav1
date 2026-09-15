import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherClasses } from '../../data/mockData';

export default function GiveFeedbackScreen({ route, navigation }: any) {
  const studentId = route.params?.studentId;
  const studentName = route.params?.studentName;
  const allStudents = teacherClasses.flatMap(c => c.students);
  const [selected, setSelected] = useState(studentId || '');
  const [feedbackType, setFeedbackType] = useState<string>('positive');
  const [content, setContent] = useState('');

  const types = [
    { key: 'positive', label: 'Positive', icon: 'thumbs-up' as const, color: '#10B981' },
    { key: 'observation', label: 'Observation', icon: 'eye' as const, color: '#3B82F6' },
    { key: 'concern', label: 'Concern', icon: 'alert-circle' as const, color: '#F59E0B' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={24} color={Colors.textWhite} /></TouchableOpacity>
        <Text style={styles.title}>Give Feedback</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!studentName && (
          <>
            <Text style={styles.label}>Select Student</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
              {allStudents.slice(0, 8).map(s => (
                <TouchableOpacity key={s.id} activeOpacity={0.8} style={[styles.chip, selected === s.id && styles.chipActive]} onPress={() => setSelected(s.id)}>
                  <Text style={[styles.chipText, selected === s.id && styles.chipTextActive]}>{s.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
        {studentName && <Text style={styles.studentLabel}>Feedback for {studentName}</Text>}

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeRow}>
          {types.map(t => (
            <TouchableOpacity key={t.key} activeOpacity={0.8} style={[styles.typeChip, feedbackType === t.key && { backgroundColor: t.color + '15', borderColor: t.color }]} onPress={() => setFeedbackType(t.key)}>
              <Ionicons name={t.icon} size={16} color={feedbackType === t.key ? t.color : Colors.textTertiary} />
              <Text style={[styles.typeText, feedbackType === t.key && { color: t.color }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Observation</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Share your observation about this student..." value={content} onChangeText={setContent} multiline numberOfLines={5} textAlignVertical="top" placeholderTextColor={Colors.textTertiary} />

        <TouchableOpacity activeOpacity={0.8} style={styles.submitBtn} onPress={() => {
          if (!content) { Alert.alert('Missing', 'Please enter your feedback'); return; }
          Alert.alert('Sent!', 'Feedback has been published.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        }}>
          <Ionicons name="paper-plane" size={20} color={Colors.textWhite} />
          <Text style={styles.submitText}>Publish Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.darkSecondary, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: Colors.textWhite },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 10, marginTop: 20 },
  studentLabel: { fontSize: 16, fontWeight: '600', color: Colors.primary, marginTop: 8 },
  chips: { maxHeight: 48 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.white, marginRight: 8, borderWidth: 1, borderColor: Colors.borderLight },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textWhite },
  typeRow: { flexDirection: 'row' },
  typeChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.white, marginRight: 8, borderWidth: 1, borderColor: Colors.borderLight },
  typeText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, marginLeft: 6 },
  input: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: Colors.borderLight, color: Colors.textPrimary },
  textArea: { minHeight: 120, paddingTop: 14 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8B5CF6', borderRadius: 14, paddingVertical: 16, marginTop: 32 },
  submitText: { fontSize: 16, fontWeight: '600', color: Colors.textWhite, marginLeft: 8 },
});
