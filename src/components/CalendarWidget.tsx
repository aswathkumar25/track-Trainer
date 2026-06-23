import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, CircleCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Attendance, Batch, Holiday, Student } from '../types';

interface CalendarWidgetProps {
  attendances: Attendance[];
  batches: Batch[];
  students: Student[];
  holidays: Holiday[];
  onGoToAttendance: (batchId: string, date: string) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  attendances,
  batches,
  students,
  holidays,
  onGoToAttendance
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const tempYear = currentDate.getFullYear();
  const tempMonth = currentDate.getMonth();

  const daysCount = getDaysInMonth(tempYear, tempMonth);
  const startDayOffset = getFirstDayOfMonth(tempYear, tempMonth);

  const prevMonth = () => {
    setCurrentDate(new Date(tempYear, tempMonth - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(tempYear, tempMonth + 1, 1));
    setSelectedDay(null);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map calendar matrix days
  const calendarDays = [];
  // previous month filler
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push({ type: 'empty', dayNum: null, dateStr: '' });
  }
  // current month days
  for (let i = 1; i <= daysCount; i++) {
    const dayDate = new Date(tempYear, tempMonth, i);
    const dateStr = dayDate.toISOString().split('T')[0];
    const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
    calendarDays.push({ type: 'day', dayNum: i, dateStr, isWeekend });
  }

  // Find info of selected day
  const getSelectedDayData = () => {
    if (!selectedDay) return null;
    
    const dayHolidays = holidays.filter(h => h.date === selectedDay);
    const dayAttendances = attendances.filter(a => a.date === selectedDay);
    
    return {
      date: selectedDay,
      holidays: dayHolidays,
      attendances: dayAttendances.map(att => {
        const batch = batches.find(b => b.id === att.batchId);
        const presentCount = att.records.filter(r => r.status === 'present' || r.status === 'late').length;
        const total = att.records.length;
        return {
          ...att,
          batchName: batch?.name || 'Unknown Batch',
          presentCount,
          totalCount: total,
          ratio: total > 0 ? Math.round((presentCount / total) * 100) : 0
        };
      })
    };
  };

  const selectedDayData = getSelectedDayData();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" id="calendar-widget-section">
      {/* Monthly grid calendar */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md dark:border-white/5 dark:bg-slate-900/50 light-theme:bg-white light-theme:border-slate-200 lg:col-span-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 dark:border-white/5 light-theme:border-slate-100">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-indigo-400" />
            <h3 className="font-display text-lg font-semibold text-white light-theme:text-slate-950">
              {monthNames[tempMonth]} {tempYear}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={prevMonth} 
              className="rounded-lg border border-white/5 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-700"
              id="prev-month-btn"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className="rounded-lg border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-700"
              id="today-month-btn"
            >
              Today
            </button>
            <button 
              onClick={nextMonth} 
              className="rounded-lg border border-white/5 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white light-theme:border-slate-200 light-theme:bg-slate-50 light-theme:text-slate-700"
              id="next-month-btn"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 border-b border-white/5 pb-3 text-[10px] text-slate-400 dark:border-white/5 light-theme:border-slate-100">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> High attendance (&gt;80%)
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Low attendance (&le;50%)
          </div>
          <div className="flex items-center gap-1 font-semibold text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-500" /> Scheduled Holiday
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6]/30 border border-indigo-400/50" /> Selected Date
          </div>
        </div>

        {/* Days Header */}
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center font-display text-xs font-semibold text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Grid cells */}
        <div className="mt-2 grid grid-cols-7 gap-1.5" id="calendar-days-grid">
          {calendarDays.map((cell, idx) => {
            if (cell.type === 'empty') {
              return <div key={`empty-${idx}`} className="aspect-square bg-slate-950/20 rounded-lg light-theme:bg-slate-100/30" />;
            }
            
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
            const isSelected = selectedDay === cell.dateStr;
            
            // Check day status
            const dayHolidays = holidays.filter(h => h.date === cell.dateStr);
            const isHoliday = dayHolidays.length > 0;
            const dayAtts = attendances.filter(a => a.date === cell.dateStr);
            const isMarked = dayAtts.length > 0;
            
            let colorClass = "bg-slate-900/40 text-slate-300 pointer hover:bg-white/5 light-theme:bg-slate-50 light-theme:text-slate-800 light-theme:hover:bg-slate-100/80";
            if (cell.isWeekend) {
              colorClass = "bg-slate-950/30 text-slate-500 hover:bg-white/5 light-theme:bg-slate-100/50 light-theme:text-slate-400";
            }
            
            if (isHoliday) {
              colorClass = "bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20";
            } else if (isMarked) {
              // average attendance ratio
              let totalPresent = 0;
              let totalRc = 0;
              dayAtts.forEach(at => {
                totalPresent += at.records.filter(r => r.status === 'present' || r.status === 'late').length;
                totalRc += at.records.length;
              });
              const ratio = totalRc > 0 ? (totalPresent / totalRc) : 0;
              
              if (ratio >= 0.8) {
                colorClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20";
              } else if (ratio < 0.5) {
                colorClass = "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20";
              } else {
                colorClass = "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20";
              }
            }

            return (
              <button
                key={`day-${cell.dayNum}`}
                onClick={() => setSelectedDay(cell.dateStr)}
                className={`flex flex-col items-center justify-between aspect-square rounded-xl p-1.5 text-xs transition-all relative ${colorClass} ${
                  isSelected ? 'ring-2 ring-indigo-500/75 scale-[1.02] shadow-lg shadow-indigo-500/10' : ''
                } ${isToday ? 'outline-dashed outline-1 outline-indigo-400 font-bold' : ''}`}
              >
                <span className="self-start">{cell.dayNum}</span>
                
                {/* Visual indicators */}
                <span className="flex gap-0.5 mt-auto">
                  {dayAtts.map((_at, i) => (
                    <span key={i} className="h-1 w-1 rounded-full bg-current opacity-60" />
                  ))}
                  {isHoliday && (
                    <span className="h-1 w-1 rounded-full bg-sky-400" />
                  )}
                </span>
                
                {isToday && (
                  <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details drawer panel */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md dark:border-white/5 dark:bg-slate-900/50 light-theme:bg-white light-theme:border-slate-200 lg:col-span-4">
        <h4 className="font-display font-semibold text-white light-theme:text-slate-900">
          Session Inspector
        </h4>
        <p className="text-xs text-slate-400">
          Detailed metrics for selected day
        </p>

        {!selectedDay ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
            <Sparkles className="h-10 w-10 opacity-20 mb-3 animate-pulse text-indigo-400" />
            <p className="text-xs">Select any marked or colored calendar box to inspect roster data logs.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-5 animate-fade-in">
            <div className="rounded-xl bg-white/5 p-3 dark:bg-white/5 light-theme:bg-slate-50">
              <span className="font-mono text-[10px] uppercase text-indigo-400 font-semibold">Inspecting</span>
              <p className="text-sm font-bold text-white light-theme:text-slate-900">{new Date(selectedDay).toDateString()}</p>
            </div>

            {selectedDayData?.holidays.map(h => (
              <div key={h.id} className="rounded-xl border border-sky-400/20 bg-sky-500/5 p-4 text-xs text-sky-400 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>
                  <h5 className="font-bold">Scheduled Holiday: {h.name}</h5>
                  <p className="text-[10px] text-sky-400/80 uppercase tracking-wider">{h.type} Holiday</p>
                </div>
              </div>
            ))}

            {selectedDayData?.attendances.length === 0 ? (
              <div className="text-center py-6 text-slate-500 border border-dashed border-white/10 rounded-xl">
                <p className="text-xs">No attendance marked for this session date.</p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {batches.map(b => (
                    <button
                      key={b.id}
                      onClick={() => onGoToAttendance(b.id, selectedDay)}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-indigo-500 transition"
                    >
                      Log {b.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-300 light-theme:text-slate-700">Attendance Sheets ({selectedDayData?.attendances.length})</p>
                
                {selectedDayData?.attendances.map(att => (
                  <div 
                    key={att.id}
                    className="rounded-xl border border-white/5 bg-slate-950/30 p-4 space-y-3 dark:border-white/5 light-theme:border-slate-200 light-theme:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-white light-theme:text-slate-900">{att.batchName}</h5>
                        <p className="text-[10px] text-slate-400">Session At: {att.time}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                        att.ratio >= 80 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : att.ratio <= 50 
                            ? 'bg-rose-500/10 text-rose-400' 
                            : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {att.ratio}% Present
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Roster size: {att.totalCount} Students</span>
                      <span>Present: {att.presentCount}</span>
                    </div>

                    {/* Progress Ratio */}
                    <div className="h-1.5 w-full rounded-full bg-white/5 light-theme:bg-slate-200 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${att.ratio >= 80 ? 'bg-emerald-500' : att.ratio <= 50 ? 'bg-rose-500' : 'bg-amber-500'}`}
                        style={{ width: `${att.ratio}%` }}
                      />
                    </div>

                    <button
                      onClick={() => onGoToAttendance(att.batchId, selectedDay)}
                      className="w-full rounded-lg border border-indigo-505 bg-indigo-600/10 py-1.5 hover:bg-indigo-600 transition text-[11px] font-semibold text-indigo-400 hover:text-white flex items-center justify-center gap-1.5"
                    >
                      <User className="h-3 w-3" /> Edit Session Marks
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
