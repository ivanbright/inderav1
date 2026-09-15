import { mockData } from '../data/mockData';
import { UserProfile } from './authService';

class OfflineService {
    private isOfflineMode = false;
    private currentUser: any = null;

    setOfflineMode(enabled: boolean) {
        this.isOfflineMode = enabled;
        if (enabled) {
            console.log('✨ Demo mode enabled - using mock data');
        } else {
            console.log('🌐 Connected to Firebase');
        }
    }

    isOffline(): boolean {
        return this.isOfflineMode;
    }

    // Mock authentication for offline mode
    async mockSignIn(email: string, password: string): Promise<{ user: any; profile: UserProfile }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let role: 'parent' | 'teacher' | 'admin' = 'parent';
        let displayName = 'Demo User';

        if (email.includes('parent')) {
            role = 'parent';
            displayName = 'Nomsa Mbeki';
        } else if (email.includes('teacher')) {
            role = 'teacher';
            displayName = 'Sarah Johnson';
        } else if (email.includes('admin')) {
            role = 'admin';
            displayName = 'Principal Mokoena';
        }

        const mockUser = {
            uid: `mock-${role}-uid`,
            email,
            displayName,
        };

        const mockProfile: UserProfile = {
            uid: mockUser.uid,
            email: mockUser.email,
            displayName: mockUser.displayName,
            role,
            schoolId: 'oakridge-academy',
            profileComplete: true,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
        };

        // Add role-specific profile data
        if (role === 'parent') {
            mockProfile.parentProfile = {
                childrenIds: ['student-1', 'student-2'],
                phone: '+27 82 123 4567',
                emergencyContact: '+27 83 987 6543',
            };
        } else if (role === 'teacher') {
            mockProfile.teacherProfile = {
                subjects: ['mathematics'],
                classIds: ['class-8a'],
                employeeId: 'T001',
            };
        } else if (role === 'admin') {
            mockProfile.adminProfile = {
                permissions: ['full_access'],
                managedSchoolIds: ['oakridge-academy'],
            };
        }

        this.currentUser = mockUser;
        return { user: mockUser, profile: mockProfile };
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async mockSignOut() {
        this.currentUser = null;
    }

    // Provide mock data for different app sections
    getMockAnnouncements() {
        return mockData.announcements || [];
    }

    getMockStudents() {
        return mockData.students || [];
    }

    getMockNotifications() {
        return mockData.notifications || [];
    }

    getMockCalendarEvents() {
        return mockData.calendarEvents || [];
    }

    getMockBehaviorReports() {
        return mockData.behaviorReports || [];
    }

    getMockAbsenceRequests() {
        return mockData.absenceRequests || [];
    }

    getMockPickupPersons() {
        return [
            {
                id: 'pickup-1',
                name: 'Nomsa Mbeki',
                relationship: 'Mother',
                phone: '+27 82 123 4567',
                idNumber: '7901234567089',
                isActive: true,
                addedAt: new Date().toISOString(),
            },
            {
                id: 'pickup-2',
                name: 'Mandla Mbeki',
                relationship: 'Father',
                phone: '+27 83 987 6543',
                idNumber: '7801234567089',
                isActive: true,
                addedAt: new Date().toISOString(),
            },
            {
                id: 'pickup-3',
                name: 'Grace Mbeki',
                relationship: 'Grandmother',
                phone: '+27 84 555 1234',
                idNumber: '5501234567089',
                isActive: false,
                addedAt: new Date().toISOString(),
            },
        ];
    }

    // Mock operations for offline mode
    async mockCreateOperation(collection: string, data: any) {
        console.log(`Mock create in ${collection}:`, data);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { id: `mock-${Date.now()}`, ...data };
    }

    async mockUpdateOperation(collection: string, id: string, data: any) {
        console.log(`Mock update in ${collection}/${id}:`, data);
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    }

    async mockDeleteOperation(collection: string, id: string) {
        console.log(`Mock delete in ${collection}/${id}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    }
}

export const offlineService = new OfflineService();
export default offlineService;