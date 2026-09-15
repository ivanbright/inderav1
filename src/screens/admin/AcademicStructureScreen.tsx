import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { academicTerms } from '../../data/mockData';

export default function AcademicStructureScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <Text style={styles.title}>Academic Structure</Text>
        <Text style={styles.subtitle}>2026 Academic Year</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Terms</Text>
        {academicTerms.map(term => (
          <View key={term.id} style={[styles.termCard, term.isCurrent && styles.termCardActive]}>
            <View style={styles.termHeader}>
              <View style={[styles.termIcon, { backgroundColor: term.isCurrent ? Colors.primary + '15' : Colors.borderLight }]}>
                <Ionicons name="calendar" size={18} color={term.isCurrent ? Colors.primary : Colors.textTertiary} />
              </View>
              <View style={styles.termInfo}>
                <Text style={styles.termName}>{term.name}</Text>
                <Text style={styles.termDates}>{term.startDate} → {term.endDate}</Text>
              </View>
              {term.isCurrent && <View style={styles.currentBadge}><Text style={styles.currentText}>Current</Text></View>}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Grade Levels</Text>
        {['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'].map(grade => (
          <View key={grade} style={styles.gradeRow}>
            <View style={styles.gradeIcon}><Ionicons name="school" size={18} color={Colors.textSecondary} /></View>
            <Text style={styles.gradeName}>{grade}</Text>
            <Text style={styles.gradeDetail}>2 classes</Text>
          </View>
        ))}
      </ScrollView>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12, marginTop: 8 },
  termCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.borderLight },
  termCardActive: { borderColor: Colors.primary, borderWidth: 2 },
  termHeader: { flexDirection: 'row', alignItems: 'center' },
  termIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  termInfo: { flex: 1 },
  termName: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  termDates: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  currentBadge: { backgroundColor: Colors.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  currentText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  gradeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderLight },
  gradeIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  gradeName: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  gradeDetail: { fontSize: 13, color: Colors.textSecondary },
});
