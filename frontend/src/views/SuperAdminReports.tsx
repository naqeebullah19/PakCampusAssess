import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const SuperAdminReports: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await api.getSuperAdminReports();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant">Synthesizing National Analytics &amp; Turnout Metrics...</span>
      </div>
    );
  }

  const summary = data?.summary || {};
  const provincial = data?.provincial_breakdown || [];
  const centers = data?.center_capacity || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            National Testing &amp; Admissions Analytics
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">
            Provincial demographic turnout, pass ratios, and testing center infrastructure utilization
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high border border-outline-variant/30 shadow-xs transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>Print Gazette Report</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
          <div className="font-label-sm text-[11px] uppercase tracking-wide text-on-surface-variant font-bold">
            Total Candidates
          </div>
          <div className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            {summary.total_candidates || 0}
          </div>
          <div className="font-body-xs text-[11px] text-secondary mt-1">Real-time candidate registrations</div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
          <div className="font-label-sm text-[11px] uppercase tracking-wide text-on-surface-variant font-bold">
            Active Examinations
          </div>
          <div className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            {summary.total_examinations || 0}
          </div>
          <div className="font-body-xs text-[11px] text-on-surface-variant mt-1">Standardized assessments</div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
          <div className="font-label-sm text-[11px] uppercase tracking-wide text-on-surface-variant font-bold">
            National Pass Ratio
          </div>
          <div className="font-headline-xl text-headline-xl text-secondary font-bold mt-1">
            {summary.pass_rate_percentage || 0}%
          </div>
          <div className="font-body-xs text-[11px] text-secondary mt-1">Across all published cycles</div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
          <div className="font-label-sm text-[11px] uppercase tracking-wide text-on-surface-variant font-bold">
            Partner Universities
          </div>
          <div className="font-headline-xl text-headline-xl text-primary font-bold mt-1">
            {summary.total_institutions || 0}
          </div>
          <div className="font-body-xs text-[11px] text-on-surface-variant mt-1">Recognized institutions</div>
        </div>
      </div>

      {/* Provincial Distribution & Center Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
          <h3 className="font-headline-md text-headline-md font-bold text-primary mb-4">
            Candidate Geographic Distribution
          </h3>
          <div className="flex flex-col gap-3">
            {provincial.map((p: any) => (
              <div key={p.province} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/10">
                <span className="font-label-md text-label-md font-semibold text-primary">{p.province}</span>
                <span className="font-code-sm text-body-sm font-bold text-secondary">{p.count} Candidates</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
          <h3 className="font-headline-md text-headline-md font-bold text-primary mb-4">
            Authorized Center Capacity
          </h3>
          <div className="flex flex-col gap-3">
            {centers.map((c: any) => (
              <div key={c.center} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/10">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-semibold text-primary">{c.center}</span>
                  <span className="font-code-sm text-[10px] text-on-surface-variant">{c.city}</span>
                </div>
                <span className="font-code-sm text-body-sm font-bold text-primary">{c.capacity} Terminals</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
