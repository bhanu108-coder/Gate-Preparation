import React from 'react';
import { NavView } from '../types';
import { avatarUrls } from '../data/initialData';
import { Menu, Search, Plus, Bell, HelpCircle } from 'lucide-react';

interface TopNavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onToggleMobileSidebar: () => void;
  onOpenAddLecture: () => void;
  onOpenNotifications: () => void;
  onOpenHelp: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentView,
  onNavigate,
  onToggleMobileSidebar,
  onOpenAddLecture,
  onOpenNotifications,
  onOpenHelp,
  searchQuery,
  onSearchChange,
  unreadCount = 2,
}) => {
  return (
    <header
      id="top-navbar"
      className="fixed top-0 left-0 w-full h-16 bg-[#121214]/90 backdrop-blur-md border-b border-[#27272A] z-30 flex items-center justify-between px-4 md:px-8 lg:pl-[304px] transition-all"
    >
      {/* Left: Mobile hamburger & App Name */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileSidebar}
          className="p-1.5 text-[#A1A1AA] hover:bg-[#18181B] hover:text-white rounded-lg lg:hidden"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div
          onClick={() => onNavigate('dashboard')}
          className="font-bold text-[20px] text-[#FAFAFA] tracking-tight cursor-pointer select-none"
        >
          GATE Mastery
        </div>
      </div>

      {/* Middle: Search bar & Desktop top links */}
      <div className="hidden md:flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lectures, PYQs..."
            className="pl-10 pr-4 py-2 border border-[#27272A] rounded-full text-[13px] bg-[#18181B] text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#3B82F6] focus:bg-[#121214] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none w-64 lg:w-72 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#FAFAFA] text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        <nav className="flex items-center gap-2">
          <button
            id="top-nav-dashboard"
            onClick={() => onNavigate('dashboard')}
            className={`font-semibold text-[13px] px-3 py-1.5 rounded-md transition-all ${
              currentView === 'dashboard'
                ? 'text-[#60A5FA] border-b-2 border-[#3B82F6] rounded-none pb-2 font-bold'
                : 'text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]'
            }`}
          >
            Dashboard
          </button>
          <button
            id="top-nav-schedule"
            onClick={() => onNavigate('schedule')}
            className={`font-semibold text-[13px] px-3 py-1.5 rounded-md transition-all ${
              currentView === 'schedule'
                ? 'text-[#60A5FA] border-b-2 border-[#3B82F6] rounded-none pb-2 font-bold'
                : 'text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]'
            }`}
          >
            Study Schedule
          </button>
        </nav>
      </div>

      {/* Right: Add lecture CTA, icons, and Profile Avatar */}
      <div className="flex items-center gap-3">
        <button
          id="btn-add-lecture-header"
          onClick={onOpenAddLecture}
          className="hidden sm:flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-full font-semibold text-[12px] tracking-wide hover:bg-[#1D4ED8] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lecture</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            id="btn-notifications-header"
            onClick={onOpenNotifications}
            className="p-2 text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#60A5FA] rounded-full transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[#121214] animate-pulse" />
            )}
          </button>

          <button
            id="btn-help-header"
            onClick={onOpenHelp}
            className="p-2 text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#60A5FA] rounded-full transition-colors hidden sm:flex"
            aria-label="Get help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Avatar */}
        <div
          onClick={() => onNavigate('settings')}
          className="cursor-pointer group flex items-center"
          title="Scholar Profile"
        >
          <img
            src={avatarUrls.scholar}
            alt="User Profile Avatar"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-[#27272A] object-cover ring-2 ring-transparent group-hover:ring-[#3B82F6] transition-all"
          />
        </div>
      </div>
    </header>
  );
};
