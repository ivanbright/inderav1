import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';
import { useBehaviorReports } from '../../hooks/useBehaviorReports';
import { useApp } from '../../contexts/AppContext';

export default function BehaviorReportsScreen({ route }: any) {
    const { childId } = route.params || {};
    const { students } = useApp();

    // Get target student
    const targetStudent = students.find(s => s.id === childId) || students[0];
    const targetStudentId = targetStudent?.id || '';

    const { reports, isLoading, error, getWeeklyAverageRating } = useBehaviorReports(targetStudentId);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'positive' | 'neutral' | 'concern'>('all');

    const behaviorConfig = {
        positive: { icon: 'happy-outline' as const, color: '#10B981', bg: '#ECFDF5', label: 'Positive' },
        neutral: { icon: 'remove-circle-outline' as const, color: '#6B7280', bg: '#F9FAFB', label: 'Neutral' },
        concern: { icon: 'alert-circle-outline' as const, color: '#EF4444', bg: '#FEF2F2', label: 'Concern' },
    };

    const categoryConfig = {
        academic: { icon: 'school-outline', color: '#3B82F6' },
        social: { icon: 'people-outline', color: '#8B5CF6' },
        behavior: { icon: 'person-outline', color: '#F59E0B' },
        participation: { icon: 'hand-right-outline', color: '#10B981' },
    };

    const filteredReports = reports.filter(report => {
        if (selectedFilter === 'all') return true;
        return report.type === selectedFilter;
    });

    const filters = [
        { key: 'all' as const, label: 'All Reports', count: reports.length },
        { key: 'positive' as const, label: 'Positive', count: reports.filter(r => r.type === 'positive').length },
        { key: 'neutral' as const, label: 'Neutral', count: reports.filter(r => r.type === 'neutral').length },
        { key: 'concern' as const, label: 'Concerns', count: reports.filter(r => r.type === 'concern').length },
    ];

    const getOverallBehaviorScore = () => {
        if (!reports.length) return 0;
        const totalScore = reports.reduce((sum, report) => sum + report.rating, 0);
        return Math.round((totalScore / reports.length) * 100 / 5); // Convert to percentage
    };

    if (!targetStudent) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Behavior Reports" showBack={true} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No student selected</Text>
                </View>
            </View>
        );
    }

    const renderStarRating = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Ionicons
                key={i}
                name={i < rating ? "star" : "star-outline"}
                size={14}
                color={i < rating ? "#F59E0B" : Colors.textTertiary}
            />
        ));
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Behavior Reports"
                subtitle={targetStudent.displayName}
                showBack={true}
            />

            {/* Overview Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{getOverallBehaviorScore()}%</Text>
                    <Text style={styles.statLabel}>Overall Score</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{reports.filter(r => r.type === 'positive').length}</Text>
                    <Text style={styles.statLabel}>Positive Reports</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{reports.length}</Text>
                    <Text style={styles.statLabel}>Total Reports</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {filters.map(filter => (
                        <TouchableOpacity
                            key={filter.key}
                            style={[styles.filterTab, selectedFilter === filter.key && styles.filterTabActive]}
                            onPress={() => setSelectedFilter(filter.key)}
                        >
                            <Text style={[styles.filterLabel, selectedFilter === filter.key && styles.filterLabelActive]}>
                                {filter.label}
                            </Text>
                            <View style={[styles.filterBadge, selectedFilter === filter.key && styles.filterBadgeActive]}>
                                <Text style={[styles.filterCount, selectedFilter === filter.key && styles.filterCountActive]}>
                                    {filter.count}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text style={styles.loadingText}>Loading behavior reports...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={48} color={Colors.gradePoor} />
                            <Text style={styles.errorTitle}>Unable to load reports</Text>
                            <Text style={styles.errorSubtitle}>Check your connection and try again.</Text>
                        </View>
                    ) : filteredReports.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="school-outline" size={48} color={Colors.textTertiary} />
                            <Text style={styles.emptyTitle}>No behavior reports</Text>
                            <Text style={styles.emptySubtitle}>
                                {selectedFilter === 'all'
                                    ? 'No behavior reports have been recorded yet.'
                                    : `No ${selectedFilter} reports found.`
                                }
                            </Text>
                        </View>
                    ) : (
                        filteredReports.map(report => {
                            const config = behaviorConfig[report.type];
                            const categoryIcon = categoryConfig[report.category];
                            return (
                                <View key={report.id} style={styles.reportCard}>
                                    <View style={styles.reportHeader}>
                                        <View style={styles.reportIconRow}>
                                            <View style={[styles.reportIcon, { backgroundColor: config.bg }]}>
                                                <Ionicons name={config.icon} size={20} color={config.color} />
                                            </View>
                                            <View style={styles.reportMeta}>
                                                <View style={styles.reportTitleRow}>
                                                    <View style={styles.categoryBadge}>
                                                        <Ionicons name={categoryIcon.icon as keyof typeof Ionicons.glyphMap} size={12} color={categoryIcon.color} />
                                                        <Text style={[styles.categoryText, { color: categoryIcon.color }]}>
                                                            {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.starRating}>
                                                        {renderStarRating(report.rating)}
                                                    </View>
                                                </View>
                                                <Text style={styles.reportDate}>{new Date(report.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                                            <Text style={[styles.typeText, { color: config.color }]}>{config.label}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.reportDescription}>{report.description}</Text>

                                    <View style={styles.reportFooter}>
                                        <View style={styles.teacherInfo}>
                                            <Ionicons name="person-circle-outline" size={16} color={Colors.textSecondary} />
                                            <Text style={styles.teacherName}>{report.teacherId}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: Colors.textTertiary,
        textAlign: 'center',
    },
    filterContainer: {
        backgroundColor: Colors.white,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    filterScroll: {
        paddingHorizontal: 20,
        gap: 12,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.background,
    },
    filterTabActive: {
        backgroundColor: Colors.primaryLight,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginRight: 6,
    },
    filterLabelActive: {
        color: Colors.primary,
    },
    filterBadge: {
        backgroundColor: Colors.white,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
    },
    filterBadgeActive: {
        backgroundColor: Colors.primary,
    },
    filterCount: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textTertiary,
    },
    filterCountActive: {
        color: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    reportCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reportIconRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    reportIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    reportMeta: {
        flex: 1,
    },
    reportTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '600',
    },
    starRating: {
        flexDirection: 'row',
        gap: 2,
    },
    reportDate: {
        fontSize: 12,
        color: Colors.textTertiary,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    reportDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    reportFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    teacherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    teacherName: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 12,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    errorSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 12,
    },
});