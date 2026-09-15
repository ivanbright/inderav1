import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

export default function AdminStudentDetailScreen({ route, navigation }: any) {
    const student = route?.params?.student ?? {};
    const [activeTab, setActiveTab] = useState<'info' | 'academic' | 'activity'>('info');

    // Generate mock data if not provided
    const studentData = {
        ...student,
        email: student.email || `${student.name.toLowerCase().replace(' ', '.')}@student.school.edu`,
        parentEmail: student.parentEmail || `parent.${student.name.toLowerCase().replace(' ', '.')}@email.com`,
        phone: student.phone || '+1 (555) 123-4567',
        address: student.address || '123 Main Street, City, State 12345',
        dateOfBirth: student.dateOfBirth || 'March 15, 2010',
        enrollmentDate: student.enrollmentDate || 'September 2023',
        studentId: student.studentId || `STU${student.id.padStart(6, '0')}`,
        subjects: student.subjects || [
            { name: 'Mathematics', teacher: 'Mr. Johnson', grade: 'A-', attendance: 95 },
            { name: 'English', teacher: 'Ms. Smith', grade: 'B+', attendance: 92 },
            { name: 'Science', teacher: 'Dr. Wilson', grade: 'A', attendance: 98 },
            { name: 'History', teacher: 'Mr. Brown', grade: 'B', attendance: 89 },
        ],
        recentActivity: student.recentActivity || [
            { type: 'Assessment', description: 'Math Quiz - Score: 85%', date: '2 days ago' },
            { type: 'Attendance', description: 'Present in all classes', date: '1 day ago' },
            { type: 'Assignment', description: 'English Essay submitted', date: '3 days ago' },
            { type: 'Feedback', description: 'Excellent participation in Science', date: '1 week ago' },
        ],
    };

    const tabs = [
        { key: 'info' as const, label: 'Personal Info', icon: 'person-outline' },
        { key: 'academic' as const, label: 'Academic', icon: 'school-outline' },
        { key: 'activity' as const, label: 'Activity', icon: 'list-outline' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Contact Information</Text>
                            <View style={styles.infoRow}>
                                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Student Email</Text>
                                    <Text style={styles.infoValue}>{studentData.email}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Parent Email</Text>
                                    <Text style={styles.infoValue}>{studentData.parentEmail}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="call-outline" size={20} color={Colors.textSecondary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Phone</Text>
                                    <Text style={styles.infoValue}>{studentData.phone}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={20} color={Colors.textSecondary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Address</Text>
                                    <Text style={styles.infoValue}>{studentData.address}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Student Details</Text>
                            <View style={styles.infoRow}>
                                <Ionicons name="id-card-outline" size={20} color={Colors.textSecondary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Student ID</Text>
                                    <Text style={styles.infoValue}>{studentData.studentId}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Date of Birth</Text>
                                    <Text style={styles.infoValue}>{studentData.dateOfBirth}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="school-outline" size={20} color={Colors.textSecondary} />
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Enrollment Date</Text>
                                    <Text style={styles.infoValue}>{studentData.enrollmentDate}</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="link-outline" size={20} color={studentData.parentLinked ? Colors.attendancePresent : Colors.attendanceAbsent} />
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Parent Account</Text>
                                    <Text style={[styles.infoValue, { color: studentData.parentLinked ? Colors.attendancePresent : Colors.attendanceAbsent }]}>
                                        {studentData.parentLinked ? 'Linked' : 'Not Linked'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );

            case 'academic':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Current Subjects</Text>
                            {studentData.subjects?.map((subject: any, index: number) => (
                                <View key={index} style={styles.subjectRow}>
                                    <View style={styles.subjectInfo}>
                                        <Text style={styles.subjectName}>{subject.name}</Text>
                                        <Text style={styles.teacherName}>Teacher: {subject.teacher}</Text>
                                    </View>
                                    <View style={styles.subjectStats}>
                                        <View style={styles.gradeContainer}>
                                            <Text style={styles.gradeLabel}>Grade</Text>
                                            <Text style={styles.gradeValue}>{subject.grade}</Text>
                                        </View>
                                        <View style={styles.attendanceContainer}>
                                            <Text style={styles.attendanceLabel}>Attendance</Text>
                                            <Text style={[styles.attendanceValue, { color: subject.attendance >= 95 ? Colors.attendancePresent : subject.attendance >= 85 ? Colors.attendanceLate : Colors.attendanceAbsent }]}>
                                                {subject.attendance}%
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                );

            case 'activity':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Recent Activity</Text>
                            {studentData.recentActivity?.map((activity: any, index: number) => (
                                <View key={index} style={styles.activityRow}>
                                    <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type).bg }]}>
                                        <Ionicons name={getActivityIcon(activity.type)} size={18} color={getActivityColor(activity.type).color} />
                                    </View>
                                    <View style={styles.activityInfo}>
                                        <Text style={styles.activityDescription}>{activity.description}</Text>
                                        <Text style={styles.activityDate}>{activity.date}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    const getActivityIcon = (type: string): keyof typeof Ionicons.glyphMap => {
        switch (type.toLowerCase()) {
            case 'assessment':
                return 'school-outline';
            case 'attendance':
                return 'calendar-outline';
            case 'assignment':
                return 'document-text-outline';
            case 'feedback':
                return 'chatbubble-ellipses-outline';
            default:
                return 'information-circle-outline';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'assessment':
                return { color: '#3B82F6', bg: '#EFF6FF' };
            case 'attendance':
                return { color: '#10B981', bg: '#ECFDF5' };
            case 'assignment':
                return { color: '#F59E0B', bg: '#FFFBEB' };
            case 'feedback':
                return { color: '#8B5CF6', bg: '#F5F3FF' };
            default:
                return { color: '#6B7280', bg: '#F9FAFB' };
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={studentData.name}
                subtitle={`Class ${studentData.className}`}
                showBack={true}
            />

            {/* Student Avatar & Basic Info */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{studentData.avatar}</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{studentData.name}</Text>
                    <Text style={styles.profileClass}>Class {studentData.className}</Text>
                    <View style={[styles.linkStatus, { backgroundColor: studentData.parentLinked ? Colors.primaryLight : '#FEE2E2' }]}>
                        <Ionicons
                            name={studentData.parentLinked ? 'link' : 'unlink'}
                            size={14}
                            color={studentData.parentLinked ? Colors.primary : Colors.attendanceAbsent}
                        />
                        <Text style={[styles.linkText, { color: studentData.parentLinked ? Colors.primary : Colors.attendanceAbsent }]}>
                            {studentData.parentLinked ? 'Parent Linked' : 'Parent Not Linked'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Ionicons
                            name={tab.icon as keyof typeof Ionicons.glyphMap}
                            size={18}
                            color={activeTab === tab.key ? Colors.primary : Colors.textTertiary}
                        />
                        <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {renderTabContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 20,
        padding: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.primary,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    profileClass: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    linkStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    linkText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 4,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: Colors.primaryLight,
    },
    tabLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textTertiary,
        marginLeft: 6,
    },
    activeTabLabel: {
        color: Colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    tabContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    infoCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: Colors.textTertiary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    subjectInfo: {
        flex: 1,
    },
    subjectName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    teacherName: {
        fontSize: 12,
        color: Colors.textTertiary,
    },
    subjectStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    gradeContainer: {
        alignItems: 'center',
    },
    gradeLabel: {
        fontSize: 10,
        color: Colors.textTertiary,
        marginBottom: 2,
    },
    gradeValue: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    attendanceContainer: {
        alignItems: 'center',
    },
    attendanceLabel: {
        fontSize: 10,
        color: Colors.textTertiary,
        marginBottom: 2,
    },
    attendanceValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    activityIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    activityInfo: {
        flex: 1,
    },
    activityDescription: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    activityDate: {
        fontSize: 12,
        color: Colors.textTertiary,
    },
});