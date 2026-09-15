// Indera V1 Mock Data
// This file provides realistic demo data for all screens

export interface Child {
  id: string;
  name: string;
  grade: string;
  avatar: string; // initials for now
  overallAverage: number;
  attendanceRate: number;
  subjects: Subject[];
  attendance: AttendanceRecord[];
  feedback: FeedbackEntry[];
  recentActivity: ActivityItem[];
  behaviorReports: BehaviorReport[];
  healthRecords: HealthRecord[];
  authorizedPickups: AuthorizedPickup[];
}

export interface BehaviorReport {
  id: string;
  date: string;
  type: 'positive' | 'neutral' | 'concern';
  category: 'academic' | 'social' | 'behavior' | 'participation';
  description: string;
  teacher: string;
  rating: number; // 1-5 scale
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'medication' | 'injury' | 'illness' | 'allergy';
  description: string;
  actionTaken?: string;
  parentNotified: boolean;
}

export interface AuthorizedPickup {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  idNumber: string;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  currentPercentage: number;
  assessments: Assessment[];
  color: string;
}

export interface Assessment {
  id: string;
  name: string;
  type: 'Quiz' | 'Test' | 'Exam' | 'Practical' | 'Assignment';
  date: string;
  score: number;
  maxScore: number;
  feedback?: string;
  teacher: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
}

export interface FeedbackEntry {
  id: string;
  teacher: string;
  subject: string;
  date: string;
  content: string;
  type: 'positive' | 'observation' | 'concern';
}

export interface ActivityItem {
  id: string;
  type: 'assessment' | 'attendance' | 'feedback' | 'assignment' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  childName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'event' | 'notice' | 'exam' | 'general';
  isNew: boolean;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'assessment' | 'attendance' | 'feedback' | 'announcement' | 'assignment';
  isRead: boolean;
  childName?: string;
}

// ─── Mock Children ─────────────────────────────────

const mathAssessments: Assessment[] = [
  { id: 'a1', name: 'Algebra Quiz 1', type: 'Quiz', date: '2026-09-10', score: 17, maxScore: 20, teacher: 'Mrs. Johnson', feedback: 'Great improvement in solving equations. Keep up the practice!' },
  { id: 'a2', name: 'Geometry Test', type: 'Test', date: '2026-09-03', score: 42, maxScore: 50, teacher: 'Mrs. Johnson', feedback: 'Strong understanding of angles. Work on proofs.' },
  { id: 'a3', name: 'Number Theory Quiz', type: 'Quiz', date: '2026-08-25', score: 14, maxScore: 20, teacher: 'Mrs. Johnson' },
  { id: 'a4', name: 'Mid-Term Exam', type: 'Exam', date: '2026-08-15', score: 68, maxScore: 100, teacher: 'Mrs. Johnson', feedback: 'Solid foundation but needs more practice with word problems.' },
];

const scienceAssessments: Assessment[] = [
  { id: 'a5', name: 'Chemistry Lab Report', type: 'Practical', date: '2026-09-09', score: 23, maxScore: 25, teacher: 'Mr. Nkosi' },
  { id: 'a6', name: 'Physics Quiz', type: 'Quiz', date: '2026-09-01', score: 15, maxScore: 20, teacher: 'Mr. Nkosi', feedback: 'Excellent understanding of forces and motion.' },
  { id: 'a7', name: 'Biology Test', type: 'Test', date: '2026-08-20', score: 38, maxScore: 50, teacher: 'Mr. Nkosi' },
];

const englishAssessments: Assessment[] = [
  { id: 'a8', name: 'Essay Writing', type: 'Assignment', date: '2026-09-08', score: 35, maxScore: 40, teacher: 'Ms. Dlamini', feedback: 'Beautiful use of language. Work on paragraph transitions.' },
  { id: 'a9', name: 'Grammar Test', type: 'Test', date: '2026-08-28', score: 40, maxScore: 50, teacher: 'Ms. Dlamini' },
  { id: 'a10', name: 'Comprehension Quiz', type: 'Quiz', date: '2026-08-18', score: 18, maxScore: 20, teacher: 'Ms. Dlamini' },
];

