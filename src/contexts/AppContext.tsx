import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { where, orderBy } from 'firebase/firestore';
import { authService, UserProfile } from '../services/authService';
import { databaseService } from '../services/databaseService';
import { initializationService } from '../services/initializationService';
import { Student, Parent, Teacher, Notification, Announcement } from '../services/models';

interface AppContextType {
    // Auth state
    user: User | null;
    userProfile: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // User data based on role
    students: Student[];
    parent: Parent | null;
    teacher: Teacher | null;
    notifications: Notification[];
    announcements: Announcement[];

    // Actions
    signIn: (email: string, password: string) => Promise<void>;
    registerUser: (
        email: string,
        password: string,
        role: UserProfile['role'],
        inviteCode?: string
    ) => Promise<void | { pendingApproval: true }>;
    googleSignIn: (
        accessToken: string,
        idToken: string,
        role?: UserProfile['role']
    ) => Promise<void | { pendingApproval: true }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    refreshData: () => Promise<void>;
    markNotificationRead: (notificationId: string) => Promise<void>;
    markAnnouncementViewed: (announcementId: string) => Promise<void>;

    // Error state
    error: string | null;
    clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data state
    const [students, setStudents] = useState<Student[]>([]);
    const [parent, setParent] = useState<Parent | null>(null);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // Auth state change listener
    useEffect(() => {
        const unsubscribe = authService.onAuthStateChange(async (user, profile) => {
            setUser(user);
            setUserProfile(profile);

            if (user && profile) {
                await loadUserData(profile);
            } else {
                clearUserData();
            }

            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const clearUserData = () => {
        setStudents([]);
        setParent(null);
        setTeacher(null);
        setNotifications([]);
        setAnnouncements([]);
    };

    const loadUserData = async (profile: UserProfile) => {
        try {
            setIsLoading(true);
            clearUserData();

            switch (profile.role) {
                case 'parent':
                    await loadParentData(profile);
                    break;
                case 'teacher':
                    await loadTeacherData(profile);
                    break;
                case 'admin':
                    await loadAdminData(profile);
                    break;
            }

            // Load common data
            await loadNotifications(profile);
            await loadAnnouncements(profile);

        } catch (error: any) {
            console.error('Error loading user data:', error);
            setError(error.message || 'Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    const loadParentData = async (profile: UserProfile) => {
        try {
            // Get parent record
            const parentData = await databaseService.list<Parent>('parents', [
                where('userId', '==', profile.uid)
            ]);

            if (parentData.length > 0) {
                const parentRecord = parentData[0];
                setParent(parentRecord);

                // Get children
                const childrenData = await databaseService.getStudentsByParent(parentRecord.id);
                setStudents(childrenData);

                // Set up real-time listeners
                setupParentListeners(parentRecord.id);
            }
        } catch (error) {
            console.error('Error loading parent data:', error);
            throw error;
        }
    };

    const loadTeacherData = async (profile: UserProfile) => {
        try {
            // Get teacher record
            const teacherData = await databaseService.list<Teacher>('teachers', [
                where('userId', '==', profile.uid)
            ]);

            if (teacherData.length > 0) {
                const teacherRecord = teacherData[0];
                setTeacher(teacherRecord);

                // Get students for teacher's classes
                const studentData = await databaseService.getStudentsByTeacher(teacherRecord.id);
                setStudents(studentData);

                // Set up real-time listeners
                setupTeacherListeners(teacherRecord.id);
            }
        } catch (error) {
            console.error('Error loading teacher data:', error);
            throw error;
        }
    };

    const loadAdminData = async (profile: UserProfile) => {
        try {
            // For admin, load all students in the school
            const studentData = await databaseService.list<Student>('students', [
                where('schoolId', '==', profile.schoolId),
                where('isActive', '==', true)
            ]);
            setStudents(studentData);

            // Set up real-time listeners for admin
            setupAdminListeners(profile.schoolId);
        } catch (error) {
            console.error('Error loading admin data:', error);
            throw error;
        }
    };

    const loadNotifications = async (profile: UserProfile) => {
        try {
            const notificationData = await databaseService.getUserNotifications(
                profile.uid,
                profile.role as 'parent' | 'teacher' | 'admin'
            );
            setNotifications(notificationData);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const loadAnnouncements = async (profile: UserProfile) => {
        try {
            let announcementData: Announcement[] = [];

            if (profile.role === 'parent' && parent) {
                announcementData = await databaseService.getAnnouncementsForParent(parent.id);
            } else {
                // For teachers and admins, load all school announcements
                announcementData = await databaseService.list<Announcement>('announcements', [
                    where('schoolId', '==', profile.schoolId),
                    where('isPublished', '==', true),
                    orderBy('publishDate', 'desc')
                ]);
            }

            setAnnouncements(announcementData);
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    };

    const setupParentListeners = (parentId: string) => {
        // Listen to children changes
        const childrenUnsubscribe = databaseService.onSnapshot<Student>(
            'students',
            (studentData) => setStudents(studentData),
            [where('parentIds', 'array-contains', parentId)]
        );

        // Note: In a real app, you'd want to store these unsubscribe functions
        // and call them when the component unmounts or user changes
    };

    const setupTeacherListeners = (teacherId: string) => {
        // Similar listeners for teacher data
        // Implementation would depend on specific requirements
    };

    const setupAdminListeners = (schoolId: string) => {
        // Similar listeners for admin data
        // Implementation would depend on specific requirements
    };

    // Actions
    const signIn = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await authService.signIn(email, password);
            // User data will be loaded by the auth state change listener
        } catch (error: any) {
            setError(error.message || 'Sign in failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const registerUser = async (
        email: string,
        password: string,
        role: UserProfile['role'],
        inviteCode?: string
    ): Promise<void | { pendingApproval: true }> => {
        try {
            setError(null);
            const result = await authService.registerUser(email, password, role, inviteCode);
            if (result && 'pendingApproval' in result) {
                return { pendingApproval: true };
            }
        } catch (error: any) {
            setError(error.message || 'Registration failed');
            throw error;
        }
    };

    const googleSignIn = async (
        accessToken: string,
        idToken: string,
        role?: UserProfile['role']
    ): Promise<void | { pendingApproval: true }> => {
        try {
            setError(null);
            const result = await authService.googleSignIn(accessToken, idToken, role);
            if (result && 'pendingApproval' in result) {
                return { pendingApproval: true };
            }
        } catch (error: any) {
            setError(error.message || 'Google sign in failed');
            throw error;
        }
    };

    const signOut = async () => {
        try {
            setError(null);
            await authService.signOut();
            clearUserData();
        } catch (error: any) {
            setError(error.message || 'Sign out failed');
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            setError(null);
            await authService.resetPassword(email);
        } catch (error: any) {
            setError(error.message || 'Password reset failed');
            throw error;
        }
    };

    const refreshData = async () => {
        if (userProfile) {
            await loadUserData(userProfile);
        }
    };

    const markNotificationRead = async (notificationId: string) => {
        try {
            await databaseService.markNotificationAsRead(notificationId);

            // Update local state
            setNotifications(prev => prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true, readAt: new Date().toISOString() }
                    : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAnnouncementViewed = async (announcementId: string) => {
        if (!user) return;

        try {
            await databaseService.markAnnouncementAsViewed(announcementId, user.uid);

            // Update local state
            setAnnouncements(prev => prev.map(announcement =>
                announcement.id === announcementId
                    ? { ...announcement, viewedBy: [...announcement.viewedBy, user.uid] }
                    : announcement
            ));
        } catch (error) {
            console.error('Error marking announcement as viewed:', error);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const contextValue: AppContextType = {
        user,
        userProfile,
        isAuthenticated: !!user,
        isLoading,

        students,
        parent,
        teacher,
        notifications,
        announcements,

        signIn,
        registerUser,
        googleSignIn,
        signOut,
        resetPassword,
        refreshData,
        markNotificationRead,
        markAnnouncementViewed,

        error,
        clearError,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};