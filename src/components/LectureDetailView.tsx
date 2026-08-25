import React, { useState, useEffect, useRef } from 'react';
import { Lecture, LectureNote, ConceptItem } from '../types';
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle,
  ArrowRight,
  Download,
  Send,
  Sparkles,
  Volume2,
  Maximize,
  RotateCcw,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LectureDetailViewProps {
  lecture: Lecture;
  onBack: () => void;
  onNextLecture?: () => void;
  onUpdateLecture: (updated: Lecture) => void;
  onRemoveLecture?: (id: string) => void;
}

export const LectureDetailView: React.FC<LectureDetailViewProps> = ({
  lecture,
  onBack,
  onNextLecture,
  onUpdateLecture,
  onRemoveLecture,
}) => {
  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(lecture.currentTimeSeconds || 2895); // 48:15
  const [totalSec] = useState(lecture.durationSeconds || 5055); // 1:24:15
  const [newNoteText, setNewNoteText] = useState('');
  const [activeHighlightNoteId, setActiveHighlightNoteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'notes' | 'ai'>('notes');
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtHistory, setDoubtHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello! I'm your **GATE Gemini AI Academic Tutor**. Ask me any doubt about **${lecture.title}**, seek clarification on formulas, or click **Formula Sheet** above!`,
      time: 'Just now',
    },
  ]);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleAskDoubt = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || doubtQuestion;
    if (!promptToSend.trim() || isAskingAi) return;

    const userEntry = {
      sender: 'user' as const,
      text: promptToSend,
      time: formatTime(currentSec),
    };

    setDoubtHistory((prev) => [...prev, userEntry]);
    if (!customPrompt) setDoubtQuestion('');
    setIsAskingAi(true);

    try {
      const res = await fetch('/api/gemini/ask-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          context: `Subject: ${lecture.subject}, Module: ${lecture.module}`,
          lectureTitle: lecture.title,
          timestamp: formatTime(currentSec),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDoubtHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer || 'Here is the conceptual breakdown for your GATE preparation.',
            time: formatTime(currentSec),
          },
        ]);
      } else {
        setDoubtHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'I could not connect to Gemini AI right now. Please ensure your Google Gemini API Key is configured in the AI Studio environment or try again.',
            time: formatTime(currentSec),
          },
        ]);
      }
    } catch (err) {
      setDoubtHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to reach the Gemini server. Please check your internet connection and API key.',
          time: formatTime(currentSec),
        },
      ]);
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleAiSummarize = async () => {
    if (isSummarizing) return;
    setIsSummarizing(true);
    setRightPanelTab('ai');

    try {
      const res = await fetch('/api/gemini/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureTitle: lecture.title,
          subject: lecture.subject,
          module: lecture.module,
          existingNotes: lecture.notes.map((n) => `[${n.timestamp}] ${n.text}`).join('\n'),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDoubtHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `### 🎯 High-Yield Formula & Concept Sheet\n\n${data.summary}`,
            time: formatTime(currentSec),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Timer loop for simulated playback
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSec((prev) => {
          if (prev >= totalSec) {
            setIsPlaying(false);
            return totalSec;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSec]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentSec(val);
  };

  const handleJumpToTimestamp = (note: LectureNote) => {
    setCurrentSec(note.timestampSec);
    setActiveHighlightNoteId(note.id);
    setTimeout(() => setActiveHighlightNoteId(null), 2500);
  };

  const handleToggleConcept = (conceptId: string) => {
    const updatedConcepts = lecture.concepts.map((c) =>
      c.id === conceptId ? { ...c, completed: !c.completed } : c
    );
    const completedCount = updatedConcepts.filter((c) => c.completed).length;
    const progress = Math.round((completedCount / updatedConcepts.length) * 100);

    if (completedCount === updatedConcepts.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    onUpdateLecture({
      ...lecture,
      concepts: updatedConcepts,
      progressPercent: progress,
      isCompleted: completedCount === updatedConcepts.length,
    });
  };

  const handleToggleCompleted = () => {
    const newStatus = !lecture.isCompleted;
    if (newStatus) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
    }
    onUpdateLecture({
      ...lecture,
      isCompleted: newStatus,
      progressPercent: newStatus ? 100 : 60,
    });
  };

  const handleAddNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: LectureNote = {
      id: `n-${Date.now()}`,
      timestamp: formatTime(currentSec),
      timestampSec: currentSec,
      text: newNoteText.trim(),
    };

    const updatedNotes = [...lecture.notes, newNote].sort((a, b) => a.timestampSec - b.timestampSec);

    onUpdateLecture({
      ...lecture,
      notes: updatedNotes,
    });

    setNewNoteText('');
  };

  const handleExportNotes = () => {
    const notesText = `${lecture.title} - Lecture Notes\n\n` +
      lecture.notes.map((n) => `[${n.timestamp}] ${n.text}`).join('\n\n');

    const blob = new Blob([notesText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lecture.title.replace(/\s+/g, '_')}_Notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmDelete = () => {
    if (onRemoveLecture) {
      onRemoveLecture(lecture.id);
      setIsDeleteModalOpen(false);
      onBack();
    }
  };

  return (
    <div id="lecture-detail-view" className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto pb-12 animate-fadeIn">
      {/* Back Link */}
      <div>
        <button
          id="btn-back-to-module"
          onClick={onBack}
          className="inline-flex items-center text-[#A1A1AA] hover:text-[#60A5FA] transition-colors text-[14px] font-medium group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Module: {lecture.subject}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Video Player & Main Info */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          {/* Video Player Container */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-[#1F1F23] to-[#0A0A0A] rounded-xl overflow-hidden border border-[#27272A] flex flex-col justify-between shadow-sm group">
            {/* Top info badge */}
            <div className="p-4 flex justify-between items-center z-10">
              <span className="text-white/80 text-[12px] font-medium bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs border border-white/10">
                {lecture.subject} • {lecture.module}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black/60 text-white rounded text-[11px] font-bold tracking-wider backdrop-blur-xs border border-white/20">
                  HD 1080p
                </span>
              </div>
            </div>

            {/* Big center play/pause button */}
            <div className="self-center flex items-center justify-center">
              <button
                id="btn-play-pause-center"
                onClick={handleTogglePlay}
                className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-105 hover:bg-[#1D4ED8] transition-all"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white fill-white" />
                ) : (
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                )}
              </button>
            </div>

            {/* Bottom Overlay & Scrubbable Progress Bar */}
            <div className="p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 z-10">
              {/* Scrub slider */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={totalSec}
                  value={currentSec}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
              </div>

              <div className="flex justify-between items-center text-white text-[12px] font-semibold">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="hover:text-[#93C5FD] transition-colors p-1"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span>
                    {formatTime(currentSec)} / {lecture.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentSec(0)}
                    title="Restart"
                    className="hover:text-[#93C5FD] transition-colors p-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button title="Volume" className="hover:text-[#93C5FD] transition-colors p-1">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button title="Fullscreen" className="hover:text-[#93C5FD] transition-colors p-1">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lecture Header & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-[#141416] border border-[#27272A] rounded-xl shadow-xs">
            <div>
              <h2 className="text-[24px] md:text-[26px] font-bold text-[#FAFAFA] tracking-tight leading-snug">
                {lecture.title}
              </h2>
              <p className="text-[14px] text-[#A1A1AA] mt-1 font-normal">{lecture.module}</p>
            </div>

            <div className="flex flex-wrap gap-2.5 w-full md:w-auto items-center">
              <button
                id="btn-mark-completed"
                onClick={handleToggleCompleted}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[13px] tracking-wide transition-all border ${
                  lecture.isCompleted
                    ? 'bg-[#10B981] text-white border-[#10B981]'
                    : 'border-[#3B82F6] text-[#60A5FA] hover:bg-[#2563EB]/15'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{lecture.isCompleted ? 'Completed' : 'Mark as Completed'}</span>
              </button>

              <button
                id="btn-next-lecture"
                onClick={() => {
                  if (onNextLecture) onNextLecture();
                  else alert('Proceeding to Next Module...');
                }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] tracking-wide hover:bg-[#1D4ED8] transition-colors shadow-xs"
              >
                <span>Next Lecture</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onRemoveLecture && (
                <button
                  id="btn-remove-lecture-detail"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#27272A] hover:border-[#EF4444]/30 rounded-lg font-semibold text-[13px] tracking-wide transition-colors"
                  title="Remove lecture from workspace"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              )}
            </div>
          </div>

          {/* Concept Checklist Bento Box */}
          <div className="bg-[#141416] border border-[#27272A] rounded-xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-semibold text-[#FAFAFA] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#60A5FA] text-[22px]">fact_check</span>
                <span>Concepts Covered</span>
              </h3>
              <span className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                {lecture.concepts.filter((c) => c.completed).length} / {lecture.concepts.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lecture.concepts.map((concept) => {
                return (
                  <label
                    key={concept.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      concept.completed
                        ? 'bg-[#18181B] border-[#3B82F6]/40'
                        : 'bg-[#121214] border-[#27272A] hover:border-[#3F3F46]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={concept.completed}
                      onChange={() => handleToggleConcept(concept.id)}
                      className="mt-1 w-4 h-4 text-[#3B82F6] rounded border-[#52525B] focus:ring-[#3B82F6] cursor-pointer"
                    />
                    <div>
                      <span
                        className={`text-[13px] font-bold block ${
                          concept.completed ? 'text-[#60A5FA]' : 'text-[#FAFAFA]'
                        }`}
                      >
                        {concept.title}
                      </span>
                      <span className="text-[12px] text-[#A1A1AA] mt-0.5 block leading-relaxed">
                        {concept.description}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized Notes & Gemini AI Doubt Tutor */}
        <div className="w-full lg:w-[420px] flex flex-col bg-[#141416] border border-[#27272A] rounded-xl shadow-xs overflow-hidden shrink-0">
          {/* Tabs Header */}
          <div className="border-b border-[#27272A] bg-[#18181B] flex items-center justify-between px-2 pt-2">
            <div className="flex gap-1">
              <button
                onClick={() => setRightPanelTab('notes')}
                className={`px-3.5 py-2 text-[13px] font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
                  rightPanelTab === 'notes'
                    ? 'bg-[#141416] text-[#60A5FA] border-t-2 border-x border-[#27272A] border-t-[#3B82F6]'
                    : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]/50'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">edit_note</span>
                <span>Notes ({lecture.notes.length})</span>
              </button>

              <button
                onClick={() => setRightPanelTab('ai')}
                className={`px-3.5 py-2 text-[13px] font-bold rounded-t-lg transition-colors flex items-center gap-1.5 relative ${
                  rightPanelTab === 'ai'
                    ? 'bg-[#141416] text-[#60A5FA] border-t-2 border-x border-[#27272A] border-t-[#3B82F6]'
                    : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Gemini AI Tutor</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              </button>
            </div>

            {rightPanelTab === 'notes' ? (
              <div className="flex items-center gap-1 pb-1">
                <button
                  onClick={handleAiSummarize}
                  disabled={isSummarizing}
                  className="text-[11px] font-semibold text-[#60A5FA] hover:text-[#93C5FD] px-2 py-1 rounded hover:bg-[#2563EB]/15 flex items-center gap-1 transition-colors"
                  title="Generate AI Formula Sheet"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isSummarizing ? 'Analyzing...' : 'AI Summary'}</span>
                </button>
                <button
                  onClick={handleExportNotes}
                  className="text-[#A1A1AA] hover:text-[#FAFAFA] p-1.5 rounded-lg hover:bg-[#27272A] transition-colors"
                  title="Download Notes (.txt)"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAiSummarize()}
                disabled={isSummarizing}
                className="text-[11px] font-semibold text-[#60A5FA] hover:text-[#93C5FD] px-2 py-1 mb-1 rounded hover:bg-[#2563EB]/15 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isSummarizing ? 'Generating...' : 'Formula Sheet'}</span>
              </button>
            )}
          </div>

          {/* TAB 1: NOTES */}
          {rightPanelTab === 'notes' && (
            <>
              {/* Notes Timeline Area */}
              <div className="p-4 overflow-y-auto space-y-4 max-h-[380px] min-h-[280px] bg-[#121214]/50">
                {lecture.notes.map((note) => {
                  const isHighlighted = activeHighlightNoteId === note.id;
                  return (
                    <div key={note.id} className="group relative pl-16">
                      {/* Clickable timestamp badge */}
                      <div
                        onClick={() => handleJumpToTimestamp(note)}
                        className="absolute left-0 top-0 cursor-pointer"
                        title={`Jump to ${note.timestamp}`}
                      >
                        <span className="px-2.5 py-1 bg-[#27272A] text-[#93C5FD] hover:bg-[#2563EB] hover:text-white rounded text-[11px] font-bold tracking-wider shadow-xs border border-[#3F3F46] transition-colors inline-block">
                          {note.timestamp}
                        </span>
                      </div>

                      {/* Note text container */}
                      <div
                        className={`border-l-2 pl-3 py-0.5 transition-all ${
                          isHighlighted
                            ? 'border-[#3B82F6] bg-[#2563EB]/20 rounded-r p-2'
                            : 'border-[#27272A] group-hover:border-[#3B82F6]'
                        }`}
                      >
                        <p className="text-[13px] text-[#FAFAFA] leading-relaxed">{note.text}</p>
                      </div>
                    </div>
                  );
                })}

                {lecture.notes.length === 0 && (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-[13px] text-[#71717A]">
                      No notes recorded yet.
                    </p>
                    <button
                      onClick={handleAiSummarize}
                      className="px-3 py-1.5 bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/30 rounded-lg text-[12px] font-semibold hover:bg-[#2563EB]/25 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Generate Notes with Gemini</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Add Note Input Area */}
              <div className="p-4 border-t border-[#27272A] bg-[#141416]">
                <form onSubmit={handleAddNote} className="relative">
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add a note at current video timestamp..."
                    rows={3}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg p-3 pr-12 text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] focus:bg-[#121214] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="absolute bottom-3 right-3 w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center hover:bg-[#1D4ED8] disabled:opacity-40 disabled:hover:bg-[#2563EB] transition-all shadow-xs"
                    title="Save note"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>

                <div className="mt-2 text-right">
                  <span className="text-[11px] font-semibold text-[#71717A]">
                    Will attach to <span className="text-[#60A5FA] font-bold">{formatTime(currentSec)}</span>
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: GEMINI AI DOUBT TUTOR */}
          {rightPanelTab === 'ai' && (
            <div className="flex flex-col flex-1">
              {/* Quick AI Prompt Chips */}
              <div className="px-3 py-2 border-b border-[#27272A] bg-[#18181B]/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <button
                  onClick={() => handleAskDoubt(undefined, `Explain the key formula and intuition taught around ${formatTime(currentSec)} for ${lecture.title}.`)}
                  className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] rounded-md font-medium whitespace-nowrap transition-colors"
                >
                  💡 Explain Concept at {formatTime(currentSec)}
                </button>
                <button
                  onClick={() => handleAskDoubt(undefined, `What are the most common GATE traps or tricky edge-cases in ${lecture.subject} - ${lecture.module}?`)}
                  className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] rounded-md font-medium whitespace-nowrap transition-colors"
                >
                  ⚠️ Common GATE Traps
                </button>
                <button
                  onClick={() => handleAskDoubt(undefined, `Give me a fast 2-minute revision mnemonic or shortcut for ${lecture.title}.`)}
                  className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] rounded-md font-medium whitespace-nowrap transition-colors"
                >
                  ⚡ Revision Shortcut
                </button>
              </div>

              {/* Chat Thread */}
              <div className="p-4 overflow-y-auto space-y-3.5 max-h-[340px] min-h-[260px] bg-[#121214]/60">
                {doubtHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[90%] p-3.5 rounded-xl text-[13px] leading-relaxed ${
                        item.sender === 'user'
                          ? 'bg-[#2563EB] text-white rounded-br-xs'
                          : 'bg-[#18181B] border border-[#27272A] text-[#FAFAFA] rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{item.text}</div>

                      {item.sender === 'ai' && (
                        <div className="mt-2.5 pt-2 border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#A1A1AA]">
                          <span>Gemini 3.7 Flash</span>
                          <button
                            onClick={() => {
                              const newNote: LectureNote = {
                                id: `note-${Date.now()}`,
                                timestamp: item.time || formatTime(currentSec),
                                timestampSec: currentSec,
                                text: `[AI Insight] ${item.text.slice(0, 180)}...`,
                              };
                              onUpdateLecture({
                                ...lecture,
                                notes: [...lecture.notes, newNote],
                              });
                              alert('AI Insight pinned to your timestamped notes!');
                            }}
                            className="text-[#60A5FA] hover:underline font-semibold"
                          >
                            + Pin to Notes
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-[#71717A] mt-1 px-1">{item.time}</span>
                  </div>
                ))}

                {isAskingAi && (
                  <div className="flex items-center gap-2 p-3 bg-[#18181B] border border-[#27272A] rounded-xl text-[13px] text-[#60A5FA] animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI is analyzing GATE concept &amp; formulas...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-[#27272A] bg-[#141416]">
                <form onSubmit={handleAskDoubt} className="flex gap-2">
                  <input
                    type="text"
                    value={doubtQuestion}
                    onChange={(e) => setDoubtQuestion(e.target.value)}
                    placeholder="Ask any GATE doubt or formula question..."
                    className="flex-1 bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!doubtQuestion.trim() || isAskingAi}
                    className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Removing Lecture */}
      {isDeleteModalOpen && (
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
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p className="text-[14px] text-[#FAFAFA] leading-relaxed">
                Are you sure you want to remove <span className="font-semibold text-[#60A5FA]">"{lecture.title}"</span> from your workspace?
              </p>
              <div className="p-3.5 bg-[#18181B] border border-[#27272A] rounded-xl text-[12px] text-[#A1A1AA] space-y-1">
                <p>• Subject: <strong className="text-[#FAFAFA]">{lecture.subject}</strong></p>
                <p>• Module: <strong className="text-[#FAFAFA]">{lecture.module}</strong></p>
                <p>• You will be redirected back to the My Lectures page.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#27272A] bg-[#18181B] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
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
