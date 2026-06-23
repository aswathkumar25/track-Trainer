import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Check, X, Clock, HelpCircle, Archive, Save, RotateCcw, RotateCw, Trash2, 
  Search, ShieldAlert, Sparkles, RefreshCcw, AlertTriangle, FileText, CheckCircle2 
} from 'lucide-react';
import { Student, Attendance, AttendanceStatus, AttendanceRecord } from '../types';
import { db } from '../database/db';

interface ActiveAttendanceSessionProps {
  batchId: string;
  batchName: string;
  dateString: string; // YYYY-MM-DD
  trainerId: string;
  students: Student[];
  onBack: () => void;
  onSaved: () => void;
}

export const ActiveAttendanceSession: React.FC<ActiveAttendanceSessionProps> = ({
  batchId,
  batchName,
  dateString,
  trainerId,
  students,
  onBack,
  onSaved
}) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [remarks, setRemarks] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Undo/Redo stack state
  const [history, setHistory] = useState<AttendanceRecord[][]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  // Initialize records from db or seed defaults
  useEffect(() => {
    const list = db.getAll<Attendance>('attendance');
    const existing = list.find(a => a.batchId === batchId && a.date === dateString);
    
    let initialRecords: AttendanceRecord[] = [];
    if (existing) {
      initialRecords = existing.records;
      setRemarks(existing.remarks || '');
    } else {
      // Default all to 'present' initially
      initialRecords = students.map(s => ({
        studentId: s.id,
        status: 'present',
        remarks: ''
      }));
    }

    setRecords(initialRecords);
    // Initialize Undo/Redo histories
    setHistory([initialRecords]);
    setHistoryPointer(0);
  }, [batchId, dateString, students]);

  // Handle history changes
  const pushStateToHistory = (newRecords: AttendanceRecord[]) => {
    const croppedHistory = history.slice(0, historyPointer + 1);
    const updatedHistory = [...croppedHistory, newRecords];
    setHistory(updatedHistory);
    setHistoryPointer(updatedHistory.length - 1);
    
    // AutoSave check
    if (autoSave) {
      triggerSave(newRecords);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const updated = records.map(p => {
      if (p.studentId === studentId) {
        return { ...p, status };
      }
      return p;
    });
    setRecords(updated);
    pushStateToHistory(updated);
  };

  const handleRowRemarkChange = (studentId: string, text: string) => {
    const updated = records.map(p => {
      if (p.studentId === studentId) {
        return { ...p, remarks: text };
      }
      return p;
    });
    setRecords(updated);
    // Push but maybe debounced or just standard to avoid massive undo stack
    pushStateToHistory(updated);
  };

  // Undo / Redo mechanics
  const handleUndo = () => {
    if (historyPointer > 0) {
      const prevPointer = historyPointer - 1;
      setHistoryPointer(prevPointer);
      const prevRecords = history[prevPointer];
      setRecords(prevRecords);
      if (autoSave) triggerSave(prevRecords);
    }
  };

  const handleRedo = () => {
    if (historyPointer < history.length - 1) {
      const nextPointer = historyPointer + 1;
      setHistoryPointer(nextPointer);
      const nextRecords = history[nextPointer];
      setRecords(nextRecords);
      if (autoSave) triggerSave(nextRecords);
    }
  };

  // Mark all helpers
  const handleMarkAll = (status: AttendanceStatus) => {
    const updated = records.map(p => ({ ...p, status }));
    setRecords(updated);
    pushStateToHistory(updated);
  };

  const triggerSave = (recordsToSave: AttendanceRecord[] = records) => {
    setSaveStatus('saving');
    try {
      const allAtts = db.getAll<Attendance>('attendance');
      const compositeId = `${batchId}_${dateString}`;
      
      const newAttendance: Attendance = {
        id: compositeId,
        date: dateString,
        batchId,
        trainerId: trainerId || 't1',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        remarks,
        records: recordsToSave
      };

      const existingIdx = allAtts.findIndex(a => a.id === compositeId);
      if (existingIdx !== -1) {
        allAtts[existingIdx] = newAttendance;
      } else {
        allAtts.unshift(newAttendance);
        db.createNotification(
          `Attendance Log Created: ${batchName}`, 
          `Attendance registered for ${dateString} containing ${recordsToSave.length} student records.`, 
          'success'
        );
      }
      db.set('attendance', allAtts);
      db.logActivity('SAVE_ATTENDANCE', `Attendance committed for Batch: ${batchName}, Date: ${dateString}.`);

      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      }, 500);
    } catch {
      setSaveStatus('error');
    }
  };

  // Filtered Students
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  // Counters
  const countPresent = records.filter(r => r.status === 'present').length;
  const countAbsent = records.filter(r => r.status === 'absent').length;
  const countLate = records.filter(r => r.status === 'late').length;
  const countLeave = records.filter(r => r.status === 'leave').length;
  const countHoliday = records.filter(r => r.status === 'holiday').length;
  const totalRoster = records.length;
  const presentPct = totalRoster > 0 ? Math.round(((countPresent + countLate) / totalRoster) * 100) : 0;

  return (
    <div className="space-y-6" id="active-session-marker-box">
      {/* Session Breadcrumb & Metadata Card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md dark:border-white/5 dark:bg-slate-900/50 light-theme:bg-white light-theme:border-slate-200 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-indigo-400">
            <span>Roster Session Marker</span>
            <span>•</span>
            <span>{new Date(dateString).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white light-theme:text-slate-950">
            {batchName}
          </h2>
          <p className="text-xs text-slate-400">
            Logging classroom attendance. Please select student checklist markers carefully.
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 dark:border-white/10 light-theme:border-slate-200 light-theme:bg-slate-50">
            <button
              onClick={handleUndo}
              disabled={historyPointer <= 0}
              className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
              title="Undo Mark"
              id="undo-btn"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyPointer >= history.length - 1}
              className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
              title="Redo Mark"
              id="redo-btn"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>

          {/* Autosave Toggler */}
          <label className="flex items-center gap-2 rounded-lg border border-white/5 bg-slate-950/20 px-3 py-1.5 text-xs text-slate-300 pointer light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-700">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="accent-indigo-500 rounded"
              id="autosave-checkbox"
            />
            Auto-Save
          </label>

          {/* Manual Save Trigger */}
          <button
            onClick={() => triggerSave()}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-505 transition active:scale-95 disabled:opacity-50"
            id="manual-save-btn"
          >
            {saveStatus === 'saving' ? (
              <>
                <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="h-3.5 w-3.5" /> Logged!
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Save Roster
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 light-theme:border-slate-200 light-theme:text-slate-700 light-theme:hover:bg-slate-100"
            id="back-active-session-btn"
          >
            Close
          </button>
        </div>
      </div>

      {/* Ratios Counter Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-center light-theme:bg-white light-theme:border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400">Attendance Index</span>
          <p className="mt-1 font-display text-2xl font-bold text-indigo-400 font-display">{presentPct}%</p>
          <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400" style={{ width: `${presentPct}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-center light-theme:bg-white light-theme:border-slate-200">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Present</span>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-400">{countPresent}</p>
          <span className="text-[10px] text-slate-400">students in seats</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-center light-theme:bg-white light-theme:border-slate-200">
          <span className="text-[10px] uppercase font-bold text-rose-400">Absent</span>
          <p className="mt-1 font-display text-2xl font-bold text-rose-400">{countAbsent}</p>
          <span className="text-[10px] text-slate-400">not physical</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-center light-theme:bg-white light-theme:border-slate-200">
          <span className="text-[10px] uppercase font-bold text-amber-400">Late</span>
          <p className="mt-1 font-display text-2xl font-bold text-amber-400">{countLate}</p>
          <span className="text-[10px] text-slate-400">tardiness records</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-center light-theme:bg-white light-theme:border-slate-200">
          <span className="text-[10px] uppercase font-bold text-sky-400">Approved Leave</span>
          <p className="mt-1 font-display text-2xl font-bold text-sky-400">{countLeave}</p>
          <span className="text-[10px] text-slate-400">permission logs</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-center light-theme:bg-white light-theme:border-slate-200">
          <span className="text-[10px] uppercase font-bold text-purple-400 font-display">Off Day</span>
          <p className="mt-1 font-display text-2xl font-bold text-purple-400">{countHoliday}</p>
          <span className="text-[10px] text-slate-400">institutional off</span>
        </div>
      </div>

      {/* Grid container with list filters and overall remarks */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Quick Find */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter roster table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900/50 py-2 pr-4 pl-10 text-xs text-white placeholder-slate-500 outline-hidden focus:border-indigo-500 light-theme:bg-white light-theme:border-slate-200 light-theme:text-slate-900"
              id="filter-roster-input"
            />
          </div>

          {/* Quick Mark Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Roster shortcuts:</span>
            <button
              onClick={() => handleMarkAll('present')}
              className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
              id="mark-all-present-btn"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-505 hover:text-white transition"
              id="mark-all-absent-btn"
            >
              All Absent
            </button>
            <button
              onClick={() => handleMarkAll('holiday')}
              className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400 hover:bg-purple-500 hover:text-white transition"
              id="mark-all-holiday-btn"
            >
              Set Holiday
            </button>
          </div>
        </div>

        {/* Global Class Remarks Input */}
        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-4 dark:border-white/5 light-theme:border-slate-200 light-theme:bg-white">
          <label className="block text-xs font-semibold text-slate-300 light-theme:text-slate-700">
            Overall Session Notes / Remarks
          </label>
          <input
            type="text"
            placeholder="E.g., Delivered Chapter 4 relations. Students were fully engaged."
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              // Trigger autosave if needed (save immediate batch data)
              if (autoSave) setTimeout(() => triggerSave(), 100);
            }}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-950/40 p-2.5 text-xs text-slate-200 outline-hidden focus:border-indigo-500 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
            id="session-global-remarks"
          />
        </div>

        {/* Student Marks Table */}
        <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-xs light-theme:bg-white light-theme:border-slate-200">
          <table className="w-full border-collapse text-left text-xs text-slate-200">
            <thead className="border-b border-white/5 bg-slate-950/20 text-slate-400 light-theme:bg-slate-50 light-theme:border-slate-200 light-theme:text-slate-600">
              <tr>
                <th className="p-4 font-semibold">Student ID</th>
                <th className="p-4 font-semibold">Participant Details</th>
                <th className="p-4 font-semibold text-center">Roster Marks</th>
                <th className="p-4 font-semibold">Remarks / Exceptions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 light-theme:divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No classroom students matching query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const markedRecord = records.find(r => r.studentId === stu.id) || { status: 'present', remarks: '' };
                  const activeStatus = markedRecord.status;

                  return (
                    <tr 
                      key={stu.id}
                      className="hover:bg-white/1 transition-all light-theme:hover:bg-slate-50/50"
                    >
                      <td className="p-4 font-mono select-all text-slate-400 font-medium">
                        {stu.studentId}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 font-display font-bold text-indigo-300">
                            {stu.name.charAt(0)}
                          </span>
                          <div>
                            <h4 className="font-semibold text-white light-theme:text-slate-900">{stu.name}</h4>
                            <p className="text-[10px] text-slate-400">{stu.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Present Selector */}
                          <button
                            onClick={() => handleStatusChange(stu.id, 'present')}
                            className={`rounded-lg px-2.5 py-1.5 font-semibold text-[10px] uppercase tracking-wider transition ${
                              activeStatus === 'present'
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                                : 'bg-slate-950/20 text-slate-400 hover:bg-slate-950/40 hover:text-slate-200 light-theme:bg-slate-100'
                            }`}
                          >
                            Present
                          </button>

                          {/* Absent Selector */}
                          <button
                            onClick={() => handleStatusChange(stu.id, 'absent')}
                            className={`rounded-lg px-2.5 py-1.5 font-semibold text-[10px] uppercase tracking-wider transition ${
                              activeStatus === 'absent'
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10'
                                : 'bg-slate-950/20 text-slate-400 hover:bg-slate-950/40 hover:text-slate-200 light-theme:bg-slate-100'
                            }`}
                          >
                            Absent
                          </button>

                          {/* Late Selector */}
                          <button
                            onClick={() => handleStatusChange(stu.id, 'late')}
                            className={`rounded-lg px-2.5 py-1.5 font-semibold text-[10px] uppercase tracking-wider transition ${
                              activeStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10'
                                : 'bg-slate-950/20 text-slate-400 hover:bg-slate-950/40 hover:text-slate-200 light-theme:bg-slate-100'
                            }`}
                          >
                            Late
                          </button>

                          {/* Leave Selector */}
                          <button
                            onClick={() => handleStatusChange(stu.id, 'leave')}
                            className={`rounded-lg px-2.5 py-1.5 font-semibold text-[10px] uppercase tracking-wider transition ${
                              activeStatus === 'leave'
                                ? 'bg-sky-505 bg-sky-600 text-white shadow-md'
                                : 'bg-slate-950/20 text-slate-400 hover:bg-slate-950/40 hover:text-slate-200 light-theme:bg-slate-100'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          placeholder="Note absence cause / remarks..."
                          value={markedRecord.remarks || ''}
                          onChange={(e) => handleRowRemarkChange(stu.id, e.target.value)}
                          className="w-full rounded-lg border border-white/5 bg-slate-950/30 px-2.5 py-1.5 text-[11px] text-slate-300 outline-hidden focus:border-indigo-500 light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-900"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Action Status bar alert */}
        <div className="flex items-center justify-between text-xs text-slate-400 py-2">
          <span>Active Session Roster is loaded inside encrypted IndexedDB storage.</span>
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold animate-bounce">
              <CheckCircle2 className="h-4 w-4" /> Autoclipped state synced with storage block!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
