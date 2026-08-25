import React, { useState } from 'react';
import { avatarUrls } from '../data/initialData';
import { User, Bell, Target, Shield, BookOpen, Check, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [name, setName] = useState('Scholar Bhanu');
  const [email, setEmail] = useState('bhanukushwaha8055@gmail.com');
  const [targetExamYear, setTargetExamYear] = useState('2025');
  const [targetRank, setTargetRank] = useState('Top 100');
  const [dailyGoalHours, setDailyGoalHours] = useState('4');
  const [emailDigest, setEmailDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-view" className="flex flex-col gap-8 w-full max-w-[1000px] mx-auto pb-12 animate-fadeIn">
      <div>
        <h2 className="text-[32px] md:text-[36px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
          Academic Workspace Settings
        </h2>
        <p className="text-[17px] text-[#A1A1AA] mt-1">
          Configure your GATE targets, profile preferences, and study synchronization.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="text-[18px] font-bold text-[#FAFAFA] flex items-center gap-2 border-b border-[#27272A] pb-3">
            <User className="w-5 h-5 text-[#60A5FA]" />
            <span>Profile &amp; Credentials</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={avatarUrls.scholar}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full border-2 border-[#2563EB] object-cover shadow-sm"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-[16px] font-bold text-[#FAFAFA]">{name}</h4>
              <p className="text-[13px] text-[#A1A1AA]">{email}</p>
              <span className="inline-block px-2.5 py-0.5 bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-[11px] font-bold uppercase rounded-full">
                GATE CS Scholar • 14 Day Streak
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[12px] font-bold text-[#A1A1AA] uppercase block mb-1">Scholar Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[14px] text-[#FAFAFA] focus:border-[#3B82F6] outline-none"
              />
            </div>
            <div>
              <label className="text-[12px] font-bold text-[#A1A1AA] uppercase block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[14px] text-[#FAFAFA] focus:border-[#3B82F6] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Academic Goals Card */}
        <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="text-[18px] font-bold text-[#FAFAFA] flex items-center gap-2 border-b border-[#27272A] pb-3">
            <Target className="w-5 h-5 text-[#60A5FA]" />
            <span>Target Exam &amp; Study Schedule</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[12px] font-bold text-[#A1A1AA] uppercase block mb-1">Target GATE Year</label>
              <select
                value={targetExamYear}
                onChange={(e) => setTargetExamYear(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[14px] text-[#FAFAFA] focus:border-[#3B82F6] outline-none"
              >
                <option value="2025">GATE 2025 (142 Days Remaining)</option>
                <option value="2026">GATE 2026</option>
                <option value="2027">GATE 2027</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#A1A1AA] uppercase block mb-1">Target AIR</label>
              <input
                type="text"
                value={targetRank}
                onChange={(e) => setTargetRank(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[14px] text-[#FAFAFA] focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#A1A1AA] uppercase block mb-1">Daily Study Target</label>
              <select
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[14px] text-[#FAFAFA] focus:border-[#3B82F6] outline-none"
              >
                <option value="2">2 Hours / Day</option>
                <option value="4">4 Hours / Day (Recommended)</option>
                <option value="6">6 Hours / Day (Sprint)</option>
                <option value="8">8 Hours / Day (Full-time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Save */}
        <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="chk-digest"
              checked={emailDigest}
              onChange={(e) => setEmailDigest(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded border-[#52525B] bg-[#18181B] focus:ring-[#3B82F6]"
            />
            <label htmlFor="chk-digest" className="text-[14px] text-[#FAFAFA] font-medium cursor-pointer">
              Enable Daily Target reminders &amp; PYQ streak alerts
            </label>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-[13px] text-[#34D399] font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Preferences Saved!</span>
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8] transition-colors shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
