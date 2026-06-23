import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Trash2, X, AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Notification } from '../types';
import { db } from '../database/db';

interface NotificationCenterProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onRefresh
}) => {
  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const list = db.getAll<Notification>('notifications');
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      db.set('notifications', list);
      onRefresh();
    }
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    db.delete('notifications', id);
    onRefresh();
  };

  const markAllRead = () => {
    const list = db.getAll<Notification>('notifications');
    list.forEach(n => { n.read = true; });
    db.set('notifications', list);
    onRefresh();
  };

  const clearAll = () => {
    db.set('notifications', []);
    onRefresh();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs" 
            onClick={onClose}
          />
          
          {/* Slider Drawer */}
          <motion.div
            initial={{ x: 380, opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm border-l border-white/5 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-md dark:border-white/5 light-theme:bg-white/95 light-theme:border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 dark:border-white/10 light-theme:border-slate-200">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-400" />
                <h3 className="font-display text-lg font-semibold text-white light-theme:text-slate-900">
                  Notification Hub
                </h3>
                {notifications.some(n => !n.read) && (
                  <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </div>
              <button 
                onClick={onClose} 
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                id="close-notif-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <button 
                onClick={markAllRead} 
                className="flex items-center gap-1 hover:text-indigo-400"
                id="mark-all-read-btn"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
              <button 
                onClick={clearAll} 
                className="flex items-center gap-1 hover:text-red-400"
                id="clear-all-notif-btn"
              >
                <Trash2 className="h-3 w-3" /> Clear all
              </button>
            </div>

            {/* Notification Stack */}
            <div className="mt-4 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                  <Bell className="h-10 w-10 opacity-20 mb-3" />
                  <p className="text-sm">No new notifications</p>
                  <p className="text-xs">Quiet as a mouse.</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const isRead = notif.read;
                  
                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      className={`relative flex gap-3 rounded-xl border p-3.5 transition-all ${
                        isRead 
                          ? 'border-white/5 bg-white/2 dark:border-white/5 dark:bg-white/2 light-theme:border-slate-100 light-theme:bg-slate-50/50' 
                          : 'border-indigo-500/20 bg-indigo-500/5 dark:border-indigo-500/20 dark:bg-indigo-500/5 light-theme:border-indigo-100 light-theme:bg-indigo-50/30'
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                        {notif.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-400" />}
                        {notif.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                        {notif.type === 'info' && <Info className="h-4 w-4 text-sky-400" />}
                      </div>

                      <div className="flex-1 pr-6">
                        <h4 className={`text-xs font-semibold ${isRead ? 'text-slate-300 light-theme:text-slate-700' : 'text-slate-100 light-theme:text-slate-900'}`}>
                          {notif.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="mt-2 block font-mono text-[10px] text-slate-500">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 flex gap-1">
                        {!isRead && (
                          <button
                            onClick={(e) => markAsRead(notif.id, e)}
                            className="rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-emerald-400"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notif.id, e)}
                          className="rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-red-400"
                          title="Delete notification"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
