import React from 'react';
import { X, Bell, Flame, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: any) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: '14-Day Study Streak Active! 🔥',
      message: 'You have completed today\'s syllabus block for Data Structures. 4 hours completed!',
      time: '15 mins ago',
      type: 'streak',
      action: () => onNavigate('dashboard'),
    },
    {
      id: '2',
      title: 'PDF Digitization Complete',
      message: 'GATE_2020_CS_Set1.pdf was digitized into 65 interactive practice questions with solutions.',
      time: '2 hours ago',
      type: 'digitize',
      action: () => onNavigate('pyq-bank'),
    },
    {
      id: '3',
      title: 'Study Reminder: TCP & Subnetting',
      message: 'Scheduled revision for Computer Networks is coming up at 03:00 PM today.',
      time: '4 hours ago',
      type: 'reminder',
      action: () => onNavigate('schedule'),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex justify-end animate-fadeIn">
      <div className="bg-[#141416] w-full max-w-md h-full shadow-2xl border-l border-[#27272A] flex flex-col animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-[#27272A] bg-[#18181B] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[16px] text-[#FAFAFA]">
            <Bell className="w-5 h-5 text-[#60A5FA]" />
            <span>Academic Notifications</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto divide-y divide-[#27272A] flex-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                n.action();
                onClose();
              }}
              className="py-4 hover:bg-[#18181B] rounded-xl p-3 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[14px] font-bold text-[#FAFAFA] group-hover:text-[#60A5FA] transition-colors">
                  {n.title}
                </h4>
                <span className="text-[11px] text-[#71717A]">{n.time}</span>
              </div>
              <p className="text-[13px] text-[#A1A1AA] leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#27272A] bg-[#18181B] text-center">
          <button
            onClick={onClose}
            className="text-[13px] font-semibold text-[#60A5FA] hover:underline"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
