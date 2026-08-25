import React, { useState } from 'react';
import { PYQQuestion, PYQDifficulty, PYQStatus, DigitizedUpload } from '../types';
import {
  Search,
  Upload,
  SlidersHorizontal,
  FileText,
  RefreshCw,
  Clock,
  CheckCircle,
  Circle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Check,
} from 'lucide-react';

interface PYQBankViewProps {
  pyqs: PYQQuestion[];
  digitizedUploads: DigitizedUpload[];
  onSelectPYQ: (pyq: PYQQuestion) => void;
  onOpenUploadModal: () => void;
  onUpdatePYQ: (updated: PYQQuestion) => void;
}

export const PYQBankView: React.FC<PYQBankViewProps> = ({
  pyqs,
  digitizedUploads,
  onSelectPYQ,
  onOpenUploadModal,
  onUpdatePYQ,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>('ALL');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const pageSize = 5;

  // Counts for Bento stats
  const totalCount = pyqs.length;
  const attemptedCount = pyqs.filter((q) => q.status === 'Solved' || q.status === 'Bookmarked').length;
  const unsolvedCount = pyqs.filter((q) => q.status === 'Unsolved' || q.status === 'Pending').length;
  const flaggedCount = pyqs.filter((q) => q.status === 'Flagged').length;

  const filteredPYQs = pyqs.filter((q) => {
    // Status filter
    if (selectedFilterStatus === 'ATTEMPTED' && q.status !== 'Solved' && q.status !== 'Bookmarked') return false;
    if (selectedFilterStatus === 'UNSOLVED' && q.status !== 'Unsolved' && q.status !== 'Pending') return false;
    if (selectedFilterStatus === 'FLAGGED' && q.status !== 'Flagged') return false;

    // Subject filter
    if (selectedSubjectFilter !== 'ALL' && q.subject !== selectedSubjectFilter) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const qLower = searchQuery.toLowerCase();
      const matchText =
        q.subject.toLowerCase().includes(qLower) ||
        q.topic.toLowerCase().includes(qLower) ||
        q.questionText.toLowerCase().includes(qLower) ||
        q.year.toString().includes(qLower);
      if (!matchText) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredPYQs.length / pageSize) || 1;
  const paginatedList = filteredPYQs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderDifficultyBars = (diff: PYQDifficulty) => {
    if (diff === 'Easy') {
      return (
        <div>
          <div className="flex gap-[3px]">
            <span className="w-4 h-1.5 bg-[#10B981] rounded-xs" />
            <span className="w-4 h-1.5 bg-[#27272A] rounded-xs" />
            <span className="w-4 h-1.5 bg-[#27272A] rounded-xs" />
          </div>
          <span className="text-[12px] font-semibold text-[#A1A1AA] mt-1 block">Easy</span>
        </div>
      );
    }
    if (diff === 'Medium') {
      return (
        <div>
          <div className="flex gap-[3px]">
            <span className="w-4 h-1.5 bg-[#10B981] rounded-xs" />
            <span className="w-4 h-1.5 bg-[#10B981] rounded-xs" />
            <span className="w-4 h-1.5 bg-[#27272A] rounded-xs" />
          </div>
          <span className="text-[12px] font-semibold text-[#A1A1AA] mt-1 block">Medium</span>
        </div>
      );
    }
    return (
      <div>
        <div className="flex gap-[3px]">
          <span className="w-4 h-1.5 bg-[#EF4444] rounded-xs" />
          <span className="w-4 h-1.5 bg-[#EF4444] rounded-xs" />
          <span className="w-4 h-1.5 bg-[#EF4444] rounded-xs" />
        </div>
        <span className="text-[12px] font-semibold text-[#A1A1AA] mt-1 block">Hard</span>
      </div>
    );
  };

  const renderStatusBadge = (status: PYQStatus) => {
    if (status === 'Solved') {
      return (
        <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Solved</span>
        </span>
      );
    }
    if (status === 'Flagged') {
      return (
        <span className="px-3 py-1 rounded-full bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
          <Flag className="w-3.5 h-3.5 fill-[#EF4444]" />
          <span>Flagged</span>
        </span>
      );
    }
    if (status === 'Bookmarked') {
      return (
        <span className="px-3 py-1 rounded-full bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bookmarked</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-[#27272A] text-[#A1A1AA] border border-[#3F3F46] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
        <Circle className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div id="pyq-bank-view" className="flex flex-col gap-8 w-full max-w-[1440px] mx-auto pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[32px] md:text-[36px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
            PYQ Bank
          </h2>
          <p className="text-[16px] text-[#A1A1AA] mt-1 font-normal">
            Master previous year questions organized by subject and difficulty.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search topics, keywords, or years..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#141416] rounded-lg border border-[#27272A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] transition-all shadow-xs"
            />
          </div>

          <button
            id="btn-upload-pdf"
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8] transition-colors shadow-xs shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>

          <button
            id="btn-filter-toggle"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center justify-center w-10 h-10 border rounded-lg transition-colors shrink-0 ${
              showFilterDrawer || selectedSubjectFilter !== 'ALL'
                ? 'bg-[#27272A] border-[#3B82F6] text-[#60A5FA]'
                : 'border-[#27272A] bg-[#141416] text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]'
            }`}
            title="Filter by subject"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subject Filter Bar (collapsible / toggleable) */}
      {showFilterDrawer && (
        <div className="bg-[#141416] border border-[#27272A] rounded-xl p-4 flex flex-wrap items-center gap-2 shadow-xs animate-fadeIn">
          <span className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider mr-2">Subject:</span>
          {['ALL', 'Data Structures', 'Algorithms', 'Operating Systems', 'Computer Networks', 'Databases'].map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubjectFilter(sub);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold tracking-wide transition-all ${
                selectedSubjectFilter === sub
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Quick Filters (Bento Stats Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Questions Card */}
        <button
          onClick={() => {
            setSelectedFilterStatus('ALL');
            setCurrentPage(1);
          }}
          className={`p-5 rounded-xl flex flex-col items-start border text-left transition-all ${
            selectedFilterStatus === 'ALL'
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md'
              : 'bg-[#141416] text-[#FAFAFA] border-[#27272A] hover:border-[#3B82F6]'
          }`}
        >
          <span className="text-[12px] font-semibold opacity-90 mb-1 uppercase tracking-wider">
            Total Questions
          </span>
          <span className="text-[28px] font-bold tracking-tight">1,248</span>
        </button>

        {/* Attempted Card */}
        <button
          onClick={() => {
            setSelectedFilterStatus('ATTEMPTED');
            setCurrentPage(1);
          }}
          className={`p-5 rounded-xl border flex flex-col items-start text-left transition-all ${
            selectedFilterStatus === 'ATTEMPTED'
              ? 'bg-[#27272A] text-[#FAFAFA] border-[#3B82F6] shadow-sm'
              : 'bg-[#141416] text-[#FAFAFA] border-[#27272A] hover:border-[#3B82F6]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span className="text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Attempted</span>
          </div>
          <span className="text-[28px] font-bold tracking-tight">842</span>
        </button>

        {/* Unsolved Card */}
        <button
          onClick={() => {
            setSelectedFilterStatus('UNSOLVED');
            setCurrentPage(1);
          }}
          className={`p-5 rounded-xl border flex flex-col items-start text-left transition-all ${
            selectedFilterStatus === 'UNSOLVED'
              ? 'bg-[#27272A] text-[#FAFAFA] border-[#3B82F6] shadow-sm'
              : 'bg-[#141416] text-[#FAFAFA] border-[#27272A] hover:border-[#3B82F6]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#71717A]" />
            <span className="text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Unsolved</span>
          </div>
          <span className="text-[28px] font-bold tracking-tight">356</span>
        </button>

        {/* Flagged Card */}
        <button
          onClick={() => {
            setSelectedFilterStatus('FLAGGED');
            setCurrentPage(1);
          }}
          className={`p-5 rounded-xl border flex flex-col items-start text-left transition-all ${
            selectedFilterStatus === 'FLAGGED'
              ? 'bg-[#450A0A] text-[#F87171] border-[#EF4444] shadow-sm'
              : 'bg-[#141416] text-[#FAFAFA] border-[#27272A] hover:border-[#EF4444]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Flagged</span>
          </div>
          <span className="text-[28px] font-bold tracking-tight">50</span>
        </button>
      </div>

      {/* Recent Uploads & Digitization Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-semibold text-[#FAFAFA] tracking-tight">
            Recent Uploads &amp; Digitization
          </h3>
          <button
            onClick={onOpenUploadModal}
            className="text-[13px] font-semibold text-[#60A5FA] hover:underline"
          >
            Upload New Paper
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {digitizedUploads.map((item) => {
            const isDigitized = item.status === 'DIGITIZED';
            return (
              <div
                key={item.id}
                className="bg-[#141416] p-5 rounded-xl border border-[#27272A] flex gap-4 items-start shadow-xs hover:border-[#3B82F6] transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    isDigitized ? 'bg-[#2563EB]/15 text-[#60A5FA]' : 'bg-[#18181B] text-[#71717A]'
                  }`}
                >
                  {isDigitized ? (
                    <FileText className="w-7 h-7" />
                  ) : (
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[15px] font-bold text-[#FAFAFA] truncate">{item.fileName}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isDigitized
                          ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30'
                          : 'bg-[#27272A] text-[#A1A1AA]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[13px] text-[#A1A1AA] line-clamp-2 italic leading-relaxed">
                    {item.snippet}
                  </p>

                  {!isDigitized && item.progressPercent && (
                    <div className="mt-3">
                      <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#3B82F6] h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-semibold text-[#A1A1AA] mt-1">
                        Extracting text ({item.progressPercent}%)...
                      </p>
                    </div>
                  )}

                  {isDigitized && (
                    <div className="mt-3 flex items-center gap-1 text-[#71717A] text-[12px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.timeAgo}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main PYQ Table Section */}
      <div className="bg-[#141416] rounded-xl border border-[#27272A] shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 p-4 border-b border-[#27272A] bg-[#18181B] text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
          <div className="col-span-2 md:col-span-1">Year</div>
          <div className="col-span-6 md:col-span-5">Subject / Topic</div>
          <div className="hidden md:block md:col-span-2">Difficulty</div>
          <div className="col-span-4 md:col-span-2 text-center">Status</div>
          <div className="hidden md:block md:col-span-2 text-right">Action</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col divide-y divide-[#27272A]">
          {paginatedList.map((q) => {
            const isSolved = q.status === 'Solved';
            return (
              <div
                key={q.id}
                onClick={() => onSelectPYQ(q)}
                className="grid grid-cols-12 gap-3 p-4 items-center hover:bg-[#18181B] transition-colors group cursor-pointer"
              >
                {/* Year */}
                <div className="col-span-2 md:col-span-1 text-[13px] font-semibold text-[#A1A1AA]">
                  {q.year}
                </div>

                {/* Subject & Topic */}
                <div className="col-span-6 md:col-span-5">
                  <p className="text-[15px] font-bold text-[#FAFAFA] group-hover:text-[#60A5FA] transition-colors truncate">
                    {q.subject}
                  </p>
                  <p className="text-[13px] text-[#A1A1AA] truncate mt-0.5">{q.topic}</p>
                </div>

                {/* Difficulty Bars */}
                <div className="hidden md:block md:col-span-2">{renderDifficultyBars(q.difficulty)}</div>

                {/* Status Badge */}
                <div className="col-span-4 md:col-span-2 flex justify-center">
                  {renderStatusBadge(q.status)}
                </div>

                {/* Action button */}
                <div className="hidden md:flex md:col-span-2 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPYQ(q);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold tracking-wide transition-all shadow-xs ${
                      isSolved
                        ? 'border border-[#3B82F6] text-[#60A5FA] hover:bg-[#2563EB] hover:text-white'
                        : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                    }`}
                  >
                    {isSolved ? 'Review' : q.status === 'Flagged' ? 'Resume' : 'Attempt'}
                  </button>
                </div>
              </div>
            );
          })}

          {paginatedList.length === 0 && (
            <div className="p-8 text-center text-[#71717A]">
              No questions found matching your search or filters.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 flex justify-between items-center bg-[#141416] border-t border-[#27272A]">
          <span className="text-[13px] text-[#A1A1AA]">
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, filteredPYQs.length)} of {filteredPYQs.length} (Total 1,248 in database)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-[#A1A1AA] hover:text-[#60A5FA] hover:bg-[#18181B] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-[13px] font-semibold text-[#FAFAFA] px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-[#A1A1AA] hover:text-[#60A5FA] hover:bg-[#18181B] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
