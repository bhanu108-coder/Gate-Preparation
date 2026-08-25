export type NavView = 'dashboard' | 'lectures' | 'lecture-detail' | 'pyq-bank' | 'schedule' | 'settings';

export type SubjectFilter = string;

export interface SubjectInfo {
  id: string;
  name: string;
  category?: string;
  color?: string;
  icon?: string;
}

export type PYQDifficulty = 'Easy' | 'Medium' | 'Hard';
export type PYQStatus = 'Solved' | 'Unsolved' | 'Flagged' | 'Bookmarked' | 'Pending';

export interface ConceptItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface LectureNote {
  id: string;
  timestamp: string;
  timestampSec: number;
  text: string;
}

export interface Lecture {
  id: string;
  title: string;
  subject: string;
  module: string;
  videoCount: number;
  duration: string;
  durationSeconds: number;
  currentTimeSeconds: number;
  progressPercent: number;
  targetPercent: number;
  isCompleted: boolean;
  videoUrl?: string;
  concepts: ConceptItem[];
  notes: LectureNote[];
  thumbnailGradient?: string;
}

export interface PYQQuestion {
  id: string;
  year: number;
  subject: string;
  topic: string;
  difficulty: PYQDifficulty;
  status: PYQStatus;
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  formulaRecap?: string;
  gatePaperSet?: string;
  userSelectedOption?: number;
}

export interface DigitizedUpload {
  id: string;
  fileName: string;
  status: 'DIGITIZED' | 'PROCESSING' | 'READY';
  snippet: string;
  timeAgo: string;
  progressPercent?: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  subject: string;
  duration: string;
  isCompleted: boolean;
  type: 'Lecture' | 'PYQ Practice' | 'Revision' | 'Mock Test';
}