const historyAssessments: Assessment[] = [
  { id: 'a11', name: 'World War II Essay', type: 'Assignment', date: '2026-09-07', score: 28, maxScore: 40, teacher: 'Mr. Botha', feedback: 'Good research but needs stronger argumentation.' },
  { id: 'a12', name: 'Chapter 3 Quiz', type: 'Quiz', date: '2026-08-26', score: 16, maxScore: 20, teacher: 'Mr. Botha' },
];

const artAssessments: Assessment[] = [
  { id: 'a13', name: 'Portfolio Review', type: 'Practical', date: '2026-09-05', score: 45, maxScore: 50, teacher: 'Ms. Van Wyk', feedback: 'Outstanding creativity and technique. One of the best in class.' },
];

const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: ('present' | 'absent' | 'late' | 'excused')[] = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'late', 'present', 'absent', 'present', 'present', 'present', 'excused', 'present', 'present', 'present', 'present', 'present'];

  for (let i = 0; i < 20; i++) {
    const date = new Date(2026, 8, 14 - i); // September going backwards
    if (date.getDay() === 0 || date.getDay() === 6) continue; // skip weekends
    records.push({
      id: `att-${i}`,
      date: date.toISOString().split('T')[0],
      status: statuses[i % statuses.length],
      note: statuses[i % statuses.length] === 'absent' ? 'Flu - parent notified' :
        statuses[i % statuses.length] === 'late' ? 'Arrived 15 minutes late' :
          statuses[i % statuses.length] === 'excused' ? 'Family event' : undefined,
    });
  }
  return records;
};

