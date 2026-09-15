import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherClasses } from '../../data/mockData';

type Status = 'present' | 'absent' | 'late';

export default function RecordAttendanceScreen({ route, navigation }: any) {
  const classId = route.params?.classId;
  const [selectedClass, setSelectedClass] = useState(classId || teacherClasses[0]?.id);
  const cls = teacherClasses.find(c => c.id === selectedClass);

  const [attendance, setAttendance] = useState<Record<string, Status>>(() => {
    const init: Record<string, Status> = {};
    cls?.students.forEach(s => { init[s.id] = 'present'; });
    return init;
  });

  const toggle = (studentId: string) => {
    setAttendance(prev => {
      const order: Status[] = ['present', 'absent', 'late'];
      const current = prev[studentId] || 'present';
      const next = order[(order.indexOf(current) + 1) % order.length];
      return { ...prev, [studentId]: next };
    });
  };

  const statusConfig = {
    present: { color: Colors.attendancePresent, icon: 'checkmark-circle' as const },
    absent: { color: Colors.attendanceAbsent, icon: 'close-circle' as const },
    late: { color: Colors.attendanceLate, icon: 'time' as const },
  };

  if (!cls) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={24} color={Colors.textWhite} /></TouchableOpacity>
        <Text style={styles.title}>Record Attendance</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Class selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classSelector} contentContainerStyle={styles.classSelectorContent}>
        {teacherClasses.map(c => (
          <TouchableOpacity key={c.id} activeOpacity={0.8} style={[styles.classChip, selectedClass === c.id && styles.classChipActive]} onPress={() => setSelectedClass(c.id)}>
            <Text style={[styles.classChipText, selectedClass === c.id && styles.classChipTextActive]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.dateLabel}>Today — {new Date().toISOString().split('T')[0]}</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cls.students.map(student => {
          const status = attendance[student.id] || 'present';
          const config = statusConfig[status];
          return (
            <TouchableOpacity key={student.id} activeOpacity={0.8} style={styles.studentRow} onPress={() => toggle(student.id)}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{student.avatar}</Text></View>
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: config.color + '15' }]}>
                <Ionicons name={config.icon} size={18} color={config.color} />
                <Text style={[styles.statusText, { color: config.color }]}>{status}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.submitBtn} onPress={() => { Alert.alert('Success', 'Attendance recorded!', [{ text: 'OK', onPress: () => navigation.goBack() }]); }}>
          <Ionicons name="checkmark" size={20} color={Colors.textWhite} />
          <Text style={styles.submitText}>Confirm Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.dark, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  back: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.darkSecondary, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: Colors.textWhite },
  classSelector: { maxHeight: 56 },
  classSelectorContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  classChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.white, marginRight: 8, borderWidth: 1, borderColor: Colors.borderLight },
  classChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  classChipText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  classChipTextActive: { color: Colors.textWhite },
  dateLabel: { paddingHorizontal: 24, paddingVertical: 8, fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  studentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderLight },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  studentName: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600', marginLeft: 4, textTransform: 'capitalize' },
  footer: { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.attendancePresent, borderRadius: 14, paddingVertical: 16 },
  submitText: { fontSize: 16, fontWeight: '600', color: Colors.textWhite, marginLeft: 8 },
});
