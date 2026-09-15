import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

const iconMap: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
    assessment: { name: 'school', color: '#3B82F6', bg: '#EFF6FF' },
    attendance: { name: 'calendar', color: '#10B981', bg: '#ECFDF5' },
    feedback: { name: 'chatbubble-ellipses', color: '#8B5CF6', bg: '#F5F3FF' },
    assignment: { name: 'document-text', color: '#F59E0B', bg: '#FFFBEB' },
    announcement: { name: 'megaphone', color: '#EF4444', bg: '#FEF2F2' },
};

export default function NotificationDetailScreen({ route, navigation }: any) {
    const { notification } = route.params;
    const icon = iconMap[notification.type] || iconMap.announcement;

    const getDetailContent = () => {
        if (notification.detailContent) return notification.detailContent;

        // Generate detailed content based on type
        switch (notification.type) {
            case 'assessment':
                return `Assessment Details:\n\n${notification.message}\n\nThis assessment has been scheduled for your child. Please ensure they are prepared and have all necessary materials. If you have any questions about the assessment format or content, please contact the teacher directly.`;

            case 'attendance':
                return `Attendance Notice:\n\n${notification.message}\n\nRegular attendance is crucial for your child's academic success. If your child will be absent, please notify the school in advance. For extended absences, please provide appropriate documentation.`;

            case 'feedback':
                return `Teacher Feedback:\n\n${notification.message}\n\nYour child's teacher has provided detailed feedback on their recent performance. This feedback is designed to help support your child's learning journey. Please review and discuss with your child.`;

            case 'assignment':
                return `Assignment Details:\n\n${notification.message}\n\nThis assignment is an important part of your child's learning process. Please ensure they have a quiet space to work and access to necessary resources. Due dates are firm unless prior arrangements are made.`;

            case 'announcement':
                return `School Announcement:\n\n${notification.message}\n\nThis announcement contains important information for all families. Please read carefully and take any necessary actions mentioned. Contact the school office if you have questions.`;

            default:
                return notification.message;
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Notification Details"
                showBack={true}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
                            <Ionicons name={icon.name} size={28} color={icon.color} />
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.title}>{notification.title}</Text>
                            {notification.childName && (
                                <View style={styles.childBadge}>
                                    <Text style={styles.childName}>{notification.childName}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Metadata */}
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                            <Text style={styles.metaText}>{notification.timestamp}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="pricetag-outline" size={16} color={Colors.textSecondary} />
                            <Text style={styles.metaText}>{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</Text>
                        </View>
                        <View style={[styles.metaItem, styles.statusItem]}>
                            <Ionicons
                                name={notification.isRead ? "checkmark-circle" : "ellipse-outline"}
                                size={16}
                                color={notification.isRead ? Colors.attendancePresent : Colors.attendanceAbsent}
                            />
                            <Text style={[styles.metaText, { color: notification.isRead ? Colors.attendancePresent : Colors.attendanceAbsent }]}>
                                {notification.isRead ? "Read" : "Unread"}
                            </Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageTitle}>Details</Text>
                        <Text style={styles.messageContent}>{getDetailContent()}</Text>
                    </View>

                    {/* Action buttons if any */}
                    {notification.actions && notification.actions.length > 0 && (
                        <View style={styles.actionsContainer}>
                            <Text style={styles.actionsTitle}>Actions</Text>
                            {notification.actions.map((action: any, index: number) => (
                                <View key={index} style={styles.actionItem}>
                                    <Ionicons name="arrow-forward-circle-outline" size={20} color={Colors.primary} />
                                    <Text style={styles.actionText}>{action.label}</Text>
                                </View>
                            ))}
                        </View>
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    childBadge: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    childName: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '600',
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusItem: {
        marginLeft: 'auto',
    },
    metaText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    messageContainer: {
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
    messageTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    messageContent: {
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    actionsContainer: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    actionsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    actionText: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '600',
    },
});