export const mockChildren: Child[] = [
  {
    id: 'c1',
    name: 'Amahle Mbeki',
    grade: 'Grade 8A',
    avatar: 'AM',
    overallAverage: 78,
    attendanceRate: 94,
    subjects: [
      { id: 's1', name: 'Mathematics', teacher: 'Mrs. Johnson', currentPercentage: 78, assessments: mathAssessments, color: '#3B82F6' },
      { id: 's2', name: 'Natural Sciences', teacher: 'Mr. Nkosi', currentPercentage: 85, assessments: scienceAssessments, color: '#10B981' },
      { id: 's3', name: 'English', teacher: 'Ms. Dlamini', currentPercentage: 82, assessments: englishAssessments, color: '#8B5CF6' },
      { id: 's4', name: 'History', teacher: 'Mr. Botha', currentPercentage: 70, assessments: historyAssessments, color: '#F59E0B' },
      { id: 's5', name: 'Art', teacher: 'Ms. Van Wyk', currentPercentage: 90, assessments: artAssessments, color: '#EC4899' },
    ],
    attendance: generateAttendance(),
    feedback: [
      { id: 'f1', teacher: 'Mrs. Johnson', subject: 'Mathematics', date: '2026-09-12', content: 'Amahle has shown remarkable improvement in algebra this term. She is participating more actively in class discussions and helping other students.', type: 'positive' },
      { id: 'f2', teacher: 'Mr. Nkosi', subject: 'Natural Sciences', date: '2026-09-09', content: 'Consistently excellent lab work. Amahle demonstrates careful observation and thorough documentation of experiments.', type: 'positive' },
      { id: 'f3', teacher: 'Mr. Botha', subject: 'History', date: '2026-09-05', content: 'Amahle needs to work on supporting her arguments with more specific historical evidence. Recommend additional reading on source analysis.', type: 'observation' },
    ],
    recentActivity: [
      { id: 'ra1', type: 'assessment', title: 'Algebra Quiz 1 graded', description: 'Mathematics — 17/20 (85%)', timestamp: '2 hours ago' },
      { id: 'ra2', type: 'feedback', title: 'New feedback from Mrs. Johnson', description: 'Mathematics — Positive observation', timestamp: '5 hours ago' },
      { id: 'ra3', type: 'attendance', title: 'Attendance recorded', description: 'Present — Full day', timestamp: 'Today, 8:05 AM' },
      { id: 'ra4', type: 'assessment', title: 'Chemistry Lab Report graded', description: 'Natural Sciences — 23/25 (92%)', timestamp: 'Yesterday' },
      { id: 'ra5', type: 'assignment', title: 'New assignment posted', description: 'English — Book Report due Sep 20', timestamp: 'Yesterday' },
    ],
    behaviorReports: [
      { id: 'br1', date: '2026-09-14', type: 'positive', category: 'social', description: 'Helped a new student feel welcome during break time', teacher: 'Ms. Dlamini', rating: 5 },
      { id: 'br2', date: '2026-09-13', type: 'positive', category: 'academic', description: 'Excellent participation in group discussion', teacher: 'Mrs. Johnson', rating: 4 },
      { id: 'br3', date: '2026-09-12', type: 'neutral', category: 'behavior', description: 'Had lunch and played well with friends', teacher: 'Mrs. Johnson', rating: 3 },
    ],
    healthRecords: [
      { id: 'hr1', date: '2026-09-10', type: 'medication', description: 'Administered inhaler for mild asthma during PE', actionTaken: 'Rested for 10 minutes', parentNotified: true },
    ],
    authorizedPickups: [
      { id: 'ap1', name: 'Nomsa Mbeki', relationship: 'Mother', phone: '+27 82 123 4567', idNumber: '7901234567089', isActive: true },
      { id: 'ap2', name: 'Mandla Mbeki', relationship: 'Father', phone: '+27 83 987 6543', idNumber: '7801234567089', isActive: true },
      { id: 'ap3', name: 'Grace Mbeki', relationship: 'Grandmother', phone: '+27 84 555 1234', idNumber: '5501234567089', isActive: true },
    ],
  },
  {
    id: 'c2',
    name: 'Thabo Mbeki',
    grade: 'Grade 5B',
    avatar: 'TM',
    overallAverage: 72,
    attendanceRate: 97,
    subjects: [
      {
        id: 's6', name: 'Mathematics', teacher: 'Mrs. Pillay', currentPercentage: 68, assessments: [
          { id: 'a14', name: 'Fractions Test', type: 'Test', date: '2026-09-11', score: 32, maxScore: 50, teacher: 'Mrs. Pillay', feedback: 'Needs more practice with mixed fractions.' },
          { id: 'a15', name: 'Mental Math Quiz', type: 'Quiz', date: '2026-09-04', score: 14, maxScore: 20, teacher: 'Mrs. Pillay' },
        ], color: '#3B82F6'
      },
      {
        id: 's7', name: 'English', teacher: 'Mr. Smith', currentPercentage: 75, assessments: [
          { id: 'a16', name: 'Spelling Test', type: 'Test', date: '2026-09-10', score: 18, maxScore: 20, teacher: 'Mr. Smith' },
          { id: 'a17', name: 'Reading Comprehension', type: 'Quiz', date: '2026-09-02', score: 35, maxScore: 50, teacher: 'Mr. Smith', feedback: 'Good effort. Encourage more reading at home.' },
        ], color: '#8B5CF6'
      },
      {
        id: 's8', name: 'Life Skills', teacher: 'Ms. Moyo', currentPercentage: 80, assessments: [
          { id: 'a18', name: 'Group Project', type: 'Practical', date: '2026-09-08', score: 40, maxScore: 50, teacher: 'Ms. Moyo', feedback: 'Thabo was a great team leader.' },
        ], color: '#10B981'
      },
    ],
    attendance: generateAttendance(),
    feedback: [
      { id: 'f4', teacher: 'Mrs. Pillay', subject: 'Mathematics', date: '2026-09-11', content: 'Thabo is a hard worker but struggles with fractions. I recommend extra practice at home with visual aids.', type: 'concern' },
      { id: 'f5', teacher: 'Ms. Moyo', subject: 'Life Skills', date: '2026-09-08', content: 'Thabo showed excellent leadership during the group project. He encouraged quieter students to contribute.', type: 'positive' },
    ],
    recentActivity: [
      { id: 'ra6', type: 'assessment', title: 'Fractions Test graded', description: 'Mathematics — 32/50 (64%)', timestamp: '3 hours ago' },
      { id: 'ra7', type: 'feedback', title: 'New feedback from Mrs. Pillay', description: 'Mathematics — Area of concern', timestamp: '3 hours ago' },
      { id: 'ra8', type: 'attendance', title: 'Attendance recorded', description: 'Present — Full day', timestamp: 'Today, 7:55 AM' },
    ],
    behaviorReports: [
      { id: 'br6', date: '2026-09-14', type: 'positive', category: 'social', description: 'Shared toys with classmates during break', teacher: 'Mr. Smith', rating: 4 },
      { id: 'br7', date: '2026-09-13', type: 'neutral', category: 'behavior', description: 'Followed instructions well during class', teacher: 'Mrs. Pillay', rating: 3 },
    ],
    healthRecords: [
      { id: 'hr3', date: '2026-09-12', type: 'illness', description: 'Complained of stomach ache after lunch', actionTaken: 'Rested in sick bay', parentNotified: true },
    ],
    authorizedPickups: [
      { id: 'ap5', name: 'Nomsa Mbeki', relationship: 'Mother', phone: '+27 82 123 4567', idNumber: '7901234567089', isActive: true },
      { id: 'ap6', name: 'Mandla Mbeki', relationship: 'Father', phone: '+27 83 987 6543', idNumber: '7801234567089', isActive: true },
    ],
  },
];

