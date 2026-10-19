import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, User } from '../api/client';

interface NavigationProps {
  currentUser: User | null;
  onRoleChanged: () => void;
  children: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ currentUser, onRoleChanged, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // If we are in the CBT high-stakes workspace, render without the administrative navigation shell
  if (location.pathname === '/cbt/workspace') {
    return <div className="min-h-screen bg-surface">{children}</div>;
  }

  // Derive active persona based on currentUser profile or fallback
  const userRole = currentUser?.profile?.role || 'SUPER_ADMIN';
  const isCandidateRole = userRole === 'CANDIDATE' || location.pathname.startsWith('/candidate') || location.pathname === '/';

  // Role selector options
  const getCurrentRoleOption = () => {
    if (isCandidateRole) return 'Candidate';
    if (location.pathname.startsWith('/university')) return 'University Admissions';
    if (location.pathname.startsWith('/faculty')) return 'Faculty Reviewer';
    if (location.pathname.startsWith('/examiner')) return 'Examiner';
    return 'Super Administrator';
  };

  const handleRoleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    try {
      setSwitching(true);
      await api.switchRole(role);
      onRoleChanged();
      if (role === 'Candidate' || role === 'Student') {
        navigate('/candidate/dashboard');
      } else if (role === 'University Admissions') {
        navigate('/university/admissions');
      } else if (role === 'Faculty Reviewer') {
        navigate('/faculty/reviews');
      } else if (role === 'Examiner') {
        navigate('/admin/live-monitoring');
      } else {
        navigate('/admin/overview');
      }
    } catch (err) {
      console.error("Role switch failed:", err);
    } finally {
      setSwitching(false);
    }
  };

  const currentPath = location.pathname;

  const getBreadcrumbTitle = () => {
    if (currentPath === '/admin/overview') return 'Overview';
    if (currentPath === '/admin/ip-authorization') return 'IP Authorization';
    if (currentPath === '/admin/merit-policies') return 'Merit Policies';
    if (currentPath === '/admin/live-monitoring') return 'Live Exam Monitoring';
    if (currentPath === '/admin/sessions' || currentPath === '/admin/seat-allocation') return 'Sessions & Seat Allocation';
    if (currentPath === '/admin/question-bank') return 'Question Bank';
    if (currentPath === '/university/admissions') return 'Admissions Verification Docket';
    if (currentPath === '/faculty/reviews') return 'Faculty Review Workspace';
    if (currentPath === '/candidate/profile') return 'My Profile';
    if (currentPath === '/candidate/academic-records') return 'Academic Records';
    if (currentPath === '/examinations/available') return 'Available Tests';
    if (currentPath === '/' || currentPath === '/candidate/dashboard') return 'Candidate Dashboard';
    return 'Dashboard';
  };

  const sidebarWidthClass = isCandidateRole ? 'w-[268px]' : 'w-[248px]';
  const mainOffsetClass = isCandidateRole ? 'lg:pl-[268px]' : 'lg:pl-[248px]';
  const headerLeftOffsetClass = isCandidateRole ? 'lg:left-[268px]' : 'lg:left-[248px]';

  return (
    <div className="min-h-screen bg-surface font-sans text-body-md text-on-surface antialiased">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest shadow-sm z-50 px-4 flex items-center justify-between border-b border-border-hairline">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container-high transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div className="flex flex-col">
            <span className="font-headline-md text-body-sm font-bold text-primary">PakCampusAssess</span>
            <span className="font-code-sm text-[10px] text-on-surface-variant uppercase">{isCandidateRole ? 'Candidate Portal' : 'Ministry Portal'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={getCurrentRoleOption()}
            onChange={handleRoleSelect}
            className="bg-surface-container-low font-label-sm text-label-sm text-primary font-semibold px-2 py-1 rounded-lg border border-border-hairline"
          >
            <option value="Super Administrator">Admin</option>
            <option value="Candidate">Candidate</option>
            <option value="University Admissions">Dean</option>
            <option value="Faculty Reviewer">Faculty</option>
          </select>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed left-0 top-0 h-screen ${sidebarWidthClass} bg-surface-container-lowest shadow-[0_1px_8px_rgba(32,54,75,0.04)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 border-r border-border-hairline ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-lowest border-b border-border-hairline">
            <Link to={isCandidateRole ? "/candidate/dashboard" : "/admin/overview"} className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[20px] text-secondary-fixed">school</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-body-sm font-bold tracking-tight text-primary leading-tight">PakCampusAssess</span>
                <span className="font-code-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  {isCandidateRole ? 'Candidate Portal' : 'Ministry Portal'}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Persona Card / Status Banner */}
          {isCandidateRole ? (
            <div className="mx-space-sm my-space-xs p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-border-hairline">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-semibold text-primary truncate">Ayesha Siddiqui</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>Verified
                </span>
              </div>
              <div className="flex items-center justify-between font-code-sm text-label-sm text-on-surface-variant">
                <span>Roll No:</span>
                <span className="font-semibold text-primary">CA-2027-01052</span>
              </div>
            </div>
          ) : (
            <div className="px-space-md py-space-sm">
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-lg text-secondary border border-border-hairline">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wide font-semibold">National Session Active</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          {isCandidateRole ? (
            /* CANDIDATE NAVIGATION LINKS */
            <nav className="flex flex-col px-space-xs gap-y-3 pb-space-lg">
              <div className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  Applicant Workspace
                </div>
                <Link
                  to="/candidate/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/candidate/dashboard' || currentPath === '/'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    Dashboard
                  </span>
                  <span className={`w-2 h-2 rounded-full ${currentPath === '/candidate/dashboard' || currentPath === '/' ? 'bg-secondary-fixed' : 'bg-transparent'}`}></span>
                </Link>

                <Link
                  to="/candidate/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/candidate/profile'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    My Profile
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">CNIC Verified</span>
                </Link>

                <Link
                  to="/candidate/academic-records"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/candidate/academic-records'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">school</span>
                    Academic Records
                  </span>
                  <span className="font-code-sm text-label-sm text-secondary font-semibold">100%</span>
                </Link>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  Admissions & Testing
                </div>
                <Link
                  to="/examinations/available"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/examinations/available'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">assignment</span>
                    Available Tests
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high font-code-sm text-label-sm text-primary">4 Open</span>
                </Link>

                <Link
                  to="/candidate/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">app_registration</span>
                    My Registrations
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">2 Active</span>
                </Link>

                <Link
                  to="/candidate/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                    Admit Card / Slip
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">Ready</span>
                </Link>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  Communications & Help
                </div>
                <Link
                  to="/cbt/workspace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-space-sm py-2 rounded-lg text-secondary hover:bg-secondary-container/30 transition-all font-semibold"
                >
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">terminal</span>
                    CBT Active Room
                  </span>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                </Link>
                <div className="flex items-center justify-between px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer">
                  <span className="font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">notifications</span>
                    Notifications
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container font-code-sm text-label-sm">3 New</span>
                </div>
              </div>
            </nav>
          ) : (
            /* ADMINISTRATIVE NAVIGATION LINKS (MATCHES EXACT STITCH NUMBERED HIERARCHY) */
            <nav className="flex flex-col px-space-xs gap-y-4 pb-space-lg">
              {/* 1. CORE */}
              <div className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  1. Core
                </div>
                <Link
                  to="/admin/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 transition-all rounded-lg ${
                    currentPath === '/admin/overview'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  <span className="font-label-md text-label-md">Overview</span>
                </Link>
                <div className="flex items-center justify-between px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[18px]">notifications</span>
                    <span className="font-label-md text-label-md">Notifications</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container font-code-sm text-label-sm">12</span>
                </div>
                <Link
                  to="/admin/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span className="font-label-md text-label-md">Audit Logs</span>
                </Link>
              </div>

              {/* 2. EXAMINATION OPS */}
              <div className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  2. Examination Ops
                </div>
                <Link
                  to="/examinations/available"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/examinations/available'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">category</span>
                  <span className="font-label-md text-label-md">Test Categories</span>
                </Link>
                <Link
                  to="/admin/question-bank"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/admin/question-bank'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  <span className="font-label-md text-label-md">Question Bank</span>
                </Link>
                <Link
                  to="/admin/question-bank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">architecture</span>
                  <span className="font-label-md text-label-md">Assessment Blueprints</span>
                </Link>
                <Link
                  to="/admin/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/admin/sessions' || currentPath === '/admin/seat-allocation'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">event_available</span>
                  <span className="font-label-md text-label-md">Examination Sessions</span>
                </Link>
                <Link
                  to="/admin/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span className="font-label-md text-label-md">Candidate Registrations</span>
                </Link>
                <Link
                  to="/admin/seat-allocation"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/admin/seat-allocation'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">event_seat</span>
                  <span className="font-label-md text-label-md">Seat Allocation</span>
                </Link>
              </div>

              {/* 3. INFRASTRUCTURE & STAFF */}
              <div className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  3. Infrastructure & Staff
                </div>
                <Link
                  to="/admin/ip-authorization"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                  <span className="font-label-md text-label-md">Centers & Universities</span>
                </Link>
                <Link
                  to="/admin/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">computer</span>
                  <span className="font-label-md text-label-md">Labs & Workstations</span>
                </Link>
                <Link
                  to="/admin/ip-authorization"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/admin/ip-authorization'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">security</span>
                  <span className="font-label-md text-label-md">IP Authorization</span>
                </Link>
                <Link
                  to="/admin/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span className="font-label-md text-label-md">Examiner Management</span>
                </Link>
                <Link
                  to="/admin/live-monitoring"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/admin/live-monitoring'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                    <span className="font-label-md text-label-md">Live Exam Monitoring</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                </Link>
              </div>

              {/* 4. RESULTS & MERIT */}
              <div className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  4. Results & Merit
                </div>
                <Link
                  to="/admin/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  <span className="font-label-md text-label-md">Results & Scoring</span>
                </Link>
                <Link
                  to="/admin/merit-policies"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/admin/merit-policies'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">policy</span>
                  <span className="font-label-md text-label-md">Merit Policies</span>
                </Link>
                <Link
                  to="/university/admissions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/university/admissions'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span className="font-label-md text-label-md">Applications & Verification</span>
                </Link>
                <Link
                  to="/faculty/reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all ${
                    currentPath === '/faculty/reviews'
                      ? 'bg-primary text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">leaderboard</span>
                  <span className="font-label-md text-label-md">Merit Lists & Publication</span>
                </Link>
              </div>

              {/* 5. SETTINGS */}
              <div className="flex flex-col gap-0.5">
                <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                  5. Settings
                </div>
                <Link
                  to="/admin/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span className="font-label-md text-label-md">System Settings</span>
                </Link>
              </div>
            </nav>
          )}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-space-md bg-surface-container-low flex flex-col gap-space-xs border-t border-border-hairline shrink-0">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm font-semibold uppercase">Helpline: 0800-CAMPUS</span>
            {isCandidateRole ? (
              <span className="font-code-sm text-label-sm text-secondary font-semibold">24/7</span>
            ) : (
              <span className="material-symbols-outlined text-[16px] text-outline">headset_mic</span>
            )}
          </div>
          {isCandidateRole ? (
            <div className="flex items-center justify-between font-code-sm text-label-sm text-outline pt-1 border-t border-surface-container-high">
              <span className="truncate">NADRA Biometric Linked</span>
              <span className="text-secondary font-semibold">Tier-4 Encrypted</span>
            </div>
          ) : (
            <div className="flex items-center justify-between font-code-sm text-label-sm text-outline">
              <span className="truncate">PakCampusAssess OS</span>
              <span>v2.4.1-rc</span>
            </div>
          )}
        </div>
      </aside>

      {/* TOP HEADER */}
      <header
        className={`fixed top-0 ${headerLeftOffsetClass} right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(32,54,75,0.04)] z-40 px-space-lg hidden lg:flex items-center justify-between gap-space-md border-b border-border-hairline`}
      >
        {/* Breadcrumb Navigator */}
        <div className="flex items-center gap-space-sm flex-1 max-w-sm">
          <div className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant overflow-hidden whitespace-nowrap">
            <span className="font-semibold text-primary">PakCampusAssess</span>
            <span className="text-outline">/</span>
            <span>{isCandidateRole ? 'Candidate' : 'Super Admin'}</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-medium">{getBreadcrumbTitle()}</span>
          </div>
        </div>

        {/* Global Search Box (⌘K) */}
        <div className="flex-1 max-w-md hidden md:flex items-center">
          <div className="w-full flex items-center bg-surface-container px-3 py-1.5 rounded-lg text-on-surface-variant focus-within:ring-1 focus-within:ring-secondary border border-transparent focus-within:border-secondary">
            <span className="material-symbols-outlined text-[18px] mr-2 text-outline">search</span>
            <input
              className="w-full bg-transparent font-body-sm text-body-sm focus:outline-none placeholder:text-outline text-on-surface"
              placeholder="Search candidates, roll #, test sessions..."
              type="text"
            />
            <kbd className="font-code-sm text-label-sm bg-surface-container-lowest px-1.5 py-0.5 rounded text-on-surface-variant shadow-sm border border-border-hairline">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Controls & User Profile Badge */}
        <div className="flex items-center gap-space-md">
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>All Systems Operational</span>
          </div>

          {/* Interactive Role Switcher Persona */}
          <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg border border-border-hairline">
            <label className="sr-only" htmlFor="role-switcher">Switch Persona</label>
            <select
              id="role-switcher"
              value={getCurrentRoleOption()}
              onChange={handleRoleSelect}
              disabled={switching}
              className="bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="Super Administrator">Super Administrator</option>
              <option value="Candidate">Candidate View</option>
              <option value="Examiner">Examiner / Proctor</option>
              <option value="University Admissions">University Admissions</option>
              <option value="Faculty Reviewer">Faculty Reviewer</option>
            </select>
          </div>

          {/* Notification Button */}
          <button
            aria-label="Notifications"
            className="relative p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
          </button>

          {/* User Profile Info */}
          <div className="flex items-center gap-space-sm pl-2">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="font-label-md text-label-md font-semibold text-primary leading-tight">
                {isCandidateRole ? 'Ayesha Siddiqui' : 'Dr. Tariq Mansoor'}
              </span>
              <span className="font-code-sm text-label-sm text-on-surface-variant">
                {isCandidateRole ? 'CA-2027-01052' : 'Exam Director'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-surface-container-highest shrink-0 bg-primary-container flex items-center justify-center text-white font-bold text-xs">
              {isCandidateRole ? 'AS' : 'TM'}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className={`relative pt-16 min-h-screen w-full ${mainOffsetClass} bg-surface transition-all duration-300`}>
        <div className="w-full px-4 sm:px-6 lg:px-gutter-desktop py-space-lg">
          {children}
        </div>
      </main>
    </div>
  );
};
