import React from 'react';
import { Lecture, PYQQuestion, NavView } from '../types';
import { TrendingUp, Clock, Flame, PlayCircle, Plus, CheckCircle, ExternalLink, Play } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: NavView) => void;
  onSelectLecture: (lecture: Lecture) => void;
  onSelectPYQ: (pyq: PYQQuestion) => void;
  onOpenAddLecture: () => void;
  lectures: Lecture[];
  pyqs: PYQQuestion[];
  streakDays?: number;
  completedLecturesCount?: number;
  totalLecturesCount?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectLecture,
  onSelectPYQ,
  onOpenAddLecture,
  lectures,
  pyqs,
  streakDays = 14,
  completedLecturesCount = 42,
  totalLecturesCount = 120,
}) => {
  const currentlyWatching = lectures.find((l) => l.id === 'lec-5') || lectures[0];
  const recentPYQs = pyqs.slice(0, 4);

  // Calculate live syllabus coverage and PYQ mastery
  const syllabusPercent = 68;
  const pyqSolvedCount = pyqs.filter((q) => q.status === 'Solved').length;
  const pyqPercent = Math.round((pyqSolvedCount / Math.max(pyqs.length, 1)) * 100);

  return (
    <div id="dashboard-view" className="flex flex-col gap-8 w-full max-w-[1440px] mx-auto pb-12 animate-fadeIn">
      {/* Header Greeting Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[32px] md:text-[36px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
            Good morning, Scholar.
          </h2>
          <p className="text-[17px] text-[#A1A1AA] mt-1 font-normal">
            You have <span className="font-semibold text-[#FAFAFA]">4 hours</span> of planned study today. Let's get to work.
          </p>
        </div>

        <button
          id="btn-add-lecture-dashboard-mobile"
          onClick={onOpenAddLecture}
          className="md:hidden w-full bg-[#2563EB] text-white px-5 py-3 rounded-full font-semibold text-[13px] tracking-wide flex items-center justify-center gap-2 shadow-sm hover:bg-[#1D4ED8] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lecture</span>
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Overall Progress Card (Takes up 8 columns) */}
        <div className="md:col-span-8 bg-[#141416] border border-[#27272A] rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-[#3B82F6]/50 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[20px] font-semibold text-[#FAFAFA] tracking-tight">GATE 2025 Readiness</h3>
              <p className="text-[14px] text-[#A1A1AA] mt-1">Based on syllabus completion and mock scores</p>
            </div>
            <span className="bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 px-3 py-1 rounded-full text-[12px] font-semibold tracking-wider uppercase">
              On Track
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6 my-2">
            {/* Syllabus Coverage Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Syllabus Coverage
                </span>
                <span className="text-[12px] font-bold text-[#FAFAFA]">{syllabusPercent}%</span>
              </div>
              <div className="h-3 w-full bg-[#27272A] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${syllabusPercent}%` }}
                />
                {/* Target Pace Marker at 75% */}
                <div
                  className="absolute top-0 bottom-0 border-l-2 border-dashed border-[#A1A1AA]/60"
                  style={{ left: '75%' }}
                  title="Target Pace (75%)"
                />
              </div>
            </div>

            {/* PYQ Mastery Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  PYQ Mastery
                </span>
                <span className="text-[12px] font-bold text-[#FAFAFA]">{pyqPercent || 42}%</span>
              </div>
              <div className="h-3 w-full bg-[#27272A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3B82F6] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pyqPercent || 42}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card footer metrics */}
          <div className="mt-6 pt-4 border-t border-[#27272A] flex flex-wrap gap-6 text-[13px] text-[#A1A1AA]">
            <div className="flex items-center gap-1.5 font-medium text-[#34D399]">
              <TrendingUp className="w-4 h-4" />
              <span>+5% this week</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-[#A1A1AA]">
              <Clock className="w-4 h-4" />
              <span>142 days remaining for GATE 2025</span>
            </div>
          </div>
        </div>

        {/* Quick Stats (Takes up 4 columns) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Study Streak */}
          <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 flex items-center justify-between hover:border-[#3B82F6]/50 transition-all">
            <div>
              <p className="text-[12px] font-semibold text-[#A1A1AA] mb-1 uppercase tracking-wider">Study Streak</p>
              <p className="text-[28px] font-bold text-[#FAFAFA] tracking-tight">{streakDays} Days</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/15 flex items-center justify-center text-[#60A5FA]">
              <Flame className="w-6 h-6 fill-[#60A5FA]" />
            </div>
          </div>

          {/* Lectures Watched */}
          <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 flex items-center justify-between hover:border-[#3B82F6]/50 transition-all">
            <div>
              <p className="text-[12px] font-semibold text-[#A1A1AA] mb-1 uppercase tracking-wider">Lectures Watched</p>
              <p className="text-[28px] font-bold text-[#FAFAFA] tracking-tight">
                {completedLecturesCount}
                <span className="text-[16px] text-[#A1A1AA] font-normal ml-1.5">/ {totalLecturesCount}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#27272A] flex items-center justify-center text-[#A1A1AA]">
              <PlayCircle className="w-6 h-6 fill-[#71717A]/30 text-[#A1A1AA]" />
            </div>
          </div>
        </div>

        {/* Currently Watching (Video Card Placeholder - 6 columns) */}
        <div
          id="currently-watching-card"
          onClick={() => onSelectLecture(currentlyWatching)}
          className="md:col-span-6 bg-[#141416] border border-[#27272A] rounded-xl overflow-hidden flex flex-col hover:border-[#3B82F6] transition-all cursor-pointer group"
        >
          <div className="aspect-video relative bg-gradient-to-br from-[#1F1F23] to-[#0A0A0A] flex items-center justify-center overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-between items-end">
              <span className="text-white text-[12px] font-semibold px-2.5 py-1 bg-black/70 rounded backdrop-blur-xs border border-white/10">
                45:20 / 1:12:00
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLecture(currentlyWatching);
                }}
                className="text-white text-[12px] font-semibold border border-white/30 px-3 py-1 rounded hover:bg-white/20 transition-colors"
              >
                Mark as Watched
              </button>
            </div>
          </div>

          <div className="p-6">
            <span className="text-[12px] font-bold text-[#60A5FA] uppercase tracking-wider mb-1.5 block">
              Currently Watching
            </span>
            <h3 className="text-[19px] font-bold text-[#FAFAFA] group-hover:text-[#60A5FA] transition-colors leading-snug mb-1">
              {currentlyWatching.title}
            </h3>
            <p className="text-[14px] text-[#A1A1AA]">{currentlyWatching.module}</p>
          </div>
        </div>

        {/* Recent PYQ Attempts List (6 columns) */}
        <div className="md:col-span-6 bg-[#141416] border border-[#27272A] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[20px] font-semibold text-[#FAFAFA] tracking-tight">Recent PYQ Attempts</h3>
              <button
                id="btn-view-all-pyqs"
                onClick={() => onNavigate('pyq-bank')}
                className="text-[13px] font-semibold text-[#60A5FA] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    <th className="py-3 text-[11px] font-bold text-[#71717A] uppercase tracking-wider w-16">Year</th>
                    <th className="py-3 text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Subject</th>
                    <th className="py-3 text-[11px] font-bold text-[#71717A] uppercase tracking-wider w-24">
                      Difficulty
                    </th>
                    <th className="py-3 text-[11px] font-bold text-[#71717A] uppercase tracking-wider text-right w-24">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-[#FAFAFA]">
                  {recentPYQs.map((q) => {
                    const difficultyColor =
                      q.difficulty === 'Hard'
                        ? 'text-[#F87171]'
                        : q.difficulty === 'Medium'
                        ? 'text-[#60A5FA]'
                        : 'text-[#34D399]';

                    const statusBadge =
                      q.status === 'Solved' ? (
                        <span className="inline-block bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase">
                          Solved
                        </span>
                      ) : q.status === 'Bookmarked' ? (
                        <span className="inline-block bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase">
                          Bookmarked
                        </span>
                      ) : q.status === 'Flagged' ? (
                        <span className="inline-block bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase">
                          Flagged
                        </span>
                      ) : (
                        <span className="inline-block border border-[#3F3F46] text-[#A1A1AA] px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase">
                          {q.status}
                        </span>
                      );

                    return (
                      <tr
                        key={q.id}
                        onClick={() => onSelectPYQ(q)}
                        className="border-b border-[#27272A] last:border-0 hover:bg-[#18181B] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 text-[#A1A1AA] font-medium">{q.year}</td>
                        <td className="py-3 font-semibold text-[#FAFAFA] group-hover:text-[#60A5FA] transition-colors">
                          {q.subject} - {q.topic}
                        </td>
                        <td className={`py-3 font-semibold ${difficultyColor}`}>{q.difficulty}</td>
                        <td className="py-3 text-right">{statusBadge}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 text-right">
            <button
              onClick={() => onNavigate('pyq-bank')}
              className="text-[12px] font-medium text-[#71717A] hover:text-[#60A5FA]"
            >
              Showing latest attempts • Click row to review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
