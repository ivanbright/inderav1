import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherClasses } from '../../data/mockData';

export default function ResultEntryScreen({ route, navigation }: any) {
  const params = route?.params ?? {};
  const classId = params.classId ?? teacherClasses[0]?.id;
  const assessmentName = params.assessmentName ?? 'Assessment';
  const type = params.type ?? 'Exam';
  const maxScore = params.maxScore ?? 20;
  const cls = teacherClasses.find(c => c.id === classId) ?? teacherClasses[0];
  if (!cls) return null;

  const [scores, setScores] = useState<Record<string, string>>({});

  const updateScore = (studentId: string, value: string) => {
    setScores(prev => ({ ...prev, [studentId]: value }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={24} color={Colors.textWhite} /></TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Enter Results</Text>
          <Text style={styles.subtitle}>{assessmentName} · {type} · /{maxScore}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cls.students.map(student => (
          <View key={student.id} style={styles.row}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{student.avatar}</Text></View>
            <Text style={styles.name}>{student.name}</Text>
            <View style={styles.scoreInput}>
              <TextInput style={styles.input} placeholder="0" value={scores[student.id] || ''} onChangeText={v => updateScore(student.id, v)} keyboardType="numeric" placeholderTextColor={Colors.textTertiary} />
              <Text style={styles.maxLabel}>/{maxScore}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.publishBtn} onPress={() => { Alert.alert('Published!', 'Results have been published. Parents will be notified.', [{ text: 'OK', onPress: () => navigation.popToTop() }]); }}>
          <Ionicons name="paper-plane" size={20} color={Colors.textWhite} />
          <Text style={styles.publishText}>Publish Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.darkSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  headerInfo: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600', color: Colors.textWhite },
  subtitle: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderLight },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  name: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  scoreInput: { flexDirection: 'row', alignItems: 'center' },
  input: { width: 50, textAlign: 'center', fontSize: 18, fontWeight: '700', color: Colors.textPrimary, backgroundColor: Colors.borderLight, borderRadius: 8, paddingVertical: 6 },
  maxLabel: { fontSize: 14, color: Colors.textTertiary, marginLeft: 4 },
  footer: { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  publishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16 },
  publishText: { fontSize: 16, fontWeight: '600', color: Colors.textWhite, marginLeft: 8 },
});
