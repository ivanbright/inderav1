// Firestore data models matching our app structure

export interface School {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    principalId: string;
    settings: {
        academicYear: string;
        currentTerm: string;
        termDates: TermDate[];
        schoolHours: {
            start: string;
            end: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface TermDate {
    termName: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface Student {
    id: string;
    schoolId: string;
    studentId: string; // School-assigned ID
    firstName: string;
    lastName: string;
    displayName: string;
    dateOfBirth: string;
    grade: string;
    classId: string;
    parentIds: string[];
    enrollmentDate: string;
    isActive: boolean;
    avatar?: string;
    medicalInfo?: {
        allergies: string[];
        medications: string[];
        emergencyContact: {
            name: string;
            phone: string;
            relationship: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface Parent {
    id: string;
    userId: string; // Links to auth user
    schoolId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    childrenIds: string[];
    authorizedPickups: AuthorizedPickup[];
    emergencyContacts: EmergencyContact[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthorizedPickup {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    idNumber: string;
    isActive: boolean;
    addedAt: string;
}

export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
}

export interface Teacher {
    id: string;
    userId: string; // Links to auth user
    schoolId: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subjects: string[];
    classIds: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Class {
    id: string;
    schoolId: string;
    name: string;
    grade: string;
    teacherIds: string[];
    studentIds: string[];
    subjects: string[];
    academicYear: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Subject {
    id: string;
    schoolId: string;
    name: string;
    code: string;
    teacherIds: string[];
    classIds: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Assessment {
    id: string;
    schoolId: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    name: string;
    type: 'Quiz' | 'Test' | 'Exam' | 'Practical' | 'Assignment';
    totalMarks: number;
    date: string;
    dueDate?: string;
    instructions?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AssessmentResult {
    id: string;
    assessmentId: string;
    studentId: string;
    teacherId: string;
    score: number;
    totalMarks: number;
    percentage: number;
    feedback?: string;
    submittedAt?: string;
    gradedAt: string;
    createdAt: string;
}

export interface AttendanceRecord {
    id: string;
    schoolId: string;
    studentId: string;
    classId: string;
    teacherId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    arrivalTime?: string;
    note?: string;
    markedAt: string;
    markedBy: string;
}

export interface BehaviorReport {
    id: string;
    schoolId: string;
    studentId: string;
    teacherId: string;
    date: string;
    type: 'positive' | 'neutral' | 'concern';
    category: 'academic' | 'social' | 'behavior' | 'participation';
    description: string;
    rating: number; // 1-5 scale
    parentNotified: boolean;
    followUpRequired: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TeacherFeedback {
    id: string;
    schoolId: string;
    studentId: string;
    teacherId: string;
    subjectId: string;
    content: string;
    type: 'positive' | 'observation' | 'concern';
    isPrivate: boolean; // Whether visible to parents
    parentViewed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Announcement {
    id: string;
    schoolId: string;
    authorId: string; // Teacher/Admin who created it
    title: string;
    content: string;
    category: 'event' | 'notice' | 'exam' | 'general' | 'emergency';
    priority: 'low' | 'medium' | 'high';
    targetAudience: ('all_parents' | 'all_teachers' | 'specific_classes' | 'specific_grades')[];
    targetClassIds?: string[];
    targetGrades?: string[];
    attachments?: AnnouncementAttachment[];
    publishDate: string;
    expiryDate?: string;
    isPublished: boolean;
    viewedBy: string[]; // User IDs who have viewed
    createdAt: string;
    updatedAt: string;
}

export interface AnnouncementAttachment {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
}

export interface CalendarEvent {
    id: string;
    schoolId: string;
    title: string;
    description?: string;
    type: 'holiday' | 'event' | 'meeting' | 'fieldTrip' | 'early' | 'reminder';
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    targetAudience: ('all_parents' | 'all_teachers' | 'specific_classes' | 'specific_grades')[];
    targetClassIds?: string[];
    targetGrades?: string[];
    createdBy: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AbsenceRequest {
    id: string;
    schoolId: string;
    studentId: string;
    parentId: string;
    date: string;
    type: 'sick' | 'appointment' | 'family' | 'other';
    isFullDay: boolean;
    startTime?: string;
    endTime?: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    id: string;
    schoolId: string;
    recipientId: string; // User ID who should receive this
    recipientType: 'parent' | 'teacher' | 'admin';
    title: string;
    message: string;
    type: 'assessment' | 'attendance' | 'feedback' | 'announcement' | 'assignment' | 'behavior' | 'system';
    data?: Record<string, any>; // Additional data for navigation
    isRead: boolean;
    readAt?: string;
    priority: 'low' | 'medium' | 'high';
    expiresAt?: string;
    createdAt: string;
}

export interface HealthRecord {
    id: string;
    schoolId: string;
    studentId: string;
    date: string;
    type: 'medication' | 'injury' | 'illness' | 'allergy';
    description: string;
    actionTaken?: string;
    staffMemberId: string; // Who recorded this
    parentNotified: boolean;
    severity: 'low' | 'medium' | 'high';
    followUpRequired: boolean;
    createdAt: string;
    updatedAt: string;
}

// Query interfaces for complex operations
export interface StudentProgress {
    studentId: string;
    subjects: {
        [subjectId: string]: {
            currentPercentage: number;
            assessments: AssessmentResult[];
            trend: 'improving' | 'stable' | 'declining';
        };
    };
    overallAverage: number;
    attendanceRate: number;
    behaviorScore: number;
    lastUpdated: string;
}

export interface ClassSummary {
    classId: string;
    studentCount: number;
    averageAttendance: number;
    averagePerformance: number;
    recentActivity: {
        assessments: number;
        behaviorReports: number;
        absences: number;
    };
    lastUpdated: string;
}