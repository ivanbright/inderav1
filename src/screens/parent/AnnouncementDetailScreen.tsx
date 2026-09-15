import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';

export default function AnnouncementDetailScreen({ route, navigation }: any) {
    const { announcement } = route.params;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${announcement.title}\n\n${announcement.content}\n\n- ${announcement.author}, ${announcement.authorRole}`,
                title: announcement.title,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return { color: Colors.attendanceAbsent, bg: '#FEE2E2' };
            case 'medium':
                return { color: Colors.attendanceLate, bg: '#FEF3C7' };
            case 'low':
                return { color: Colors.attendancePresent, bg: '#D1FAE5' };
            default:
                return { color: Colors.textSecondary, bg: Colors.background };
        }
    };

    const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
        switch (category.toLowerCase()) {
            case 'academic':
                return 'school-outline';
            case 'event':
                return 'calendar-outline';
            case 'urgent':
                return 'warning-outline';
            case 'general':
                return 'information-circle-outline';
            case 'sports':
                return 'trophy-outline';
            case 'arts':
                return 'color-palette-outline';
            default:
                return 'megaphone-outline';
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getAttachmentIcon = (type: string): keyof typeof Ionicons.glyphMap => {
        switch (type.toLowerCase()) {
            case 'pdf':
                return 'document-text-outline';
            case 'image':
            case 'jpg':
            case 'png':
                return 'image-outline';
            case 'doc':
            case 'docx':
                return 'document-outline';
            case 'excel':
            case 'xls':
            case 'xlsx':
                return 'grid-outline';
            default:
                return 'document-outline';
        }
    };

    const priorityStyle = getPriorityColor(announcement.priority);

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Announcement"
                showBack={true}
                rightIcon="share-outline"
                onRightPress={handleShare}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header Card */}
                    <View style={styles.headerCard}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{announcement.title}</Text>
                            <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
                                <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
                                    {announcement.priority.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name={getCategoryIcon(announcement.category)} size={16} color={Colors.textSecondary} />
                                <Text style={styles.metaText}>{announcement.category}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                                <Text style={styles.metaText}>{announcement.date}</Text>
                            </View>
                        </View>

                        <View style={styles.authorRow}>
                            <View style={styles.authorAvatar}>
                                <Text style={styles.authorInitial}>
                                    {announcement.author.split(' ').map((n: any) => n[0]).join('').substring(0, 2)}
                                </Text>
                            </View>
                            <View style={styles.authorInfo}>
                                <Text style={styles.authorName}>{announcement.author}</Text>
                                <Text style={styles.authorRole}>{announcement.authorRole}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Content Card */}
                    <View style={styles.contentCard}>
                        <Text style={styles.contentTitle}>Message</Text>
                        <Text style={styles.contentText}>{announcement.content}</Text>
                    </View>

                    {/* Target Audience Card */}
                    {announcement.targetAudience && announcement.targetAudience.length > 0 && (
                        <View style={styles.audienceCard}>
                            <Text style={styles.cardTitle}>
                                <Ionicons name="people-outline" size={18} color={Colors.textPrimary} /> Target Audience
                            </Text>
                            <View style={styles.audienceList}>
                                {announcement.targetAudience.map((audience: any, index: number) => (
                                    <View key={index} style={styles.audienceItem}>
                                        <Ionicons name="checkmark-circle" size={16} color={Colors.attendancePresent} />
                                        <Text style={styles.audienceText}>{audience}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Attachments Card */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                        <View style={styles.attachmentsCard}>
                            <Text style={styles.cardTitle}>
                                <Ionicons name="attach-outline" size={18} color={Colors.textPrimary} /> Attachments
                            </Text>
                            {announcement.attachments.map((attachment: any, index: number) => (
                                <TouchableOpacity key={index} style={styles.attachmentItem}>
                                    <View style={styles.attachmentIcon}>
                                        <Ionicons
                                            name={getAttachmentIcon(attachment.type)}
                                            size={20}
                                            color={Colors.primary}
                                        />
                                    </View>
                                    <View style={styles.attachmentInfo}>
                                        <Text style={styles.attachmentName}>{attachment.name}</Text>
                                        <Text style={styles.attachmentType}>{attachment.type.toUpperCase()}</Text>
                                    </View>
                                    <Ionicons name="download-outline" size={20} color={Colors.textTertiary} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Expiry Notice */}
                    {announcement.expiryDate && (
                        <View style={styles.expiryCard}>
                            <View style={styles.expiryRow}>
                                <Ionicons name="time-outline" size={18} color={Colors.attendanceLate} />
                                <Text style={styles.expiryText}>
                                    This announcement expires on {formatDate(announcement.expiryDate)}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionsCard}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <Ionicons name="share-outline" size={20} color={Colors.primary} />
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                            <Ionicons name="bookmark-outline" size={20} color={Colors.textSecondary} />
                            <Text style={[styles.actionText, styles.secondaryText]}>Save</Text>
                        </TouchableOpacity>
                    </View>
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
    headerCard: {
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
        marginRight: 12,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '700',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    authorInitial: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primary,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    authorRole: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    contentCard: {
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
    contentTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    contentText: {
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 24,
    },
    audienceCard: {
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
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    audienceList: {
        gap: 8,
    },
    audienceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    audienceText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    attachmentsCard: {
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
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.background,
        borderRadius: 12,
        marginBottom: 8,
    },
    attachmentIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    attachmentInfo: {
        flex: 1,
    },
    attachmentName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    attachmentType: {
        fontSize: 11,
        color: Colors.textTertiary,
    },
    expiryCard: {
        backgroundColor: '#FEF3C7',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    expiryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    expiryText: {
        fontSize: 13,
        color: Colors.attendanceLate,
        fontWeight: '500',
        flex: 1,
    },
    actionsCard: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryLight,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    secondaryButton: {
        backgroundColor: Colors.background,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.primary,
    },
    secondaryText: {
        color: Colors.textSecondary,
    },
});