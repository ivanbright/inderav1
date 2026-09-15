import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';
import { useCalendarData } from '../../hooks/useCalendarData';
import AnimatedCard from '../../components/AnimatedCard';
import AnimatedList from '../../components/AnimatedList';
import {
    createScreenEntranceAnimation,
    createFadeAnimation,
    createScaleAnimation,
    createListItemAnimation,
    ANIMATION_DURATIONS,
} from '../../utils/animations';

interface CalendarEventDisplay {
    id: string;
    title: string;
    date: string;
    type: 'holiday' | 'event' | 'meeting' | 'fieldTrip' | 'early' | 'reminder';
    description?: string;
    time?: string;
    isToday?: boolean;
    isPast?: boolean;
}

// Fallback mock events for when Firebase data is loading
const fallbackEvents: CalendarEventDisplay[] = [
    {
        id: '1',
        title: 'Parent-Teacher Conference',
        date: 'Sept 15, 2026',
        type: 'meeting',
        time: '2:00 PM - 2:30 PM',
        description: 'Individual meeting with Ms. Johnson about Emma\'s progress',
        isToday: true,
    },
    {
        id: '2',
        title: 'School Photos',
        date: 'Sept 18, 2026',
        type: 'event',
        time: 'All Day',
        description: 'Individual and class photos. Please dress in school uniform.',
    },
    {
        id: '3',
        title: 'Field Trip - Science Museum',
        date: 'Sept 22, 2026',
        type: 'fieldTrip',
        time: '9:00 AM - 3:00 PM',
        description: 'Permission slip and $15 fee due by Sept 20th',
    },
    {
        id: '4',
        title: 'Early Dismissal',
        date: 'Sept 25, 2026',
        type: 'early',
        time: '12:30 PM',
        description: 'Teacher professional development day',
    },
    {
        id: '5',
        title: 'Fall Break',
        date: 'Oct 2-6, 2026',
        type: 'holiday',
        description: 'No school - Autumn break',
    },
    {
        id: '6',
        title: 'Book Fair',
        date: 'Oct 9-13, 2026',
        type: 'event',
        description: 'Weekly book fair in the school library',
    },
    {
        id: '7',
        title: 'Math Quiz Reminder',
        date: 'Sept 19, 2026',
        type: 'reminder',
        description: 'Don\'t forget Emma has a math quiz on multiplication tables',
    },
];