// ─── Mock Announcements ────────────────────────────

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Parent-Teacher Meeting',
    content: 'Dear Parents,\n\nWe invite you to our quarterly Parent-Teacher Meeting scheduled for Saturday, September 20th from 9:00 AM to 12:00 PM.\n\nPlease make arrangements to attend as we will be discussing your child\'s academic progress and upcoming activities.\n\nLight refreshments will be served.',
    date: '2026-09-13',
    category: 'event',
    isNew: true,
  },
  {
    id: 'ann2',
    title: 'Mid-Term Examination Schedule',
    content: 'The mid-term examinations will commence on October 1st and end on October 10th. Detailed timetables have been sent to class teachers. Please ensure your child is well-prepared.',
    date: '2026-09-12',
    category: 'exam',
    isNew: true,
  },
  {
    id: 'ann3',
    title: 'School Closure — Heritage Day',
    content: 'Please note that the school will be closed on Thursday, September 24th in observance of Heritage Day. Classes will resume on Friday, September 25th.',
    date: '2026-09-10',
    category: 'notice',
    isNew: false,
  },
  {
    id: 'ann4',
    title: 'Annual Sports Day',
    content: 'Our Annual Sports Day will be held on Saturday, October 15th. All students are encouraged to participate. Parents are welcome to attend and support their children.',
    date: '2026-09-08',
    category: 'event',
    isNew: false,
  },
  {
    id: 'ann5',
    title: 'Library Book Return Reminder',
    content: 'All library books must be returned by September 30th for the end-of-term inventory. Lost books will be charged at replacement cost.',
    date: '2026-09-05',
    category: 'general',
    isNew: false,
  },
];

// ─── Mock Notifications ────────────────────────────

