import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { teacherClasses } from '../../data/mockData';

export default function TeacherClassesScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
      <View style={styles.header}>
        <Text style={styles.title}>My Classes</Text>
        <Text style={styles.subtitle}>{teacherClasses.length} classes assigned</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {teacherClasses.map(cls => (
          <TouchableOpacity key={cls.id} activeOpacity={0.85} style={styles.card} onPress={() => navigation.navigate('ClassStudents', { classId: cls.id })}>
            <View style={styles.cardHeader}>
              <View style={styles.classIcon}><Ionicons name="school" size={22} color={Colors.primary} /></View>
              <View style={styles.cardInfo}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classSubject}>{cls.subject}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
            </View>
            <View style={styles.cardStats}>
              <View style={styles.stat}><Ionicons name="people" size={16} color={Colors.textSecondary} /><Text style={styles.statText}>{cls.studentCount} students</Text></View>
              <View style={styles.stat}><Ionicons name="layers" size={16} color={Colors.textSecondary} /><Text style={styles.statText}>Grade {cls.grade}</Text></View>
            </View>
          </TouchableOpacity>
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
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: Colors.borderLight },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  classIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  className: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  classSubject: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  cardStats: { flexDirection: 'row' },
  stat: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  statText: { fontSize: 13, color: Colors.textSecondary, marginLeft: 6 },
});
