import { 
  User, Student, Trainer, Batch, Course, Attendance, Holiday, Settings, Notification, ActivityLog, Backup 
} from '../types';

// Helper for initial mock dates
const getPastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const INITIAL_COURSES: Course[] = [
  { id: 'c1', name: 'Full Stack Web Development', description: 'React, Node.js, Express, and databases.', duration: '24 Weeks' },
  { id: 'c2', name: 'Mobile Application Development', description: 'React Native, iOS, and Android development.', duration: '16 Weeks' },
  { id: 'c3', name: 'UI/UX Design Masterclass', description: 'Product design, typography, Figma, and user research.', duration: '12 Weeks' },
  { id: 'c4', name: 'Data Science & Applied AI', description: 'Python, machine learning, and prompt engineering.', duration: '20 Weeks' },
];

const INITIAL_TRAINERS: Trainer[] = [
  { id: 't1', trainerId: 'TR-2026-001', name: 'Alex Rivera', email: 'alex.rivera@inst.edu', phone: '+1 (555) 342-9980', specialization: 'Full Stack & Web Architecture', assignedBatches: ['b1', 'b4'], status: 'active' },
  { id: 't2', trainerId: 'TR-2026-002', name: 'Sarah Jenkins', email: 'sarah.j@inst.edu', phone: '+1 (555) 781-4433', specialization: 'Mobile Apps (React Native & Swift)', assignedBatches: ['b2'], status: 'active' },
  { id: 't3', trainerId: 'TR-2026-003', name: 'Michael Chen', email: 'm.chen@inst.edu', phone: '+1 (555) 676-1211', specialization: 'UI/UX & Interactive Prototyping', assignedBatches: ['b3'], status: 'active' },
];

const INITIAL_BATCHES: Batch[] = [
  { id: 'b1', name: 'FullStack Cohort 12', courseId: 'c1', trainerId: 't1', startDate: getPastDate(45), endDate: getPastDate(-120), status: 'active', studentCount: 6, attendancePercentage: 92 },
  { id: 'b2', name: 'React Native Summer', courseId: 'c2', trainerId: 't2', startDate: getPastDate(30), endDate: getPastDate(-50), status: 'active', studentCount: 5, attendancePercentage: 88 },
  { id: 'b3', name: 'UI/UX Design Evening', courseId: 'c3', trainerId: 't3', startDate: getPastDate(15), endDate: getPastDate(-60), status: 'active', studentCount: 5, attendancePercentage: 95 },
  { id: 'b4', name: 'Applied AI Weekend', courseId: 'c4', trainerId: 't1', startDate: getPastDate(5), endDate: getPastDate(-135), status: 'active', studentCount: 4, attendancePercentage: 85 },
];