export const mockNotifications: NotificationData[] = [
  { id: 'n1', title: 'Quiz Result Published', message: 'Amahle scored 17/20 in Algebra Quiz 1', timestamp: '2 hours ago', type: 'assessment', isRead: false, childName: 'Amahle' },
  { id: 'n2', title: 'New Teacher Feedback', message: 'Mrs. Johnson left feedback about Amahle', timestamp: '5 hours ago', type: 'feedback', isRead: false, childName: 'Amahle' },
  { id: 'n3', title: 'Test Result Published', message: 'Thabo scored 32/50 in Fractions Test', timestamp: '3 hours ago', type: 'assessment', isRead: false, childName: 'Thabo' },
  { id: 'n4', title: 'Parent-Teacher Meeting', message: 'New school announcement posted', timestamp: 'Yesterday', type: 'announcement', isRead: true },
  { id: 'n5', title: 'Assignment Due Soon', message: 'English Book Report due Sep 20', timestamp: 'Yesterday', type: 'assignment', isRead: true, childName: 'Amahle' },
  { id: 'n6', title: 'Attendance Alert', message: 'Amahle was marked late on Sep 5', timestamp: '2 days ago', type: 'attendance', isRead: true, childName: 'Amahle' },
  { id: 'n7', title: 'Exam Schedule Published', message: 'Mid-term examination dates announced', timestamp: '2 days ago', type: 'announcement', isRead: true },
  { id: 'n8', title: 'Lab Report Graded', message: 'Amahle scored 23/25 in Chemistry Lab', timestamp: '3 days ago', type: 'assessment', isRead: true, childName: 'Amahle' },
];

// ─── Parent Data ───────────────────────────────────

export const parentProfile = {
  name: 'Nomsa Mbeki',
  email: 'nomsa.mbeki@email.com',
  phone: '+27 82 123 4567',
  children: mockChildren,
};

// ─── Teacher Types & Data ──────────────────────────

export interface TeacherClass {
  id: string;
  name: string;
  grade: string;
  subject: string;
  studentCount: number;
  students: TeacherStudent[];
}

export interface TeacherStudent {
  id: string;
  name: string;
  avatar: string;
  currentGrade: number;
  attendanceStatus?: 'present' | 'absent' | 'late' | 'excused';
  recentScores: { name: string; score: number; maxScore: number }[];
}

export interface TeacherAssignment {
  id: string;
  title: string;
  className: string;
  subject: string;
  dueDate: string;
  status: 'active' | 'grading' | 'completed';
  submissionCount: number;
  totalStudents: number;
}

const grade8AStudents: TeacherStudent[] = [
  { id: 'ts1', name: 'Amahle Mbeki', avatar: 'AM', currentGrade: 78, recentScores: [{ name: 'Algebra Quiz 1', score: 17, maxScore: 20 }, { name: 'Geometry Test', score: 42, maxScore: 50 }] },
  { id: 'ts2', name: 'Sipho Ndlovu', avatar: 'SN', currentGrade: 65, recentScores: [{ name: 'Algebra Quiz 1', score: 13, maxScore: 20 }, { name: 'Geometry Test', score: 34, maxScore: 50 }] },
  { id: 'ts3', name: 'Naledi Khumalo', avatar: 'NK', currentGrade: 88, recentScores: [{ name: 'Algebra Quiz 1', score: 19, maxScore: 20 }, { name: 'Geometry Test', score: 46, maxScore: 50 }] },
  { id: 'ts4', name: 'Bongani Dube', avatar: 'BD', currentGrade: 55, recentScores: [{ name: 'Algebra Quiz 1', score: 10, maxScore: 20 }, { name: 'Geometry Test', score: 28, maxScore: 50 }] },
  { id: 'ts5', name: 'Lindiwe Zulu', avatar: 'LZ', currentGrade: 72, recentScores: [{ name: 'Algebra Quiz 1', score: 15, maxScore: 20 }, { name: 'Geometry Test', score: 38, maxScore: 50 }] },
  { id: 'ts6', name: 'Thandi Molefe', avatar: 'TM', currentGrade: 82, recentScores: [{ name: 'Algebra Quiz 1', score: 16, maxScore: 20 }, { name: 'Geometry Test', score: 44, maxScore: 50 }] },
  { id: 'ts7', name: 'Kagiso Mokoena', avatar: 'KM', currentGrade: 60, recentScores: [{ name: 'Algebra Quiz 1', score: 12, maxScore: 20 }, { name: 'Geometry Test', score: 30, maxScore: 50 }] },
];

