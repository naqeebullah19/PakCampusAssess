import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, User } from '../api/client';

interface CandidateLayoutProps {
  currentUser: User | null;
  onLogout: () => void;
  onRoleChanged: () => void;
  children: React.ReactNode;
}

export const CandidateLayout: React.FC<CandidateLayoutProps> = ({
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
      if (role === 'Super Administrator' || role === 'SUPER_ADMIN') {
        navigate('/super-admin');
      } else if (role === 'University Admissions' || role === 'University Admissions Admin') {
        navigate('/university/admissions');
      } else if (role === 'Faculty Reviewer') {
        navigate('/faculty/reviews');
      } else if (role === 'Examiner' || role === 'Invigilator') {
        navigate('/admin/live-monitoring');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Role switch failed:", err);
    } finally {
      setSwitching(false);
    }
  };

  const candidateNavItems = [
    { label: "My Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Identity & Profile", path: "/candidate/profile", icon: "person" },
    { label: "Academic Credentials", path: "/candidate/academic-records", icon: "school" },
    { label: "Available Examinations", path: "/examinations/available", icon: "explore" },
  ];

  return (
    <div className="min-h-screen bg-surface font-sans text-body-md text-on-surface antialiased">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest shadow-sm z-50 px-4 flex items-center justify-between border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container-high transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div className="flex flex-col">
            <span className="font-headline-md text-body-sm font-bold text-primary">PakCampusAssess</span>
            <span className="font-code-sm text-[10px] text-secondary uppercase font-semibold">Candidate Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-error hover:bg-error-container/20 transition-colors"
            title="Log Out"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-primary/40 z-40 backdrop-blur-xs"
        />
      )}

      {/* Candidate Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[268px] bg-surface-container-lowest shadow-[0_1px_8px_rgba(32,54,75,0.04)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-200 border-r border-outline-variant/20 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Bar */}
          <div className="h-16 px-space-md flex items-center gap-space-sm bg-surface-container-lowest border-b border-outline-variant/15">
            <div className="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-bold font-headline-md text-body-md shadow-xs">
              PCA
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-body-sm font-bold tracking-tight text-primary leading-tight">PakCampusAssess</span>
              <span className="font-code-sm text-[10px] text-secondary uppercase tracking-wider font-semibold">Candidate Portal</span>
            </div>
          </div>

          {/* Candidate Dossier Card */}
          <div className="p-4 mx-3 my-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-body-sm">
                {currentUser?.first_name?.[0] || "A"}
              </div>
              <div className="flex flex-col truncate">
                <span className="font-headline-md text-body-sm font-bold text-primary truncate">
                  {currentUser?.full_name || "Ayesha Siddiqui"}
                </span>
                <span className="font-code-sm text-[11px] text-on-surface-variant">Roll: CA-2027-01052</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-label-sm">
              <span className="text-secondary font-medium">NADRA Verified</span>
              <span className="text-on-surface-variant font-code-sm">Cycle 2027-A</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col px-3 gap-y-1">
            <div className="px-3 py-1 font-label-sm text-[11px] text-on-surface-variant/70 font-bold uppercase tracking-wider">
              Candidate Menu
            </div>
            {candidateNavItems.map((item) => {
              const isActive = currentPath === item.path || (item.path === '/dashboard' && currentPath === '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm transition-all ${
                    isActive
                      ? 'bg-secondary text-on-secondary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-label-md text-label-md">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 bg-surface-container-low flex flex-col gap-1 border-t border-outline-variant/15 text-[11px] text-on-surface-variant">
          <div className="flex items-center justify-between">
            <span className="font-semibold">HEC Admissions Desk</span>
            <span className="font-code-sm text-secondary">Active</span>
          </div>
          <div className="text-outline text-[10px]">Candidate Portal v2.4.1</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-[268px]">
        {/* Top Header */}
        <header className="fixed top-0 left-0 lg:left-[268px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-xs z-40 px-4 lg:px-space-lg flex items-center justify-between gap-space-md border-b border-outline-variant/15">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md font-bold text-primary">Candidate Assessment Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Persona Switcher for Testing */}
            <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/20">
              <label className="sr-only" htmlFor="candidate-role-switcher">Switch Persona</label>
              <select
                id="candidate-role-switcher"
                value="Candidate"
                onChange={handleRoleSwitch}
                disabled={switching}
                className="bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="Candidate">Candidate</option>
                <option value="Super Administrator">Super Administrator</option>
                <option value="Examination Controller">Examination Manager</option>
                <option value="University Admissions">University Admissions</option>
                <option value="Faculty Reviewer">Faculty Reviewer</option>
                <option value="Examiner">Invigilator</option>
              </select>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
              title="Log Out"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="hidden sm:inline font-medium">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative pt-16 min-h-screen w-full px-4 lg:px-gutter-desktop py-space-lg bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
};
