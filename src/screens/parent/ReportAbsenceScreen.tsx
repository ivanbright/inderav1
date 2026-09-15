import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import ScreenHeader from '../../components/ScreenHeader';
import { useAbsenceRequests } from '../../hooks/useAbsenceRequests';
import { useApp } from '../../contexts/AppContext';

export default function ReportAbsenceScreen({ route, navigation }: any) {
    const { childId, childName } = route.params || {};
    const { students } = useApp();
    const { submitRequest, isLoading } = useAbsenceRequests();

    const [selectedType, setSelectedType] = useState<'sick' | 'appointment' | 'family' | 'other'>('sick');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isFullDay, setIsFullDay] = useState(true);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [reason, setReason] = useState('');

    // If no childId provided, get first child
    const targetChildId = childId || (students.length > 0 ? students[0].id : null);
    const targetChildName = childName || (students.length > 0 ? students[0].displayName : 'Student');

    const absenceTypes = [
        { key: 'sick' as const, label: 'Illness', icon: 'medical-outline', color: '#EF4444', bg: '#FEF2F2' },
        { key: 'appointment' as const, label: 'Medical Appointment', icon: 'time-outline', color: '#3B82F6', bg: '#EBF5FF' },
        { key: 'family' as const, label: 'Family Emergency', icon: 'people-outline', color: '#8B5CF6', bg: '#F3F0FF' },
        { key: 'other' as const, label: 'Other', icon: 'help-circle-outline', color: '#6B7280', bg: '#F9FAFB' },
    ];

    const handleSubmit = async () => {
        if (!targetChildId) {
            Alert.alert('Error', 'No student selected.');
            return;
        }

        if (!reason.trim()) {
            Alert.alert('Missing Information', 'Please provide a reason for the absence.');
            return;
        }

        if (!isFullDay && (!startTime || !endTime)) {
            Alert.alert('Missing Information', 'Please specify start and end times for partial absence.');
            return;
        }

        try {
            await submitRequest({
                studentId: targetChildId,
                date: selectedDate,
                type: selectedType,
                isFullDay,
                startTime: isFullDay ? undefined : startTime,
                endTime: isFullDay ? undefined : endTime,
                reason: reason.trim(),
            });

            Alert.alert(
                'Request Submitted',
                'Your absence request has been submitted successfully. You will receive a notification once it is reviewed.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Submission Failed', error.message || 'Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Report Absence"
                subtitle={targetChildName}
                showBack={true}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>

                    {/* Date Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Date of Absence</Text>
                        <TouchableOpacity style={styles.dateSelector}>
                            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                            <Text style={styles.dateText}>{new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</Text>
                            <Ionicons name="chevron-down" size={20} color={Colors.textTertiary} />
                        </TouchableOpacity>
                    </View>

                    {/* Absence Type */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Type of Absence</Text>
                        <View style={styles.typeGrid}>
                            {absenceTypes.map(type => (
                                <TouchableOpacity
                                    key={type.key}
                                    style={[styles.typeCard, selectedType === type.key && styles.typeCardActive]}
                                    onPress={() => setSelectedType(type.key)}
                                >
                                    <View style={[styles.typeIcon, { backgroundColor: type.bg }]}>
                                        <Ionicons name={type.icon as keyof typeof Ionicons.glyphMap} size={20} color={type.color} />
                                    </View>
                                    <Text style={[styles.typeLabel, selectedType === type.key && styles.typeLabelActive]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Full Day / Partial Day */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Duration</Text>
                        <View style={styles.durationContainer}>
                            <TouchableOpacity
                                style={[styles.durationOption, isFullDay && styles.durationOptionActive]}
                                onPress={() => setIsFullDay(true)}
                            >
                                <Ionicons
                                    name={isFullDay ? "radio-button-on" : "radio-button-off"}
                                    size={20}
                                    color={isFullDay ? Colors.primary : Colors.textTertiary}
                                />
                                <Text style={[styles.durationText, isFullDay && styles.durationTextActive]}>Full Day</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.durationOption, !isFullDay && styles.durationOptionActive]}
                                onPress={() => setIsFullDay(false)}
                            >
                                <Ionicons
                                    name={!isFullDay ? "radio-button-on" : "radio-button-off"}
                                    size={20}
                                    color={!isFullDay ? Colors.primary : Colors.textTertiary}
                                />
                                <Text style={[styles.durationText, !isFullDay && styles.durationTextActive]}>Partial Day</Text>
                            </TouchableOpacity>
                        </View>

                        {!isFullDay && (
                            <View style={styles.timeContainer}>
                                <View style={styles.timeInput}>
                                    <Text style={styles.timeLabel}>From</Text>
                                    <TextInput
                                        style={styles.timeField}
                                        placeholder="9:00 AM"
                                        value={startTime}
                                        onChangeText={setStartTime}
                                    />
                                </View>
                                <View style={styles.timeInput}>
                                    <Text style={styles.timeLabel}>To</Text>
                                    <TextInput
                                        style={styles.timeField}
                                        placeholder="12:00 PM"
                                        value={endTime}
                                        onChangeText={setEndTime}
                                    />
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Reason */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Reason for Absence</Text>
                        <TextInput
                            style={styles.reasonInput}
                            placeholder="Please provide details about the absence..."
                            multiline
                            numberOfLines={4}
                            value={reason}
                            onChangeText={setReason}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Text style={styles.submitButtonText}>Submitting...</Text>
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
                                <Text style={styles.submitButtonText}>Submit Request</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Info Notice */}
                    <View style={styles.infoNotice}>
                        <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
                        <Text style={styles.infoText}>
                            The school will be notified of this absence. For extended absences or urgent matters, please contact the school office directly.
                        </Text>
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    dateText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginLeft: 12,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeCard: {
        width: '48%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    typeCardActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    typeIcon: {
        width: 44,
        height: 44,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    typeLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    typeLabelActive: {
        color: Colors.primary,
    },
    durationContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    durationOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    durationOptionActive: {
        backgroundColor: Colors.primaryLight,
    },
    durationText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    durationTextActive: {
        color: Colors.primary,
    },
    timeContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    timeInput: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    timeField: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    reasonInput: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.border,
        minHeight: 100,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 18,
        gap: 8,
        marginBottom: 16,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.white,
    },
    infoNotice: {
        flexDirection: 'row',
        backgroundColor: Colors.primaryLight,
        borderRadius: 12,
        padding: 12,
        gap: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: Colors.primary,
        lineHeight: 16,
    },
});