const INITIAL_STUDENTS: Student[] = [
  // FullStack Cohort 12 (b1)
  { id: 's1', studentId: 'STU-26-001', name: 'Emma Watson', email: 'emma.w@gmail.com', phone: '+1 (555) 102-3940', batchId: 'b1', status: 'active', notes: 'Very active in discussions. Strong javascript skills.' },
  { id: 's2', studentId: 'STU-26-002', name: 'John Doe', email: 'john.doe@gmail.com', phone: '+1 (555) 203-4951', batchId: 'b1', status: 'active', notes: 'Prefers UI styling work.' },
  { id: 's3', studentId: 'STU-26-003', name: 'Sophia Loren', email: 'sophia.l@gmail.com', phone: '+1 (555) 304-5962', batchId: 'b1', status: 'active', notes: 'Needs extra assistance with database relations.' },
  { id: 's4', studentId: 'STU-26-004', name: 'David Miller', email: 'david.m@gmail.com', phone: '+1 (555) 405-6973', batchId: 'b1', status: 'active', notes: 'Self-taught learner, fast pacing.' },
  { id: 's5', studentId: 'STU-26-005', name: 'Clara Oswald', email: 'clara.o@gmail.com', phone: '+1 (555) 506-7984', batchId: 'b1', status: 'active', notes: 'Excellent teamwork and communication.' },
  { id: 's6', studentId: 'STU-26-006', name: 'Ethan Hunt', email: 'ethan.h@gmail.com', phone: '+1 (555) 607-8995', batchId: 'b1', status: 'active', notes: 'Prefers working independently.' },

  // React Native Summer (b2)
  { id: 's7', studentId: 'STU-26-007', name: 'Bruce Wayne', email: 'bruce.w@gmail.com', phone: '+1 (555) 708-9006', batchId: 'b2', status: 'active', notes: 'Exceptional attention to detail. Fast coder.' },
  { id: 's8', studentId: 'STU-26-008', name: 'Selina Kyle', email: 'selina.k@gmail.com', phone: '+1 (555) 809-0117', batchId: 'b2', status: 'active', notes: 'Strong problem solving, occasionally late.' },
  { id: 's9', studentId: 'STU-26-009', name: 'Oliver Queen', email: 'oliver.q@gmail.com', phone: '+1 (555) 910-1228', batchId: 'b2', status: 'active', notes: 'Struggles slightly with native device modules.' },
  { id: 's10', studentId: 'STU-26-010', name: 'Barry Allen', email: 'barry.a@gmail.com', phone: '+1 (555) 121-2339', batchId: 'b2', status: 'active', notes: 'Extremely fast progress, eager to learn animations.' },
  { id: 's11', studentId: 'STU-26-011', name: 'Diana Prince', email: 'diana.p@gmail.com', phone: '+1 (555) 232-3440', batchId: 'b2', status: 'active', notes: 'Leadership quality. Helps other peers.' },

  // UI/UX Design Evening (b3)
  { id: 's12', studentId: 'STU-26-012', name: 'Luke Skywalker', email: 'luke.s@gmail.com', phone: '+1 (555) 343-4551', batchId: 'b3', status: 'active', notes: 'Great visualization skill. Master of layout systems.' },
  { id: 's13', studentId: 'STU-26-013', name: 'Leia Organa', email: 'leia.o@gmail.com', phone: '+1 (555) 454-5662', batchId: 'b3', status: 'active', notes: 'Exceptional visual polish. Strong presentation skills.' },
  { id: 's14', studentId: 'STU-26-014', name: 'Han Solo', email: 'han.solo@gmail.com', phone: '+1 (555) 565-6773', batchId: 'b3', status: 'active', notes: 'Practical design focused. Good with wireframing.' },
  { id: 's15', studentId: 'STU-26-015', name: 'Tony Stark', email: 'tony.stark@gmail.com', phone: '+1 (555) 676-7884', batchId: 'b3', status: 'active', notes: 'Advanced user researcher. Highly innovative.' },
  { id: 's16', studentId: 'STU-26-016', name: 'Peter Parker', email: 'peter.p@gmail.com', phone: '+1 (555) 787-8995', batchId: 'b3', status: 'active', notes: 'A bit quiet, but design works are stellar.' },

  // Applied AI Weekend (b4)
  { id: 's17', studentId: 'STU-26-017', name: 'Clark Kent', email: 'clark.k@gmail.com', phone: '+1 (555) 898-9006', batchId: 'b4', status: 'active', notes: 'Focuses on model fine-tuning and embeddings.' },
  { id: 's18', studentId: 'STU-26-018', name: 'Lois Lane', email: 'lois.l@gmail.com', phone: '+1 (555) 909-0117', batchId: 'b4', status: 'active', notes: 'Focuses on AI ethics, content summarization.' },
  { id: 's19', studentId: 'STU-26-019', name: 'Arthur Curry', email: 'arthur.c@gmail.com', phone: '+1 (555) 111-2222', batchId: 'b4', status: 'active', notes: 'Needs guidance on linear algebra concepts.' },
  { id: 's20', studentId: 'STU-26-020', name: 'Wanda Maximoff', email: 'wanda.m@gmail.com', phone: '+1 (555) 222-3333', batchId: 'b4', status: 'active', notes: 'Very intuitive prompt styling master.' },
];

const INITIAL_HOLIDAYS: Holiday[] = [
  { id: 'h1', date: getPastDate(10), name: 'Independence Day', type: 'national' },
  { id: 'h2', date: '2026-07-04', name: 'National Holiday', type: 'national' },
  { id: 'h3', date: '2026-12-25', name: 'Christmas Day', type: 'festival' },
  { id: 'h4', date: '2026-11-26', name: 'Thanksgiving', type: 'national' },
];

const INITIAL_SETTINGS: Settings = {
  theme: 'dark',
  accentColor: 'indigo',
  instituteName: 'Alpha Tech Academy',
  attendanceTiming: '09:00 AM',
  workingDays: [1, 2, 3, 4, 5], // Mon to Fri
  holidayList: INITIAL_HOLIDAYS,
};