const grade8BStudents: TeacherStudent[] = [
  { id: 'ts8', name: 'Zanele Sithole', avatar: 'ZS', currentGrade: 91, recentScores: [{ name: 'Algebra Quiz 1', score: 20, maxScore: 20 }] },
  { id: 'ts9', name: 'Mpho Maseko', avatar: 'MM', currentGrade: 73, recentScores: [{ name: 'Algebra Quiz 1', score: 14, maxScore: 20 }] },
  { id: 'ts10', name: 'Lerato Nkosi', avatar: 'LN', currentGrade: 67, recentScores: [{ name: 'Algebra Quiz 1', score: 13, maxScore: 20 }] },
  { id: 'ts11', name: 'Andile Ngcobo', avatar: 'AN', currentGrade: 80, recentScores: [{ name: 'Algebra Quiz 1', score: 17, maxScore: 20 }] },
  { id: 'ts12', name: 'Nompilo Mthembu', avatar: 'NM', currentGrade: 58, recentScores: [{ name: 'Algebra Quiz 1', score: 11, maxScore: 20 }] },
];

export const teacherClasses: TeacherClass[] = [
  { id: 'tc1', name: 'Grade 8A', grade: '8', subject: 'Mathematics', studentCount: 7, students: grade8AStudents },
  { id: 'tc2', name: 'Grade 8B', grade: '8', subject: 'Mathematics', studentCount: 5, students: grade8BStudents },
  {
    id: 'tc3', name: 'Grade 9A', grade: '9', subject: 'Mathematics', studentCount: 6, students: [
      { id: 'ts13', name: 'Refilwe Tau', avatar: 'RT', currentGrade: 75, recentScores: [] },
      { id: 'ts14', name: 'Thabiso Mahlangu', avatar: 'TH', currentGrade: 82, recentScores: [] },
      { id: 'ts15', name: 'Nomvula Cele', avatar: 'NC', currentGrade: 69, recentScores: [] },
      { id: 'ts16', name: 'Siyanda Mkhize', avatar: 'SM', currentGrade: 90, recentScores: [] },
      { id: 'ts17', name: 'Khanya Radebe', avatar: 'KR', currentGrade: 62, recentScores: [] },
      { id: 'ts18', name: 'Ayanda Zwane', avatar: 'AZ', currentGrade: 78, recentScores: [] },
    ]
  },
];

export const teacherAssignments: TeacherAssignment[] = [
  { id: 'ta1', title: 'Algebra Practice Set 3', className: 'Grade 8A', subject: 'Mathematics', dueDate: '2026-09-18', status: 'active', submissionCount: 3, totalStudents: 7 },
  { id: 'ta2', title: 'Geometry Worksheet', className: 'Grade 8B', subject: 'Mathematics', dueDate: '2026-09-16', status: 'grading', submissionCount: 5, totalStudents: 5 },
  { id: 'ta3', title: 'Trigonometry Intro', className: 'Grade 9A', subject: 'Mathematics', dueDate: '2026-09-20', status: 'active', submissionCount: 1, totalStudents: 6 },
  { id: 'ta4', title: 'Number Patterns Homework', className: 'Grade 8A', subject: 'Mathematics', dueDate: '2026-09-10', status: 'completed', submissionCount: 7, totalStudents: 7 },
];

export const teacherProfile = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@school.edu',
  phone: '+27 83 456 7890',
  subject: 'Mathematics',
  classCount: 3,
  studentCount: 18,
};

export const teacherRecentActivity: ActivityItem[] = [
  { id: 'tra1', type: 'assessment', title: 'Published Algebra Quiz 1', description: 'Grade 8A — 7 results entered', timestamp: '2 hours ago' },
  { id: 'tra2', type: 'attendance', title: 'Recorded attendance', description: 'Grade 8A — All present', timestamp: 'Today, 8:10 AM' },
  { id: 'tra3', type: 'feedback', title: 'Gave feedback to Amahle', description: 'Mathematics — Positive observation', timestamp: '5 hours ago' },
  { id: 'tra4', type: 'assignment', title: 'Posted Algebra Practice Set 3', description: 'Grade 8A — Due Sep 18', timestamp: 'Yesterday' },
  { id: 'tra5', type: 'assessment', title: 'Published Geometry Test', description: 'Grade 8A — 7 results entered', timestamp: '2 days ago' },
];

