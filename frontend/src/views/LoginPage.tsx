import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, User } from '../api/client';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'Super Administrator',
      desc: 'Central Ministry & National Directorate Access',
      username: 'admin@pakcampusassess.edu.pk',
      password: 'AdminPass2027!',
      target: '/super-admin',
      badge: 'SUPER_ADMIN',
      icon: 'shield_person'
    },
    {
      role: 'Candidate / Examinee',
      desc: 'Applicant Portal, Admit Cards & Results',
      username: 'ayesha.siddiqui@gmail.com',
      password: 'Candidate2027!',
      target: '/dashboard',
      badge: 'CANDIDATE',
      icon: 'person'
    },
    {
      role: 'Examination Manager',
      desc: 'Session Scheduling & Workstation Ops',
      username: 'controller@pakcampusassess.edu.pk',
      password: 'ControllerPass2027!',
      target: '/admin/examination-sessions',
      badge: 'EXAM_CONTROLLER',
      icon: 'manage_accounts'
    },
    {
      role: 'University Admissions',
      desc: 'Dean & Committee Verification Docket',
      username: 'admissions@nust.edu.pk',
      password: 'AdmissionsPass2027!',
      target: '/university/admissions',
      badge: 'UNIVERSITY_ADMIN',
      icon: 'domain'
    },
  ];

  const handleLogin = async (e?: React.FormEvent, customUser?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const targetUser = customUser || username;
    const targetPass = customPass || password;

    if (!targetUser) {
      setError("Please provide a username or institutional email.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.login(targetUser, targetPass);
      const user = res.data.user;
      onLoginSuccess(user);

      // Determine appropriate landing page
      const role = user.profile?.role;
      if (role === 'SUPER_ADMIN') {
        const from = (location.state as any)?.from?.pathname;
        navigate(from && from.startsWith('/super-admin') ? from : '/super-admin', { replace: true });
      } else if (role === 'CANDIDATE') {
        navigate('/dashboard', { replace: true });
      } else if (role === 'UNIVERSITY_ADMIN') {
        navigate('/university/admissions', { replace: true });
      } else if (role === 'FACULTY_REVIEWER') {
        navigate('/faculty/reviews', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.error || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const selectDemoAccount = (acc: typeof demoAccounts[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    handleLogin(undefined, acc.username, acc.password);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 sm:p-6 antialiased font-sans">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border border-outline-variant/30 flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold font-headline-lg text-headline-md shadow-xs mb-3">
            PCA
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            PakCampusAssess
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Centralized National Admissions &amp; Computer-Based Testing System
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-body-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3.5 mb-6">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold mb-1">
              Institutional Email / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin@pakcampusassess.edu.pk"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Sign In to System</span>
              </>
            )}
          </button>
        </form>

        {/* One-Click Personas for Rapid Inspection */}
        <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-2.5">
          <span className="font-label-sm text-[11px] text-on-surface-variant/80 uppercase font-bold tracking-wider text-center">
            Or select persona for rapid inspection
          </span>

          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => selectDemoAccount(acc)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left border border-outline-variant/20 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">{acc.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary leading-tight">
                      {acc.role}
                    </span>
                    <span className="font-code-sm text-[10px] text-on-surface-variant">{acc.username}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center font-code-sm text-[11px] text-outline">
        Institutional Gateway • Server Authoritative Session Verification
      </div>
    </div>
  );
};
