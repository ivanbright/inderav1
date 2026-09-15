import { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { Student, AuthorizedPickup } from '../services/models';
import { useApp } from '../contexts/AppContext';

export interface PickupPersonData {
    name: string;
    relationship: string;
    phone: string;
    idNumber: string;
}

export interface UsePickupManagementResult {
    authorizedPickups: AuthorizedPickup[];
    isLoading: boolean;
    error: string | null;
    addPickupPerson: (studentId: string, personData: PickupPersonData) => Promise<void>;
    removePickupPerson: (studentId: string, pickupId: string) => Promise<void>;
    togglePickupPersonStatus: (studentId: string, pickupId: string, isActive: boolean) => Promise<void>;
    refreshPickupData: () => Promise<void>;
}

export const usePickupManagement = (studentId: string): UsePickupManagementResult => {
    const { userProfile, students } = useApp();
    const [authorizedPickups, setAuthorizedPickups] = useState<AuthorizedPickup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPickupData = async () => {
        if (!userProfile || !studentId) return;

        try {
            setIsLoading(true);
            setError(null);

            // Get the student data to access authorized pickups
            const student = await databaseService.get<Student>('students', studentId);
            if (student && student.parentIds) {
                // Get parent data to access authorized pickups
                const parentPromises = student.parentIds.map(parentId =>
                    databaseService.get('parents', parentId)
                );
                const parents = await Promise.all(parentPromises);

                // Combine all authorized pickups from all parents
                const allPickups: AuthorizedPickup[] = [];
                parents.forEach(parent => {
                    if (parent && parent.authorizedPickups) {
                        allPickups.push(...parent.authorizedPickups);
                    }
                });

                // Remove duplicates based on ID
                const uniquePickups = allPickups.filter((pickup, index, self) =>
                    index === self.findIndex(p => p.id === pickup.id)
                );

                setAuthorizedPickups(uniquePickups);
            }

        } catch (err: any) {
            console.error('Error loading pickup data:', err);
            setError(err.message || 'Failed to load pickup data');
        } finally {
            setIsLoading(false);
        }
    };

    const addPickupPerson = async (studentId: string, personData: PickupPersonData) => {
        if (!userProfile) {
            throw new Error('User not authenticated');
        }

        try {
            setError(null);

            // Get the student to find the parent
            const student = await databaseService.get<Student>('students', studentId);
            if (!student || !student.parentIds.length) {
                throw new Error('Student or parent not found');
            }

            // For simplicity, add to the first parent (primary parent)
            const parentId = student.parentIds[0];
            const parent = await databaseService.get('parents', parentId);

            if (!parent) {
                throw new Error('Parent not found');
            }

            // Create new authorized pickup person
            const newPickup: AuthorizedPickup = {
                id: `pickup_${Date.now()}`,
                name: personData.name,
                relationship: personData.relationship,
                phone: personData.phone,
                idNumber: personData.idNumber,
                isActive: true,
                addedAt: new Date().toISOString(),
            };

            // Update parent's authorized pickups
            const updatedPickups = [...(parent.authorizedPickups || []), newPickup];
            await databaseService.update('parents', parentId, {
                authorizedPickups: updatedPickups
            });

            // Update local state
            setAuthorizedPickups(prev => [...prev, newPickup]);

            // Create notification for school admin
            await databaseService.createNotification({
                schoolId: userProfile.schoolId,
                recipientId: 'admin',
                recipientType: 'admin',
                title: 'New Authorized Pickup Person',
                message: `${parent.firstName} ${parent.lastName} added ${personData.name} as authorized pickup for ${student.firstName}`,
                type: 'system',
                data: {
                    type: 'pickup_authorization',
                    studentId: studentId,
                    parentId: parentId,
                    pickupPersonId: newPickup.id,
                },
                isRead: false,
                priority: 'low',
            });

        } catch (err: any) {
            console.error('Error adding pickup person:', err);
            const errorMessage = err.message || 'Failed to add pickup person';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const removePickupPerson = async (studentId: string, pickupId: string) => {
        if (!userProfile) {
            throw new Error('User not authenticated');
        }

        try {
            setError(null);

            // Get the student to find the parent
            const student = await databaseService.get<Student>('students', studentId);
            if (!student || !student.parentIds.length) {
                throw new Error('Student or parent not found');
            }

            // Find which parent has this pickup person
            for (const parentId of student.parentIds) {
                const parent = await databaseService.get('parents', parentId);
                if (parent && parent.authorizedPickups) {
                    const pickupIndex = parent.authorizedPickups.findIndex(p => p.id === pickupId);
                    if (pickupIndex !== -1) {
                        // Remove the pickup person
                        const updatedPickups = parent.authorizedPickups.filter(p => p.id !== pickupId);
                        await databaseService.update('parents', parentId, {
                            authorizedPickups: updatedPickups
                        });

                        // Update local state
                        setAuthorizedPickups(prev => prev.filter(p => p.id !== pickupId));
                        break;
                    }
                }
            }

        } catch (err: any) {
            console.error('Error removing pickup person:', err);
            const errorMessage = err.message || 'Failed to remove pickup person';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const togglePickupPersonStatus = async (studentId: string, pickupId: string, isActive: boolean) => {
        if (!userProfile) {
            throw new Error('User not authenticated');
        }

        try {
            setError(null);

            // Get the student to find the parent
            const student = await databaseService.get<Student>('students', studentId);
            if (!student || !student.parentIds.length) {
                throw new Error('Student or parent not found');
            }

            // Find which parent has this pickup person and update status
            for (const parentId of student.parentIds) {
                const parent = await databaseService.get('parents', parentId);
                if (parent && parent.authorizedPickups) {
                    const pickupIndex = parent.authorizedPickups.findIndex(p => p.id === pickupId);
                    if (pickupIndex !== -1) {
                        // Update the pickup person status
                        const updatedPickups = [...parent.authorizedPickups];
                        updatedPickups[pickupIndex] = {
                            ...updatedPickups[pickupIndex],
                            isActive
                        };

                        await databaseService.update('parents', parentId, {
                            authorizedPickups: updatedPickups
                        });

                        // Update local state
                        setAuthorizedPickups(prev => prev.map(p =>
                            p.id === pickupId ? { ...p, isActive } : p
                        ));
                        break;
                    }
                }
            }

        } catch (err: any) {
            console.error('Error updating pickup person status:', err);
            const errorMessage = err.message || 'Failed to update pickup person status';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const refreshPickupData = async () => {
        await loadPickupData();
    };

    useEffect(() => {
        loadPickupData();
    }, [userProfile, studentId]);

    return {
        authorizedPickups,
        isLoading,
        error,
        addPickupPerson,
        removePickupPerson,
        togglePickupPersonStatus,
        refreshPickupData,
    };
};