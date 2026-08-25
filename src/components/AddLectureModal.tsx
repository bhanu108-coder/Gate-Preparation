import React, { useState } from 'react';
import { Lecture } from '../types';
import { X, Youtube, Plus, Sparkles, Check, BookPlus } from 'lucide-react';

interface AddLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects?: string[];
  onAddLecture: (lecture: Lecture) => void;
  onAddSubject?: (subjectName: string) => void;
}

export const AddLectureModal: React.FC<AddLectureModalProps> = ({
  isOpen,
  onClose,
  subjects = [
    'Data Structures',
    'Algorithms',
    'Digital Logic',
    'OS',
    'Computer Networks',
    'Databases',
    'Discrete Math',
  ],
  onAddLecture,
  onAddSubject,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0] || 'Data Structures');
  const [module, setModule] = useState('Unit 1 • Fundamentals');
  const [videoCount, setVideoCount] = useState(1);
  const [duration, setDuration] = useState('1h 15m');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingNewSubject, setIsCreatingNewSubject] = useState(false);
  const [newSubjectInput, setNewSubjectInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalSubject = subject;
    if (isCreatingNewSubject && newSubjectInput.trim()) {
      finalSubject = newSubjectInput.trim();
      if (onAddSubject) {
        onAddSubject(finalSubject);
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newLec: Lecture = {
        id: `lec-${Date.now()}`,
        title: title.trim(),
        subject: finalSubject,
        module,
        videoCount: Number(videoCount) || 1,
        duration: duration || '1h 00m',
        durationSeconds: 3600,
        currentTimeSeconds: 0,
        progressPercent: 0,
        targetPercent: 50,
        isCompleted: false,
        videoUrl: playlistUrl,
        concepts: [
          {
            id: `c-${Date.now()}-1`,
            title: `${title} Overview & Key Theorems`,
            description: 'Core foundational principles tested in GATE.',
            completed: false,
          },
          {
            id: `c-${Date.now()}-2`,
            title: 'Sample Problem Solving & Complexity',
            description: 'Step by step numerical deductions.',
            completed: false,
          },
        ],
        notes: [],
      };

      onAddLecture(newLec);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  const handleAutoFillSample = () => {
    setTitle('Theory of Computation: DFA Minimization & Myhill-Nerode');
    setSubject('Algorithms');
    setModule('TOC & Automata • Unit 2');
    setVideoCount(4);
    setDuration('2h 45m');
    setPlaylistUrl('https://youtube.com/playlist?list=PLBlnK6fEyqRgp46ElvKh1_YB42GPEQUMT');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141416] border border-[#27272A] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#27272A] bg-[#18181B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#FAFAFA]">Add New Lecture / Playlist</h3>
              <p className="text-[12px] text-[#A1A1AA]">Curate study materials for your syllabus tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider">
              Lecture Title *
            </label>
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="text-[11px] font-semibold text-[#60A5FA] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Example TOC Course</span>
            </button>
          </div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Complete Combinational Circuits Crash Course"
            className="w-full px-4 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[14px] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
                  Subject
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewSubject(!isCreatingNewSubject)}
                  className="text-[11px] font-bold text-[#60A5FA] hover:underline"
                >
                  {isCreatingNewSubject ? 'Select existing' : '+ New Subject'}
                </button>
              </div>

              {isCreatingNewSubject ? (
                <input
                  type="text"
                  required
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                  placeholder="Enter subject name..."
                  className="w-full px-3 py-2.5 bg-[#18181B] border border-[#3B82F6] rounded-lg text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus:ring-1 focus:ring-[#3B82F6] outline-none"
                />
              ) : (
                <select
                  value={subject}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setIsCreatingNewSubject(true);
                    } else {
                      setSubject(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] focus:border-[#3B82F6] outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="__add_new__">+ Add New Subject...</option>
                </select>
              )}
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Module / Unit
              </label>
              <input
                type="text"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                placeholder="e.g. Unit 3 • Trees"
                className="w-full px-3 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Total Videos
              </label>
              <input
                type="number"
                min={1}
                value={videoCount}
                onChange={(e) => setVideoCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3h 30m"
                className="w-full px-3 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
              YouTube Playlist Link (Optional)
            </label>
            <div className="relative">
              <Youtube className="w-4 h-4 text-[#EF4444] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://youtube.com/playlist?list=..."
                className="w-full pl-10 pr-3 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-[#27272A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA] rounded-lg font-semibold text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !title.trim()}
              className="px-6 py-2 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8] transition-colors shadow-xs flex items-center gap-2"
            >
              {isProcessing ? 'Adding...' : 'Add to Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