const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin', role: 'admin', name: 'System Administrator', email: 'admin@alpha.edu' },
  { id: 'u2', username: 'alex', role: 'trainer', name: 'Alex Rivera', email: 'alex.rivera@inst.edu' },
  { id: 'u3', username: 'emma', role: 'student', name: 'Emma Watson', email: 'emma.w@gmail.com' },
];

// Seed actual historical logs for past occurrences
const generateHistoricalSessions = (): Attendance[] => {
  const attendances: Attendance[] = [];
  // For each batch, generate past weeks of attendance logs (e.g. 5 days)
  const batchMapping: Record<string, string[]> = {
    b1: ['s1', 's2', 's3', 's4', 's5', 's6'],
    b2: ['s7', 's8', 's9', 's10', 's11'],
    b3: ['s12', 's13', 's14', 's15', 's16'],
    b4: ['s17', 's18', 's19', 's20'],
  };

  const trainersMap: Record<string, string> = {
    b1: 't1', b2: 't2', b3: 't3', b4: 't1'
  };

  // Generate for past 5 business days
  let count = 0;
  for (let i = 1; i <= 8; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
    
    const dateStr = d.toISOString().split('T')[0];
    
    Object.keys(batchMapping).forEach(batchId => {
      const studentIds = batchMapping[batchId];
      const trainerId = trainersMap[batchId];
      
      const records = studentIds.map((studentId, idx) => {
        // High percentage of present. Let there be some absentees, lates, leaves
        let status: 'present' | 'absent' | 'late' | 'leave' = 'present';
        const rand = (idx + i) % 15;
        if (rand === 0) status = 'absent';
        else if (rand === 5) status = 'late';
        else if (rand === 11) status = 'leave';

        return {
          studentId,
          status,
          remarks: status !== 'present' ? `Historical logging note (${status})` : '',
        };
      });

      attendances.push({
        id: `${batchId}_${dateStr}`,
        date: dateStr,
        batchId,
        trainerId,
        time: '09:15 AM',
        remarks: `Standard session attendance session ${++count}`,
        records,
      });
    });
  }

  return attendances;
};

const INITIAL_ATTENDANCE: Attendance[] = generateHistoricalSessions();

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'System Initialized', message: 'Offline-first database successfully bootstrapped in the user browser storage container.', type: 'success', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 'n2', title: 'Welcome to Alpha Tech Academy', message: 'You have been logged into the active session attendance tracker framework.', type: 'info', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
  { id: 'n3', title: 'Pending Attendance Alert', message: 'FullStack Cohort 12 attendance verification has not been signed off for today.', type: 'warning', timestamp: new Date().toISOString(), read: false },
];

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'l1', action: 'BOOTSTRAP', userId: 'u1', userName: 'System Administrator', userRole: 'admin', timestamp: new Date(Date.now() - 10800000).toISOString(), details: 'Database memory structures was auto-seeded with 4 courses, 3 trainers, 4 active learning batches, and 20 students.' },
  { id: 'l2', action: 'LOGIN', userId: 'u1', userName: 'System Administrator', userRole: 'admin', timestamp: new Date().toISOString(), details: 'Successfully logged in to trainer console environment.' },
];

/**
 * Robust Client DB Class that uses localStorage with dynamic JSON parsers.
 * This guarantees 100% security context compliance inside nested iframes.
 */
class ClientDB {
  private memoryCache: Record<string, any> = {};

  constructor() {
    this.init();
  }

  private init() {
    this.ensureCollection('courses', INITIAL_COURSES);
    this.ensureCollection('trainers', INITIAL_TRAINERS);
    this.ensureCollection('batches', INITIAL_BATCHES);
    this.ensureCollection('students', INITIAL_STUDENTS);
    this.ensureCollection('holidays', INITIAL_HOLIDAYS);
    this.ensureCollection('settings', INITIAL_SETTINGS);
    this.ensureCollection('users', INITIAL_USERS);
    this.ensureCollection('attendance', INITIAL_ATTENDANCE);
    this.ensureCollection('notifications', INITIAL_NOTIFICATIONS);
    this.ensureCollection('activityLogs', INITIAL_ACTIVITY_LOGS);
    this.ensureCollection('backups', [] as Backup[]);
  }

