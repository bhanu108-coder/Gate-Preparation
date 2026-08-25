import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Plus,
  Flame,
  Target,
  Sparkles,
  BookOpen,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyScheduleViewProps {
  schedule: ScheduleItem[];
  onToggleScheduleItem: (id: string) => void;
  onAddScheduleItem: (item: ScheduleItem) => void;
}

export const StudyScheduleView: React.FC<StudyScheduleViewProps> = ({
  schedule,
  onToggleScheduleItem,
  onAddScheduleItem,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Data Structures');
  const [newTime, setNewTime] = useState('07:00 PM - 08:30 PM');
  const [newDuration, setNewDuration] = useState('1h 30m');
  const [showAddForm, setShowAddForm] = useState(false);

  const completedCount = schedule.filter((s) => s.isCompleted).length;
  const totalPlannedHours = 4.0;
  const completedHours = completedCount * 1.0;

  const handleToggle = (id: string) => {
    onToggleScheduleItem(id);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: ScheduleItem = {
      id: `s-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      time: newTime,
      duration: newDuration,
      isCompleted: false,
      type: 'Revision',
    };

    onAddScheduleItem(item);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div id="study-schedule-view" className="flex flex-col gap-8 w-full max-w-[1440px] mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[32px] md:text-[36px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
            Study Schedule &amp; Daily Target
          </h2>
          <p className="text-[17px] text-[#A1A1AA] mt-1 font-normal">
            You have <span className="font-semibold text-[#FAFAFA]">4 hours of planned study</span> today. Keep momentum!
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add Study Block'}</span>
        </button>
      </div>

      {/* Target Pace Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider">Today's Progress</span>
            <span className="text-[12px] font-bold text-[#34D399] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full border border-[#10B981]/30">
              {completedCount} / {schedule.length} Blocks
            </span>
          </div>
          <div className="my-3">
            <div className="flex justify-between text-[14px] font-semibold text-[#FAFAFA] mb-1">
              <span>Completed Study</span>
              <span>{Math.round((completedCount / Math.max(schedule.length, 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-[#27272A] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#10B981] h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / Math.max(schedule.length, 1)) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-[13px] text-[#A1A1AA]">Target pace: 4 planned hours per weekday.</p>
        </div>

        <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider">Exam Countdown</span>
            <p className="text-[28px] font-bold text-[#FAFAFA] mt-1">142 Days</p>
            <p className="text-[13px] text-[#A1A1AA] mt-0.5">GATE CS &amp; IT Exam Window</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/15 text-[#60A5FA] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider">Active Streak</span>
            <p className="text-[28px] font-bold text-[#FAFAFA] mt-1">14 Days</p>
            <p className="text-[13px] text-[#34D399] font-semibold mt-0.5">+5% higher syllabus coverage</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/15 text-[#60A5FA] flex items-center justify-center">
            <Flame className="w-6 h-6 fill-[#60A5FA]" />
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddNew} className="bg-[#141416] border border-[#27272A] rounded-xl p-6 shadow-xs animate-fadeIn space-y-4">
          <h3 className="text-[16px] font-bold text-[#FAFAFA]">Schedule a New Study Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase block mb-1">Session Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Graph Theory PYQs"
                className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase block mb-1">Subject</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] outline-none focus:border-[#3B82F6]"
              >
                <option value="Data Structures">Data Structures</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Digital Logic">Digital Logic</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase block mb-1">Time Slot</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase block mb-1">Duration</label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA] rounded-lg text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8]"
            >
              Add Block
            </button>
          </div>
        </form>
      )}

      {/* Schedule Timeline List */}
      <div className="bg-[#141416] border border-[#27272A] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#18181B] border-b border-[#27272A] flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-[15px] text-[#FAFAFA]">
            <CalendarIcon className="w-4 h-4 text-[#60A5FA]" />
            <span>Today's Study Plan</span>
          </div>
          <span className="text-[12px] font-semibold text-[#A1A1AA]">
            Click item to toggle completion status
          </span>
        </div>

        <div className="divide-y divide-[#27272A]">
          {schedule.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`p-5 flex items-center justify-between hover:bg-[#18181B] transition-colors cursor-pointer group ${
                  item.isCompleted ? 'bg-[#121214]/60' : 'bg-[#141416]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      item.isCompleted
                        ? 'bg-[#10B981] border-[#10B981] text-white'
                        : 'border-[#52525B] group-hover:border-[#3B82F6]'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold tracking-wider text-[#60A5FA] uppercase">
                        {item.subject}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#27272A] text-[#FAFAFA] font-semibold border border-[#3F3F46]">
                        {item.type}
                      </span>
                    </div>
                    <h4
                      className={`text-[16px] font-bold mt-0.5 transition-all ${
                        item.isCompleted ? 'line-through text-[#71717A]' : 'text-[#FAFAFA]'
                      }`}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#FAFAFA]">
                      <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>{item.time}</span>
                    </div>
                    <span className="text-[12px] text-[#A1A1AA]">{item.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