// ─── Admin Types & Data ────────────────────────────

export interface AdminTeacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subjects: string[];
  classCount: number;
}

export interface AdminStudent {
  id: string;
  name: string;
  avatar: string;
  className: string;
  parentLinked: boolean;
  parentName?: string;
}

export interface AdminParent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  childrenCount: number;
  childrenNames: string[];
}

export interface AdminClass {
  id: string;
  name: string;
  grade: string;
  teacherName: string;
  studentCount: number;
  subjects: string[];
}

export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export const adminTeachers: AdminTeacher[] = [
  { id: 'at1', name: 'Sarah Johnson', email: 'sarah.johnson@school.edu', avatar: 'SJ', subjects: ['Mathematics'], classCount: 3 },
  { id: 'at2', name: 'David Nkosi', email: 'david.nkosi@school.edu', avatar: 'DN', subjects: ['Natural Sciences'], classCount: 2 },
  { id: 'at3', name: 'Grace Dlamini', email: 'grace.dlamini@school.edu', avatar: 'GD', subjects: ['English'], classCount: 4 },
  { id: 'at4', name: 'Johan Botha', email: 'johan.botha@school.edu', avatar: 'JB', subjects: ['History', 'Geography'], classCount: 3 },
  { id: 'at5', name: 'Ayesha Pillay', email: 'ayesha.pillay@school.edu', avatar: 'AP', subjects: ['Mathematics'], classCount: 2 },
  { id: 'at6', name: 'Lisa Van Wyk', email: 'lisa.vanwyk@school.edu', avatar: 'LV', subjects: ['Art', 'Life Skills'], classCount: 5 },
  { id: 'at7', name: 'James Smith', email: 'james.smith@school.edu', avatar: 'JS', subjects: ['English'], classCount: 3 },
  { id: 'at8', name: 'Nomsa Moyo', email: 'nomsa.moyo@school.edu', avatar: 'NM', subjects: ['Life Skills'], classCount: 2 },
];

export const adminStudents: AdminStudent[] = [
  { id: 'as1', name: 'Amahle Mbeki', avatar: 'AM', className: 'Grade 8A', parentLinked: true, parentName: 'Nomsa Mbeki' },
  { id: 'as2', name: 'Sipho Ndlovu', avatar: 'SN', className: 'Grade 8A', parentLinked: true, parentName: 'David Ndlovu' },
  { id: 'as3', name: 'Naledi Khumalo', avatar: 'NK', className: 'Grade 8A', parentLinked: true, parentName: 'Thandi Khumalo' },
  { id: 'as4', name: 'Bongani Dube', avatar: 'BD', className: 'Grade 8A', parentLinked: false },
  { id: 'as5', name: 'Lindiwe Zulu', avatar: 'LZ', className: 'Grade 8A', parentLinked: true, parentName: 'Maria Zulu' },
  { id: 'as6', name: 'Thabo Mbeki', avatar: 'TM', className: 'Grade 5B', parentLinked: true, parentName: 'Nomsa Mbeki' },
  { id: 'as7', name: 'Zanele Sithole', avatar: 'ZS', className: 'Grade 8B', parentLinked: true, parentName: 'Peter Sithole' },
  { id: 'as8', name: 'Mpho Maseko', avatar: 'MM', className: 'Grade 8B', parentLinked: true, parentName: 'Joyce Maseko' },
  { id: 'as9', name: 'Refilwe Tau', avatar: 'RT', className: 'Grade 9A', parentLinked: false },
  { id: 'as10', name: 'Thabiso Mahlangu', avatar: 'TH', className: 'Grade 9A', parentLinked: true, parentName: 'Sizwe Mahlangu' },
];