  private ensureCollection<T>(key: string, defaultVal: T) {
    const fullKey = `attendance_db_${key}`;
    try {
      const existing = localStorage.getItem(fullKey);
      if (!existing) {
        localStorage.setItem(fullKey, JSON.stringify(defaultVal));
        this.memoryCache[key] = defaultVal;
      } else {
        this.memoryCache[key] = JSON.parse(existing);
      }
    } catch (e) {
      console.warn(`Local Storage write failed for key: ${key}. Using in-memory fallback.`, e);
      this.memoryCache[key] = defaultVal;
    }
  }

  private save(key: string) {
    const fullKey = `attendance_db_${key}`;
    try {
      localStorage.setItem(fullKey, JSON.stringify(this.memoryCache[key]));
    } catch (e) {
      console.error(`Failed to lock sync store to LocalStorage: ${key}`, e);
    }
  }

  // --- Generic Store Implementations ---
  
  public getAll<T>(collection: string): T[] {
    const val = this.memoryCache[collection] || [];
    return Array.isArray(val) ? (val as T[]) : [val] as unknown as T[];
  }

  public get<T>(collection: string, id: string): T | null {
    const items = this.getAll<any>(collection);
    return items.find(item => item.id === id) || null;
  }

  public set(collection: string, value: any) {
    this.memoryCache[collection] = value;
    this.save(collection);
  }

  public add<T extends { id: string }>(collection: string, item: T): T {
    const list = this.getAll<any>(collection);
    list.unshift(item); // insert at start
    this.memoryCache[collection] = list;
    this.save(collection);
    this.logActivity(`ADDED_${collection.toUpperCase()}`, `Added item with id: ${item.id}`);
    return item;
  }

  public update<T extends { id: string }>(collection: string, item: T): T | null {
    const list = this.getAll<any>(collection);
    const index = list.findIndex(x => x.id === item.id);
    if (index !== -1) {
      list[index] = { ...list[index], ...item };
      this.memoryCache[collection] = list;
      this.save(collection);
      this.logActivity(`UPDATE_${collection.toUpperCase()}`, `Updated item parameters: ${item.id}`);
      return list[index] as T;
    }
    return null;
  }

  public delete(collection: string, id: string): boolean {
    const list = this.getAll<any>(collection);
    const index = list.findIndex(x => x.id === id);
    if (index !== -1) {
      list.splice(index, 1);
      this.memoryCache[collection] = list;
      this.save(collection);
      this.logActivity(`DELETE_${collection.toUpperCase()}`, `Removed item reference: ${id}`);
      return true;
    }
    return false;
  }

  public clearAll() {
    localStorage.clear();
    this.memoryCache = {};
    this.init();
    this.logActivity('RESET_DATABASE', 'The native IndexedDB / browser storage engine has been reformatted to defaults.');
  }

  public importDump(dump: any): boolean {
    try {
      if (!dump || typeof dump !== 'object') return false;
      Object.keys(dump).forEach(storeKey => {
        const fullKey = `attendance_db_${storeKey}`;
        localStorage.setItem(fullKey, JSON.stringify(dump[storeKey]));
        this.memoryCache[storeKey] = dump[storeKey];
      });
      this.logActivity('RESTORE_DATABASE', 'System state restore operation was completed from external dump files.');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public exportDump(): string {
    const dump: Record<string, any> = {};
    const stores = ['courses', 'trainers', 'batches', 'students', 'holidays', 'settings', 'users', 'attendance', 'notifications', 'activityLogs'];
    stores.forEach(s => {
      dump[s] = this.getAll(s);
    });
    return JSON.stringify(dump, null, 2);
  }

  // Activity Log helper
  public logActivity(action: string, details: string) {
    const log: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      action,
      userId: 'u1',
      userName: 'Current Operator',
      userRole: 'admin',
      timestamp: new Date().toISOString(),
      details
    };
    const list = this.memoryCache['activityLogs'] || [];
    list.unshift(log);
    // keep max 100 logs
    if (list.length > 100) list.pop();
    this.memoryCache['activityLogs'] = list;
    this.save('activityLogs');
  }

  public createNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    const list = this.memoryCache['notifications'] || [];
    list.unshift(notification);
    if (list.length > 50) list.pop();
    this.memoryCache['notifications'] = list;
    this.save('notifications');
  }
}

export const db = new ClientDB();
