import { useState, useCallback, useEffect } from 'react';
import { where } from 'firebase/firestore';
import { databaseService } from '../services/databaseService';
import { Teacher, Student, Class, Subject, Parent, Announcement } from '../services/models';

export interface AdminData {
    teachers: Teacher[];
    students: Student[];
    classes: Class[];
    subjects: Subject[];
    parents: Parent[];
    announcements: Announcement[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export const useAdminData = (schoolId: string | undefined): AdminData => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [parents, setParents] = useState<Parent[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!schoolId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const [teacherList, studentList, classList, subjectList, parentList, announcementList] = await Promise.all([
                databaseService.list<Teacher>('teachers', [where('schoolId', '==', schoolId)]),
                databaseService.list<Student>('students', [where('schoolId', '==', schoolId)]),
                databaseService.list<Class>('classes', [where('schoolId', '==', schoolId)]),
                databaseService.list<Subject>('subjects', [where('schoolId', '==', schoolId)]),
                databaseService.list<Parent>('parents', [where('schoolId', '==', schoolId)]),
                databaseService.list<Announcement>('announcements', [where('schoolId', '==', schoolId)]),
            ]);

            setTeachers(teacherList.filter(t => t.isActive));
            setStudents(studentList.filter(s => s.isActive));
            setClasses(classList.filter(c => c.isActive));
            setSubjects(subjectList.filter(s => s.isActive));
            setParents(parentList.filter(p => p.isActive));
            setAnnouncements(announcementList);
        } catch (e: any) {
            console.error('Error loading admin data:', e);
            setError(e.message || 'Failed to load admin data');
        } finally {
            setIsLoading(false);
        }
    }, [schoolId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        teachers,
        students,
        classes,
        subjects,
        parents,
        announcements,
        isLoading,
        error,
        refresh,
    };
};