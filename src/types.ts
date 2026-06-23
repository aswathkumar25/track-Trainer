export type Role = 'admin' | 'trainer' | 'student';

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
  email: string;
  photo?: string;
}

export type StudentStatus = 'active' | 'archived' | 'pending';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  batchId: string;
  status: StudentStatus;
  photo?: string;
  notes?: string;
  documents?: { name: string; date: string; url?: string }[];
}

export type TrainerStatus = 'active' | 'inactive';

export interface Trainer {
  id: string;
  trainerId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  assignedBatches: string[]; // batchIds
  status: TrainerStatus;
  photo?: string;
}

export type BatchStatus = 'active' | 'completed' | 'archived';

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  trainerId: string;
  studentCount?: number;
  attendancePercentage?: number;
  startDate: string;
  endDate: string;
  status: BatchStatus;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'holiday';

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface Attendance {
  id: string; // e.g., batchId_date
  date: string; // YYYY-MM-DD
  batchId: string;
  trainerId: string;
  remarks?: string;
  time: string; // HH:MM
  records: AttendanceRecord[];
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: 'national' | 'festival' | 'institutional' | 'other';
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string; // hex or tailwind name e.g., 'indigo', 'blue', 'violet'
  instituteName: string;
  instituteLogo?: string;
  attendanceTiming: string; // e.g., "09:00 AM"
  workingDays: number[]; // 0-6 (0 is Sunday, etc.)
  holidayList: Holiday[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string; // ISO string
  read: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string; // ISO string
  details: string;
}

export interface Backup {
  id: string;
  filename: string;
  date: string;
  size: string;
}
