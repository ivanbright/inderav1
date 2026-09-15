import { useState, useEffect } from 'react';
import { where, orderBy } from 'firebase/firestore';
import { databaseService } from '../services/databaseService';
import { AbsenceRequest } from '../services/models';
import { useApp } from '../contexts/AppContext';

export interface AbsenceRequestData {
    studentId: string;
    date: string;
    type: 'sick' | 'appointment' | 'family' | 'other';
    isFullDay: boolean;
    startTime?: string;
    endTime?: string;
    reason: string;
}

export interface UseAbsenceRequestsResult {
    requests: AbsenceRequest[];
    isLoading: boolean;
    error: string | null;
    submitRequest: (data: AbsenceRequestData) => Promise<void>;
    refreshRequests: () => Promise<void>;
}

export const useAbsenceRequests = (studentId?: string): UseAbsenceRequestsResult => {
    const { userProfile, parent } = useApp();
    const [requests, setRequests] = useState<AbsenceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadRequests = async () => {
        if (!userProfile || !parent) return;

        try {
            setIsLoading(true);
            setError(null);

            let absenceRequests: AbsenceRequest[] = [];

            if (studentId) {
                // Load requests for specific student
                absenceRequests = await databaseService.getAbsenceRequests(studentId);
            } else {
                // Load requests for all parent's children
                const allRequests = await Promise.all(
                    parent.childrenIds.map(childId =>
                        databaseService.getAbsenceRequests(childId)
                    )
                );
                absenceRequests = allRequests.flat();

                // Sort by creation date, most recent first
                absenceRequests.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            }

            setRequests(absenceRequests);
        } catch (err: any) {
            console.error('Error loading absence requests:', err);
            setError(err.message || 'Failed to load absence requests');
        } finally {
            setIsLoading(false);
        }
    };

    const submitRequest = async (data: AbsenceRequestData) => {
        if (!userProfile || !parent) {
            throw new Error('User not authenticated');
        }

        try {
            setError(null);

            const requestData: Omit<AbsenceRequest, 'id'> = {
                schoolId: userProfile.schoolId,
                studentId: data.studentId,
                parentId: parent.id,
                date: data.date,
                type: data.type,
                isFullDay: data.isFullDay,
                startTime: data.startTime,
                endTime: data.endTime,
                reason: data.reason,
                status: 'pending',
            };

            const newRequest = await databaseService.submitAbsenceRequest(requestData);

            // Add to local state
            setRequests(prev => [newRequest, ...prev]);

            // Create notification for relevant staff
            await databaseService.createNotification({
                schoolId: userProfile.schoolId,
                recipientId: 'admin', // In a real app, this would be the class teacher or admin
                recipientType: 'admin',
                title: 'New Absence Request',
                message: `${parent.firstName} ${parent.lastName} submitted an absence request for ${data.date}`,
                type: 'system',
                data: {
                    type: 'absence_request',
                    requestId: newRequest.id,
                    studentId: data.studentId,
                },
                isRead: false,
                priority: 'medium',
            });

        } catch (err: any) {
            console.error('Error submitting absence request:', err);
            const errorMessage = err.message || 'Failed to submit absence request';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const refreshRequests = async () => {
        await loadRequests();
    };

    useEffect(() => {
        loadRequests();
    }, [userProfile, parent, studentId]);

    return {
        requests,
        isLoading,
        error,
        submitRequest,
        refreshRequests,
    };
};