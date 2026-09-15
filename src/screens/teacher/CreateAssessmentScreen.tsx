import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherClasses } from '../../data/mockData';

export default function CreateAssessmentScreen({ route, navigation }: any) {
  const classId = route.params?.classId;
  const [selectedClass, setSelectedClass] = useState(classId || teacherClasses[0]?.id);
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('Quiz');
  const [maxScore, setMaxScore] = useState('20');

  const types = ['Quiz', 'Test', 'Exam', 'Practical'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={24} color={Colors.textWhite} /></TouchableOpacity>
        <Text style={styles.title}>Create Assessment</Text>
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

        <Text style={styles.label}>Assessment Type</Text>
        <View style={styles.typeRow}>
          {types.map(t => (
            <TouchableOpacity key={t} activeOpacity={0.8} style={[styles.typeChip, type === t && styles.typeChipActive]} onPress={() => setType(t)}>
              <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Assessment Name</Text>
        <TextInput style={styles.input} placeholder="e.g. Chapter 5 Quiz" value={name} onChangeText={setName} placeholderTextColor={Colors.textTertiary} />

        <Text style={styles.label}>Maximum Score</Text>
        <TextInput style={styles.input} placeholder="20" value={maxScore} onChangeText={setMaxScore} keyboardType="numeric" placeholderTextColor={Colors.textTertiary} />

        <TouchableOpacity activeOpacity={0.8} style={styles.nextBtn} onPress={() => {
          if (!name) { Alert.alert('Missing', 'Please enter an assessment name'); return; }
          navigation.navigate('ResultEntry', { classId: selectedClass, assessmentName: name, type, maxScore: parseInt(maxScore) || 20 });
        }}>
          <Text style={styles.nextBtnText}>Next — Enter Results</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.textWhite} />
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
  chips: { maxHeight: 48 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.white, marginRight: 8, borderWidth: 1, borderColor: Colors.borderLight },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textWhite },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  typeChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.white, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderLight },
  typeChipActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  typeChipText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  typeChipTextActive: { color: Colors.textWhite },
  input: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: Colors.borderLight, color: Colors.textPrimary },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, marginTop: 32 },
  nextBtnText: { fontSize: 16, fontWeight: '600', color: Colors.textWhite, marginRight: 8 },
});
