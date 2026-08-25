import React, { useState } from 'react';
import { NavView, Lecture, PYQQuestion, DigitizedUpload, ScheduleItem } from './types';
import {
  initialLectures,
  initialPYQs,
  initialDigitizedUploads,
  initialSchedule,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { MyLecturesView } from './components/MyLecturesView';
import { LectureDetailView } from './components/LectureDetailView';
import { PYQBankView } from './components/PYQBankView';
import { StudyScheduleView } from './components/StudyScheduleView';
import { SettingsView } from './components/SettingsView';
import { PYQModal } from './components/PYQModal';
import { AddLectureModal } from './components/AddLectureModal';
import { UploadPDFModal } from './components/UploadPDFModal';
import { PremiumModal } from './components/PremiumModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [lectures, setLectures] = useState<Lecture[]>(initialLectures);
  const [pyqs, setPyqs] = useState<PYQQuestion[]>(initialPYQs);
  const [digitizedUploads, setDigitizedUploads] = useState<DigitizedUpload[]>(initialDigitizedUploads);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);

  // Active selections & modals
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedPYQ, setSelectedPYQ] = useState<PYQQuestion | null>(null);
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false);
  const [isUploadPDFOpen, setIsUploadPDFOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Navigation handler
  const handleNavigate = (view: NavView) => {
    setCurrentView(view);
    if (view !== 'lecture-detail') {
      setSelectedLecture(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lecture Handlers
  const handleSelectLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setCurrentView('lecture-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateLecture = (updated: Lecture) => {
    setLectures((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLecture(updated);
  };

  const handleAddLecture = (newLec: Lecture) => {
    setLectures((prev) => [newLec, ...prev]);
  };

  const handleRemoveLecture = (id: string) => {
    setLectures((prev) => prev.filter((l) => l.id !== id));
    if (selectedLecture && selectedLecture.id === id) {
      setSelectedLecture(null);
      if (currentView === 'lecture-detail') {
        setCurrentView('lectures');
      }
    }
  };

  const handleAddLectureFromUrl = (url: string) => {
    const isTOC = url.toLowerCase().includes('toc') || url.toLowerCase().includes('automata');
    const newLec: Lecture = {
      id: `lec-${Date.now()}`,
      title: isTOC ? 'Theory of Computation: DFA Minimization' : 'Operating Systems: Virtual Memory & Page Replacement',
      subject: isTOC ? 'Algorithms' : 'OS',
      module: isTOC ? 'TOC & Automata • Unit 2' : 'Operating Systems • Unit 3',
      videoCount: 6,
      duration: '3h 15m',
      durationSeconds: 11700,
      currentTimeSeconds: 0,
      progressPercent: 0,
      targetPercent: 40,
      isCompleted: false,
      videoUrl: url,
      concepts: [
        {
          id: `c-${Date.now()}-1`,
          title: 'Core Fundamentals & Theorems',
          description: 'High yield definitions and standard properties.',
          completed: false,
        },
        {
          id: `c-${Date.now()}-2`,
          title: 'GATE Numerical Applications',
          description: 'Step by step numerical deductions.',
          completed: false,
        },
      ],
      notes: [
        {
          id: `n-${Date.now()}-1`,
          timestamp: '00:00',
          timestampSec: 0,
          text: `Curated playlist imported from ${url.substring(0, 32)}...`,
        },
      ],
    };

    setLectures((prev) => [newLec, ...prev]);
  };

  // PYQ Handlers
  const handleSelectPYQ = (pyq: PYQQuestion) => {
    setSelectedPYQ(pyq);
  };

  const handleUpdatePYQ = (updated: PYQQuestion) => {
    setPyqs((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    if (selectedPYQ && selectedPYQ.id === updated.id) {
      setSelectedPYQ(updated);
    }
  };

  // PDF Upload Handler
  const handleUploadSuccess = (newUpload: DigitizedUpload, newQuestions: PYQQuestion[]) => {
    setDigitizedUploads((prev) => [newUpload, ...prev]);
    setPyqs((prev) => [...newQuestions, ...prev]);
  };

  // Schedule Handlers
  const handleToggleScheduleItem = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const handleAddScheduleItem = (newItem: ScheduleItem) => {
    setSchedule((prev) => [...prev, newItem]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col font-sans selection:bg-[#27272A] selection:text-white">
      {/* Top Navigation Bar */}
      <TopNavbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onOpenAddLecture={() => setIsAddLectureOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        searchQuery={globalSearchQuery}
        onSearchChange={(q) => {
          setGlobalSearchQuery(q);
          if (q.trim() !== '' && currentView !== 'lectures' && currentView !== 'pyq-bank') {
            setCurrentView('pyq-bank');
          }
        }}
      />

      {/* Side Navigation Bar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenPremium={() => setIsPremiumOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 md:px-8 lg:px-12 lg:ml-[280px] w-auto max-w-[1500px] transition-all">
        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            onSelectLecture={handleSelectLecture}
            onSelectPYQ={handleSelectPYQ}
            onOpenAddLecture={() => setIsAddLectureOpen(true)}
            lectures={lectures}
            pyqs={pyqs}
          />
        )}

        {currentView === 'lectures' && (
          <MyLecturesView
            lectures={lectures}
            onSelectLecture={handleSelectLecture}
            onOpenAddLectureModal={() => setIsAddLectureOpen(true)}
            onAddLectureFromUrl={handleAddLectureFromUrl}
            onRemoveLecture={handleRemoveLecture}
          />
        )}

        {currentView === 'lecture-detail' && selectedLecture && (
          <LectureDetailView
            lecture={selectedLecture}
            onBack={() => handleNavigate('lectures')}
            onNextLecture={() => {
              const currentIndex = lectures.findIndex((l) => l.id === selectedLecture.id);
              const nextIndex = (currentIndex + 1) % lectures.length;
              setSelectedLecture(lectures[nextIndex]);
            }}
            onUpdateLecture={handleUpdateLecture}
            onRemoveLecture={handleRemoveLecture}
          />
        )}

        {currentView === 'pyq-bank' && (
          <PYQBankView
            pyqs={pyqs}
            digitizedUploads={digitizedUploads}
            onSelectPYQ={handleSelectPYQ}
            onOpenUploadModal={() => setIsUploadPDFOpen(true)}
            onUpdatePYQ={handleUpdatePYQ}
          />
        )}

        {currentView === 'schedule' && (
          <StudyScheduleView
            schedule={schedule}
            onToggleScheduleItem={handleToggleScheduleItem}
            onAddScheduleItem={handleAddScheduleItem}
          />
        )}

        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Interactive Modals and Drawers */}
      <PYQModal
        pyq={selectedPYQ}
        onClose={() => setSelectedPYQ(null)}
        onUpdatePYQ={handleUpdatePYQ}
      />

      <AddLectureModal
        isOpen={isAddLectureOpen}
        onClose={() => setIsAddLectureOpen(false)}
        onAddLecture={handleAddLecture}
      />

      <UploadPDFModal
        isOpen={isUploadPDFOpen}
        onClose={() => setIsUploadPDFOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={handleNavigate}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