export default function CalendarScreen() {
    const { events: firebaseEvents, isLoading, error } = useCalendarData();
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'events' | 'holidays' | 'reminders'>('all');

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const filterFadeAnim = useRef(new Animated.Value(0)).current;
    const filterSlideAnim = useRef(new Animated.Value(-30)).current;

    useEffect(() => {
        // Start screen entrance animation
        const entranceAnimation = Animated.sequence([
            createScreenEntranceAnimation(fadeAnim, slideAnim),
            Animated.delay(200),
            createScreenEntranceAnimation(filterFadeAnim, filterSlideAnim),
        ]);

        entranceAnimation.start();
    }, []);

    // Transform Firebase events to display format
    const calendarEvents = useMemo(() => {
        if (isLoading || error) {
            return fallbackEvents;
        }

        const today = new Date().toISOString().split('T')[0];

        return firebaseEvents.map(event => {
            const eventDate = new Date(event.startDate);
            const isToday = event.startDate === today;

            return {
                id: event.id,
                title: event.title,
                date: eventDate.toLocaleDateString('en-ZA', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                type: event.type,
                description: event.description,
                time: event.startTime && event.endTime
                    ? `${event.startTime} - ${event.endTime}`
                    : event.startTime
                        ? event.startTime
                        : 'All Day',
                isToday,
                isPast: event.startDate < today,
            } as CalendarEventDisplay;
        });
    }, [firebaseEvents, isLoading, error]);

    const eventConfig = {
        holiday: { icon: 'sunny-outline' as const, color: '#F59E0B', bg: '#FEF3C7', label: 'Holiday' },
        event: { icon: 'calendar-outline' as const, color: '#8B5CF6', bg: '#F3F0FF', label: 'School Event' },
        meeting: { icon: 'people-outline' as const, color: '#3B82F6', bg: '#EBF5FF', label: 'Meeting' },
        fieldTrip: { icon: 'bus-outline' as const, color: '#10B981', bg: '#ECFDF5', label: 'Field Trip' },
        early: { icon: 'time-outline' as const, color: '#EF4444', bg: '#FEF2F2', label: 'Early Dismissal' },
        reminder: { icon: 'alarm-outline' as const, color: '#6B7280', bg: '#F9FAFB', label: 'Reminder' },
    };

    const filters = [
        { key: 'all' as const, label: 'All Events', count: calendarEvents.length },
        { key: 'events' as const, label: 'School Events', count: calendarEvents.filter(e => ['event', 'meeting', 'fieldTrip'].includes(e.type)).length },
        { key: 'holidays' as const, label: 'Holidays', count: calendarEvents.filter(e => e.type === 'holiday').length },
        { key: 'reminders' as const, label: 'Reminders', count: calendarEvents.filter(e => e.type === 'reminder').length },
    ];

    const filteredEvents = calendarEvents.filter(event => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'events') return ['event', 'meeting', 'fieldTrip', 'early'].includes(event.type);
        if (selectedFilter === 'holidays') return event.type === 'holiday';
        if (selectedFilter === 'reminders') return event.type === 'reminder';
        return false;
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }}
            >
                <ScreenHeader
                    title="School Calendar"
                    subtitle={`${filteredEvents.length} upcoming events`}
                    showBack={false}
                />
            </Animated.View>

            {/* Animated Filter Tabs */}
            <Animated.View
                style={[
                    styles.filterContainer,
                    {
                        opacity: filterFadeAnim,
                        transform: [{ translateY: filterSlideAnim }],
                    },
                ]}
            >
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
            </Animated.View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {isLoading ? (
                        <AnimatedCard animationType="fade" delay={300}>
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                                <Text style={styles.loadingText}>Loading calendar events...</Text>
                            </View>
                        </AnimatedCard>
                    ) : error ? (
                        <AnimatedCard animationType="bounceIn" delay={300}>
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle-outline" size={48} color={Colors.gradePoor} />
                                <Text style={styles.errorTitle}>Unable to load events</Text>
                                <Text style={styles.errorSubtitle}>Showing offline events. Check your connection and try again.</Text>
                            </View>
                        </AnimatedCard>
                    ) : null}

                    <AnimatedList staggerDelay={100}>
                        {filteredEvents.map(event => {
                            const config = eventConfig[event.type];
                            return (
                                <TouchableOpacity key={event.id} style={styles.eventCard} activeOpacity={0.7}>
                                    <View style={styles.eventHeader}>
                                        <View style={[styles.eventIcon, { backgroundColor: config.bg }]}>
                                            <Ionicons name={config.icon} size={20} color={config.color} />
                                        </View>
                                        <View style={styles.eventInfo}>
                                            <View style={styles.eventTitleRow}>
                                                <Text style={styles.eventTitle}>{event.title}</Text>
                                                {event.isToday && (
                                                    <View style={styles.todayBadge}>
                                                        <Text style={styles.todayText}>Today</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={styles.eventMeta}>
                                                <Text style={styles.eventDate}>{event.date}</Text>
                                                {event.time && (
                                                    <>
                                                        <View style={styles.dot} />
                                                        <Text style={styles.eventTime}>{event.time}</Text>
                                                    </>
                                                )}
                                            </View>
                                            <View style={styles.eventTypeContainer}>
                                                <View style={[styles.eventTypeBadge, { backgroundColor: config.bg }]}>
                                                    <Text style={[styles.eventTypeText, { color: config.color }]}>
                                                        {config.label}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                                    </View>

                                    {event.description && (
                                        <Text style={styles.eventDescription}>{event.description}</Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </AnimatedList>

                    {filteredEvents.length === 0 && (
                        <AnimatedCard animationType="scaleIn" delay={400}>
                            <View style={styles.emptyState}>
                                <Ionicons name="calendar-outline" size={48} color={Colors.textTertiary} />
                                <Text style={styles.emptyTitle}>No events found</Text>
                                <Text style={styles.emptySubtitle}>
                                    {selectedFilter === 'all'
                                        ? 'No upcoming events in the calendar'
                                        : `No ${selectedFilter} found`
                                    }
                                </Text>
                            </View>
                        </AnimatedCard>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
    eventCard: {
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
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    eventIcon: {
        width: 44,
        height: 44,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    todayBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    todayText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.white,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventDate: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: Colors.textTertiary,
        marginHorizontal: 8,
    },
    eventTime: {
        fontSize: 13,
        color: Colors.textTertiary,
    },
    eventTypeContainer: {
        alignSelf: 'flex-start',
    },
    eventTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    eventTypeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    eventDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginTop: 12,
        paddingLeft: 56,
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
        marginBottom: 20,
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
        paddingHorizontal: 40,
    },
});