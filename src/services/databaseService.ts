import {
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    writeBatch,
    Timestamp,
    QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import {
    Student, Parent, Teacher, Class, Subject, Assessment, AssessmentResult,
    AttendanceRecord, BehaviorReport, TeacherFeedback, Announcement,
    CalendarEvent, AbsenceRequest, Notification, HealthRecord, School
} from './models';

export class DatabaseService {
    // ─── GENERIC CRUD OPERATIONS ────────────────────────

    async create<T>(collectionName: string, data: Omit<T, 'id'>, customId?: string): Promise<T> {
        try {
            const timestamp = new Date().toISOString();
            const docData = {
                ...data,
                createdAt: timestamp,
                updatedAt: timestamp
            };

            if (customId) {
                const docRef = doc(db, collectionName, customId);
                await setDoc(docRef, docData);
                return { ...docData, id: customId } as T;
            } else {
                const docRef = await addDoc(collection(db, collectionName), docData);
                return { ...docData, id: docRef.id } as T;
            }
        } catch (error) {
            console.error(`Error creating ${collectionName}:`, error);
            throw error;
        }
    }

    async get<T>(collectionName: string, id: string): Promise<T | null> {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as T;
            }
            return null;
        } catch (error) {
            console.error(`Error getting ${collectionName} ${id}:`, error);
            throw error;
        }
    }

    async update<T>(collectionName: string, id: string, updates: Partial<T>): Promise<void> {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error(`Error updating ${collectionName} ${id}:`, error);
            throw error;
        }
    }

    async delete(collectionName: string, id: string): Promise<void> {
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting ${collectionName} ${id}:`, error);
            throw error;
        }
    }

    async list<T>(
        collectionName: string,
        constraints: QueryConstraint[] = [],
        limitCount?: number
    ): Promise<T[]> {
        try {
            let q = query(collection(db, collectionName), ...constraints);

            if (limitCount) {
                q = query(q, limit(limitCount));
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        } catch (error) {
            console.error(`Error listing ${collectionName}:`, error);
            throw error;
        }
    }

    // ─── REAL-TIME LISTENERS ────────────────────────────

    onSnapshot<T>(
        collectionName: string,
        callback: (data: T[]) => void,
        constraints: QueryConstraint[] = []
    ) {
        try {
            const q = query(collection(db, collectionName), ...constraints);

            return onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
                callback(data);
            });
        } catch (error) {
            console.error(`Error setting up listener for ${collectionName}:`, error);
            throw error;
        }
    }

    onDocSnapshot<T>(
        collectionName: string,
        id: string,
        callback: (data: T | null) => void
    ) {
        try {
            const docRef = doc(db, collectionName, id);

            return onSnapshot(docRef, (snapshot) => {
                if (snapshot.exists()) {
                    callback({ id: snapshot.id, ...snapshot.data() } as T);
                } else {
                    callback(null);
                }
            });
        } catch (error) {
            console.error(`Error setting up doc listener for ${collectionName} ${id}:`, error);
            throw error;
        }
    }

    // ─── STUDENT OPERATIONS ─────────────────────────────

    async getStudentsByParent(parentId: string): Promise<Student[]> {
        return this.list<Student>('students', [where('parentIds', 'array-contains', parentId)]);
    }

    async getStudentsByClass(classId: string): Promise<Student[]> {
        return this.list<Student>('students', [where('classId', '==', classId), where('isActive', '==', true)]);
    }

    async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
        // First get classes taught by teacher
        const classes = await this.list<Class>('classes', [
            where('teacherIds', 'array-contains', teacherId)
        ]);

        // Get students from all these classes
        const classIds = classes.map(c => c.id);
        if (classIds.length === 0) return [];

        return this.list<Student>('students', [
            where('classId', 'in', classIds),
            where('isActive', '==', true)
        ]);
    }

    // ─── ATTENDANCE OPERATIONS ──────────────────────────

    async markAttendance(attendanceData: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
        return this.create<AttendanceRecord>('attendance', attendanceData);
    }

    async getAttendanceByStudent(studentId: string, startDate?: string, endDate?: string): Promise<AttendanceRecord[]> {
        const constraints: QueryConstraint[] = [
            where('studentId', '==', studentId),
            orderBy('date', 'desc')
        ];

        if (startDate) {
            constraints.push(where('date', '>=', startDate));
        }
        if (endDate) {
            constraints.push(where('date', '<=', endDate));
        }

        return this.list<AttendanceRecord>('attendance', constraints);
    }

    async getAttendanceByClass(classId: string, date: string): Promise<AttendanceRecord[]> {
        return this.list<AttendanceRecord>('attendance', [
            where('classId', '==', classId),
            where('date', '==', date)
        ]);
    }

    // ─── ASSESSMENT OPERATIONS ──────────────────────────

    async createAssessment(assessmentData: Omit<Assessment, 'id'>): Promise<Assessment> {
        return this.create<Assessment>('assessments', assessmentData);
    }

    async getAssessmentsByClass(classId: string): Promise<Assessment[]> {
        return this.list<Assessment>('assessments', [
            where('classId', '==', classId),
            where('isActive', '==', true),
            orderBy('date', 'desc')
        ]);
    }

    async getAssessmentsBySubject(subjectId: string): Promise<Assessment[]> {
        return this.list<Assessment>('assessments', [
            where('subjectId', '==', subjectId),
            where('isActive', '==', true),
            orderBy('date', 'desc')
        ]);
    }

    async recordAssessmentResult(resultData: Omit<AssessmentResult, 'id'>): Promise<AssessmentResult> {
        const percentage = Math.round((resultData.score / resultData.totalMarks) * 100);
        return this.create<AssessmentResult>('assessmentResults', {
            ...resultData,
            percentage
        });
    }

    async getStudentAssessmentResults(studentId: string, subjectId?: string): Promise<AssessmentResult[]> {
        const constraints: QueryConstraint[] = [
            where('studentId', '==', studentId),
            orderBy('gradedAt', 'desc')
        ];

        if (subjectId) {
            // We'll need to join with assessments to filter by subject
            const assessments = await this.getAssessmentsBySubject(subjectId);
            const assessmentIds = assessments.map(a => a.id);

            if (assessmentIds.length === 0) return [];

            constraints.push(where('assessmentId', 'in', assessmentIds));
        }

        return this.list<AssessmentResult>('assessmentResults', constraints);
    }

    // ─── BEHAVIOR OPERATIONS ────────────────────────────

    async recordBehaviorReport(reportData: Omit<BehaviorReport, 'id'>): Promise<BehaviorReport> {
        return this.create<BehaviorReport>('behaviorReports', reportData);
    }

    async getStudentBehaviorReports(studentId: string, startDate?: string, endDate?: string): Promise<BehaviorReport[]> {
        const constraints: QueryConstraint[] = [
            where('studentId', '==', studentId),
            orderBy('date', 'desc')
        ];

        if (startDate) {
            constraints.push(where('date', '>=', startDate));
        }
        if (endDate) {
            constraints.push(where('date', '<=', endDate));
        }

        return this.list<BehaviorReport>('behaviorReports', constraints);
    }

    // ─── FEEDBACK OPERATIONS ────────────────────────────

    async createTeacherFeedback(feedbackData: Omit<TeacherFeedback, 'id'>): Promise<TeacherFeedback> {
        return this.create<TeacherFeedback>('teacherFeedback', feedbackData);
    }

    async getStudentFeedback(studentId: string, subjectId?: string): Promise<TeacherFeedback[]> {
        const constraints: QueryConstraint[] = [
            where('studentId', '==', studentId),
            where('isPrivate', '==', false),
            orderBy('createdAt', 'desc')
        ];

        if (subjectId) {
            constraints.push(where('subjectId', '==', subjectId));
        }

        return this.list<TeacherFeedback>('teacherFeedback', constraints);
    }

    async markFeedbackAsViewed(feedbackId: string): Promise<void> {
        return this.update('teacherFeedback', feedbackId, { parentViewed: true });
    }

    // ─── ANNOUNCEMENT OPERATIONS ────────────────────────

    async createAnnouncement(announcementData: Omit<Announcement, 'id'>): Promise<Announcement> {
        return this.create<Announcement>('announcements', announcementData);
    }

    async getAnnouncementsForParent(parentId: string): Promise<Announcement[]> {
        // Get parent's children to determine relevant announcements
        const parent = await this.get<Parent>('parents', parentId);
        if (!parent) return [];

        const students = await Promise.all(
            parent.childrenIds.map(id => this.get<Student>('students', id))
        );

        const classIds = students.filter(s => s).map(s => s!.classId);
        const grades = students.filter(s => s).map(s => s!.grade);

        return this.list<Announcement>('announcements', [
            where('isPublished', '==', true),
            where('publishDate', '<=', new Date().toISOString()),
            orderBy('publishDate', 'desc')
        ]);
        // Note: Additional filtering for targetAudience would be done client-side
    }

    async markAnnouncementAsViewed(announcementId: string, userId: string): Promise<void> {
        const announcement = await this.get<Announcement>('announcements', announcementId);
        if (announcement && !announcement.viewedBy.includes(userId)) {
            await this.update('announcements', announcementId, {
                viewedBy: [...announcement.viewedBy, userId]
            });
        }
    }

    // ─── CALENDAR OPERATIONS ────────────────────────────

    async createCalendarEvent(eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
        return this.create<CalendarEvent>('calendarEvents', eventData);
    }

    async getCalendarEventsForParent(parentId: string): Promise<CalendarEvent[]> {
        // Similar logic to announcements - get relevant events based on children
        return this.list<CalendarEvent>('calendarEvents', [
            where('isActive', '==', true),
            where('startDate', '>=', new Date().toISOString().split('T')[0]),
            orderBy('startDate', 'asc')
        ]);
    }

    // ─── ABSENCE OPERATIONS ─────────────────────────────

    async submitAbsenceRequest(requestData: Omit<AbsenceRequest, 'id'>): Promise<AbsenceRequest> {
        return this.create<AbsenceRequest>('absenceRequests', {
            ...requestData,
            status: 'pending'
        });
    }

    async getAbsenceRequests(studentId?: string, status?: string): Promise<AbsenceRequest[]> {
        const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

        if (studentId) {
            constraints.push(where('studentId', '==', studentId));
        }
        if (status) {
            constraints.push(where('status', '==', status));
        }

        return this.list<AbsenceRequest>('absenceRequests', constraints);
    }

    async approveAbsenceRequest(requestId: string, approvedBy: string): Promise<void> {
        return this.update('absenceRequests', requestId, {
            status: 'approved',
            approvedBy,
            approvedAt: new Date().toISOString()
        });
    }

    async rejectAbsenceRequest(requestId: string, rejectionReason: string): Promise<void> {
        return this.update('absenceRequests', requestId, {
            status: 'rejected',
            rejectionReason
        });
    }

    // ─── NOTIFICATION OPERATIONS ────────────────────────

    async createNotification(notificationData: Omit<Notification, 'id'>): Promise<Notification> {
        return this.create<Notification>('notifications', notificationData);
    }

    async getUserNotifications(userId: string, recipientType: 'parent' | 'teacher' | 'admin'): Promise<Notification[]> {
        return this.list<Notification>('notifications', [
            where('recipientId', '==', userId),
            where('recipientType', '==', recipientType),
            orderBy('createdAt', 'desc'),
            limit(50)
        ]);
    }

    async markNotificationAsRead(notificationId: string): Promise<void> {
        return this.update('notifications', notificationId, {
            isRead: true,
            readAt: new Date().toISOString()
        });
    }

    async markAllNotificationsAsRead(userId: string, recipientType: string): Promise<void> {
        const notifications = await this.list<Notification>('notifications', [
            where('recipientId', '==', userId),
            where('recipientType', '==', recipientType),
            where('isRead', '==', false)
        ]);

        const batch = writeBatch(db);
        notifications.forEach(notification => {
            const docRef = doc(db, 'notifications', notification.id);
            batch.update(docRef, {
                isRead: true,
                readAt: new Date().toISOString()
            });
        });

        await batch.commit();
    }

    // ─── HEALTH OPERATIONS ──────────────────────────────

    async recordHealthEntry(healthData: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
        return this.create<HealthRecord>('healthRecords', healthData);
    }

    async getStudentHealthRecords(studentId: string): Promise<HealthRecord[]> {
        return this.list<HealthRecord>('healthRecords', [
            where('studentId', '==', studentId),
            orderBy('date', 'desc')
        ]);
    }

    // ─── CLASS & TEACHER OPERATIONS ─────────────────────

    async getClassesByTeacher(teacherId: string): Promise<Class[]> {
        return this.list<Class>('classes', [
            where('teacherIds', 'array-contains', teacherId),
            where('isActive', '==', true)
        ]);
    }

    async getSubjectsByTeacher(teacherId: string): Promise<Subject[]> {
        return this.list<Subject>('subjects', [
            where('teacherIds', 'array-contains', teacherId),
            where('isActive', '==', true)
        ]);
    }

    // ─── BATCH OPERATIONS ───────────────────────────────

    async batchUpdateAttendance(attendanceRecords: AttendanceRecord[]): Promise<void> {
        const batch = writeBatch(db);

        attendanceRecords.forEach(record => {
            const docRef = doc(db, 'attendance', record.id);
            batch.set(docRef, {
                ...record,
                markedAt: new Date().toISOString()
            });
        });

        await batch.commit();
    }

    async batchCreateAssessmentResults(results: Omit<AssessmentResult, 'id'>[]): Promise<void> {
        const batch = writeBatch(db);

        results.forEach(result => {
            const docRef = doc(collection(db, 'assessmentResults'));
            const percentage = Math.round((result.score / result.totalMarks) * 100);
            batch.set(docRef, {
                ...result,
                percentage,
                createdAt: new Date().toISOString()
            });
        });

        await batch.commit();
    }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;