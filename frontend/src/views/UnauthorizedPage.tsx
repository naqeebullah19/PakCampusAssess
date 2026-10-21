import React from 'react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center antialiased font-sans">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl p-8 shadow-md border border-outline-variant/30 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-error-container text-error flex items-center justify-center mb-5 shadow-xs">
          <span className="material-symbols-outlined text-[36px]">gpp_bad</span>
        </div>

        <span className="font-code-sm text-label-sm uppercase tracking-widest text-error font-bold mb-1">
          HTTP 403 • ACCESS DENIED
        </span>
        <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight mb-3">
          Restricted Statutory Area
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
          Access to the <strong className="text-primary font-semibold">PakCampusAssess Super Admin Portal</strong> is strictly restricted to verified Super Administrator personnel. Your authenticated session does not possess the requisite institutional clearance.
        </p>

        <div className="w-full bg-surface-container-low rounded-xl p-4 text-left mb-6 border border-outline-variant/20">
          <div className="flex items-center gap-2 mb-1.5 text-body-sm font-semibold text-primary">
            <span className="material-symbols-outlined text-[18px] text-secondary">security</span>
            <span>Enforced Security Policy</span>
          </div>
          <p className="font-body-xs text-[12px] text-on-surface-variant">
            Candidate accounts, faculty reviewers, examination invigilators, and university admissions staff cannot access platform-wide administrative controls without an explicit statutory delegation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            to="/dashboard"
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md text-center hover:opacity-95 transition-all shadow-sm"
          >
            Candidate Dashboard
          </Link>
          <Link
            to="/login"
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-surface-container-high text-primary font-label-md text-label-md text-center hover:bg-surface-container-highest transition-all border border-outline-variant/30"
          >
            Switch Account
          </Link>
        </div>
      </div>

      <div className="mt-8 font-code-sm text-[11px] text-outline">
        Institutional Reference: PAC-SEC-POLICY-403 • Ministry of Federal Education
      </div>
    </div>
  );
};
