import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { teacherProfile } from '../../data/mockData';

export default function TeacherHomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.name}>{teacherProfile.name.split(' ')[0]}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{teacherProfile.name.charAt(0)}</Text>
            </View>
          </View>
        </View>

        {/* Hero Card (Glassmorphic feel with gradient) */}
        <View style={styles.heroShadow}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['rgba(255,192,203,0.3)', 'rgba(230,230,250,0.4)', 'transparent']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Ionicons name="sunny" size={14} color={Colors.textSecondary} />
                <Text style={styles.heroBadgeText}>DAILY SCHEDULE</Text>
              </View>
              <Text style={styles.heroTitle}>Today's{'\n'}Classes</Text>
              <Text style={styles.heroSubtitle}>You have 4 classes today.</Text>
            </View>
          </View>
        </View>

        {/* 2x2 Grid */}
        <View style={styles.grid}>
          {/* Card 1: Students */}
          <TouchableOpacity activeOpacity={0.8} style={styles.gridItemWrapper} onPress={() => navigation.navigate('ClassesTab')}>
            <View style={styles.gridCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="pulse" size={24} color="#EF4444" />
                <View style={[styles.miniBadge, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="arrow-down" size={10} color="#EF4444" />
                  <Text style={[styles.miniBadgeText, { color: '#EF4444' }]}>2%</Text>
                </View>
              </View>
              <Text style={styles.cardNumber}>{teacherProfile.studentCount}<Text style={styles.cardUnit}> sts</Text></Text>
              <Text style={styles.cardDesc}>Total Students</Text>
              
              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>Avg: 85</Text>
                <Text style={styles.footerText}>Peak: 100</Text>
              </View>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '85%', backgroundColor: '#EF4444' }]} /></View>
            </View>
          </TouchableOpacity>

          {/* Card 2: Attendance */}
          <TouchableOpacity activeOpacity={0.8} style={styles.gridItemWrapper} onPress={() => navigation.navigate('RecordAttendance')}>
            <View style={styles.gridCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="moon" size={24} color="#5D5FEF" />
                <View style={[styles.miniBadge, { backgroundColor: '#EFEEFC' }]}>
                  <Ionicons name="arrow-up" size={10} color="#5D5FEF" />
                  <Text style={[styles.miniBadgeText, { color: '#5D5FEF' }]}>12%</Text>
                </View>
              </View>
              <Text style={styles.cardNumber}>95<Text style={styles.cardUnit}>%</Text></Text>
              <Text style={styles.cardDesc}>Attendance Rate</Text>
              
              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>Target: 98%</Text>
              </View>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '95%', backgroundColor: '#5D5FEF' }]} /></View>
            </View>
          </TouchableOpacity>

          {/* Card 3: Grading */}
          <TouchableOpacity activeOpacity={0.8} style={styles.gridItemWrapper} onPress={() => navigation.navigate('ResultEntry')}>
            <View style={styles.gridCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="flash" size={24} color="#F59E0B" />
                <View style={[styles.miniBadge, { backgroundColor: '#FFFBEB' }]}>
                  <Text style={[styles.miniBadgeText, { color: '#F59E0B', marginLeft: 0 }]}>High</Text>
                </View>
              </View>
              <Text style={styles.cardNumber}>15<Text style={styles.cardUnit}> items</Text></Text>
              <Text style={styles.cardDesc}>Pending Grading</Text>
              
              <View style={[styles.pillBadge, { marginTop: 12 }]}>
                <Text style={styles.pillBadgeText}>Due today</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 4: Goals */}
          <TouchableOpacity activeOpacity={0.8} style={styles.gridItemWrapper}>
            <View style={styles.gridCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="scan" size={24} color="#10B981" />
                <View style={[styles.miniBadge, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.miniBadgeText, { color: '#10B981', marginLeft: 0 }]}>3/5</Text>
                </View>
              </View>
              <Text style={styles.cardNumber}>Goals</Text>
              <Text style={styles.cardDesc}>Weekly Targets</Text>
              
              <View style={styles.bulletList}>
                <View style={styles.bulletRow}><View style={styles.bullet}/><Text style={styles.bulletText}>Grade Math</Text></View>
                <View style={styles.bulletRow}><View style={styles.bullet}/><Text style={styles.bulletText}>Post notice</Text></View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 100 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  greeting: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  name: { ...Typography.h2, color: Colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  searchBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginRight: 12, shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  avatarText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  
  // Hero Card
  heroShadow: { shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 10, marginBottom: 24 },
  heroCard: { backgroundColor: Colors.white, borderRadius: 32, overflow: 'hidden', minHeight: 200 },
  heroContent: { padding: 28, zIndex: 1 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginLeft: 6, letterSpacing: 0.5 },
  heroTitle: { ...Typography.h1, color: Colors.textPrimary, lineHeight: 38, marginBottom: 16 },
  heroSubtitle: { fontSize: 14, color: Colors.textSecondary },
  
  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItemWrapper: { width: '48%', marginBottom: 16, shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 },
  gridCard: { backgroundColor: Colors.white, borderRadius: 28, padding: 20, minHeight: 180 },
  
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  miniBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  miniBadgeText: { fontSize: 10, fontWeight: '700', marginLeft: 2 },
  
  cardNumber: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  cardUnit: { fontSize: 14, fontWeight: '600', color: Colors.textTertiary },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 6 },
  footerText: { fontSize: 10, fontWeight: '600', color: Colors.textTertiary },
  progressBarBg: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2 },
  progressBarFill: { height: '100%', borderRadius: 2 },
  
  pillBadge: { backgroundColor: '#FFFBEB', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  pillBadgeText: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  
  bulletList: { marginTop: 12 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 8 },
  bulletText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
});
