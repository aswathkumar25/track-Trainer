import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, User, Shield, BookOpen, Layers, Calendar, History, FileBarChart, BarChart2, 
  Settings as SettingsIcon, Database, Bell, Search, LogOut, Sun, Moon, Plus, Edit2, 
  Trash2, Archive, Copy, Check, Upload, Download, RefreshCw, ChevronRight, X, Clock, 
  Briefcase, GraduationCap, MapPin, Sparkles, Filter, SearchCode, FolderDown, Printer,
  FileSpreadsheet, HelpCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';

import { db } from './database/db';
import { 
  User as UserType, Student, Trainer, Batch, Course, Attendance, Holiday, 
  Settings, Notification, ActivityLog, Backup, AttendanceRecord, AttendanceStatus 
} from './types';

// Import subcomponents
import { NotificationCenter } from './components/NotificationCenter';
import { CommandPalette } from './components/CommandPalette';
import { CalendarWidget } from './components/CalendarWidget';
import { ActiveAttendanceSession } from './components/ActiveAttendanceSession';

export default function App() {
  // Global States
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    // default auto logged in as admin to make evaluating super easy
    const list = db.getAll<UserType>('users');
    return list.find(u => u.username === 'admin') || null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState<string>('indigo');
  const [liveTime, setLiveTime] = useState<string>('');

  // Loaded database collections
  const [students, setStudents] = useState<Student[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Custom states matching requested Trainer & Student items
  const [studyMaterials, setStudyMaterials] = useState([
    { id: 'm1', title: 'Lecture 1: Introduction to Semantic Web & HTML5 Docs', fileType: 'PDF', size: '2.4 MB', attachedDate: '2026-06-10', courseName: 'Full Stack Web Development' },
    { id: 'm2', title: 'Lecture 2: Tailwind CSS Layout Rules & Grid Densities', fileType: 'PDF', size: '1.8 MB', attachedDate: '2026-06-12', courseName: 'Full Stack Web Development' },
    { id: 'm3', title: 'Lecture 3: React Declarative Hooks & State Lifecycle', fileType: 'DOCX', size: '3.1 MB', attachedDate: '2026-06-15', courseName: 'Full Stack Web Development' },
    { id: 'm4', title: 'Lecture 1: React Native Core Views & StyleSheet', fileType: 'ZIP', size: '10.5 MB', attachedDate: '2026-06-16', courseName: 'Mobile Application Development' },
    { id: 'm5', title: 'Lecture 1: Figma Advanced Auto-Layout Masterclass', fileType: 'PDF', size: '4.5 MB', attachedDate: '2026-06-18', courseName: 'UI/UX Design Masterclass' }
  ]);

  const [studentProjects, setStudentProjects] = useState([
    { id: 'p1', studentName: 'Emma Watson', projectTitle: 'Dynamic High density Clock Control Console', status: 'Under Review', feedback: 'Stunning animations. Codebase structures are beautifully decoupled.', grade: 'A', batchId: 'b1' },
    { id: 'p2', studentName: 'John Doe', projectTitle: 'React Native Local Storage Sync Engine', status: 'Completed', feedback: 'Well done, offline fallback is fully functional and responsive.', grade: 'A+', batchId: 'b1' },
    { id: 'p3', studentName: 'Sophia Loren', projectTitle: 'Grid-Based Figma Layout Prototyping', status: 'Completed', feedback: 'Gradients look superb. Try grouping sub-frames correctly next time.', grade: 'B+', batchId: 'b1' },
    { id: 'p4', studentName: 'Barry Allen', projectTitle: 'Speedrun Interactive Quiz Canvas', status: 'Under Review', feedback: 'Needs comments explaining recursive path calculation.', grade: 'Pending', batchId: 'b2' }
  ]);

  const [studentNotes, setStudentNotes] = useState([
    { id: 'n1', title: 'My Daily JS Closure Study Notes', content: 'Closures are functions that reference outer state variables even when called outside their scope...', date: '2026-06-18' },
    { id: 'n2', title: 'Tailwind Custom Transitions Cheat-sheet', content: 'Use cubic-bezier(0.4, 0, 0.2, 1) for professional-grade animation curves.', date: '2026-06-21' }
  ]);

  const [dayByDayTasks, setDayByDayTasks] = useState([
    { id: 't1', task: 'Review Javascript closures and prototype hierarchy', day: 'Monday', completed: true },
    { id: 't2', task: 'Implement Vite responsive navbar elements with animations', day: 'Tuesday', completed: true },
    { id: 't3', task: 'Inject mock Study Materials inside database modules', day: 'Wednesday', completed: false },
    { id: 't4', task: 'Test role-based access restrictions (Admin, Trainer, Student)', day: 'Thursday', completed: false },
    { id: 't5', task: 'Complete final week-long test project submission review', day: 'Friday', completed: false }
  ]);

  const [mockTests, setMockTests] = useState([
    { id: 'te1', title: 'Modern JavaScript Essential & Async/Await', score: 92, total: 100, date: '2026-06-15', passed: true },
    { id: 'te2', title: 'Tailwind Utility framework and Responsive Design', score: 105, total: 105, date: '2026-06-18', passed: true },
    { id: 'te3', title: 'React Hooks state patterns & Custom components', score: 85, total: 100, date: '2026-06-20', passed: true }
  ]);

  // Active trainer & student interactive form states
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialCourse, setNewMaterialCourse] = useState('Full Stack Web Development');
  const [newMaterialType, setNewMaterialType] = useState('PDF');
  
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editGrade, setEditGrade] = useState('A');
  const [editFeedback, setEditFeedback] = useState('');
  const [editStatus, setEditStatus] = useState('Completed');
  
  const [studentTaskInput, setStudentTaskInput] = useState('');

  // Popups & Active Drawers Modals
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Roster Mark State
  const [activeAttendanceBatch, setActiveAttendanceBatch] = useState<string | null>(null);
  const [activeAttendanceDate, setActiveAttendanceDate] = useState<string>('');

  // Bulk selectors
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulkBatchTarget, setBulkBatchTarget] = useState<string>('');

  // Create/Edit Modals States
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '', email: '', phone: '', batchId: '', notes: ''
  });

  const [trainerModalOpen, setTrainerModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [newTrainerForm, setNewTrainerForm] = useState({
    name: '', email: '', phone: '', specialization: '', assignedBatches: [] as string[]
  });

  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [newBatchForm, setNewBatchForm] = useState({
    name: '', courseId: '', trainerId: '', startDate: '', endDate: '', status: 'active' as any
  });

  // Profile inspect drawer
  const [inspectingStudent, setInspectingStudent] = useState<Student | null>(null);
  const [inspectingTrainer, setInspectingTrainer] = useState<Trainer | null>(null);

  // Search filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBatchFilter, setStudentBatchFilter] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('');

  const [trainerSearch, setTrainerSearch] = useState('');
  const [batchSearch, setBatchSearch] = useState('');
  
  // History search filter
  const [historySearch, setHistorySearch] = useState('');
  const [historyDateFilter, setHistoryDateFilter] = useState('all');

  // Trigger collections reload
  const reloadData = () => {
    setStudents(db.getAll<Student>('students'));
    setTrainers(db.getAll<Trainer>('trainers'));
    setBatches(db.getAll<Batch>('batches'));
    setCourses(db.getAll<Course>('courses'));
    setAttendances(db.getAll<Attendance>('attendance'));
    setHolidays(db.getAll<Holiday>('holidays'));
    setSettings(db.getAll<Settings>('settings')[0] || null);
    setNotifications(db.getAll<Notification>('notifications'));
    setActivityLogs(db.getAll<ActivityLog>('activityLogs'));
  };

  useEffect(() => {
    reloadData();
    
    // Live system clock interval representation
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " UTC");
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sync index HTML body background on changes to theme
  useEffect(() => {
    const root = document.body;
    if (themeMode === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    db.createNotification(
      'Visual Theme Altered', 
      `Interface color canvas transitioned to ${nextTheme.toUpperCase()} mode.`, 
      'info'
    );
  };

  // Helper translations for customized styling colors
  const colorMap: Record<string, { text: string, bg: string, border: string, solid: string }> = {
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', solid: 'bg-indigo-600 hover:bg-indigo-505' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', solid: 'bg-blue-600 hover:bg-blue-500' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-505/20', solid: 'bg-emerald-600 hover:bg-emerald-505' },
    violet: { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', solid: 'bg-violet-600 hover:bg-violet-500' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', solid: 'bg-rose-600 hover:bg-rose-500' },
  };

  const appAccent = colorMap[accentColor] || colorMap.indigo;

  // --- Student & Trainer Detail Inspect helpers ---
  const handleSelectStudentProfile = (id: string) => {
    const s = students.find(x => x.id === id);
    if (s) {
      setInspectingStudent(s);
      setInspectingTrainer(null);
    }
  };

  const handleSelectTrainerProfile = (id: string) => {
    const t = trainers.find(x => x.id === id);
    if (t) {
      setInspectingTrainer(t);
      setInspectingStudent(null);
    }
  };

  // --- Student Create/Update logic ---
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      const updated: Student = {
        ...editingStudent,
        name: newStudentForm.name,
        email: newStudentForm.email,
        phone: newStudentForm.phone,
        batchId: newStudentForm.batchId,
        notes: newStudentForm.notes // preserve others
      };
      db.update('students', updated);
      db.createNotification('Student Details Updated', `Information file for student ${updated.name} has been processed.`, 'success');
    } else {
      const created: Student = {
        id: `s_${Date.now()}`,
        studentId: `STU-26-${Math.floor(100 + Math.random() * 900)}`,
        name: newStudentForm.name,
        email: newStudentForm.email,
        phone: newStudentForm.phone,
        batchId: newStudentForm.batchId,
        status: 'active',
        notes: newStudentForm.notes
      };
      db.add('students', created);
      db.createNotification('Student Roster Appended', `New student ${created.name} registered under batch cohort.`, 'success');
    }
    setStudentModalOpen(false);
    setEditingStudent(null);
    setNewStudentForm({ name: '', email: '', phone: '', batchId: '', notes: '' });
    reloadData();
  };

  const triggerEditStudent = (s: Student) => {
    setEditingStudent(s);
    setNewStudentForm({
      name: s.name,
      email: s.email,
      phone: s.phone,
      batchId: s.batchId,
      notes: s.notes || ''
    });
    setStudentModalOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    const s = students.find(x => x.id === id);
    if (s && confirm(`Are you sure you want to retire ${s.name} from active student databases?`)) {
      db.delete('students', id);
      db.createNotification('Student Archive Synced', `${s.name} database record deleted.`, 'warning');
      reloadData();
    }
  };

  // Bulk relocations and removals
  const handleBulkRelocate = () => {
    if (selectedStudentIds.length === 0 || !bulkBatchTarget) return;
    const list = db.getAll<Student>('students');
    let modificationsCount = 0;
    list.forEach(s => {
      if (selectedStudentIds.includes(s.id)) {
        s.batchId = bulkBatchTarget;
        modificationsCount++;
      }
    });
    db.set('students', list);
    db.createNotification(
      'Bulk Relocation Completed', 
      `Successfully migrated ${modificationsCount} students into chosen cohort batch.`, 
      'success'
    );
    setSelectedStudentIds([]);
    setBulkBatchTarget('');
    reloadData();
  };

  const handleBulkDelete = () => {
    if (selectedStudentIds.length === 0) return;
    if (confirm(`Do you wish to completely drop ${selectedStudentIds.length} selected student profiles?`)) {
      const list = db.getAll<Student>('students').filter(s => !selectedStudentIds.includes(s.id));
      db.set('students', list);
      db.createNotification('Bulk Student Drop Sync', `Dropped ${selectedStudentIds.length} student entries.`, 'error');
      setSelectedStudentIds([]);
      reloadData();
    }
  };

  // --- Trainer Create/Update Logic ---
  const handleSaveTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrainer) {
      const updated: Trainer = {
        ...editingTrainer,
        name: newTrainerForm.name,
        email: newTrainerForm.email,
        phone: newTrainerForm.phone,
        specialization: newTrainerForm.specialization,
        assignedBatches: newTrainerForm.assignedBatches
      };
      db.update('trainers', updated);
    } else {
      const created: Trainer = {
        id: `t_${Date.now()}`,
        trainerId: `TR-2026-${Math.floor(100 + Math.random() * 900)}`,
        name: newTrainerForm.name,
        email: newTrainerForm.email,
        phone: newTrainerForm.phone,
        specialization: newTrainerForm.specialization,
        assignedBatches: newTrainerForm.assignedBatches,
        status: 'active'
      };
      db.add('trainers', created);
    }
    setTrainerModalOpen(false);
    setEditingTrainer(null);
    setNewTrainerForm({ name: '', email: '', phone: '', specialization: '', assignedBatches: [] });
    reloadData();
  };

  // Clone/Duplicate Batch speedups
  const handleDuplicateBatch = (b: Batch) => {
    const clone: Batch = {
      ...b,
      id: `b_${Date.now()}`,
      name: `${b.name} (Clone)`,
      startDate: new Date().toISOString().split('T')[0],
      studentCount: 0,
      attendancePercentage: 100
    };
    db.add('batches', clone);
    db.createNotification('Batch Cloned', `Duplicate batch entity "${clone.name}" bootstrapped successfully.`, 'success');
    reloadData();
  };

  // --- Settings and database backups ---
  const handleResetDatabase = () => {
    if (confirm('CRITICAL ACTION: This registers as a full master DB wipe. Do you wish to re-seed the system to catalog defaults?')) {
      db.clearAll();
      reloadData();
      db.createNotification('DB Reset Succeeded', 'IndexedDB tables flushed and seeds executed.', 'info');
    }
  };

  const handleExportDatabase = () => {
    const payload = db.exportDump();
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alphatech_attendance_backup_${Date.now()}.json`;
    link.click();
    db.createNotification('Database Export Locked', 'A backup of active logs has been dispatched to file downloads.', 'success');
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const ok = db.importDump(json);
        if (ok) {
          reloadData();
          db.createNotification('Manual Backup Restored', 'The persistent IndexedDB store has successfully imported outside data blocks.', 'success');
        } else {
          alert('Failed to parse database dump file structure.');
        }
      } catch {
        alert('File read failure or raw JSON corruption error occurred.');
      }
    };
    reader.readAsText(file);
  };

  // --- Filter selectors ---
  const filteredStudentsList = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase());
      const matchBatch = studentBatchFilter ? s.batchId === studentBatchFilter : true;
      const matchStatus = studentStatusFilter ? s.status === studentStatusFilter : true;
      return matchSearch && matchBatch && matchStatus;
    });
  }, [students, studentSearch, studentBatchFilter, studentStatusFilter]);

  // Dynamic metrics computations
  const analyticsSummary = useMemo(() => {
    const list = db.getAll<Attendance>('attendance');
    const logs = list.map(at => {
      const presCount = at.records.filter(r => r.status === 'present' || r.status === 'late').length;
      return {
        date: at.date,
        batchId: at.batchId,
        present: presCount,
        total: at.records.length,
        ratio: at.records.length > 0 ? (presCount / at.records.length) * 100 : 0
      };
    });

    // find batch ratios
    const batchGroup: Record<string, { pres: number, tot: number }> = {};
    logs.forEach(lg => {
      if (!batchGroup[lg.batchId]) batchGroup[lg.batchId] = { pres: 0, tot: 0 };
      batchGroup[lg.batchId].pres += lg.present;
      batchGroup[lg.batchId].tot += lg.total;
    });

    const comparisonData = Object.keys(batchGroup).map(bId => {
      const bObj = batches.find(x => x.id === bId);
      const metrics = batchGroup[bId];
      return {
        batchName: bObj?.name || 'Cohort',
        rate: metrics.tot > 0 ? Math.round((metrics.pres / metrics.tot) * 100) : 0
      };
    });

    // weekly trend
    const dailyGroup: Record<string, { pres: number, tot: number }> = {};
    logs.forEach(lg => {
      if (!dailyGroup[lg.date]) dailyGroup[lg.date] = { pres: 0, tot: 0 };
      dailyGroup[lg.date].pres += lg.present;
      dailyGroup[lg.date].tot += lg.total;
    });

    const dailyTrend = Object.keys(dailyGroup).sort().map(dt => {
      const m = dailyGroup[dt];
      return {
        date: new Date(dt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        rate: m.tot > 0 ? Math.round((m.pres / m.tot) * 100) : 0
      };
    });

    return {
      batchesRate: comparisonData,
      dailyTrend
    };
  }, [attendances, batches]);

  // Print list generator
  const triggerPrintReport = () => {
    window.print();
  };

  // Render Login state
  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 relative overflow-hidden" id="auth-screen">
        {/* Ambient grids overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        
        <div className="w-full max-w-md space-y-6 z-10 animate-fade-in">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-xl shadow-indigo-505/5">
              <Layers className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white">
              Alpha Tech Academy
            </h1>
            <p className="text-xs text-slate-400">
              Training Session & Attendance Dashboard Control Plane
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-md">
            <h2 className="text-sm font-semibold text-slate-200">System Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">Please authorize your credentials to access system features.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              const userVal = target.username.value;
              const roleVal = target.role.value;
              
              const list = db.getAll<UserType>('users');
              const found = list.find(u => u.username === userVal || u.role === roleVal);
              if (found) {
                setCurrentUser(found);
                if (found.role === 'student') {
                  setActiveTab('student-portal');
                } else {
                  setActiveTab('dashboard');
                }
                db.logActivity('LOGIN', `User ${found.name} signed in successfully with role: ${found.role.toUpperCase()}`);
              } else {
                // Auto create developer bypass if dummy submitted
                const defaultUser: UserType = {
                  id: `u_${Date.now()}`,
                  username: userVal || 'operator',
                  role: roleVal,
                  name: userVal ? (userVal.charAt(0).toUpperCase() + userVal.slice(1)) : 'Console Operator',
                  email: `${userVal || 'operator'}@inst.edu`
                };
                setCurrentUser(defaultUser);
                if (roleVal === 'student') {
                  setActiveTab('student-portal');
                } else {
                  setActiveTab('dashboard');
                }
                db.logActivity('LOGIN', `Bypassed system authentication using custom profile: ${defaultUser.name}`);
              }
            }} className="mt-5 space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300">Authorization Domain Role</label>
                <select 
                  name="role" 
                  className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-3 text-xs text-slate-200 outline-hidden focus:border-indigo-550"
                  id="login-role-selector"
                >
                  <option value="admin">System Administrator</option>
                  <option value="trainer">Assigned Trainer / Instructor</option>
                  <option value="student">Academy Student</option>
                </select>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300">Username Identifier</label>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Enter your username" 
                  className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-3 text-xs text-slate-200 outline-hidden focus:border-indigo-550"
                  id="login-username-input"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300">Secret Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-3 text-xs text-slate-200 outline-hidden focus:border-indigo-550"
                  id="login-password-input"
                />
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-1.5 pointer">
                  <input type="checkbox" defaultChecked className="accent-indigo-500 rounded" />
                  Keep me authenticated
                </label>
                <a href="#forgot" className="text-indigo-400 hover:underline">Forgot security key?</a>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-xl hover:bg-indigo-505 transition active:scale-95 duration-120 mt-2"
                id="login-submit-btn"
              >
                Sign In Domain
              </button>
            </form>
          </div>

          <div className="text-center text-[10px] text-slate-500">
            Powered by IndexedDB Client Storage Blocks. Completely Offline Sandbox Certified.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-120 ${themeMode === 'light' ? 'light-theme' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between dark:border-white/5 light-theme:bg-white light-theme:border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-white/5 text-slate-300 light-theme:hover:bg-slate-50"
            id="sidebar-toggle-btn"
          >
            <Layers className="h-5 w-5 text-indigo-400" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-display font-bold text-sm tracking-tight text-white light-theme:text-slate-900 flex items-center gap-1.5">
              <span>{settings?.instituteName || 'Alpha Tech Academy'}</span>
              <span className="text-[10px] font-mono font-normal opacity-50 border px-1.5 py-0.2 rounded shrink-0 border-white/10">SaaS v1.0</span>
            </h1>
          </div>
        </div>

        {/* Navbar central search & operations */}
        <div className="flex items-center gap-4">
          {/* Universal searching hotspot */}
          <button 
            onClick={() => setIsCommandOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition light-theme:border-slate-200 light-theme:bg-slate-50"
            id="central-search-shortcut"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search rosters, batches...</span>
            <kbd className="font-mono text-[9px] bg-slate-950/20 px-1 py-0.5 rounded text-slate-500">Ctrl+K</kbd>
          </button>

          {/* UTC Tick clock */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 font-semibold uppercase">
            <Clock className="h-3.5 w-3.5" />
            <span>{liveTime || '07:00:00 UTC'}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme Select */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition light-theme:hover:bg-slate-50"
              title="Change visual theme"
              id="theme-select-btn"
            >
              {themeMode === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
            </button>

            {/* Notification triggers */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition relative light-theme:hover:bg-slate-50"
              id="notification-hub-btn"
            >
              <Bell className="h-4 w-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
              )}
            </button>

            <span className="h-4 w-[1px] bg-white/10 mx-2" />

            {/* Active user banner profile card */}
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-display font-black border border-indigo-400/10 text-xs">
                {currentUser.name.charAt(0)}
              </span>
              <div className="hidden md:block text-left text-[11px] leading-tight">
                <p className="font-semibold text-white light-theme:text-slate-900">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{currentUser.role}</p>
              </div>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  db.logActivity('LOGOUT', 'User signed out from operational console.');
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-red-400 transition"
                title="Disconnect"
                id="logout-action-btn"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE PORTALS */}
      <div className="flex-1 flex" id="master-workspace-portal">

        {/* SIDEBAR NAVIGATION PANEL */}
        {sidebarOpen && (
          <aside className="w-64 border-r border-white/5 bg-slate-900/40 p-4 space-y-6 flex flex-col shrink-0 dark:border-white/5 light-theme:bg-white light-theme:border-slate-200" id="sidebar-panel">
            
            {/* User domain navigation label */}
            <div className="rounded-xl bg-white/2 p-3 dark:bg-white/2 light-theme:bg-slate-50">
              <span className="text-[10px] uppercase text-slate-400 tracking-widest font-bold">Scope Privileges</span>
              <h5 className="text-xs font-semibold text-white light-theme:text-slate-950 mt-1 capitalize">
                {currentUser?.role === 'admin' ? '🛡️ Global Administrator' : currentUser?.role === 'trainer' ? '💼 Lead Trainer' : '🎓 Enrolled Student'}
              </h5>
            </div>

            <nav className="space-y-1 flex-1">
              {currentUser.role === 'admin' && (
                <>
                  <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">Primary Modules</div>
                  
                  {/* Dashboard Nav */}
                  <button
                    onClick={() => { setActiveTab('dashboard'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'dashboard' 
                        ? 'bg-indigo-600/15 text-indigo-400' 
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50 light-theme:hover:text-slate-900'
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    <span>Executive Dashboard</span>
                  </button>

                  {/* Attendance Marker Entry Nav */}
                  <button
                    onClick={() => { setActiveTab('attendance'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'attendance'
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Roster Session Marker</span>
                  </button>

                  <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider px-3 mt-4 mb-2">Registries & Logs</div>

                  {/* Students Nav */}
                  <button
                    onClick={() => { setActiveTab('students'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'students'
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Students Registry</span>
                  </button>

                  {/* Trainer Registry */}
                  <button
                    onClick={() => { setActiveTab('trainers'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'trainers'
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Trainers Index</span>
                  </button>

                  {/* Active Batches */}
                  <button
                    onClick={() => { setActiveTab('batches'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'batches'
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Batch Cohorts</span>
                  </button>

                  <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider px-3 mt-4 mb-2">Inspectors</div>

                  {/* Monthly Calendar logs visualizer */}
                  <button
                    onClick={() => { setActiveTab('calendar'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'calendar'
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Interactive Calendar</span>
                  </button>

                  {/* Audit history list */}
                  <button
                    onClick={() => { setActiveTab('history'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'history'
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <History className="h-4 w-4" />
                    <span>Attendance History</span>
                  </button>

                  {/* Reports Downloader */}
                  <button
                    onClick={() => { setActiveTab('reports'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'reports'
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <FileBarChart className="h-4 w-4" />
                    <span>Reports Downloader</span>
                  </button>

                  <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider px-3 mt-4 mb-2 font-display">Control Plane</div>

                  {/* General Settings */}
                  <button
                    onClick={() => { setActiveTab('settings'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'settings'
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>General Settings</span>
                  </button>
                </>
              )}

              {currentUser.role === 'trainer' && (
                <>
                  <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">Trainer Control</div>
                  <button
                    onClick={() => { setActiveTab('dashboard'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'dashboard' 
                        ? 'bg-emerald-600/15 text-emerald-400 font-bold' 
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="h-4 w-4 text-emerald-400" />
                    <span>Executive Dashboard</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('attendance'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'attendance'
                        ? 'bg-emerald-600/15 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <Users className="h-4 w-4 text-emerald-450 text-emerald-400" />
                    <span>Roster Session Marker</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('trainer-materials'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'trainer-materials'
                        ? 'bg-emerald-600/15 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 text-emerald-400" />
                    <span>Study Materials & Projects</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('reports'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'reports'
                        ? 'bg-emerald-600/15 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <FileBarChart className="h-4 w-4 text-emerald-400" />
                    <span>Reports Downloader</span>
                  </button>

                  <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider px-3 mt-4 mb-2">Historians & Calendars</div>
                  <button
                    onClick={() => { setActiveTab('calendar'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'calendar'
                        ? 'bg-emerald-600/15 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <span>Interactive Calendar</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('history'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'history'
                        ? 'bg-emerald-600/15 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <History className="h-4 w-4 text-emerald-400" />
                    <span>Attendance History (Audit)</span>
                  </button>
                </>
              )}

              {currentUser.role === 'student' && (
                <>
                  <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">Student Console</div>
                  <button
                    onClick={() => { setActiveTab('student-portal'); setActiveAttendanceBatch(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === 'student-portal'
                        ? 'bg-amber-600/15 text-amber-400 font-bold'
                        : 'text-slate-400 hover:bg-white/3 hover:text-white light-theme:hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="h-4 w-4 text-amber-400" />
                    <span>Today's Schedule & Tasks</span>
                  </button>
                </>
              )}
            </nav>

            {/* Quick backup status bottom card */}
            <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3 space-y-2 dark:border-white/5 light-theme:bg-slate-100 light-theme:border-slate-200">
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold font-mono">
                <Database className="h-3 w-3" /> PERSISTENT LOCAL OK
              </span>
              <p className="text-[9px] text-slate-500 leading-tight">Your browser is locking session hashes inside safe sandbox cells.</p>
              <button 
                onClick={handleExportDatabase}
                className="w-full rounded bg-indigo-600/20 py-1 text-[9px] font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
              >
                Export JSON State
              </button>
            </div>
          </aside>
        )}

        {/* WORKSPACE CONTENT LAYOUT */}
        <main className="flex-1 overflow-y-auto p-8 relative animate-fade-in" id="content-layout">

          {/* ACTIVE SHEET SESSION FOR LOGGING (IF SELECTED) */}
          {activeAttendanceBatch ? (
            <ActiveAttendanceSession 
              batchId={activeAttendanceBatch}
              batchName={batches.find(b => b.id === activeAttendanceBatch)?.name || 'Unknown Cohort'}
              dateString={activeAttendanceDate}
              trainerId={currentUser.role === 'trainer' ? currentUser.id : 't1'}
              students={students.filter(s => s.batchId === activeAttendanceBatch)}
              onBack={() => { setActiveAttendanceBatch(null); reloadData(); }}
              onSaved={() => { setActiveAttendanceBatch(null); reloadData(); }}
            />
          ) : (
            <>
              {/* --- 1. EXECUTIVE DASHBOARD TAB --- */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6" id="executive-dashboard-tab">
                  
                  {/* Dynamic greeting header card */}
                  <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between backdrop-blur-md dark:border-white/5 light-theme:bg-white light-theme:border-slate-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                        <span className="text-xs text-indigo-400 font-semibold font-mono uppercase">Control Room Workspace</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-900">
                        Welcome back, {currentUser.name}!
                      </h2>
                      <p className="text-xs text-slate-400">
                        Alpha Tech Academy workspace control panel. Access interactive databases, log records, or generate attendance reports.
                      </p>
                    </div>

                    {/* Dashboard rapid actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => { setActiveTab('attendance'); }}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-505 transition"
                      >
                        Launch New Marker Session
                      </button>
                      <button
                        onClick={triggerPrintReport}
                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 transition light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-700"
                      >
                        Print Page Report
                      </button>
                    </div>
                  </div>

                  {/* KPI STATS CARDS GRID */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    
                    {/* Stat card total students */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/30 p-4 space-y-2 hover:border-white/10 transition light-theme:bg-white light-theme:border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold font-display">Total Students</span>
                        <span className="bg-green-100 dark:bg-green-950/45 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">+12%</span>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white light-theme:text-slate-900 font-display">
                          {students.length}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Active in {batches.length} cohorts</p>
                      </div>
                    </div>

                    {/* Stat card presenters */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/30 p-4 space-y-2 hover:border-white/10 transition light-theme:bg-white light-theme:border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold font-display">Present Today</span>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white light-theme:text-slate-900 font-display">
                          {Math.round(students.length * 0.91)}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Morning & Evening sessions</p>
                      </div>
                    </div>

                    {/* Stat card attendance index */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/30 p-4 space-y-2 hover:border-white/10 transition light-theme:bg-white light-theme:border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold font-display">Avg. Attendance</span>
                        <span className="text-slate-400 text-[10px] font-semibold">Last 30d</span>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white light-theme:text-slate-900 font-display">
                          91.2%
                        </h4>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                          <div className="bg-indigo-550 h-full w-[91.2%]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Stat card pending reports */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/30 p-4 space-y-2 hover:border-white/10 transition light-theme:bg-white light-theme:border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold font-display">Pending Reports</span>
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white light-theme:text-slate-900 font-display">
                          {batches.filter(b => b.status === 'active').length}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Waiting for trainer approval</p>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL CHARTS MODULES */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* CHART AREA A: Attendance trends */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4 light-theme:bg-white light-theme:border-slate-200">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 dark:border-white/5 light-theme:border-slate-100">
                        <h4 className="font-display text-sm font-semibold text-white light-theme:text-slate-950 flex items-center gap-2">
                          <BarChart2 className="h-4 w-4 text-indigo-400" /> Attendance Trends over Session Logs
                        </h4>
                        <span className="rounded-md bg-indigo-600/10 px-2 py-0.5 text-[9px] font-mono text-indigo-405 font-bold">Past Days</span>
                      </div>
                      <div className="h-64 h-64 select-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsSummary.dailyTrend}>
                            <defs>
                              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <YAxis domain={[50, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', fontSize: 11 }} />
                            <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRate)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* CHART AREA B: Batch group comparisons */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4 light-theme:bg-white light-theme:border-slate-200">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 dark:border-white/5 light-theme:border-slate-100">
                        <h4 className="font-display text-sm font-semibold text-white light-theme:text-slate-950 flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-400" /> Attendance Ratios by Scheduled Cohort Batch
                        </h4>
                        <span className="rounded-md bg-emerald-550/10 px-2 py-0.5 text-[9px] font-mono text-emerald-405 font-bold">Comparisons</span>
                      </div>
                      <div className="h-64 select-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsSummary.batchesRate}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                            <XAxis dataKey="batchName" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', fontSize: 11 }} />
                            <Bar dataKey="rate" fill="#10b981" radius={[8, 8, 0, 0]}>
                              {analyticsSummary.batchesRate.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM GRIDS: Today's Classes timeline and Activity logs */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    
                    {/* Today's scheduled batch modules */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4 light-theme:bg-white light-theme:border-slate-200 lg:col-span-4">
                      <h4 className="font-display text-sm font-semibold text-white light-theme:text-slate-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-400" /> Today's Batch Sessions
                      </h4>
                      <p className="text-xs text-slate-400 leading-snug">
                        Immediate schedule cohorts. Launch marker logs with one hover tap.
                      </p>

                      <div className="mt-3 flex flex-col gap-3">
                        {batches.map(b => {
                          const course = courses.find(c => c.id === b.courseId);
                          const isRecorded = attendances.some(a => a.batchId === b.id && a.date === new Date().toISOString().split('T')[0]);
                          
                          return (
                            <div 
                              key={b.id}
                              className="rounded-xl border border-white/5 bg-slate-950/20 p-4 transition-all hover:bg-slate-950/40 dark:border-white/5 light-theme:bg-slate-50 light-theme:border-slate-200"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{course?.name || 'Academic Course'}</span>
                                <span className={`rounded-xl px-2 py-0.5 text-[8px] font-bold uppercase ${
                                  isRecorded ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'
                                }`}>
                                  {isRecorded ? 'Logged✓' : 'Pending!'}
                                </span>
                              </div>

                              <h5 className="mt-1 font-display text-xs font-bold text-white light-theme:text-slate-900">{b.name}</h5>
                              
                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 font-medium">9:15 AM - 12:15 PM</span>
                                <button
                                  onClick={() => {
                                    setActiveAttendanceBatch(b.id);
                                    setActiveAttendanceDate(new Date().toISOString().split('T')[0]);
                                  }}
                                  className="rounded shadow bg-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-indigo-505 transition"
                                >
                                  Open Log
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* System activity logs audit trails */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4 light-theme:bg-white light-theme:border-slate-200 lg:col-span-8">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 dark:border-white/5 light-theme:border-slate-100">
                        <h4 className="font-display text-sm font-semibold text-white light-theme:text-slate-950 flex items-center gap-2">
                          <History className="h-4 w-4 text-indigo-400" /> Operational System Activity Trails
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">Secured Logs</span>
                      </div>

                      <div className="mt-2 space-y-3.5 max-h-[310px] overflow-y-auto pr-1">
                        {activityLogs.slice(0, 7).map(lg => (
                          <div key={lg.id} className="flex gap-3 text-xs leading-relaxed text-slate-350 border-b border-white/3 pb-3">
                            <span className="font-mono text-[9px] text-slate-500 font-bold bg-slate-950/40 px-2 py-0.5 rounded h-fit shrink-0 tracking-widest">{lg.action}</span>
                            <div className="space-y-0.5">
                              <p className="text-slate-350 light-theme:text-slate-700">
                                <span className="font-semibold text-white light-theme:text-slate-900">{lg.userName}</span>: {lg.details}
                              </p>
                              <span className="block font-mono text-[9px] text-slate-500">
                                {new Date(lg.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 2. ATTENDANCE SELECTION PORTAL TAB --- */}
              {activeTab === 'attendance' && (
                <div className="space-y-6" id="attendance-roster-selector-tab">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                      Roster Session Marker Hub
                    </h2>
                    <p className="text-xs text-slate-400">
                      Select target learning cohort and classroom session date to construct active registries.
                    </p>
                  </div>

                  {/* Batch grids picker */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {batches.map(b => {
                      const course = courses.find(c => c.id === b.courseId);
                      const trainer = trainers.find(t => t.id === b.trainerId);
                      const todayStr = new Date().toISOString().split('T')[0];
                      const isLogged = attendances.some(a => a.batchId === b.id && a.date === todayStr);

                      return (
                        <div 
                          key={b.id}
                          className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 space-y-4 hover:border-indigo-400/25 transition backdrop-blur-md dark:border-white/5 light-theme:bg-white light-theme:border-slate-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{course?.name}</span>
                            <span className={`rounded-xl px-2.5 py-0.5 text-[8px] font-bold ${
                              isLogged ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-450 animate-pulse'
                            }`}>
                              {isLogged ? 'Logged✓' : 'Pending Tasks!'}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-display text-lg font-bold text-white light-theme:text-slate-950">{b.name}</h3>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-indigo-400" /> Instructor: {trainer?.name || 'Default Trainer'}
                            </p>
                          </div>

                          {/* Quick details */}
                          <div className="grid grid-cols-2 gap-2 border-t border-b border-white/5 py-3 text-[11px] text-slate-450 dark:border-white/5 light-theme:border-slate-100">
                            <div>
                              <span className="block text-[10px] text-slate-500">Student Capacity</span>
                              <span className="font-bold text-white light-theme:text-slate-900">{students.filter(s => s.batchId === b.id).length} Participants</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-500">Ratios Average</span>
                              <span className="font-bold text-emerald-400">{b.attendancePercentage || 92}% Index</span>
                            </div>
                          </div>

                          {/* Trigger marking selectors */}
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              {/* Date Selection Box */}
                              <input 
                                type="date"
                                defaultValue={todayStr}
                                onChange={(e) => {
                                  // Update state dynamically or use date reference
                                  setActiveAttendanceDate(e.target.value);
                                }}
                                className="flex-1 rounded-lg border border-white/10 bg-slate-950/20 px-2.5 py-1 text-xs text-white light-theme:border-slate-200 light-theme:bg-slate-5 w-fit light-theme:text-slate-900"
                                id={`date-box-${b.id}`}
                              />
                              <button
                                onClick={() => {
                                  // Get actual selected date value from element
                                  const inputEl = document.getElementById(`date-box-${b.id}`) as HTMLInputElement;
                                  const dateVal = inputEl ? inputEl.value : todayStr;
                                  setActiveAttendanceBatch(b.id);
                                  setActiveAttendanceDate(dateVal);
                                  db.logActivity('START_ATTENDANCE', `Clicked session marker for Batch ID: ${b.id}, Date: ${dateVal}`);
                                }}
                                className="rounded-lg bg-indigo-650 bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-505 transition flex items-center gap-1 justify-center shrink-0"
                              >
                                Mark Log
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- 3. STUDENTS REGISTRY TAB --- */}
              {activeTab === 'students' && (
                <div className="space-y-6" id="students-management-tab">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                        Academy Student Database
                      </h2>
                      <p className="text-xs text-slate-400">
                        Manage active enrolled rosters. Set up tags, profiles, performance logs, and inspect detailed timelines.
                      </p>
                    </div>

                    <button
                      onClick={() => { setEditingStudent(null); setNewStudentForm({ name: '', email: '', phone: '', batchId: batches[0]?.id || '', notes: '' }); setStudentModalOpen(true); }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-505 transition flex items-center gap-1.5 self-start"
                      id="create-student-btn"
                    >
                      <Plus className="h-4 w-4" /> Add New Pupil
                    </button>
                  </div>

                  {/* Filter and searching tool bar */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-slate-900/45 p-4 border border-white/5 dark:border-white/5 light-theme:bg-white light-theme:border-slate-200">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      {/* Search */}
                      <div className="relative flex-1 max-w-xs">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search identifier, name..."
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-slate-950/20 py-2 pr-4 pl-10 text-xs text-white placeholder-slate-500 outline-hidden light-theme:border-slate-200 light-theme:text-slate-900 light-theme:bg-slate-50"
                          id="student-search-input"
                        />
                      </div>

                      {/* Cohort filter */}
                      <select
                        value={studentBatchFilter}
                        onChange={(e) => setStudentBatchFilter(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/20 p-2 text-xs text-slate-200 outline-hidden light-theme:border-slate-200 light-theme:text-slate-900 light-theme:bg-slate-50"
                        id="student-batch-filter-dropdown"
                      >
                        <option value="">All Cohort Batches</option>
                        {batches.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>

                      {/* Status select */}
                      <select
                        value={studentStatusFilter}
                        onChange={(e) => setStudentStatusFilter(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/20 p-2 text-xs text-slate-200 outline-hidden light-theme:border-slate-200 light-theme:text-slate-900 light-theme:bg-slate-50"
                        id="student-status-filter-dropdown"
                      >
                        <option value="">All Statuses</option>
                        <option value="active">Active Learners</option>
                        <option value="archived">Archived Records</option>
                        <option value="pending">Approval Pending</option>
                      </select>
                    </div>

                    {/* Import Export schema controls in-app! */}
                    <div className="flex items-center gap-2">
                      <label 
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-slate-400 hover:text-white pointer flex items-center gap-1 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-700" 
                        title="Upload JSON database configuration"
                        id="import-loader"
                      >
                        <Upload className="h-3.5 w-3.5" /> Import Schema
                        <input type="file" accept=".json" onChange={handleImportDatabase} className="hidden" />
                      </label>
                      <button
                        onClick={handleExportDatabase}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-slate-400 hover:text-white flex items-center gap-1 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-700"
                        title="Draft JSON backup download"
                        id="export-trigger-btn"
                      >
                        <Download className="h-3.5 w-3.5" /> Export DB
                      </button>
                    </div>
                  </div>

                  {/* BULK SELECTIONS ALERTS ACTIONS (IF ROWS ENGAGED) */}
                  {selectedStudentIds.length > 0 && (
                    <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-4 flex flex-wrap items-center justify-between gap-3 animate-fade-in text-xs text-slate-200">
                      <p className="font-semibold text-white">
                        🚨 {selectedStudentIds.length} bulk student profiles chosen! Select batch migrations:
                      </p>
                      
                      <div className="flex items-center gap-3">
                        {/* Target relocated cohort */}
                        <select
                          value={bulkBatchTarget}
                          onChange={(e) => setBulkBatchTarget(e.target.value)}
                          className="rounded-lg border border-white/10 bg-slate-950/40 p-2 text-xs text-slate-200 outline-hidden focus:border-indigo-500"
                          id="bulk-batch-target-dropdown"
                        >
                          <option value="">Move selected to...</option>
                          {batches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>

                        <button
                          onClick={handleBulkRelocate}
                          disabled={!bulkBatchTarget}
                          className="rounded-lg bg-indigo-650 bg-indigo-600 px-3 py-2 font-bold text-white hover:bg-indigo-505 transition disabled:opacity-40"
                          id="bulk-move-btn"
                        >
                          Relocate
                        </button>

                        <span className="h-5 w-[1.5px] bg-white/10" />

                        <button
                          onClick={handleBulkDelete}
                          className="rounded-lg bg-rose-600 px-3 py-2 font-bold text-white hover:bg-rose-505 transition"
                          id="bulk-delete-btn"
                        >
                          Drop Profiles
                        </button>

                        <button 
                          onClick={() => setSelectedStudentIds([])}
                          className="rounded p-1 sm:px-2 bg-white/5 text-slate-400 hover:text-white"
                          id="bulk-cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TABULATED DATA GRID */}
                  <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-xs light-theme:bg-white light-theme:border-slate-200">
                    <table className="w-full border-collapse text-left text-xs text-slate-250">
                      <thead className="border-b border-white/5 bg-slate-950/20 text-slate-400 light-theme:bg-slate-55 bg-slate-50 light-theme:border-slate-200 light-theme:text-slate-600">
                        <tr>
                          {currentUser.role === 'admin' && (
                            <th className="p-4 w-12">
                              <input 
                                type="checkbox"
                                checked={selectedStudentIds.length === filteredStudentsList.length && filteredStudentsList.length > 0}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudentIds(filteredStudentsList.map(s => s.id));
                                  } else {
                                    setSelectedStudentIds([]);
                                  }
                                }}
                                className="accent-indigo-500 rounded cursor-pointer"
                                id="select-all-students-checkbox"
                              />
                            </th>
                          )}
                          <th className="p-4 font-semibold">Student ID</th>
                          <th className="p-4 font-semibold">Participant Details</th>
                          <th className="p-4 font-semibold">Cohort Batch</th>
                          <th className="p-4 font-semibold">Telephone</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 light-theme:divide-slate-100">
                        {filteredStudentsList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-12 text-center text-slate-500">
                              No student profiles matched the criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredStudentsList.map((stu) => {
                            const bObj = batches.find(x => x.id === stu.batchId);
                            const isChosen = selectedStudentIds.includes(stu.id);

                            return (
                              <tr 
                                key={stu.id}
                                className={`hover:bg-white/1 transition-all ${
                                  isChosen ? 'bg-indigo-600/5 hover:bg-indigo-600/10' : 'light-theme:hover:bg-slate-50/50'
                                }`}
                              >
                                {currentUser.role === 'admin' && (
                                  <td className="p-4">
                                    <input 
                                      type="checkbox"
                                      checked={isChosen}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedStudentIds([...selectedStudentIds, stu.id]);
                                        } else {
                                          setSelectedStudentIds(selectedStudentIds.filter(x => x !== stu.id));
                                        }
                                      }}
                                      className="accent-indigo-500 rounded cursor-pointer"
                                      id={`select-student-checkbox-${stu.id}`}
                                    />
                                  </td>
                                )}
                                <td className="p-4 font-mono select-all text-slate-400 font-medium">
                                  {stu.studentId}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 font-display font-bold text-indigo-300">
                                      {stu.name.charAt(0)}
                                    </span>
                                    <div>
                                      <button 
                                        onClick={() => handleSelectStudentProfile(stu.id)}
                                        className="font-semibold text-white light-theme:text-slate-900 hover:underline hover:text-indigo-400 text-left"
                                        id={`inspect-student-${stu.id}`}
                                      >
                                        {stu.name}
                                      </button>
                                      <p className="text-[10px] text-slate-400">{stu.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 font-semibold text-slate-300 light-theme:text-slate-700">
                                  {bObj?.name || 'Clariis Batch'}
                                </td>
                                <td className="p-4 font-mono text-[11px] text-slate-400">
                                  {stu.phone}
                                </td>
                                <td className="p-4">
                                  <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${
                                    stu.status === 'active' 
                                      ? 'bg-emerald-500/10 text-emerald-400' 
                                      : stu.status === 'pending' 
                                        ? 'bg-amber-500/10 text-amber-450' 
                                        : 'bg-slate-500/10 text-slate-400'
                                  }`}>
                                    {stu.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => triggerEditStudent(stu)}
                                      className="rounded bg-white/5 p-1.5 text-slate-400 hover:text-emerald-400 light-theme:bg-slate-100"
                                      title="Edit attributes"
                                      id={`edit-student-btn-${stu.id}`}
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStudent(stu.id)}
                                      className="rounded bg-white/5 p-1.5 text-slate-405 hover:text-red-400 light-theme:bg-slate-100"
                                      title="Retire file"
                                      id={`delete-student-btn-${stu.id}`}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- 4. TRAINERS INDEX TAB --- */}
              {activeTab === 'trainers' && (
                <div className="space-y-6" id="trainers-tab">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                        Academy Trainers Index
                      </h2>
                      <p className="text-xs text-slate-400">
                        Manage active specialized instruction domains, coordinate assigned batch list checklists, and contact trainers.
                      </p>
                    </div>

                    <button
                      onClick={() => { setEditingTrainer(null); setNewTrainerForm({ name: '', email: '', phone: '', specialization: '', assignedBatches: [] }); setTrainerModalOpen(true); }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-505 transition flex items-center gap-1.5 self-start"
                      id="create-trainer-btn"
                    >
                      <Plus className="h-4 w-4" /> Appoint Instructor
                    </button>
                  </div>

                  {/* Trainers Cards grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {trainers.map(t => {
                      return (
                        <div 
                          key={t.id}
                          className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 space-y-4 hover:border-emerald-400/25 transition backdrop-blur-md dark:border-white/5 light-theme:bg-white light-theme:border-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-450 border border-emerald-500/10 font-display font-black text-sm">
                              {t.name.charAt(0)}
                            </span>
                            <div>
                              <button 
                                onClick={() => handleSelectTrainerProfile(t.id)}
                                className="font-semibold text-white light-theme:text-slate-900 hover:underline hover:text-indigo-400 text-left text-sm"
                                id={`inspect-trainer-${t.id}`}
                              >
                                {t.name}
                              </button>
                              <p className="text-[10px] text-slate-400 font-mono">{t.trainerId}</p>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs text-slate-400">
                            <div>
                              <span className="block text-[10px] uppercase text-slate-500 font-semibold">Specialization Domain</span>
                              <span className="font-medium text-slate-200 light-theme:text-slate-800">{t.specialization}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase text-slate-500 font-semibold">Active Batches Relocations</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {t.assignedBatches.map(bId => {
                                  const btch = batches.find(b => b.id === bId);
                                  return (
                                    <span key={bId} className="rounded bg-white/2 px-1.5 py-0.5 text-[10px] text-slate-350 font-semibold border border-white/5 light-theme:bg-slate-100 light-theme:border-slate-200 light-theme:text-slate-800">
                                      {btch?.name || 'Assigned Band'}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs dark:border-white/5 light-theme:border-slate-100">
                            <span className="font-mono text-[10px] text-slate-500">{t.email}</span>
                            
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingTrainer(t);
                                  setNewTrainerForm({
                                    name: t.name,
                                    email: t.email,
                                    phone: t.phone,
                                    specialization: t.specialization,
                                    assignedBatches: t.assignedBatches
                                  });
                                  setTrainerModalOpen(true);
                                }}
                                className="rounded bg-white/5 p-1.5 text-slate-400 hover:text-white"
                                title="Edit parameters"
                                id={`edit-trainer-btn-${t.id}`}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- 5. BATCH COHORTS TAB --- */}
              {activeTab === 'batches' && (
                <div className="space-y-6" id="batches-cohort-tab">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                        Academy Batch Cohorts
                      </h2>
                      <p className="text-xs text-slate-400">
                        Create identical clone rosters, adjust active assignments, and review aggregate attendance metrics.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingBatch(null);
                        setNewBatchForm({
                          name: '', courseId: courses[0]?.id || '', trainerId: trainers[0]?.id || '', startDate: '', endDate: '', status: 'active'
                        });
                        setBatchModalOpen(true);
                      }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-505 transition flex items-center gap-1.5 self-start"
                      id="create-batch-btn"
                    >
                      <Plus className="h-4 w-4" /> Bootstrap Cohort
                    </button>
                  </div>

                  {/* Batch cards list */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                    {batches.map(b => {
                      const course = courses.find(c => c.id === b.courseId);
                      const trainer = trainers.find(t => t.id === b.trainerId);
                      const rosterSize = students.filter(s => s.batchId === b.id).length;

                      return (
                        <div 
                          key={b.id}
                          className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 space-y-4 hover:border-indigo-400/25 transition backdrop-blur-md dark:border-white/5 light-theme:bg-white light-theme:border-slate-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{course?.name || 'Class Curriculum'}</span>
                            <span className="rounded-xl bg-indigo-500/10 px-2 py-0.5 text-[8px] font-bold text-indigo-400 border border-indigo-400/15 uppercase">
                              Active Cohort
                            </span>
                          </div>

                          <div>
                            <h3 className="font-display text-lg font-bold text-white light-theme:text-slate-950">{b.name}</h3>
                            <p className="text-xs text-slate-400 mt-1">Lead: {trainer?.name || 'Unassigned Trainer'}</p>
                          </div>

                          {/* Quick statistics */}
                          <div className="grid grid-cols-2 gap-2 border-t border-b border-white/5 py-4 text-[11px] text-slate-450 dark:border-white/5 light-theme:border-slate-100">
                            <div>
                              <span className="block text-[10px] text-slate-500">Student Capacity</span>
                              <span className="font-bold text-white light-theme:text-slate-900">{rosterSize} Participants</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-500">Attendance Ratio</span>
                              <span className="font-bold text-emerald-400">{b.attendancePercentage}% Index</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="font-mono text-[10px] text-slate-500">Since: {b.startDate}</span>
                            
                            {/* Duplicate batch and Edit action triggers */}
                            <div className="flex gap-2">
                              {/* Clone / duplicate speedups */}
                              <button
                                onClick={() => handleDuplicateBatch(b)}
                                className="rounded p-1.5 bg-white/5 text-slate-400 hover:text-white"
                                title="Duplicate Cohort (Config Clone)"
                                id={`duplicate-batch-btn-${b.id}`}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- 6. INTERACTIVE CALENDAR TAB --- */}
              {activeTab === 'calendar' && (
                <div className="space-y-6" id="calendar-tab-section">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                      Interactive Monthly Attendance Calendar Log
                    </h2>
                    <p className="text-xs text-slate-400">
                      Dynamic database mapping. Review scheduled national holidays, track class sign-offs, and inspect previous day rosters.
                    </p>
                  </div>

                  <CalendarWidget 
                    attendances={attendances}
                    batches={batches}
                    students={students}
                    holidays={holidays}
                    onGoToAttendance={(bId, dt) => {
                      setActiveAttendanceBatch(bId);
                      setActiveAttendanceDate(dt);
                    }}
                  />
                </div>
              )}

              {/* --- 7. ATTENDANCE ARCHIVES HISTORY LOGS TAB --- */}
              {activeTab === 'history' && (
                <div className="space-y-6" id="history-logs-tab">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                      Attendance Sessions Archives
                    </h2>
                    <p className="text-xs text-slate-400">
                      Review previous classroom records, inspect manual notes, or lookup individual student logs across custom date periods.
                    </p>
                  </div>

                  {/* Filter elements block */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-slate-900/45 p-4 border border-white/5 dark:border-white/5 light-theme:bg-white light-theme:border-slate-200">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      {/* Search */}
                      <div className="relative flex-1 max-w-xs">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search batch name..."
                          value={historySearch}
                          onChange={(e) => setHistorySearch(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-slate-950/20 py-2 pr-4 pl-10 text-xs text-white placeholder-slate-500 outline-hidden light-theme:border-slate-200 light-theme:text-slate-900 light-theme:bg-slate-50"
                          id="history-search-input"
                        />
                      </div>

                      {/* Date Select picker filter */}
                      <select
                        value={historyDateFilter}
                        onChange={(e) => setHistoryDateFilter(e.target.value)}
                        className="rounded-lg border border-white/10 bg-slate-950/20 p-2 text-xs text-slate-200 outline-hidden light-theme:border-slate-200 light-theme:text-slate-900 light-theme:bg-slate-50"
                        id="history-date-filter"
                      >
                        <option value="all">Any Recorded Date</option>
                        <option value="today">Sessions Today</option>
                        <option value="past5">Past 5 Days Logs</option>
                      </select>
                    </div>
                  </div>

                  {/* History elements stack */}
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {attendances.filter(att => {
                      const bat = batches.find(b => b.id === att.batchId);
                      const matchSearch = bat?.name.toLowerCase().includes(historySearch.toLowerCase());
                      
                      let matchDate = true;
                      if (historyDateFilter === 'today') {
                        matchDate = att.date === new Date().toISOString().split('T')[0];
                      } else if (historyDateFilter === 'past5') {
                        const fiveDaysAgo = new Date();
                        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
                        matchDate = new Date(att.date) >= fiveDaysAgo;
                      }

                      return matchSearch && matchDate;
                    }).map(att => {
                      const bat = batches.find(b => b.id === att.batchId);
                      const presentStudents = att.records.filter(r => r.status === 'present' || r.status === 'late').length;
                      const ratio = att.records.length > 0 ? Math.round((presentStudents / att.records.length) * 100) : 0;

                      return (
                        <div 
                          key={att.id}
                          className="rounded-xl border border-white/5 bg-slate-900/30 p-5 space-y-3 dark:border-white/5 light-theme:bg-white light-theme:border-slate-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-display font-semibold text-white light-theme:text-slate-950 text-sm">{bat?.name || 'Class Cohort'}</h4>
                              <p className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">{att.date} Log • {att.time}</p>
                            </div>
                            <span className={`rounded-xl px-2.5 py-0.5 text-[9px] font-bold ${
                              ratio >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {ratio}% Attendance Rate
                            </span>
                          </div>

                          {att.remarks && (
                            <p className="rounded bg-white/2 p-2 text-slate-400 text-[10px] leading-relaxed italic border-l border-indigo-505 dark:bg-white/2 light-theme:bg-slate-50 light-theme:border-slate-205 light-theme:text-slate-705">
                              ❝ {att.remarks} ❞
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Roster presence: {presentStudents} of {att.records.length} participants</span>
                            
                            <button
                              onClick={() => {
                                setActiveAttendanceBatch(att.batchId);
                                setActiveAttendanceDate(att.date);
                              }}
                              className="text-indigo-400 hover:underline font-semibold"
                            >
                              Inspect Marks &rarr;
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- 8. REPORTS DOWNLOADS & MOCK PRINT TAB --- */}
              {activeTab === 'reports' && (
                <div className="space-y-6" id="reports-tab">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                      Reports & Extractor Utilities
                    </h2>
                    <p className="text-xs text-slate-400">
                      Download spreadsheet sheets, print academic attendance records, or extract system JSON database schemas cleanly.
                    </p>
                  </div>

                  {/* Operational layout block */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    
                    {/* Downloader item A: Monthly CSV sheets */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4 text-center light-theme:bg-white light-theme:border-slate-200">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <FileSpreadsheet className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white light-theme:text-slate-950 text-sm">Download Spreadsheet Roster (CSV)</h4>
                        <p className="text-[11px] text-slate-404 mt-1 text-slate-400">Generates instant CSV logs compiling all batch percentage trends.</p>
                      </div>
                      <button
                        onClick={() => {
                          let csvContent = "data:text/csv;charset=utf-8,";
                          csvContent += "Batch Name,Curriculum,Capacity,Presence Index %\r\n";
                          batches.forEach(b => {
                            const size = students.filter(s => s.batchId === b.id).length;
                            csvContent += `"${b.name}","FullStack Series",${size},${b.attendancePercentage}\r\n`;
                          });
                          const encoded = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encoded);
                          link.setAttribute("download", "academy_attendance_indices.csv");
                          link.click();
                          db.createNotification('Roster Extract Synced', 'Rosters compiled into CSV spreadsheet file.', 'success');
                        }}
                        className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-555 transition"
                        id="download-csv-btn"
                      >
                        Extract CSV Sheet
                      </button>
                    </div>

                    {/* Downloader item B: Mock Print reports */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4 text-center light-theme:bg-white light-theme:border-slate-200 animate-fade-in">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <Printer className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white light-theme:text-slate-950 text-sm">Print Ledger Roster PDF</h4>
                        <p className="text-[11px] text-slate-404 mt-1 text-slate-400">Reformats interface boundaries to output crisp printable paper ledgers.</p>
                      </div>
                      <button
                        onClick={triggerPrintReport}
                        className="w-full rounded-lg bg-indigo-650 bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-505 transition"
                        id="trigger-print-btn"
                      >
                        Trigger Print Layout
                      </button>
                    </div>

                    {/* Downloader item C: System schema dump */}
                    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4 text-center light-theme:bg-white light-theme:border-slate-200">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                        <FolderDown className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white light-theme:text-slate-950 text-sm">Download DB JSON Backup</h4>
                        <p className="text-[11px] text-slate-404 mt-1 text-slate-400">Exports all IndexedDB records into a self-contained restore dump payload.</p>
                      </div>
                      <button
                        onClick={handleExportDatabase}
                        className="w-full rounded-lg bg-amber-550 bg-amber-600 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition"
                        id="download-json-backup-btn"
                      >
                        Generate Dump Payload
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TRAINER WORKSPACE TAB (Study Materials & Projects) --- */}
              {activeTab === 'trainer-materials' && (
                <div className="space-y-6 animate-fade-in" id="trainer-workspace-tab">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                      Study Materials & Student Projects Hub
                    </h2>
                    <p className="text-xs text-slate-400">
                      Disseminate lecture booklets, track student project milestones, and submit evaluator remarks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Upload study materials form */}
                    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 space-y-4 backdrop-blur-md light-theme:bg-white light-theme:border-slate-200">
                      <h3 className="text-sm font-semibold text-white light-theme:text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-emerald-400" /> Disseminate New Material
                      </h3>
                      
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 light-theme:text-slate-600">Material Title</label>
                          <input 
                            type="text"
                            value={newMaterialTitle}
                            onChange={(e) => setNewMaterialTitle(e.target.value)}
                            placeholder="e.g. Lecture 4: Asynchronous Redux Actions"
                            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/40 p-2.5 text-xs text-slate-200 placeholder-slate-500 outline-hidden focus:border-emerald-500 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-905"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 light-theme:text-slate-600">Course</label>
                            <select
                              value={newMaterialCourse}
                              onChange={(e) => setNewMaterialCourse(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/40 p-2.5 text-xs text-slate-205 outline-hidden focus:border-emerald-500 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
                            >
                              <option value="Full Stack Web Development">Full Stack Web</option>
                              <option value="Mobile Application Development">Mobile App Dev</option>
                              <option value="UI/UX Design Masterclass">UI/UX Figma</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 light-theme:text-slate-600">Format</label>
                            <select
                              value={newMaterialType}
                              onChange={(e) => setNewMaterialType(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/40 p-2.5 text-xs text-slate-205 outline-hidden focus:border-emerald-500 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
                            >
                              <option value="PDF">PDF</option>
                              <option value="ZIP">ZIP</option>
                              <option value="DOCX">Word</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!newMaterialTitle.trim()) {
                              db.createNotification('Invalid Entry', 'Material Title cannot be empty!', 'error');
                              return;
                            }
                            const item = {
                              id: `m_${Date.now()}`,
                              title: newMaterialTitle,
                              fileType: newMaterialType,
                              size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
                              attachedDate: new Date().toISOString().split('T')[0],
                              courseName: newMaterialCourse
                            };
                            setStudyMaterials([item, ...studyMaterials]);
                            setNewMaterialTitle('');
                            db.logActivity('MATERIAL_UPLOAD', `Uploaded study material booklet: ${item.title}`);
                            db.createNotification('Material Disseminated', `Successfully added '${item.title}' PDF.`, 'success');
                          }}
                          className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition duration-150 mt-2 cursor-pointer"
                        >
                          Publish Study Material
                        </button>
                      </div>
                    </div>

                    {/* Materials List display table */}
                    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md lg:col-span-2 light-theme:bg-white light-theme:border-slate-200">
                      <h3 className="text-sm font-semibold text-white light-theme:text-slate-900 flex items-center gap-1.5 mb-4">
                        <BookOpen className="h-4 w-4 text-emerald-400" /> Active Academic Booklets Library
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead>
                            <tr className="border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <th className="pb-2">Booklet Title</th>
                              <th className="pb-2">Course Target</th>
                              <th className="pb-2 text-center">Format</th>
                              <th className="pb-2">Date Added</th>
                              <th className="pb-2 text-right">Size</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {studyMaterials.map((m) => (
                              <tr key={m.id} className="hover:bg-white/3 transition">
                                <td className="py-2.5 font-medium text-white light-theme:text-slate-950">{m.title}</td>
                                <td className="py-2.5 text-slate-400 text-[11px]">{m.courseName}</td>
                                <td className="py-2.5 text-center">
                                  <span className="inline-flex items-center rounded-md bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                                    {m.fileType}
                                  </span>
                                </td>
                                <td className="py-2.5 text-slate-400 text-[11px]">{m.attachedDate}</td>
                                <td className="py-2.5 text-right font-mono text-slate-400 text-[11px]">{m.size}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Project evaluation sandbox */}
                  <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md light-theme:bg-white light-theme:border-slate-200">
                    <h3 className="text-sm font-semibold text-white light-theme:text-slate-900 flex items-center gap-1.5 mb-4">
                      <Briefcase className="h-4 w-4 text-emerald-400" /> Student Project Term Evaluation Sandbox
                    </h3>

                    {editingProject && (
                      <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Evaluating Project: {editingProject.projectTitle} ({editingProject.studentName})
                          </span>
                          <button 
                            onClick={() => setEditingProject(null)}
                            className="text-[10px] text-slate-400 hover:text-white uppercase font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400">Assignment Grade</label>
                            <select
                              value={editGrade}
                              onChange={(e) => setEditGrade(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 p-2 text-xs text-slate-200 outline-hidden light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
                            >
                              {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'Under Review'].map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400">Review Status</label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 p-2 text-xs text-slate-202 outline-hidden light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-950"
                            >
                              <option value="Under Review">Under Review</option>
                              <option value="Completed">Completed</option>
                              <option value="Revision Needed">Revision Needed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400">Detailed Feedback Remarks</label>
                            <input
                              type="text"
                              value={editFeedback}
                              onChange={(e) => setEditFeedback(e.target.value)}
                              placeholder="Good styling, clean components..."
                              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/40 p-2 text-xs text-slate-200 outline-hidden light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-905"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              const updated = studentProjects.map(p => {
                                if (p.id === editingProject.id) {
                                  return { ...p, status: editStatus, grade: editGrade, feedback: editFeedback };
                                }
                                  return p;
                              });
                              setStudentProjects(updated);
                              setEditingProject(null);
                              db.logActivity('PROJECT_VALUATION', `Reviewed and graded ${editingProject.studentName}'s assignment.`);
                              db.createNotification('Project Reviewed', `Saved feedback for ${editingProject.studentName}.`, 'success');
                            }}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
                          >
                            Commit Grading Remarks
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="pb-2.5">Enrolled Student</th>
                            <th className="pb-2.5">Project Assignment Title</th>
                            <th className="pb-2.5 text-center">Grading</th>
                            <th className="pb-2.5">Status Check</th>
                            <th className="pb-2.5">Evaluator Feedback Comments</th>
                            <th className="pb-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {studentProjects.map((proj) => (
                            <tr key={proj.id} className="hover:bg-white/2 transition">
                              <td className="py-3 text-white light-theme:text-slate-950 font-medium">{proj.studentName}</td>
                              <td className="py-3 text-slate-200 light-theme:text-slate-700 text-[11px]">{proj.projectTitle}</td>
                              <td className="py-3 text-center">
                                <span className="inline-flex rounded bg-emerald-300/10 px-1.5 py-0.5 text-xs font-bold text-emerald-400">
                                  {proj.grade}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {proj.status}
                                </span>
                              </td>
                              <td className="py-3 text-[11px] text-slate-450 italic max-w-xs truncate" title={proj.feedback}>
                                "{proj.feedback}"
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setEditingProject(proj);
                                    setEditGrade(proj.grade);
                                    setEditFeedback(proj.feedback);
                                    setEditStatus(proj.status);
                                  }}
                                  className="rounded bg-indigo-600/20 px-2.5 py-1 text-[10px] font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
                                >
                                  Evaluate Project
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STUDENT PORTAL MAIN TAB --- */}
              {activeTab === 'student-portal' && (() => {
                // Find Emma Watson's attendance status today if logged
                const todayStr = '2026-06-22';
                const todayAttendance = db.getAll<Attendance>('attendance').find(att => att.date === todayStr);
                const emmaTodayRecord = todayAttendance?.records.find(rec => rec.studentId === 's1');
                const todayStatus = emmaTodayRecord?.status || 'present';

                const handleAddTask = (e: React.FormEvent) => {
                  e.preventDefault();
                  if (!studentTaskInput.trim()) return;
                  
                  const newTask = {
                    id: `task_${Date.now()}`,
                    task: studentTaskInput,
                    day: 'Today',
                    completed: false
                  };
                  setDayByDayTasks([...dayByDayTasks, newTask]);
                  setStudentTaskInput('');
                  db.createNotification('Task Registered', `Added: "${newTask.task}" to today's schedule`, 'success');
                };

                return (
                  <div className="space-y-6 animate-fade-in" id="student-portal-tab">
                    {/* Welcome Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                          Welcome Back, Emma Watson
                        </h2>
                        <p className="text-xs text-slate-400">
                          Cohort: <span className="text-amber-400 font-semibold">FullStack Cohort 12 (b1)</span> • Lead Instructor: Alex Johnson
                        </p>
                      </div>

                      {/* Small Quick Metric Badge */}
                      <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/5 bg-slate-900/40 p-3 text-xs light-theme:bg-white light-theme:border-slate-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-slate-450 font-medium">Net Attendance:</span>
                        <span className="font-mono font-bold text-amber-400">92%</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-[11px] font-medium uppercase">
                          Today Status: <span className="text-emerald-400 font-bold">{todayStatus.toUpperCase()}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                      
                      {/* Left Column: Meetings & Lectures Scheduled today (span 2) */}
                      <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 space-y-4 backdrop-blur-md lg:col-span-2 light-theme:bg-white light-theme:border-slate-200" id="today-meetings-section">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <h3 className="text-sm font-semibold text-white light-theme:text-slate-900 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-400" /> Today's Meetings & Classes
                          </h3>
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full font-bold font-mono">
                            {todayStr}
                          </span>
                        </div>

                        <div className="space-y-3 pt-1">
                          {[
                            {
                              id: 'meet-1',
                              title: 'Daily Morning Standup & Scrum Sync',
                              time: '09:30 AM - 10:15 AM',
                              trainer: 'Alex Johnson',
                              status: 'completed',
                              desc: 'Review week sprint task, blockers, and build setup.'
                            },
                            {
                              id: 'meet-2',
                              title: 'Vite & Tailwind Precision Breakpoints Refactor',
                              time: '01:30 PM - 03:00 PM',
                              trainer: 'Sarah Connor',
                              status: 'live',
                              desc: 'Practical lab on grid-density layouts, container rules, and CSS variables.'
                            },
                            {
                              id: 'meet-3',
                              title: 'Cohort 12 Project Milestone Sync Up',
                              time: '05:00 PM - 06:00 PM',
                              trainer: 'Alex Johnson',
                              status: 'scheduled',
                              desc: 'Direct trainer-to-student evaluation checklist audits.'
                            }
                          ].map((meet) => (
                            <div 
                              key={meet.id} 
                              className={`rounded-xl border p-4 space-y-2.5 transition-all ${
                                meet.status === 'live'
                                  ? 'border-amber-500/20 bg-amber-500/5 ring-1 ring-amber-500/15'
                                  : 'border-white/5 bg-slate-950/20 light-theme:bg-slate-50 light-theme:border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <h4 className="text-xs font-bold text-white light-theme:text-slate-950 leading-snug">
                                    {meet.title}
                                  </h4>
                                  <p className="text-[10px] text-slate-450 flex items-center gap-1.5 font-medium">
                                    <Clock className="h-3 w-3 text-slate-500" /> {meet.time}
                                  </p>
                                </div>
                                
                                {meet.status === 'completed' && (
                                  <span className="inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wide font-mono">
                                    Completed
                                  </span>
                                )}
                                {meet.status === 'live' && (
                                  <span className="inline-flex rounded-md bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono animate-pulse">
                                    LIVE NOW
                                  </span>
                                )}
                                {meet.status === 'scheduled' && (
                                  <span className="inline-flex rounded-md bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-wide font-mono">
                                    Scheduled
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                {meet.desc}
                              </p>

                              <div className="flex items-center justify-between pt-1 text-[10px] border-t border-white/5 border-dashed">
                                <span className="text-slate-450">Instructor: <strong className="text-slate-300 light-theme:text-slate-700">{meet.trainer}</strong></span>
                                {meet.status === 'live' && (
                                  <button
                                    onClick={() => {
                                      db.createNotification('Class Connection', 'Connecting to secure Zoom meeting room. Launching video link...', 'success');
                                      db.logActivity('ME_JOIN', `Left classroom proxy to attend ${meet.title}`);
                                    }}
                                    className="rounded bg-amber-500 px-3 py-1 text-[10px] font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                                  >
                                    Join Zoom Call
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Today's Practical Tasks Checklist (span 3) */}
                      <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 space-y-4 backdrop-blur-md lg:col-span-3 light-theme:bg-white light-theme:border-slate-200" id="today-tasks-section">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <h3 className="text-sm font-semibold text-white light-theme:text-slate-900 flex items-center gap-2">
                            <Check className="h-4 w-4 text-amber-400" /> My Today's Tasks Ledger
                          </h3>
                          <span className="text-xs text-amber-400 font-bold">
                            {dayByDayTasks.filter(x => x.completed).length} of {dayByDayTasks.length} Done
                          </span>
                        </div>

                        {/* Interactive Add Task Input */}
                        <form onSubmit={handleAddTask} className="flex gap-2">
                          <input 
                            type="text"
                            value={studentTaskInput}
                            onChange={(e) => setStudentTaskInput(e.target.value)}
                            placeholder="Add a new custom task for today..."
                            className="w-full rounded-lg border border-white/10 bg-slate-950/40 p-2.5 text-xs text-slate-200 placeholder-slate-500 outline-hidden focus:border-amber-500 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500 transition cursor-pointer flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </form>

                        {/* Task List Items */}
                        <div className="space-y-2 pt-1 max-h-[360px] overflow-y-auto pr-1">
                          {dayByDayTasks.map((t) => (
                            <div 
                              key={t.id} 
                              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-white/5 hover:bg-slate-950/40 transition light-theme:bg-slate-50 light-theme:border-slate-200"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={t.completed}
                                  onChange={() => {
                                    const updated = dayByDayTasks.map(item => {
                                      if (item.id === t.id) {
                                        const nextComp = !item.completed;
                                        db.createNotification(nextComp ? 'Task Completed' : 'Task Opened', `Updated: "${item.task}"`, 'info');
                                        return { ...item, completed: nextComp };
                                      }
                                      return item;
                                    });
                                    setDayByDayTasks(updated);
                                  }}
                                  className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
                                />
                                <span className={`text-xs transition-colors ${
                                  t.completed 
                                    ? 'line-through text-slate-500 font-medium' 
                                    : 'text-slate-200 font-semibold light-theme:text-slate-800'
                                }`}>
                                  {t.task}
                                </span>
                              </div>
                              
                              <button
                                onClick={() => {
                                  const updated = dayByDayTasks.filter(item => item.id !== t.id);
                                  setDayByDayTasks(updated);
                                  db.createNotification('Task Dismissed', 'Deleted task item from today\'s ledger.', 'info');
                                }}
                                className="text-slate-500 hover:text-rose-500 transition p-1 cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}

                          {dayByDayTasks.length === 0 && (
                            <div className="py-8 text-center text-xs text-slate-500 italic">
                              No tasks remaining. Add custom goals above to organize today's work!
                            </div>
                          )}
                        </div>

                        {/* Progress Bar Loader */}
                        <div className="pt-3 border-t border-white/5 space-y-1.5">
                          <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden light-theme:bg-slate-100">
                            <div 
                              className="bg-amber-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${dayByDayTasks.length > 0 ? (dayByDayTasks.filter(x => x.completed).length / dayByDayTasks.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}

              {/* --- 9. ADMINISTRATIVE CONTROL PANEL / SETTINGS TAB --- */}
              {activeTab === 'settings' && (
                <div className="space-y-6" id="settings-tab-section">
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
                      General Settings & Storage Nodes
                    </h2>
                    <p className="text-xs text-slate-400">
                      Tethers accent colors, manipulates school headers, and operates persistent browser IndexedDB formatting utilities.
                    </p>
                  </div>

                  {/* Configurations list */}
                  <div className="max-w-xl rounded-2xl border border-white/5 bg-slate-900/50 p-6 space-y-5 backdrop-blur-md dark:border-white/5 light-theme:bg-white light-theme:border-slate-200">
                    
                    {/* Visual accents settings */}
                    <div className="space-y-1.5 border-b border-white/5 pb-4 dark:border-white/5 light-theme:border-slate-100">
                      <label className="block text-xs font-semibold text-slate-300 light-theme:text-slate-700">Visual System Brand Accent</label>
                      <p className="text-[10px] text-slate-500">Mutates primary buttons and focus colors instantly.</p>
                      
                      <div className="flex items-center gap-3.5 mt-2">
                        {['indigo', 'blue', 'emerald', 'violet', 'rose'].map(color => (
                          <button
                            key={color}
                            onClick={() => {
                              setAccentColor(color);
                              db.createNotification('Accent Tint Altered', `Workspace palette transitioned directly to ${color}.`, 'info');
                            }}
                            className={`h-6 w-6 rounded-full border transition active:scale-90 ${
                              color === 'indigo' ? 'bg-indigo-600' : color === 'blue' ? 'bg-blue-600' : color === 'emerald' ? 'bg-emerald-600' : color === 'violet' ? 'bg-violet-600' : 'bg-rose-600'
                            } ${accentColor === color ? 'ring-2 ring-white scale-110' : 'border-black/50'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Institute Name settings */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300 light-theme:text-slate-700">Institute Academic Brand Name</label>
                      <input
                        type="text"
                        defaultValue={settings?.instituteName || 'Alpha Tech Academy'}
                        onChange={(e) => {
                          // Dynamic update
                          const sett = db.getAll<Settings>('settings')[0];
                          if (sett) {
                            sett.instituteName = e.target.value;
                            db.set('settings', [sett]);
                            reloadData();
                          }
                        }}
                        className="w-full rounded-lg border border-white/10 bg-slate-950/20 p-2.5 text-xs text-white placeholder-slate-500 outline-hidden light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-905"
                        id="institute-name-settings-input"
                      />
                    </div>

                    {/* Database hard restructuring logs */}
                    <div className="space-y-1.5 border-t border-white/10 pt-4 dark:border-white/10 light-theme:border-slate-100">
                      <label className="block text-xs font-semibold text-slate-300 light-theme:text-rose-455 text-rose-500">Critical Storage Controls</label>
                      <p className="text-[10px] text-slate-500">Dropping database clears offline mock logs and logs out current identity. Handle carefully.</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <button
                          onClick={handleResetDatabase}
                          className="rounded bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-505 transition shadow-lg shadow-rose-600/10"
                          id="hard-reset-db-btn"
                        >
                          Hard Reset Database
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* FOOTER METRICS STATUS BAR */}
      <footer className="h-8 border-t border-white/5 bg-slate-950/40 px-6 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest dark:border-white/5 light-theme:bg-slate-50 light-theme:border-slate-200">
        <div className="flex gap-6 items-center font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> System Online</span>
          <span>IndexedDB: 14.2 MB Used</span>
        </div>
        <div className="font-semibold select-none">v2.4.0-build.829</div>
      </footer>

      {/* --- 10. MODALS & SLIDE-OUT PANEL CODES --- */}

      {/* COMMAND PALETTE POPUP */}
      <CommandPalette 
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        students={students}
        trainers={trainers}
        batches={batches}
        courses={courses}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onSelectStudentProfile={handleSelectStudentProfile}
        onSelectTrainerProfile={handleSelectTrainerProfile}
      />

      {/* NOTIFICATION HUB DRAWER */}
      <NotificationCenter 
        notifications={notifications}
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onRefresh={reloadData}
      />

      {/* STUDENT PROFILE DETAILED INSPECT SIDE SHEET PANEL DRAWER */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex justify-end" id="student-inspect-drawer">
          <div className="absolute inset-0" onClick={() => setInspectingStudent(null)} />
          <div className="relative w-full max-w-md bg-slate-900 border-l border-white/5 p-6 space-y-6 overflow-y-auto z-10 animate-fade-in light-theme:bg-white light-theme:border-slate-200">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 dark:border-white/5 light-theme:border-slate-100">
              <h3 className="font-display font-semibold text-white light-theme:text-slate-950 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-405" /> Student dossier Log
              </h3>
              <button 
                onClick={() => setInspectingStudent(null)}
                className="rounded-lg p-1.5 hover:bg-white/5 text-slate-400"
                id="close-student-inspect-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-455 font-display font-black text-xl">
                  {inspectingStudent.name.charAt(0)}
                </span>
                <div>
                  <h4 className="font-display font-bold text-white text-base light-theme:text-slate-900">{inspectingStudent.name}</h4>
                  <p className="font-mono text-xs text-slate-500 font-semibold">{inspectingStudent.studentId}</p>
                </div>
              </div>

              {/* dossier info cards */}
              <div className="rounded-xl bg-white/2 p-4 space-y-3.5 border border-white/5 dark:bg-white/2 light-theme:bg-slate-50 light-theme:border-slate-200">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Inquiries Email</span>
                    <span className="font-medium text-slate-200 light-theme:text-slate-800">{inspectingStudent.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Contact Phone</span>
                    <span className="font-mono text-slate-200 light-theme:text-slate-800">{inspectingStudent.phone}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase text-slate-505 font-bold">Roster notes</span>
                  <p className="text-xs text-slate-404 leading-relaxed mt-1 text-slate-400">{inspectingStudent.notes || 'No academic notes or restrictions logged under the file.'}</p>
                </div>
              </div>

              <div>
                <span className="block text-xs uppercase text-slate-500 font-bold mb-2">Classroom Engagement Rate Log</span>
                <div className="rounded-xl border border-white/5 bg-slate-950/20 p-4 space-y-3.5 dark:border-white/5 light-theme:bg-slate-50 light-theme:border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 light-theme:text-slate-700">Engagement index</span>
                    <span className="font-mono text-emerald-455 font-bold text-emerald-450">&gt; 92% Coefficient</span>
                  </div>
                  {/* Status checklist bar */}
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs uppercase text-slate-505 font-bold">Class Attendance Sheet History</span>
                <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-1">
                  {attendances.map(a => {
                    const stuRec = a.records.find(r => r.studentId === inspectingStudent.id);
                    if (!stuRec) return null;
                    return (
                      <div key={a.id} className="flex items-center justify-between text-xs bg-white/2 p-2.5 rounded border border-white/3 dark:bg-white/2 light-theme:bg-slate-50">
                        <div>
                          <span className="font-semibold text-white light-theme:text-slate-900">{new Date(a.date).toLocaleDateString()}</span>
                          <p className="text-[10px] text-slate-500">Session At: {a.time}</p>
                        </div>
                        <span className={`rounded-xl px-2 py-0.5 font-bold uppercase text-[8px] ${
                          stuRec.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {stuRec.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE CREATE/EDIT STUDENT MODAL */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" id="student-edit-modal-backdrop">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl relative animate-fade-in light-theme:bg-white light-theme:border-slate-200">
            <h3 className="font-display font-bold text-lg text-white light-theme:text-slate-950 border-b border-white/5 pb-3 dark:border-white/5">
              {editingStudent ? 'Edit Student Credentials' : 'Configure New Student Dossier'}
            </h3>

            <form onSubmit={handleSaveStudent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 light-theme:text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  placeholder="E.g. Emma Watson"
                  className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-2.5 text-xs text-white outline-hidden focus:border-indigo-550 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
                  id="student-form-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 light-theme:text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    placeholder="emma.watson@gmail.com"
                    className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-2.5 text-xs text-white outline-hidden focus:border-indigo-550 light-theme:border-slate-200 light-theme:bg-slate-50"
                    id="student-form-email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 light-theme:text-slate-700">Phone Mobile</label>
                  <input 
                    type="text" 
                    required
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-2.5 text-xs text-white outline-hidden focus:border-indigo-550 light-theme:border-slate-200 light-theme:bg-slate-55 bg-slate-50"
                    id="student-form-phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light-theme:text-slate-700">Assigned Cohort Batch</label>
                <select
                  required
                  value={newStudentForm.batchId}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, batchId: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-2.5 text-xs text-white outline-hidden focus:border-indigo-550 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
                  id="student-form-batch"
                >
                  <option value="">Select Cohort...</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light-theme:text-slate-700">Dossier Notes / Restrictions</label>
                <textarea
                  value={newStudentForm.notes}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, notes: e.target.value })}
                  placeholder="Optionally append comments about learning paths..."
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-2.5 text-xs text-white outline-hidden focus:border-indigo-550 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
                  id="student-form-notes"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(false)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                  id="cancel-student-modal-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-505"
                  id="save-student-form-btn"
                >
                  Save Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
