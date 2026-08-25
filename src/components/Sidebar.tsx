import React from 'react';
import { NavView } from '../types';
import { LayoutDashboard, Video, HelpCircle, Calendar, Sparkles, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onOpenPremium: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenPremium,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavView,
      label: 'Dashboard',
      icon: 'dashboard',
      lucide: LayoutDashboard,
    },
    {
      id: 'lectures' as NavView,
      label: 'My Lectures',
      icon: 'video_library',
      lucide: Video,
    },
    {
      id: 'pyq-bank' as NavView,
      label: 'PYQ Bank',
      icon: 'quiz',
      lucide: HelpCircle,
    },
    {
      id: 'schedule' as NavView,
      label: 'Study Schedule',
      icon: 'calendar_today',
      lucide: Calendar,
    },
  ];

  const handleNavClick = (view: NavView) => {
    onNavigate(view);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full p-3 justify-between">
      <div>
        {/* Logo and Workspace title */}
        <div className="flex items-center justify-between px-3 py-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md tracking-tight">
              G
            </div>
            <div>
              <div className="font-semibold text-[20px] text-[#FAFAFA] leading-none tracking-tight">GATE Prep</div>
              <div className="text-[12px] font-medium text-[#71717A] mt-1 tracking-wider uppercase">Academic Workspace</div>
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-[#A1A1AA] hover:bg-[#27272A] hover:text-white rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'lectures' && currentView === 'lecture-detail');
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 text-[13px] font-semibold tracking-wide text-left w-full ${
                  isActive
                    ? 'bg-[#27272A] text-[#FAFAFA] shadow-xs'
                    : 'text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[#27272A]">
        <button
          id="btn-go-premium"
          onClick={onOpenPremium}
          className="w-full py-2.5 px-4 bg-[#18181B] text-[#60A5FA] font-semibold text-[12px] tracking-wider uppercase rounded-xl border border-[#2563EB]/40 hover:bg-[#2563EB] hover:text-white transition-all shadow-xs flex items-center justify-center gap-2 group"
        >
          <Sparkles className="w-4 h-4 text-[#60A5FA] group-hover:text-white transition-colors" />
          <span>Go Premium</span>
        </button>

        <div className="flex flex-col gap-1">
          <button
            id="nav-item-settings"
            onClick={() => handleNavClick('settings')}
            className={`flex items-center gap-3 px-4 py-2 text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA] rounded-xl transition-all text-[13px] font-medium w-full text-left ${
              currentView === 'settings' ? 'bg-[#27272A] text-[#FAFAFA] font-semibold' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </button>

          <button
            id="nav-item-logout"
            onClick={() => {
              alert('Logged out securely. Session saved.');
            }}
            className="flex items-center gap-3 px-4 py-2 text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#EF4444] rounded-xl transition-all text-[13px] font-medium w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className="hidden lg:block fixed left-0 top-0 h-screen w-[280px] bg-[#121214] border-r border-[#27272A] z-40"
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-[#121214] border-r border-[#27272A] z-50 lg:hidden transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
};
