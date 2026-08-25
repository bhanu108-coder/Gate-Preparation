import React, { useState, useEffect, useRef } from 'react';
import { X, BookPlus, Sparkles, Check, Plus } from 'lucide-react';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSubjects: string[];
  onAddSubject: (subjectName: string) => void;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  existingSubjects,
  onAddSubject,
}) => {
  if (!isOpen) return null;

  const [subjectName, setSubjectName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const presetSuggestions = [
    'Theory of Computation',
    'Compiler Design',
    'Computer Architecture (COA)',
    'Engineering Mathematics',
    'General Aptitude',
    'Software Engineering',
    'Machine Learning & AI',
    'Information Systems',
  ].filter(
    (preset) => !existingSubjects.some((s) => s.toLowerCase() === preset.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSubjectName('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = subjectName.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a subject name.');
      return;
    }

    if (trimmed.toLowerCase() === 'all subjects' || trimmed.toLowerCase() === 'all') {
      setErrorMsg('"All Subjects" is reserved as the global filter.');
      return;
    }

    const isDuplicate = existingSubjects.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMsg(`"${trimmed}" already exists in your subjects list.`);
      return;
    }

    onAddSubject(trimmed);
    onClose();
  };

  const handleSelectPreset = (preset: string) => {
    setSubjectName(preset);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141416] border border-[#27272A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#27272A] bg-[#18181B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/40 flex items-center justify-center font-bold">
              <BookPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] text-[#FAFAFA]">Add New Subject</h3>
              <p className="text-[12px] text-[#A1A1AA]">Organize your syllabus and lectures</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Subject Name *
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Theory of Computation"
              className="w-full px-4 py-2.5 bg-[#18181B] border border-[#27272A] rounded-lg text-[14px] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] focus:bg-[#121214] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all"
            />
            {errorMsg && (
              <p className="text-[12px] text-[#EF4444] mt-1.5 font-medium animate-fadeIn">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Quick Preset Suggestions */}
          {presetSuggestions.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider block">
                Quick Add GATE Subjects:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {presetSuggestions.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="text-[12px] px-2.5 py-1 bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#60A5FA] border border-[#27272A] hover:border-[#3B82F6]/50 rounded-md transition-colors flex items-center gap-1 text-left"
                  >
                    <Plus className="w-3 h-3 text-[#60A5FA]" />
                    <span>{preset}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#27272A] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg font-semibold text-[13px] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!subjectName.trim()}
              className="px-5 py-2 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
