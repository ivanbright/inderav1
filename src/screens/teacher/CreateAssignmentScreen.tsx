import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherClasses } from '../../data/mockData';

export default function CreateAssignmentScreen({ navigation }: any) {
  const [selectedClass, setSelectedClass] = useState(teacherClasses[0]?.id);
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={24} color={Colors.textWhite} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Create Assignment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Class</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {teacherClasses.map(c => (
            <TouchableOpacity key={c.id} activeOpacity={0.8} style={[styles.chip, selectedClass === c.id && styles.chipActive]} onPress={() => setSelectedClass(c.id)}>
              <Text style={[styles.chipText, selectedClass === c.id && styles.chipTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="e.g. Chapter 5 Worksheet" value={title} onChangeText={setTitle} placeholderTextColor={Colors.textTertiary} />

        <Text style={styles.label}>Instructions</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the assignment..." value={instructions} onChangeText={setInstructions} multiline numberOfLines={4} textAlignVertical="top" placeholderTextColor={Colors.textTertiary} />

        <Text style={styles.label}>Due Date</Text>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={dueDate} onChangeText={setDueDate} placeholderTextColor={Colors.textTertiary} />

        <TouchableOpacity activeOpacity={0.8} style={styles.publishBtn} onPress={() => {
          if (!title) { Alert.alert('Missing', 'Please enter a title'); return; }
          Alert.alert('Published!', 'Assignment has been posted.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        }}>
          <Ionicons name="paper-plane" size={20} color={Colors.textWhite} />
          <Text style={styles.publishText}>Publish Assignment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.darkSecondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.textWhite },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 10, marginTop: 20 },
  chips: { maxHeight: 48 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.white, marginRight: 8, borderWidth: 1, borderColor: Colors.borderLight },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textWhite },
  input: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: Colors.borderLight, color: Colors.textPrimary },
  textArea: { minHeight: 100, paddingTop: 14 },
  publishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F59E0B', borderRadius: 14, paddingVertical: 16, marginTop: 32 },
  publishText: { fontSize: 16, fontWeight: '600', color: Colors.textWhite, marginLeft: 8 },
});
