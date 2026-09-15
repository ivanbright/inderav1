import { databaseService } from './databaseService';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {
    School, Student, Parent, Teacher, Class, Subject, Assessment, AssessmentResult,
    AttendanceRecord, BehaviorReport, TeacherFeedback, Announcement, CalendarEvent,
    AbsenceRequest, Notification, AuthorizedPickup
} from './models';

export class SeedService {
    private schoolId = 'oakridge-academy';
    private currentDate = new Date().toISOString().split('T')[0];

    async seedDemoData(): Promise<void> {
        try {
            console.log('Starting demo data seeding...');

            // Create school
            await this.createSchool();

            // Create users and profiles
            const { parentUser, teacherUser, adminUser } = await this.createUsers();

            // Create academic structure
            const { subjects, classes } = await this.createAcademicStructure();

            // Create students and parents
            const { students, parents } = await this.createStudentsAndParents(parentUser.uid);

            // Create teachers
            const teachers = await this.createTeachers(teacherUser.uid, classes, subjects);

            // Create assessments and results
            await this.createAssessmentsAndResults(classes[0], subjects, students, teachers[0]);

            // Create attendance records
            await this.createAttendanceRecords(students, classes[0], teachers[0]);

            // Create behavior reports
            await this.createBehaviorReports(students, teachers[0]);

            // Create teacher feedback
            await this.createTeacherFeedback(students, teachers[0], subjects);

            // Create announcements
            await this.createAnnouncements(teacherUser.uid);

            // Create calendar events
            await this.createCalendarEvents();

            // Create notifications
            await this.createNotifications(parentUser.uid, teacherUser.uid, students);

            console.log('Demo data seeding completed successfully!');
        } catch (error) {
            console.error('Error seeding demo data:', error);
            throw error;
        }
    }

    private async createSchool(): Promise<void> {
        const school: Omit<School, 'id'> = {
            name: 'Oakridge Academy',
            address: '42 Education Drive, Johannesburg, South Africa',
            phone: '+27 11 234 5678',
            email: 'admin@oakridgeacademy.edu',
            principalId: 'admin-user',
            settings: {
                academicYear: '2026',
                currentTerm: 'Term 3',
                termDates: [
                    { termName: 'Term 1', startDate: '2026-01-15', endDate: '2026-03-27', isActive: false },
                    { termName: 'Term 2', startDate: '2026-04-14', endDate: '2026-06-26', isActive: false },
                    { termName: 'Term 3', startDate: '2026-07-21', endDate: '2026-09-26', isActive: true },
                    { termName: 'Term 4', startDate: '2026-10-13', endDate: '2026-12-11', isActive: false },
                ],
                schoolHours: {
                    start: '07:30',
                    end: '14:30',
                },
            },
        };

        await databaseService.create<School>('schools', school, this.schoolId);
    }

    private async createUsers() {
        // Create real Firebase Auth users, then store their profiles using the real UIDs.
        // This ensures the demo login credentials work and the `users` collection
        // documents match each Auth user's UID.

        const credentials = [
            { email: 'parent@demo.com', password: 'demo123' },
            { email: 'teacher@demo.com', password: 'demo123' },
            { email: 'admin@demo.com', password: 'demo123' },
        ];

        const uids: string[] = [];
        for (const cred of credentials) {
            try {
                const result = await createUserWithEmailAndPassword(auth, cred.email, cred.password);
                uids.push(result.user.uid);
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    // User already exists — use their real UID
                    const result = await signInWithEmailAndPassword(auth, cred.email, cred.password);
                    uids.push(result.user.uid);
                } else {
                    console.error('Failed to create auth user:', cred.email, error);
                    uids.push(`demo-${cred.email.split('@')[0]}-uid`);
                }
            }
        }

        const [parentUid, teacherUid, adminUid] = uids;

        const parentProfile = {
            uid: parentUid,
            email: 'parent@demo.com',
            displayName: 'Nomsa Mbeki',
            role: 'parent' as const,
            schoolId: this.schoolId,
            profileComplete: true,
            parentProfile: {
                childrenIds: ['student-1', 'student-2'],
                phone: '+27 82 123 4567',
                emergencyContact: '+27 83 987 6543',
            },
        };

        const teacherProfile = {
            uid: teacherUid,
            email: 'teacher@demo.com',
            displayName: 'Sarah Johnson',
            role: 'teacher' as const,
            schoolId: this.schoolId,
            profileComplete: true,
            teacherProfile: {
                subjects: ['mathematics'],
                classIds: ['class-8a'],
                employeeId: 'T001',
            },
        };

