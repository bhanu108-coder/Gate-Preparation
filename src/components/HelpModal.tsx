import React from 'react';
import { X, HelpCircle, BookOpen, Video, FileText, CheckCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141416] border border-[#27272A] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#27272A] bg-[#18181B] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[16px] text-[#FAFAFA]">
            <HelpCircle className="w-5 h-5 text-[#60A5FA]" />
            <span>GATE Mastery Quick Guide</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-[14px] text-[#FAFAFA]">
          <div className="space-y-3">
            <div className="flex gap-3">
              <Video className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Curate YouTube Playlists</h4>
                <p className="text-[13px] text-[#A1A1AA] mt-0.5">
                  Paste any YouTube playlist or lecture URL to track completion, mark covered concepts, and take synchronized notes with timestamps.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Digitize GATE Question Papers</h4>
                <p className="text-[13px] text-[#A1A1AA] mt-0.5">
                  Upload official GATE PDFs to auto-extract previous year questions, options, mathematical solutions, and formula summaries.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Daily 4-Hour Target Planner</h4>
                <p className="text-[13px] text-[#A1A1AA] mt-0.5">
                  Check off sessions in the Study Schedule to maintain your 14-day streak and reach full syllabus readiness before exam day.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#18181B] border-t border-[#27272A] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
