import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherClasses } from '../../data/mockData';

export default function TeacherStudentViewScreen({ route, navigation }: any) {
  const { classId, studentId } = route.params;
  const cls = teacherClasses.find(c => c.id === classId);
  const student = cls?.students.find(s => s.id === studentId);
  if (!cls || !student) return null;

  const getColor = (g: number) => { if (g >= 80) return Colors.gradeExcellent; if (g >= 60) return Colors.gradeGood; if (g >= 50) return Colors.gradeAverage; return Colors.gradePoor; };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={24} color={Colors.textWhite} /></TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{student.avatar}</Text></View>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.classTxt}>{cls.name} · {cls.subject}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Performance</Text>
          <View style={styles.perfRow}>
            <View style={[styles.perfCircle, { borderColor: getColor(student.currentGrade) }]}>
              <Text style={[styles.perfValue, { color: getColor(student.currentGrade) }]}>{student.currentGrade}%</Text>
            </View>
            <View style={styles.perfInfo}>
              <Text style={styles.perfLabel}>{cls.subject}</Text>
              <Text style={styles.perfSub}>{student.recentScores.length} assessments recorded</Text>
            </View>
          </View>
        </View>

        {student.recentScores.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Assessments</Text>
            {student.recentScores.map((s, i) => {
              const pct = Math.round((s.score / s.maxScore) * 100);
              return (
                <View key={i} style={styles.scoreRow}>
                  <View style={styles.scoreInfo}><Text style={styles.scoreName}>{s.name}</Text><Text style={styles.scoreDetail}>{s.score}/{s.maxScore}</Text></View>
                  <Text style={[styles.scorePct, { color: getColor(pct) }]}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity activeOpacity={0.8} style={styles.feedbackBtn} onPress={() => navigation.navigate('GiveFeedback', { studentId: student.id, studentName: student.name })}>
          <Ionicons name="chatbubble-ellipses" size={20} color={Colors.textWhite} />
          <Text style={styles.feedbackBtnText}>Give Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.darkSecondary, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarText: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  name: { fontSize: 20, fontWeight: '700', color: Colors.textWhite },
  classTxt: { fontSize: 14, color: Colors.textLight, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight },
  cardTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 16 },
  perfRow: { flexDirection: 'row', alignItems: 'center' },
  perfCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  perfValue: { fontSize: 22, fontWeight: '800' },
  perfInfo: {},
  perfLabel: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  perfSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  scoreInfo: { flex: 1 },
  scoreName: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  scoreDetail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  scorePct: { fontSize: 18, fontWeight: '700' },
  feedbackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8B5CF6', borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  feedbackBtnText: { fontSize: 16, fontWeight: '600', color: Colors.textWhite, marginLeft: 8 },
});