        const adminProfile = {
            uid: adminUid,
            email: 'admin@demo.com',
            displayName: 'Principal Mokoena',
            role: 'admin' as const,
            schoolId: this.schoolId,
            profileComplete: true,
            adminProfile: {
                permissions: ['full_access'],
                managedSchoolIds: [this.schoolId],
            },
        };

        await databaseService.create('users', parentProfile, parentProfile.uid);
        await databaseService.create('users', teacherProfile, teacherProfile.uid);
        await databaseService.create('users', adminProfile, adminProfile.uid);

        return {
            parentUser: parentProfile,
            teacherUser: teacherProfile,
            adminUser: adminProfile,
        };
    }

    private async createAcademicStructure() {
        // Create subjects
        const subjects: Omit<Subject, 'id'>[] = [
            {
                schoolId: this.schoolId,
                name: 'Mathematics',
                code: 'MATH',
                teacherIds: ['teacher-1'],
                classIds: ['class-8a'],
                isActive: true,
            },
            {
                schoolId: this.schoolId,
                name: 'Natural Sciences',
                code: 'SCI',
                teacherIds: ['teacher-1'],
                classIds: ['class-8a'],
                isActive: true,
            },
            {
                schoolId: this.schoolId,
                name: 'English',
                code: 'ENG',
                teacherIds: ['teacher-1'],
                classIds: ['class-8a'],
                isActive: true,
            },
        ];

        const createdSubjects: Subject[] = [];
        for (let i = 0; i < subjects.length; i++) {
            const subject = await databaseService.create<Subject>('subjects', subjects[i], `subject-${i + 1}`);
            createdSubjects.push(subject);
        }

        // Create classes
        const classes: Omit<Class, 'id'>[] = [
            {
                schoolId: this.schoolId,
                name: 'Grade 8A',
                grade: '8',
                teacherIds: ['teacher-1'],
                studentIds: ['student-1', 'student-2'],
                subjects: createdSubjects.map(s => s.id),
                academicYear: '2026',
                isActive: true,
            },
        ];

        const createdClasses: Class[] = [];
        for (let i = 0; i < classes.length; i++) {
            const classData = await databaseService.create<Class>('classes', classes[i], `class-${8}a`);
            createdClasses.push(classData);
        }

        return { subjects: createdSubjects, classes: createdClasses };
    }

    private async createStudentsAndParents(parentUserId: string) {
        const authorizedPickups: AuthorizedPickup[] = [
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
                isActive: true,
                addedAt: new Date().toISOString(),
            },
        ];

        // Create parent
        const parent: Omit<Parent, 'id'> = {
            userId: parentUserId,
            schoolId: this.schoolId,
            firstName: 'Nomsa',
            lastName: 'Mbeki',
            email: 'parent@demo.com',
            phone: '+27 82 123 4567',
            childrenIds: ['student-1', 'student-2'],
            authorizedPickups,
            emergencyContacts: [
                {
                    id: 'ec-1',
                    name: 'Mandla Mbeki',
                    phone: '+27 83 987 6543',
                    relationship: 'Father',
                    isPrimary: true,
                },
            ],
            isActive: true,
        };

        const createdParent = await databaseService.create<Parent>('parents', parent, 'parent-1');

        // Create students
        const students: Omit<Student, 'id'>[] = [
            {
                schoolId: this.schoolId,
                studentId: 'STU001',
                firstName: 'Amahle',
                lastName: 'Mbeki',
                displayName: 'Amahle Mbeki',
                dateOfBirth: '2012-03-15',
                grade: '8',
                classId: 'class-8a',
                parentIds: ['parent-1'],
                enrollmentDate: '2026-01-15',
                isActive: true,
                avatar: 'AM',
            },
            {
                schoolId: this.schoolId,
                studentId: 'STU002',
                firstName: 'Thabo',
                lastName: 'Mbeki',
                displayName: 'Thabo Mbeki',
                dateOfBirth: '2016-08-22',
                grade: '5',
                classId: 'class-5b',
                parentIds: ['parent-1'],
                enrollmentDate: '2026-01-15',
                isActive: true,
                avatar: 'TM',
            },
        ];

        const createdStudents: Student[] = [];
        for (let i = 0; i < students.length; i++) {
            const student = await databaseService.create<Student>('students', students[i], `student-${i + 1}`);
            createdStudents.push(student);
        }

        return { students: createdStudents, parents: [createdParent] };
    }

    private async createTeachers(teacherUserId: string, classes: Class[], subjects: Subject[]) {
        const teacher: Omit<Teacher, 'id'> = {
            userId: teacherUserId,
            schoolId: this.schoolId,
            employeeId: 'T001',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'teacher@demo.com',
            phone: '+27 83 456 7890',
            subjects: subjects.map(s => s.id),
            classIds: classes.map(c => c.id),
            isActive: true,
        };

        const createdTeacher = await databaseService.create<Teacher>('teachers', teacher, 'teacher-1');
        return [createdTeacher];
    }

    private async createAssessmentsAndResults(classData: Class, subjects: Subject[], students: Student[], teacher: Teacher) {
        const mathSubject = subjects.find(s => s.name === 'Mathematics');
        if (!mathSubject) return;

        // Create assessment
        const assessment: Omit<Assessment, 'id'> = {
            schoolId: this.schoolId,
            classId: classData.id,
            subjectId: mathSubject.id,
            teacherId: teacher.id,
            name: 'Algebra Quiz 1',
            type: 'Quiz',
            totalMarks: 20,
            date: this.currentDate,
            instructions: 'Complete all questions on algebraic expressions and equations.',
            isActive: true,
        };

        const createdAssessment = await databaseService.create<Assessment>('assessments', assessment);

        // Create results for students
        for (const student of students) {
            const score = Math.floor(Math.random() * 6) + 15; // Score between 15-20
            const result: Omit<AssessmentResult, 'id'> = {
                assessmentId: createdAssessment.id,
                studentId: student.id,
                teacherId: teacher.id,
                score,
                totalMarks: 20,
                percentage: Math.round((score / 20) * 100),
                feedback: score >= 18 ? 'Excellent work!' : score >= 15 ? 'Good effort, keep practicing!' : 'Needs improvement',
                gradedAt: new Date().toISOString(),
            };

            await databaseService.create<AssessmentResult>('assessmentResults', result);
        }
    }

    private async createAttendanceRecords(students: Student[], classData: Class, teacher: Teacher) {
        // Create attendance for the last 5 school days
        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Skip weekends
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            const dateString = date.toISOString().split('T')[0];

            for (const student of students) {
                const statuses = ['present', 'present', 'present', 'present', 'late', 'present'];
                const status = statuses[Math.floor(Math.random() * statuses.length)] as 'present' | 'absent' | 'late' | 'excused';

                const attendance: Omit<AttendanceRecord, 'id'> = {
                    schoolId: this.schoolId,
                    studentId: student.id,
                    classId: classData.id,
                    teacherId: teacher.id,
                    date: dateString,
                    status,
                    arrivalTime: status === 'late' ? '08:15' : '07:55',
                    note: status === 'late' ? 'Arrived 20 minutes late' : undefined,
                    markedAt: new Date().toISOString(),
                    markedBy: teacher.id,
                };

                await databaseService.create<AttendanceRecord>('attendance', attendance);
            }
        }
    }

    private async createBehaviorReports(students: Student[], teacher: Teacher) {
        const behaviors = [
            { type: 'positive', category: 'social', description: 'Helped a classmate with their work', rating: 5 },
            { type: 'positive', category: 'academic', description: 'Excellent participation in group discussion', rating: 4 },
            { type: 'neutral', category: 'behavior', description: 'Followed classroom rules appropriately', rating: 3 },
            { type: 'positive', category: 'participation', description: 'Volunteered to answer questions', rating: 4 },
        ];

        for (const student of students) {
            for (let i = 0; i < 3; i++) {
                const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
                const date = new Date();
                date.setDate(date.getDate() - i);

                const report: Omit<BehaviorReport, 'id'> = {
                    schoolId: this.schoolId,
                    studentId: student.id,
                    teacherId: teacher.id,
                    date: date.toISOString().split('T')[0],
                    type: behavior.type as any,
                    category: behavior.category as any,
                    description: behavior.description,
                    rating: behavior.rating,
                    parentNotified: true,
                    followUpRequired: behavior.rating <= 2,
                };

                await databaseService.create<BehaviorReport>('behaviorReports', report);
            }
        }
    }

    private async createTeacherFeedback(students: Student[], teacher: Teacher, subjects: Subject[]) {
        const mathSubject = subjects.find(s => s.name === 'Mathematics');
        if (!mathSubject) return;

        for (const student of students) {
            const feedback: Omit<TeacherFeedback, 'id'> = {
                schoolId: this.schoolId,
                studentId: student.id,
                teacherId: teacher.id,
                subjectId: mathSubject.id,
                content: `${student.firstName} has shown remarkable improvement in algebra this term. Excellent problem-solving skills and active participation in class discussions.`,
                type: 'positive',
                isPrivate: false,
                parentViewed: false,
            };

            await databaseService.create<TeacherFeedback>('teacherFeedback', feedback);
        }
    }

    private async createAnnouncements(authorId: string) {
        const announcements: Omit<Announcement, 'id'>[] = [
            {
                schoolId: this.schoolId,
                authorId,
                title: 'Parent-Teacher Conference',
                content: 'Dear Parents,\n\nWe invite you to our quarterly Parent-Teacher Conference scheduled for Saturday, September 20th from 9:00 AM to 12:00 PM.\n\nPlease make arrangements to attend as we will be discussing your child\'s academic progress.',
                category: 'event',
                priority: 'medium',
                targetAudience: ['all_parents'],
                publishDate: this.currentDate,
                isPublished: true,
                viewedBy: [],
            },
            {
                schoolId: this.schoolId,
                authorId,
                title: 'Mid-Term Examination Schedule',
                content: 'The mid-term examinations will commence on October 1st and end on October 10th. Detailed timetables have been sent to class teachers.',
                category: 'exam',
                priority: 'high',
                targetAudience: ['all_parents', 'all_teachers'],
                publishDate: this.currentDate,
                isPublished: true,
                viewedBy: [],
            },
        ];

        for (const announcement of announcements) {
            await databaseService.create<Announcement>('announcements', announcement);
        }
    }

    private async createCalendarEvents() {
        const events: Omit<CalendarEvent, 'id'>[] = [
            {
                schoolId: this.schoolId,
                title: 'Parent-Teacher Conference',
                description: 'Individual meetings with teachers about student progress',
                type: 'meeting',
                startDate: '2026-09-20',
                startTime: '09:00',
                endTime: '12:00',
                targetAudience: ['all_parents'],
                createdBy: 'admin',
                isActive: true,
            },
            {
                schoolId: this.schoolId,
                title: 'School Holiday - Heritage Day',
                description: 'School closed for Heritage Day celebration',
                type: 'holiday',
                startDate: '2026-09-24',
                targetAudience: ['all_parents', 'all_teachers'],
                createdBy: 'admin',
                isActive: true,
            },
            {
                schoolId: this.schoolId,
                title: 'Science Fair',
                description: 'Annual science project exhibition',
                type: 'event',
                startDate: '2026-10-05',
                startTime: '10:00',
                endTime: '15:00',
                location: 'School Hall',
                targetAudience: ['all_parents'],
                createdBy: 'admin',
                isActive: true,
            },
        ];

        for (const event of events) {
            await databaseService.create<CalendarEvent>('calendarEvents', event);
        }
    }

    private async createNotifications(parentUserId: string, teacherUserId: string, students: Student[]) {
        const notifications: Omit<Notification, 'id'>[] = [
            {
                schoolId: this.schoolId,
                recipientId: parentUserId,
                recipientType: 'parent',
                title: 'Quiz Result Published',
                message: `${students[0]?.firstName} scored 17/20 in Algebra Quiz 1`,
                type: 'assessment',
                data: {
                    studentId: students[0]?.id,
                    assessmentType: 'quiz',
                },
                isRead: false,
                priority: 'medium',
            },
            {
                schoolId: this.schoolId,
                recipientId: parentUserId,
                recipientType: 'parent',
                title: 'New Teacher Feedback',
                message: 'Ms. Johnson left positive feedback about your child',
                type: 'feedback',
                data: {
                    studentId: students[0]?.id,
                    teacherId: teacherUserId,
                },
                isRead: false,
                priority: 'low',
            },
            {
                schoolId: this.schoolId,
                recipientId: parentUserId,
                recipientType: 'parent',
                title: 'Parent-Teacher Conference',
                message: 'New school announcement posted',
                type: 'announcement',
                isRead: true,
                priority: 'medium',
            },
        ];

        for (const notification of notifications) {
            await databaseService.create<Notification>('notifications', notification);
        }
    }
}

export const seedService = new SeedService();