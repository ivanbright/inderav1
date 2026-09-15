import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';
import { usePickupManagement } from '../../hooks/usePickupManagement';
import { useApp } from '../../contexts/AppContext';
import AnimatedScreen from '../../components/AnimatedScreen';
import AnimatedModal from '../../components/AnimatedModal';
import AnimatedCard from '../../components/AnimatedCard';
import AnimatedList from '../../components/AnimatedList';
import AnimatedButton from '../../components/AnimatedButton';
import {
    createFadeAnimation,
    createSlideAnimation,
    createScaleAnimation,
    ANIMATION_DURATIONS,
} from '../../utils/animations';

export default function PickupManagementScreen({ route }: any) {
    const { childId } = route.params || {};
    const { students } = useApp();

    // Get target student
    const targetStudent = students.find(s => s.id === childId) || students[0];
    const targetStudentId = targetStudent?.id || '';

    const {
        authorizedPickups,
        isLoading,
        error,
        addPickupPerson,
        removePickupPerson,
        togglePickupPersonStatus
    } = usePickupManagement(targetStudentId);

    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPersonData, setNewPersonData] = useState({
        name: '',
        relationship: '',
        phone: '',
        idNumber: '',
    });

    // Animation refs
    const statsSlideAnim = useRef(new Animated.Value(-30)).current;
    const statsOpacityAnim = useRef(new Animated.Value(0)).current;
    const filterSlideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Staggered entrance animations
        Animated.sequence([
            Animated.delay(200),
            Animated.parallel([
                createFadeAnimation(statsOpacityAnim, 1, ANIMATION_DURATIONS.medium),
                createSlideAnimation(statsSlideAnim, 0, ANIMATION_DURATIONS.medium),
            ]),
            Animated.delay(100),
            createSlideAnimation(filterSlideAnim, 0, ANIMATION_DURATIONS.medium),
        ]).start();
    }, []);

    const handleTogglePickup = async (pickupId: string, isActive: boolean) => {
        const action = isActive ? 'deactivate' : 'activate';
        const pickup = authorizedPickups.find(p => p.id === pickupId);

        Alert.alert(
            `${action.charAt(0).toUpperCase() + action.slice(1)} Pickup Person`,
            `Are you sure you want to ${action} ${pickup?.name} as an authorized pickup person?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: action.charAt(0).toUpperCase() + action.slice(1),
                    onPress: async () => {
                        try {
                            await togglePickupPersonStatus(targetStudentId, pickupId, !isActive);
                            Alert.alert('Updated', `${pickup?.name} has been ${action}d.`);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to update pickup person status');
                        }
                    }
                }
            ]
        );
    };

    const handleRemovePickup = async (pickupId: string) => {
        const pickup = authorizedPickups.find(p => p.id === pickupId);

        Alert.alert(
            'Remove Pickup Person',
            `Are you sure you want to remove ${pickup?.name} from authorized pickup list?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removePickupPerson(targetStudentId, pickupId);
                            Alert.alert('Removed', `${pickup?.name} has been removed from the authorized pickup list.`);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to remove pickup person');
                        }
                    }
                }
            ]
        );
    };

    const handleAddPickupPerson = async () => {
        if (!newPersonData.name.trim() || !newPersonData.relationship.trim() || !newPersonData.phone.trim() || !newPersonData.idNumber.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await addPickupPerson(targetStudentId, newPersonData);
            setNewPersonData({ name: '', relationship: '', phone: '', idNumber: '' });
            setShowAddModal(false);
            Alert.alert('Success', 'New pickup person has been added successfully.');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to add pickup person');
        }
    };

    const filteredPickups = authorizedPickups.filter(pickup => {
        if (selectedFilter === 'all') return true;
        return selectedFilter === 'active' ? pickup.isActive : !pickup.isActive;
    });

    const filters = [
        { key: 'all' as const, label: 'All People', count: authorizedPickups.length },
        { key: 'active' as const, label: 'Active', count: authorizedPickups.filter(p => p.isActive).length },
        { key: 'inactive' as const, label: 'Inactive', count: authorizedPickups.filter(p => !p.isActive).length },
    ];

    if (!targetStudent) {
        return (
            <AnimatedScreen>
                <ScreenHeader title="Pickup Management" showBack={true} />
                <AnimatedCard animationType="bounceIn" delay={300}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>No student selected</Text>
                    </View>
                </AnimatedCard>
            </AnimatedScreen>
        );
    }

    return (
        <AnimatedScreen backgroundColor={Colors.background}>
            <ScreenHeader
                title="Pickup Management"
                subtitle={targetStudent.displayName}
                showBack={true}
                rightIcon="add-circle-outline"
                onRightPress={() => setShowAddModal(true)}
            />

            {/* Safety Notice */}
            <AnimatedCard animationType="slideDown" delay={100} style={styles.safetyNoticeCard}>
                <View style={styles.safetyNotice}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
                    <Text style={styles.safetyText}>
                        Only these authorized people can pick up {targetStudent.displayName}. Changes require school verification.
                    </Text>
                </View>
            </AnimatedCard>

            {/* Quick Stats with Animation */}
            <Animated.View
                style={[
                    styles.statsContainer,
                    {
                        opacity: statsOpacityAnim,
                        transform: [{ translateY: statsSlideAnim }],
                    },
                ]}
            >
                <AnimatedCard animationType="scaleIn" delay={200}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{authorizedPickups.filter(p => p.isActive).length}</Text>
                        <Text style={styles.statLabel}>Active People</Text>
                    </View>
                </AnimatedCard>
                <AnimatedCard animationType="scaleIn" delay={300}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{authorizedPickups.length}</Text>
                        <Text style={styles.statLabel}>Total Authorized</Text>
                    </View>
                </AnimatedCard>
            </Animated.View>

            {/* Filter Tabs with Animation */}
            <Animated.View
                style={[
                    styles.filterContainer,
                    {
                        transform: [{ translateY: filterSlideAnim }],
                    },
                ]}
            >
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {filters.map((filter, index) => (
                        <AnimatedButton
                            key={filter.key}
                            style={StyleSheet.flatten([styles.filterTab, selectedFilter === filter.key && styles.filterTabActive])}
                            onPress={() => setSelectedFilter(filter.key)}
                            scaleValue={0.95}
                            rippleEffect={true}
                        >
                            <Text style={[styles.filterLabel, selectedFilter === filter.key && styles.filterLabelActive]}>
                                {filter.label}
                            </Text>
                            <View style={[styles.filterBadge, selectedFilter === filter.key && styles.filterBadgeActive]}>
                                <Text style={[styles.filterCount, selectedFilter === filter.key && styles.filterCountActive]}>
                                    {filter.count}
                                </Text>
                            </View>
                        </AnimatedButton>
                    ))}
                </ScrollView>
            </Animated.View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <AnimatedList staggerDelay={120}>
                        {filteredPickups.map(pickup => (
                            <View key={pickup.id} style={StyleSheet.flatten([styles.pickupCard, !pickup.isActive && styles.pickupCardInactive])}>
                                <View style={styles.pickupHeader}>
                                    <View style={styles.pickupAvatar}>
                                        <Text style={styles.pickupAvatarText}>{pickup.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</Text>
                                    </View>
                                    <View style={styles.pickupInfo}>
                                        <View style={styles.pickupNameRow}>
                                            <Text style={styles.pickupName}>{pickup.name}</Text>
                                            {pickup.isActive ? (
                                                <View style={styles.activeBadge}>
                                                    <Ionicons name="checkmark-circle" size={12} color={Colors.attendancePresent} />
                                                    <Text style={styles.activeText}>Active</Text>
                                                </View>
                                            ) : (
                                                <View style={styles.inactiveBadge}>
                                                    <Ionicons name="close-circle" size={12} color={Colors.textTertiary} />
                                                    <Text style={styles.inactiveText}>Inactive</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.relationship}>{pickup.relationship}</Text>
                                        <View style={styles.contactRow}>
                                            <Ionicons name="call-outline" size={14} color={Colors.textTertiary} />
                                            <Text style={styles.contactText}>{pickup.phone}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.pickupDetails}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>ID Number:</Text>
                                        <Text style={styles.detailValue}>{pickup.idNumber}</Text>
                                    </View>
                                </View>

                                <View style={styles.pickupActions}>
                                    <AnimatedButton
                                        style={StyleSheet.flatten([styles.actionButton, styles.toggleButton])}
                                        onPress={() => handleTogglePickup(pickup.id, pickup.isActive)}
                                        rippleEffect={true}
                                    >
                                        <Ionicons
                                            name={pickup.isActive ? "pause-circle-outline" : "play-circle-outline"}
                                            size={16}
                                            color={pickup.isActive ? Colors.attendanceLate : Colors.attendancePresent}
                                        />
                                        <Text style={[styles.actionText, { color: pickup.isActive ? Colors.attendanceLate : Colors.attendancePresent }]}>
                                            {pickup.isActive ? 'Deactivate' : 'Activate'}
                                        </Text>
                                    </AnimatedButton>

                                    {pickup.isActive && (
                                        <AnimatedButton
                                            style={StyleSheet.flatten([styles.actionButton, styles.emergencyButton])}
                                            onPress={() => handleRemovePickup(pickup.id)}
                                            rippleEffect={true}
                                        >
                                            <Ionicons name="trash-outline" size={16} color={Colors.attendanceAbsent} />
                                            <Text style={[styles.actionText, { color: Colors.attendanceAbsent }]}>
                                                Remove
                                            </Text>
                                        </AnimatedButton>
                                    )}
                                </View>
                            </View>
                        ))}
                    </AnimatedList>

                    {filteredPickups.length === 0 && (
                        <AnimatedCard animationType="bounceIn" delay={400}>
                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={48} color={Colors.textTertiary} />
                                <Text style={styles.emptyTitle}>No authorized people found</Text>
                                <Text style={styles.emptySubtitle}>
                                    {selectedFilter === 'all'
                                        ? 'No authorized pickup persons configured'
                                        : `No ${selectedFilter} pickup persons found`
                                    }
                                </Text>
                            </View>
                        </AnimatedCard>
                    )}

                    {/* Add Person CTA */}
                    <AnimatedCard animationType="slideUp" delay={500}>
                        <AnimatedButton
                            style={styles.addButton}
                            onPress={() => setShowAddModal(true)}
                            rippleEffect={true}
                            rippleColor={Colors.primary + '30'}
                        >
                            <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                            <Text style={styles.addButtonText}>Add Authorized Person</Text>
                        </AnimatedButton>
                    </AnimatedCard>
                </View>
            </ScrollView>

            {/* Enhanced Animated Modal */}
            <AnimatedModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                animationType="slide"
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowAddModal(false)}>
                        <Text style={styles.modalCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Add Pickup Person</Text>
                    <TouchableOpacity onPress={handleAddPickupPerson}>
                        <Text style={styles.modalSave}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={newPersonData.name}
                            onChangeText={(text) => setNewPersonData(prev => ({ ...prev, name: text }))}
                            placeholder="Enter full name"
                            placeholderTextColor={Colors.textTertiary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Relationship *</Text>
                        <TextInput
                            style={styles.input}
                            value={newPersonData.relationship}
                            onChangeText={(text) => setNewPersonData(prev => ({ ...prev, relationship: text }))}
                            placeholder="e.g., Father, Grandmother, etc."
                            placeholderTextColor={Colors.textTertiary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number *</Text>
                        <TextInput
                            style={styles.input}
                            value={newPersonData.phone}
                            onChangeText={(text) => setNewPersonData(prev => ({ ...prev, phone: text }))}
                            placeholder="+27 XX XXX XXXX"
                            keyboardType="phone-pad"
                            placeholderTextColor={Colors.textTertiary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>ID Number *</Text>
                        <TextInput
                            style={styles.input}
                            value={newPersonData.idNumber}
                            onChangeText={(text) => setNewPersonData(prev => ({ ...prev, idNumber: text }))}
                            placeholder="ID or Passport Number"
                            placeholderTextColor={Colors.textTertiary}
                        />
                    </View>

                    <View style={styles.infoNotice}>
                        <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
                        <Text style={styles.infoText}>
                            This person will need to provide valid ID when picking up your child. The school may require additional verification.
                        </Text>
                    </View>
                </ScrollView>
            </AnimatedModal>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    safetyNoticeCard: {
        marginHorizontal: 20,
        marginBottom: 16,
    },
    safetyNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryLight,
        borderRadius: 12,
        padding: 12,
        gap: 8,
    },
    safetyText: {
        flex: 1,
        fontSize: 12,
        color: Colors.primary,
        lineHeight: 16,
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
    pickupCard: {
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
    pickupCardInactive: {
        opacity: 0.7,
    },
    pickupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    pickupAvatar: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    pickupAvatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
    },
    pickupInfo: {
        flex: 1,
    },
    pickupNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    pickupName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
    },
    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    activeText: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.attendancePresent,
    },
    inactiveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    inactiveText: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.textTertiary,
    },
    relationship: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    contactText: {
        fontSize: 12,
        color: Colors.textTertiary,
    },
    pickupDetails: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    pickupActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    toggleButton: {
        backgroundColor: Colors.background,
    },
    emergencyButton: {
        backgroundColor: '#FEF2F2',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryLight,
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
        gap: 8,
    },
    addButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
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
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalCancel: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    modalSave: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.textPrimary,
        backgroundColor: Colors.background,
    },
    infoNotice: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.primaryLight,
        padding: 16,
        borderRadius: 12,
        gap: 12,
        marginTop: 20,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 12,
    },
});