export const adminParents: AdminParent[] = [
  { id: 'ap1', name: 'Nomsa Mbeki', email: 'nomsa.mbeki@email.com', avatar: 'NM', childrenCount: 2, childrenNames: ['Amahle Mbeki', 'Thabo Mbeki'] },
  { id: 'ap2', name: 'David Ndlovu', email: 'david.ndlovu@email.com', avatar: 'DN', childrenCount: 1, childrenNames: ['Sipho Ndlovu'] },
  { id: 'ap3', name: 'Thandi Khumalo', email: 'thandi.khumalo@email.com', avatar: 'TK', childrenCount: 1, childrenNames: ['Naledi Khumalo'] },
  { id: 'ap4', name: 'Maria Zulu', email: 'maria.zulu@email.com', avatar: 'MZ', childrenCount: 1, childrenNames: ['Lindiwe Zulu'] },
  { id: 'ap5', name: 'Peter Sithole', email: 'peter.sithole@email.com', avatar: 'PS', childrenCount: 1, childrenNames: ['Zanele Sithole'] },
  { id: 'ap6', name: 'Joyce Maseko', email: 'joyce.maseko@email.com', avatar: 'JM', childrenCount: 1, childrenNames: ['Mpho Maseko'] },
];

export const adminClasses: AdminClass[] = [
  { id: 'ac1', name: 'Grade 5B', grade: '5', teacherName: 'Mrs. Pillay', studentCount: 28, subjects: ['Mathematics', 'English', 'Life Skills'] },
  { id: 'ac2', name: 'Grade 8A', grade: '8', teacherName: 'Mrs. Johnson', studentCount: 32, subjects: ['Mathematics', 'Natural Sciences', 'English', 'History', 'Art'] },
  { id: 'ac3', name: 'Grade 8B', grade: '8', teacherName: 'Mr. Nkosi', studentCount: 30, subjects: ['Mathematics', 'Natural Sciences', 'English', 'History', 'Art'] },
  { id: 'ac4', name: 'Grade 9A', grade: '9', teacherName: 'Mrs. Johnson', studentCount: 29, subjects: ['Mathematics', 'Natural Sciences', 'English', 'Geography', 'Art'] },
  { id: 'ac5', name: 'Grade 9B', grade: '9', teacherName: 'Mrs. Dlamini', studentCount: 31, subjects: ['Mathematics', 'Natural Sciences', 'English', 'Geography', 'Art'] },
];

export const academicTerms: AcademicTerm[] = [
  { id: 'term1', name: 'Term 1', startDate: '2026-01-15', endDate: '2026-03-27', isCurrent: false },
  { id: 'term2', name: 'Term 2', startDate: '2026-04-14', endDate: '2026-06-26', isCurrent: false },
  { id: 'term3', name: 'Term 3', startDate: '2026-07-21', endDate: '2026-09-26', isCurrent: true },
  { id: 'term4', name: 'Term 4', startDate: '2026-10-13', endDate: '2026-12-11', isCurrent: false },
];

export const adminSubjects = [
  { id: 'sub1', name: 'Mathematics', teachers: ['Sarah Johnson', 'Ayesha Pillay'], classCount: 5 },
  { id: 'sub2', name: 'Natural Sciences', teachers: ['David Nkosi'], classCount: 2 },
  { id: 'sub3', name: 'English', teachers: ['Grace Dlamini', 'James Smith'], classCount: 7 },
  { id: 'sub4', name: 'History', teachers: ['Johan Botha'], classCount: 3 },
  { id: 'sub5', name: 'Geography', teachers: ['Johan Botha'], classCount: 2 },
  { id: 'sub6', name: 'Art', teachers: ['Lisa Van Wyk'], classCount: 5 },
  { id: 'sub7', name: 'Life Skills', teachers: ['Lisa Van Wyk', 'Nomsa Moyo'], classCount: 7 },
];

export const adminProfile = {
  name: 'Principal Mokoena',
  email: 'admin@oakridgeschool.edu',
  role: 'School Administrator',
  schoolName: 'Oakridge Academy',
  schoolAddress: '42 Education Drive, Johannesburg',
  schoolPhone: '+27 11 234 5678',
  totalStudents: 450,
  totalTeachers: 28,
  totalClasses: 15,
  totalParents: 380,
};

