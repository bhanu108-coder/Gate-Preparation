import React, { useState } from 'react';
import { PYQQuestion } from '../types';
import { X, CheckCircle, AlertCircle, Flag, BookOpen, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PYQModalProps {
  pyq: PYQQuestion | null;
  onClose: () => void;
  onUpdatePYQ: (updated: PYQQuestion) => void;
}

export const PYQModal: React.FC<PYQModalProps> = ({ pyq, onClose, onUpdatePYQ }) => {
  if (!pyq) return null;

  const [selectedOption, setSelectedOption] = useState<number | undefined>(pyq.userSelectedOption);
  const [showExplanation, setShowExplanation] = useState<boolean>(pyq.status === 'Solved' || pyq.userSelectedOption !== undefined);
  const [isFlagged, setIsFlagged] = useState<boolean>(pyq.status === 'Flagged');
  const [aiDoubtText, setAiDoubtText] = useState('');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskGemini = async (customPrompt?: string) => {
    const questionToAsk = customPrompt || aiDoubtText || `Explain in detail why option (${String.fromCharCode(65 + pyq.correctOptionIndex)}) is the correct answer, break down the mathematical derivation, and explain why the other options are wrong or subtle traps.`;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/ask-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: questionToAsk,
          context: `GATE PYQ (${pyq.year} - ${pyq.subject} - ${pyq.topic}). Question: "${pyq.questionText}". Options: ${pyq.options.map((o, i) => `(${String.fromCharCode(65 + i)}) ${o}`).join(' | ')}. Correct option: (${String.fromCharCode(65 + pyq.correctOptionIndex)})`,
          lectureTitle: `${pyq.subject} PYQs`,
          timestamp: `${pyq.year}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data.answer || 'Detailed Gemini analysis.');
      } else {
        setAiExplanation('Gemini AI could not be reached. Please verify your Google Gemini API Key.');
      }
    } catch (err) {
      setAiExplanation('Network error connecting to Gemini API.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);

    const isCorrect = index === pyq.correctOptionIndex;
    if (isCorrect) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    onUpdatePYQ({
      ...pyq,
      userSelectedOption: index,
      status: isCorrect ? 'Solved' : 'Unsolved',
    });
  };

  const handleToggleFlag = () => {
    const nextFlag = !isFlagged;
    setIsFlagged(nextFlag);
    onUpdatePYQ({
      ...pyq,
      status: nextFlag ? 'Flagged' : pyq.userSelectedOption === pyq.correctOptionIndex ? 'Solved' : 'Unsolved',
    });
  };

  const isSubmitted = selectedOption !== undefined;
  const isCorrect = selectedOption === pyq.correctOptionIndex;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141416] border border-[#27272A] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-[#27272A] bg-[#18181B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-[#2563EB] text-white rounded text-[11px] font-bold tracking-wider uppercase">
              {pyq.year}
            </span>
            <span className="text-[14px] font-bold text-[#FAFAFA]">
              {pyq.subject} • <span className="text-[#A1A1AA] font-medium">{pyq.topic}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFlag}
              className={`p-2 rounded-lg border transition-all ${
                isFlagged
                  ? 'bg-[#450A0A] text-[#F87171] border-[#EF4444]'
                  : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:text-[#F87171]'
              }`}
              title={isFlagged ? 'Flagged for revision' : 'Flag question'}
            >
              <Flag className={`w-4 h-4 ${isFlagged ? 'fill-[#EF4444]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Paper set badge */}
          {pyq.gatePaperSet && (
            <div className="text-[12px] font-semibold text-[#60A5FA] tracking-wider uppercase flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{pyq.gatePaperSet}</span>
            </div>
          )}

          {/* Question Text */}
          <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl">
            <p className="text-[16px] text-[#FAFAFA] leading-relaxed font-medium whitespace-pre-line">
              {pyq.questionText}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider">Select Option</h4>
            <div className="grid grid-cols-1 gap-2.5">
              {pyq.options.map((opt, idx) => {
                const optLetter = String.fromCharCode(65 + idx); // A, B, C, D
                const isThisSelected = selectedOption === idx;
                const isThisCorrect = idx === pyq.correctOptionIndex;

                let btnStyles = 'bg-[#18181B] border-[#27272A] hover:border-[#3B82F6] text-[#FAFAFA]';

                if (isSubmitted) {
                  if (isThisCorrect) {
                    btnStyles = 'bg-[#10B981]/15 border-[#10B981] text-[#34D399] font-bold';
                  } else if (isThisSelected && !isThisCorrect) {
                    btnStyles = 'bg-[#EF4444]/15 border-[#EF4444] text-[#F87171] font-bold';
                  } else {
                    btnStyles = 'bg-[#141416] border-[#27272A] text-[#71717A] opacity-60';
                  }
                } else if (isThisSelected) {
                  btnStyles = 'bg-[#2563EB]/20 border-[#3B82F6] text-[#60A5FA] font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all w-full shadow-xs ${btnStyles}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#27272A] flex items-center justify-center font-bold text-[13px] shrink-0 border border-[#3F3F46] text-[#FAFAFA]">
                      {optLetter}
                    </span>
                    <span className="text-[14px] flex-1">{opt}</span>
                    {isSubmitted && isThisCorrect && (
                      <CheckCircle className="w-5 h-5 text-[#34D399] shrink-0" />
                    )}
                    {isSubmitted && isThisSelected && !isThisCorrect && (
                      <AlertCircle className="w-5 h-5 text-[#F87171] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Section */}
          {showExplanation && (
            <div className="space-y-4 pt-4 border-t border-[#27272A] animate-fadeIn">
              {/* Correct / Incorrect alert */}
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  isCorrect
                    ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#34D399]'
                    : 'bg-[#EF4444]/15 border-[#EF4444]/30 text-[#F87171]'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold text-[14px]">
                      Correct Answer! Option ({String.fromCharCode(65 + pyq.correctOptionIndex)}) is correct.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold text-[14px]">
                      Incorrect. The correct option is ({String.fromCharCode(65 + pyq.correctOptionIndex)}).
                    </span>
                  </>
                )}
              </div>

              {/* Detailed Mathematical Solution */}
              <div className="bg-[#18181B] p-5 rounded-xl border border-[#27272A] space-y-2">
                <h5 className="text-[13px] font-bold text-[#60A5FA] flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Step-by-Step Solution</span>
                </h5>
                <p className="text-[14px] text-[#FAFAFA] whitespace-pre-line leading-relaxed">
                  {pyq.explanation}
                </p>
              </div>

              {/* Formula & Theorem Recap */}
              {pyq.formulaRecap && (
                <div className="bg-[#422006]/30 p-4 rounded-xl border border-[#CA8A04]/40 space-y-1.5">
                  <h6 className="text-[12px] font-bold text-[#FBBF24] flex items-center gap-1.5 uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-[#FBBF24]" />
                    <span>GATE Formula / Theorem Recap</span>
                  </h6>
                  <p className="text-[13px] text-[#FDE68A] leading-relaxed font-medium">
                    {pyq.formulaRecap}
                  </p>
                </div>
              )}

              {/* Gemini AI Deep Dive & Doubt Solver */}
              <div className="bg-[#121214] border border-[#27272A] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#60A5FA]">
                    <Sparkles className="w-4 h-4" />
                    <h6 className="text-[13px] font-bold text-[#FAFAFA]">
                      Ask Gemini AI Tutor for this Question
                    </h6>
                  </div>
                  {!aiExplanation && (
                    <button
                      onClick={() => handleAskGemini()}
                      disabled={isAiLoading}
                      className="text-[12px] font-semibold text-[#60A5FA] hover:text-white px-2.5 py-1 bg-[#2563EB]/15 hover:bg-[#2563EB] border border-[#2563EB]/30 rounded-md transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAiLoading ? 'Analyzing...' : 'Deep Conceptual Breakdown'}</span>
                    </button>
                  )}
                </div>

                {aiExplanation && (
                  <div className="bg-[#18181B] p-4 rounded-lg border border-[#27272A] text-[13px] text-[#FAFAFA] leading-relaxed space-y-2 whitespace-pre-line animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-[#27272A] text-[11px] text-[#60A5FA] font-bold">
                      <span>Gemini 3.7 Flash Analysis</span>
                      <button
                        onClick={() => handleAskGemini(`Explain why other options are distractor traps for this GATE question.`)}
                        disabled={isAiLoading}
                        className="text-[#A1A1AA] hover:text-[#FAFAFA] underline font-normal"
                      >
                        Explain Distractor Traps
                      </button>
                    </div>
                    <div>{aiExplanation}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiDoubtText}
                    onChange={(e) => setAiDoubtText(e.target.value)}
                    placeholder="Still confused? Ask a specific question to Gemini AI..."
                    className="flex-1 bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-[12px] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && aiDoubtText.trim()) {
                        e.preventDefault();
                        handleAskGemini();
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAskGemini()}
                    disabled={!aiDoubtText.trim() || isAiLoading}
                    className="px-3 py-2 bg-[#2563EB] text-white rounded-lg font-semibold text-[12px] hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#27272A] bg-[#18181B] flex items-center justify-between">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-[13px] font-semibold text-[#60A5FA] hover:underline"
          >
            {showExplanation ? 'Hide Explanation' : 'View Detailed Solution'}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg font-semibold text-[13px] hover:bg-[#1D4ED8] transition-colors shadow-xs"
          >
            Done &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
