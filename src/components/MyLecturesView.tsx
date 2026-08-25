import React, { useState } from 'react';
import { Lecture, SubjectFilter } from '../types';
import {
  Plus,
  Link2,
  Search,
  PlayCircle,
  MoreVertical,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';

interface MyLecturesViewProps {
  lectures: Lecture[];
  onSelectLecture: (lecture: Lecture) => void;
  onOpenAddLectureModal: () => void;
  onAddLectureFromUrl: (url: string) => void;
  onRemoveLecture: (id: string) => void;
}

export const MyLecturesView: React.FC<MyLecturesViewProps> = ({
  lectures,
  onSelectLecture,
  onOpenAddLectureModal,
  onAddLectureFromUrl,
  onRemoveLecture,
}) => {
  const [activeSubject, setActiveSubject] = useState<SubjectFilter>('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [pastedUrl, setPastedUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchSuccessMsg, setFetchSuccessMsg] = useState('');
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const subjects: SubjectFilter[] = [
    'All Subjects',
    'Digital Logic',
    'Algorithms',
    'Data Structures',
    'OS',
  ];

  const filteredLectures = lectures.filter((lec) => {
    const matchesSubject = activeSubject === 'All Subjects' || lec.subject === activeSubject;
    const matchesSearch =
      searchQuery.trim() === '' ||
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleFetch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pastedUrl.trim()) return;

    setIsFetching(true);
    setTimeout(() => {
      onAddLectureFromUrl(pastedUrl);
      setIsFetching(false);
      setFetchSuccessMsg('Playlist analyzed and added to workspace!');
      setPastedUrl('');
      setTimeout(() => setFetchSuccessMsg(''), 4000);
    }, 600);
  };

  const handleConfirmDelete = () => {
    if (lectureToDelete) {
      onRemoveLecture(lectureToDelete.id);
      setLectureToDelete(null);
      setActiveMenuId(null);
    }
  };

  return (
    <div id="my-lectures-view" className="flex flex-col gap-8 w-full max-w-[1440px] mx-auto pb-12 animate-fadeIn">
      {/* Header Section & Add Lecture Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[32px] md:text-[36px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
            My Lectures
          </h2>
          <p className="text-[17px] text-[#A1A1AA] max-w-2xl font-normal">
            Manage your curated YouTube playlists and track your subject-wise progress ({lectures.length} total).
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <button
            id="btn-add-lecture-lectures-view"
            onClick={onOpenAddLectureModal}
            className="w-full md:w-auto bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-semibold text-[13px] tracking-wide flex items-center justify-center gap-2 hover:bg-[#1D4ED8] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lecture</span>
          </button>
        </div>
      </div>

      {/* Add Link Input Area (Bento-style card) */}
      <div className="glass-card rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden group shadow-xs">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/10 to-transparent pointer-events-none" />

        <label className="text-[12px] font-semibold text-[#A1A1AA] tracking-wider uppercase relative z-10 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#60A5FA]" />
          <span>Paste YouTube Playlist or Video Link</span>
        </label>

        <form onSubmit={handleFetch} className="flex flex-col sm:flex-row gap-3 relative z-10">
          <div className="relative flex-1">
            <input
              id="input-youtube-url"
              type="text"
              value={pastedUrl}
              onChange={(e) => setPastedUrl(e.target.value)}
              placeholder="https://youtube.com/playlist?list=... or https://youtu.be/..."
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-3 text-[14px] text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#3B82F6] focus:bg-[#141416] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isFetching || !pastedUrl.trim()}
            className="bg-[#18181B] text-[#60A5FA] border border-[#2563EB]/40 px-6 py-3 rounded-lg font-semibold text-[13px] hover:bg-[#2563EB] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center justify-center gap-2"
          >
            {isFetching ? (
              <>
                <div className="w-4 h-4 border-2 border-[#60A5FA] border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Playlist...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Fetch Details</span>
              </>
            )}
          </button>
        </form>

        {fetchSuccessMsg && (
          <div className="relative z-10 flex items-center gap-2 text-[13px] text-[#34D399] font-medium mt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{fetchSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#141416] p-2 rounded-xl border border-[#27272A] shadow-xs">
        <div className="flex overflow-x-auto w-full sm:w-auto hide-scrollbar gap-1.5 p-1">
          {subjects.map((sub) => {
            const isActive = activeSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#27272A] text-[#FAFAFA] shadow-xs border border-[#3F3F46]'
                    : 'hover:bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA]'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72 shrink-0 p-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lectures..."
            className="w-full bg-[#18181B] border border-[#27272A] rounded-lg pl-10 pr-4 py-2 text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#3B82F6] focus:bg-[#141416] focus:ring-1 focus:ring-[#3B82F6] transition-all"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLectures.map((lec) => {
          const isMenuOpen = activeMenuId === lec.id;
          return (
            <div
              key={lec.id}
              onClick={() => onSelectLecture(lec)}
              className="bg-[#141416] border border-[#27272A] rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:border-[#3B82F6] hover:bg-[#18181B] transition-all duration-200 relative"
            >
              {/* Thumbnail preview */}
              <div className="w-full aspect-video video-gradient relative flex items-center justify-center overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-md">
                  <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-between items-end">
                  <span className="text-white text-[11px] font-semibold bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
                    {lec.videoCount} {lec.videoCount === 1 ? 'Video' : 'Videos'}
                  </span>
                  <span className="text-white text-[11px] font-semibold bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
                    {lec.duration}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1.5 relative">
                    <span className="text-[11px] font-bold tracking-wider text-[#60A5FA] uppercase">
                      {lec.subject}
                    </span>

                    {/* Action buttons on card header */}
                    <div className="flex items-center gap-1">
                      {/* Direct Remove Button */}
                      <button
                        title="Remove lecture from workspace"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLectureToDelete(lec);
                        }}
                        className="text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 p-1.5 rounded-lg transition-colors"
                        aria-label="Remove lecture"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : lec.id);
                        }}
                        className="text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#27272A] p-1.5 rounded-lg transition-colors"
                        aria-label="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-8 z-30 w-48 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl py-1.5 animate-fadeIn"
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onSelectLecture(lec);
                            }}
                            className="w-full px-3.5 py-2 text-left text-[13px] text-[#FAFAFA] hover:bg-[#27272A] flex items-center gap-2 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-[#60A5FA]" />
                            <span>Open &amp; Study</span>
                          </button>
                          <div className="my-1 border-t border-[#27272A]" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              setLectureToDelete(lec);
                            }}
                            className="w-full px-3.5 py-2 text-left text-[13px] text-[#EF4444] hover:bg-[#EF4444]/15 flex items-center gap-2 transition-colors font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove Lecture</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-[17px] font-bold text-[#FAFAFA] group-hover:text-[#60A5FA] transition-colors line-clamp-2 leading-snug">
                    {lec.title}
                  </h3>
                  <p className="text-[13px] text-[#A1A1AA] mt-1">{lec.module}</p>
                </div>

                {/* Progress bar and metrics */}
                <div className="mt-4 pt-3 border-t border-[#27272A] flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[12px] text-[#A1A1AA]">
                    <span>Progress</span>
                    <span className="font-bold text-[#FAFAFA]">{lec.progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#27272A] rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                      style={{ width: `${lec.progressPercent}%` }}
                    />
                    {/* Target marker */}
                    {lec.targetPercent > 0 && (
                      <div
                        className="absolute top-0 bottom-0 border-l-2 border-dotted border-[#A1A1AA]/60 z-10"
                        style={{ left: `${lec.targetPercent}%` }}
                        title={`Target: ${lec.targetPercent}%`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLectures.length === 0 && (
        <div className="text-center py-16 bg-[#141416] border border-dashed border-[#27272A] rounded-xl p-8">
          <p className="text-[16px] text-[#A1A1AA] font-medium">No lectures found matching your criteria.</p>
          <button
            onClick={() => {
              setActiveSubject('All Subjects');
              setSearchQuery('');
            }}
            className="mt-4 text-[#60A5FA] font-semibold text-[13px] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Confirmation Modal for Removing Lecture */}
      {lectureToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141416] border border-[#27272A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#27272A] bg-[#18181B] flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[#EF4444]">
                <div className="p-1.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[16px] text-[#FAFAFA]">Remove Lecture</h3>
              </div>
              <button
                onClick={() => setLectureToDelete(null)}
                className="p-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-[#FAFAFA] leading-relaxed">
                Are you sure you want to remove <span className="font-semibold text-[#60A5FA]">"{lectureToDelete.title}"</span> from your workspace?
              </p>
              <div className="p-3.5 bg-[#18181B] border border-[#27272A] rounded-xl text-[12px] text-[#A1A1AA] space-y-1">
                <p>• Subject: <strong className="text-[#FAFAFA]">{lectureToDelete.subject}</strong></p>
                <p>• Module: <strong className="text-[#FAFAFA]">{lectureToDelete.module}</strong></p>
                <p>• All saved timestamps, notes, and checklist items will be cleared.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#27272A] bg-[#18181B] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLectureToDelete(null)}
                className="px-4 py-2 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg font-semibold text-[13px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-[#EF4444] text-white rounded-lg font-semibold text-[13px] hover:bg-[#DC2626] transition-colors shadow-xs flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Lecture</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

