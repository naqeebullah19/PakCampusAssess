import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, User } from '../api/client';

interface SuperAdminLayoutProps {
  currentUser: User | null;
  onLogout: () => void;
  onRoleChanged: () => void;
  children: React.ReactNode;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({
  currentUser,
  onLogout,
  onRoleChanged,
  children
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const currentPath = location.pathname;

  const handleRoleSwitch = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    try {
      setSwitching(true);
      await api.switchRole(role);
      onRoleChanged();
      if (role === 'Candidate' || role === 'Student') {
        navigate('/dashboard');
      } else if (role === 'University Admissions' || role === 'University Admissions Admin') {
        navigate('/university/admissions');
      } else if (role === 'Faculty Reviewer') {
        navigate('/faculty/reviews');
      } else if (role === 'Examiner' || role === 'Invigilator') {
        navigate('/admin/live-monitoring');
      } else {
        navigate('/super-admin');
      }
    } catch (err) {
      console.error("Role switch failed:", err);
    } finally {
      setSwitching(false);
    }
  };

  const navSections = [
    {
      title: "1. Core",
      items: [
        { label: "Overview", path: "/super-admin", icon: "grid_view" },
        { label: "Audit Logs", path: "/super-admin/audit-logs", icon: "receipt_long" },
      ]
    },
    {
      title: "2. Examination Ops",
      items: [
        { label: "Test Categories", path: "/super-admin/exam-categories", icon: "category" },
        { label: "Examinations", path: "/super-admin/examinations", icon: "assignment" },
        { label: "Examination Sessions", path: "/super-admin/exam-sessions", icon: "event_available" },
        { label: "Question Bank", path: "/super-admin/question-bank", icon: "quiz" },
      ]
    },
    {
      title: "3. Operations & Infrastructure",
      items: [
        { label: "Centers & Labs", path: "/super-admin/centers", icon: "domain" },
        { label: "Staff & Invigilators", path: "/super-admin/staff", icon: "badge" },
        { label: "Live Exam Monitoring", path: "/super-admin/monitoring", icon: "videocam" },
      ]
    },
    {
      title: "4. Results & Merit",
      items: [
        { label: "Results & Merit", path: "/super-admin/results", icon: "fact_check" },
        { label: "Universities & Programs", path: "/super-admin/universities", icon: "school" },
        { label: "Admissions Docket", path: "/super-admin/admissions", icon: "how_to_reg" },
      ]
    },
    {
      title: "5. Platform",
      items: [
        { label: "User Management", path: "/super-admin/users", icon: "group" },
        { label: "Reports & Analytics", path: "/super-admin/reports", icon: "leaderboard" },
        { label: "System Settings", path: "/super-admin/settings", icon: "tune" },
      ]
    }
  ];

  const getBreadcrumbTitle = () => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (currentPath === item.path) return item.label;
      }
    }
    return "Executive Overview";
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-body-md text-on-surface antialiased">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest shadow-sm z-50 px-4 flex items-center justify-between border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container-high transition-colors"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div className="flex flex-col">
            <span className="font-headline-md text-body-sm font-bold text-primary">PakCampusAssess</span>
            <span className="font-code-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Super Admin Console</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-error hover:bg-error-container/20 transition-colors"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-primary/40 z-40 backdrop-blur-xs"
        />
      )}

      {/* Dedicated Super Admin Sidebar (Exact Stitch Specs) */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[248px] bg-surface-container-lowest shadow-[0_1px_8px_rgba(32,54,75,0.04)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-200 border-r border-outline-variant/20 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Bar */}
          <div className="h-16 px-space-md flex items-center gap-space-sm bg-surface-container-lowest border-b border-outline-variant/15">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold font-headline-md text-body-md shadow-xs">
              PCA
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-body-sm font-bold tracking-tight text-primary leading-tight">PakCampusAssess</span>
              <span className="font-code-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Super Admin Portal</span>
            </div>
          </div>

          {/* Active Status Ribbon */}
          <div className="px-space-md py-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-lg text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-[11px] uppercase tracking-wide font-semibold">Statutory Authority Active</span>
            </div>
          </div>

          {/* Super Admin Navigation List */}
          <nav className="flex flex-col px-space-xs gap-y-3.5 pb-space-lg">
            {navSections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-[11px] text-on-surface-variant/80 font-bold uppercase tracking-wider">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-body-sm transition-all ${
                        isActive
                          ? 'bg-primary text-on-primary font-medium shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span className="font-label-md text-label-md">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-space-md bg-surface-container-low flex flex-col gap-space-xs border-t border-outline-variant/15">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-[10px] font-semibold uppercase">Helpline: 0800-CAMPUS</span>
            <span className="font-code-sm text-[10px] text-secondary font-medium">Verified HEC</span>
          </div>
          <div className="flex items-center justify-between font-code-sm text-[10px] text-outline">
            <span className="truncate">PakCampusAssess OS</span>
            <span>v2.4.1-rc</span>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="lg:pl-[248px]">
        {/* Top Header */}
        <header className="fixed top-0 left-0 lg:left-[248px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(32,54,75,0.04)] z-40 px-4 lg:px-space-lg flex items-center justify-between gap-space-md border-b border-outline-variant/15">
          <div className="flex items-center gap-space-sm flex-1 max-w-sm">
            <div className="hidden sm:flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant overflow-hidden whitespace-nowrap">
              <span className="font-semibold text-primary">PakCampusAssess</span>
              <span className="text-outline">/</span>
              <span>Super Admin</span>
              <span className="text-outline">/</span>
              <span className="text-on-surface font-semibold">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md hidden md:flex items-center">
            <div className="w-full flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant focus-within:ring-1 focus-within:ring-secondary border border-outline-variant/20">
              <span className="material-symbols-outlined text-[18px] mr-2 text-outline">search</span>
              <input
                className="w-full bg-transparent font-body-sm text-body-sm focus:outline-none placeholder:text-outline text-on-surface"
                placeholder="Search candidates, roll #, test sessions..."
                type="text"
              />
              <kbd className="font-code-sm text-[10px] bg-surface-container-lowest px-1.5 py-0.5 rounded text-on-surface-variant shadow-xs border border-outline-variant/20">⌘K</kbd>
            </div>
          </div>

          {/* Actions & Profile Area */}
          <div className="flex items-center gap-space-sm lg:gap-space-md">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px]">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>All Systems Operational</span>
            </div>

            {/* Role Switcher (for QA / Testing) */}
            <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/20">
              <label className="sr-only" htmlFor="admin-role-switcher">Switch Persona</label>
              <select
                id="admin-role-switcher"
                value="Super Administrator"
                onChange={handleRoleSwitch}
                disabled={switching}
                className="bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="Super Administrator">Super Administrator</option>
                <option value="Candidate">Candidate</option>
                <option value="Examination Controller">Examination Manager</option>
                <option value="University Admissions">University Admissions</option>
                <option value="Faculty Reviewer">Faculty Reviewer</option>
                <option value="Examiner">Invigilator</option>
              </select>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-space-sm pl-1 lg:pl-2">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="font-label-md text-label-md font-semibold text-primary leading-tight">
                  {currentUser?.full_name || "Dr. Tariq Mansoor"}
                </span>
                <span className="font-code-sm text-[10px] text-secondary font-medium">
                  {currentUser?.profile?.role || "SUPER_ADMIN"}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-body-xs ring-1 ring-surface-container-highest">
                {(currentUser?.first_name?.[0] || "T")}
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                title="Log Out"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="relative pt-16 min-h-screen w-full px-4 lg:px-gutter-desktop py-space-lg bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
};
