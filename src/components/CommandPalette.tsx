import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, User, Users, Compass, Shield, Database, Settings } from 'lucide-react';
import { Student, Trainer, Batch, Course } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  trainers: Trainer[];
  batches: Batch[];
  courses: Course[];
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onSelectStudentProfile: (studentId: string) => void;
  onSelectTrainerProfile: (trainerId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  students,
  trainers,
  batches,
  courses,
  activeTab,
  onChangeTab,
  onSelectStudentProfile,
  onSelectTrainerProfile
}) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Handle hotkeys (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  // Filter lists
  const filteredStudents = search 
    ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase()))
    : students.slice(0, 3);

  const filteredTrainers = search
    ? trainers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.trainerId.toLowerCase().includes(search.toLowerCase()))
    : trainers.slice(0, 3);

  const filteredBatches = search
    ? batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    : batches.slice(0, 3);

  const commands = [
    { name: 'View Overview Dashboard', tab: 'dashboard', icon: Sparkles },
    { name: 'Mark Attendance Logs', tab: 'attendance', icon: Users },
    { name: 'Manage Students Registry', tab: 'students', icon: User },
    { name: 'Manage Trainers Registry', tab: 'trainers', icon: Shield },
    { name: 'Configure General Settings', tab: 'settings', icon: Settings },
    { name: 'Backup Database Engine', tab: 'settings', icon: Database },
  ];

  const filteredCommands = search
    ? commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : commands;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl dark:border-white/10 light-theme:bg-white light-theme:border-slate-200"
        >
          {/* Input Bar */}
          <div className="flex items-center border-b border-white/5 px-4 dark:border-white/5 light-theme:border-slate-100">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search students, batches, settings (Ctrl+K)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 flex-1 bg-transparent px-3 text-sm text-slate-100 placeholder-slate-500 outline-hidden light-theme:text-slate-900"
            />
            <button 
              onClick={onClose}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-slate-400 light-theme:border-slate-200 light-theme:bg-slate-50"
            >
              ESC
            </button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto p-3 text-xs">
            {/* Command Shortcuts */}
            {filteredCommands.length > 0 && (
              <div className="mb-4">
                <h4 className="flex items-center gap-1.5 px-3 py-1 font-display font-medium text-slate-400">
                  <Compass className="h-3 w-3" /> Navigation & Systems
                </h4>
                <div className="mt-1 flex flex-col gap-0.5">
                  {filteredCommands.map(cmd => (
                    <button
                      key={cmd.name}
                      onClick={() => {
                        onChangeTab(cmd.tab);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5 hover:text-white light-theme:text-slate-700 light-theme:hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <cmd.icon className="h-4 w-4 text-indigo-400" />
                        {cmd.name}
                      </span>
                      <kbd className="font-mono text-[9px] text-slate-500">Go</kbd>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Students Category */}
            {filteredStudents.length > 0 && (
              <div className="mb-4">
                <h4 className="flex items-center gap-1.5 px-3 py-1 font-display font-medium text-slate-400">
                  <User className="h-3 w-3" /> Students matching
                </h4>
                <div className="mt-1 flex flex-col gap-0.5">
                  {filteredStudents.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onChangeTab('students');
                        onSelectStudentProfile(s.id);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5 hover:text-white light-theme:text-slate-700 light-theme:hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-505 bg-indigo-600 font-bold text-[9px] text-white">
                          {s.name.charAt(0)}
                        </span>
                        <span>{s.name} <span className="text-[10px] text-slate-500">({s.studentId})</span></span>
                      </span>
                      <span className="text-[10px] text-indigo-400 hover:underline">View Profile</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trainers Category */}
            {filteredTrainers.length > 0 && (
              <div className="mb-4">
                <h4 className="flex items-center gap-1.5 px-3 py-1 font-display font-medium text-slate-400">
                  <Shield className="h-3 w-3" /> Trainers matching
                </h4>
                <div className="mt-1 flex flex-col gap-0.5">
                  {filteredTrainers.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onChangeTab('trainers');
                        onSelectTrainerProfile(t.id);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5 hover:text-white light-theme:text-slate-700 light-theme:hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 font-bold text-[9px] text-white">
                          {t.name.charAt(0)}
                        </span>
                        <span>{t.name} <span className="text-[10px] text-slate-500">({t.trainerId})</span></span>
                      </span>
                      <span className="text-[10px] text-emerald-400 hover:underline">View Profile</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Batches Category */}
            {filteredBatches.length > 0 && (
              <div className="mb-1">
                <h4 className="flex items-center gap-1.5 px-3 py-1 font-display font-medium text-slate-400">
                  <Users className="h-3 w-3" /> Batch Cohorts
                </h4>
                <div className="mt-1 flex flex-col gap-0.5">
                  {filteredBatches.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onChangeTab('batches');
                        onClose();
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5 hover:text-white light-theme:text-slate-700 light-theme:hover:bg-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        {b.name}
                      </span>
                      <span className="font-mono text-[9px] text-slate-500">Active</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredStudents.length === 0 && filteredCommands.length === 0 && filteredTrainers.length === 0 && (
              <div className="py-6 text-center text-slate-500">
                <p>No matches for "{search}"</p>
                <p className="text-[10px] mt-1 text-slate-600">Try searching another term.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
