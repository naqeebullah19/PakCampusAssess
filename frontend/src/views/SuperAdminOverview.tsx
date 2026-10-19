import React, { useEffect, useState } from 'react';
import { api, SuperAdminOverviewData } from '../api/client';
import { Link } from 'react-router-dom';

export const SuperAdminOverview: React.FC = () => {
  const [data, setData] = useState<SuperAdminOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cycle, setCycle] = useState<string>("Spring 2027 (Undergraduate)");
  const [centerScope, setCenterScope] = useState<string>("All 42 Regional Centers");
  const [filterSessionQuery, setFilterSessionQuery] = useState('');

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminOverview();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load admin overview:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Aggregating National Admissions Telemetry...</span>
      </div>
    );
  }

  const { kpis, centers = [], recent_incidents = [], audit_logs = [] } = data || {
    kpis: {
      total_candidates: 148920,
      total_registrations: 148920,
      active_sessions: 18,
      candidates_testing: 6412,
      completed_attempts: 94280,
      total_centers: 42,
      operational_centers: 42,
      open_incidents: 2
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg font-body-md text-body-md text-on-surface">
      {/* Top Context Header & Primary Executive Actions */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-1">
            <span className="font-code-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">National Admissions Registry</span>
            <span className="text-outline-variant font-code-sm text-label-sm">/</span>
            <span className="font-code-sm text-label-sm text-on-surface-variant font-medium">Federal Coordination Desk</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">Executive Overview</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Cycle 2027-A Centralized Entrance Testing &amp; Admissions Lifecycle</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary text-label-md font-label-md hover:bg-surface-container-high transition-colors shadow-sm border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-on-surface-variant">file_download</span>
            <span>Export National Report</span>
          </button>
          <Link
            to="/admin/merit-policies"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary text-label-md font-label-md hover:bg-surface-container-high transition-colors shadow-sm border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[17px] text-on-surface-variant">rule</span>
            <span>Generate Merit List</span>
          </Link>
          <Link
            to="/admin/seat-allocation"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-on-secondary text-label-md font-label-md hover:opacity-95 shadow-sm transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create Exam Session</span>
          </Link>
        </div>
      </div>

      {/* Cycle Control & Filter Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm border border-outline-variant/20">
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Cycle Selector */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-[18px] text-secondary">school</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Cycle:</span>
            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              className="bg-transparent font-label-md text-label-md text-primary font-medium focus:outline-none cursor-pointer"
            >
              <option>Spring 2027 (Undergraduate)</option>
              <option>Fall 2026 (Postgraduate MS/PhD)</option>
              <option>Summer 2026 (Remedial &amp; Special)</option>
            </select>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_today</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Window:</span>
            <span className="font-label-md text-label-md text-primary font-medium">Feb 10 - Feb 28, 2027</span>
            <span className="material-symbols-outlined text-[16px] text-outline cursor-pointer hover:text-primary">expand_more</span>
          </div>

          {/* Center Selector */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">apartment</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Center Scope:</span>
            <select
              value={centerScope}
              onChange={(e) => setCenterScope(e.target.value)}
              className="bg-transparent font-label-md text-label-md text-primary font-medium focus:outline-none cursor-pointer"
            >
              <option>All 42 Regional Centers</option>
              <option>Islamabad Capital Territory (8)</option>
              <option>Punjab Zone (16)</option>
              <option>Sindh Zone (10)</option>
              <option>Khyber Pakhtunkhwa Zone (5)</option>
              <option>Balochistan &amp; Gilgit Zone (3)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold mr-1">Status:</span>
          <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">
            Active Grid (Day 12 of 18)
          </span>
          <button
            onClick={loadOverview}
            className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
            title="Refresh Live Data"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
          </button>
        </div>
      </div>

      {/* 8 High-Yield Administrative KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Total Registered Candidates</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">{kpis.total_candidates.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 font-body-sm text-body-sm text-secondary font-medium">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+12.4% vs 2026 Cycle</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Active Computer Sessions</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">devices</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">{kpis.active_sessions} Sessions</div>
            <div className="flex items-center gap-1 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>Across 42 National Centers</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Currently Testing In-Lab</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">fingerprint</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
              {kpis.candidates_testing.toLocaleString()} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Candidates</span>
            </div>
            <div className="flex items-center gap-1 mt-1 font-body-sm text-body-sm text-secondary font-medium">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>98.6% Verification Turnout</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Completed Attempts</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">{kpis.completed_attempts.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">cloud_done</span>
              <span>100% Ingested &amp; Hashed</span>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Available Capacity Today</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">event_seat</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">12,800 Seats</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '84%' }}></div>
              </div>
              <span className="font-code-sm text-label-sm text-on-surface-variant font-medium">84% Booked</span>
            </div>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Awaiting Verification</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">3,140 Scores</div>
            <div className="flex items-center gap-1 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-outline">hourglass_empty</span>
              <span>Queue processing: ~14 mins</span>
            </div>
          </div>
        </div>

        {/* Card 7 */}
        <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Technical / Lab Incidents</span>
            <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">emergency_home</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-error tracking-tight font-bold">{kpis.open_incidents} Active</div>
            <div className="flex items-center gap-1 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="font-code-sm text-label-sm text-error font-medium">1 Jitter • 1 Station Swap</span>
            </div>
          </div>
        </div>

        {/* Card 8 */}
        <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-start justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Authorized Exam Centers</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">{kpis.total_centers || 42} Centers</div>
            <div className="flex items-center gap-1 mt-1 font-body-sm text-body-sm text-secondary font-medium">
              <span className="material-symbols-outlined text-[16px]">domain_verification</span>
              <span>116 Approved Secure Labs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN (Approx 65% / 8 of 12 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Live & Upcoming Examination Schedule Table Section */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden border border-outline-variant/20">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-md text-headline-md text-primary font-bold">Live &amp; Upcoming Examination Schedule</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-code-sm text-label-sm font-semibold">Batch 04</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Real-time candidate load, invigilator presence, and seat dispatch metrics</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[16px] mr-1.5 text-outline">search</span>
                  <input
                    value={filterSessionQuery}
                    onChange={(e) => setFilterSessionQuery(e.target.value)}
                    className="bg-transparent font-body-sm text-body-sm focus:outline-none placeholder:text-outline text-on-surface w-36 sm:w-44"
                    placeholder="Filter session or lead..."
                    type="text"
                  />
                </div>
                <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors" title="Export Schedule CSV">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider h-10">
                    <th className="px-4 font-semibold">Session ID</th>
                    <th className="px-4 font-semibold">Category / Stream</th>
                    <th className="px-4 font-semibold">Center &amp; Lab</th>
                    <th className="px-4 font-semibold">Slot &amp; Timing</th>
                    <th className="px-4 font-semibold">Seat Fill</th>
                    <th className="px-4 font-semibold">Lead Examiner</th>
                    <th className="px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {/* Row 1 (Active) */}
                  <tr className="hover:bg-surface-container-low/60 transition-colors h-[54px]">
                    <td className="px-4 py-2 font-code-sm text-code-sm text-primary font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        <span>EX-2027-0104</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-primary">Pre-Engineering (ECAT)</td>
                    <td className="px-4 py-2 text-on-surface-variant">NUST Sector H-12, Lab C3A</td>
                    <td className="px-4 py-2 font-code-sm text-label-sm">09:00 - 11:30 AM</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-label-sm font-semibold text-primary">250/250</span>
                        <div className="w-12 bg-surface-container rounded-full h-1 overflow-hidden">
                          <div className="bg-secondary h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-body-sm text-body-sm text-on-surface">Prof. Haris Munir</td>
                    <td className="px-4 py-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">In Progress</span>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-low/60 transition-colors h-[54px]">
                    <td className="px-4 py-2 font-code-sm text-code-sm text-primary font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        <span>EX-2027-0105</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-primary">Medical / Dental (MDCAT)</td>
                    <td className="px-4 py-2 text-on-surface-variant">KEMU Auditorium Hall 1</td>
                    <td className="px-4 py-2 font-code-sm text-label-sm">09:00 - 12:30 PM</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-label-sm font-semibold text-primary">320/320</span>
                        <div className="w-12 bg-surface-container rounded-full h-1 overflow-hidden">
                          <div className="bg-secondary h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-body-sm text-body-sm text-on-surface">Dr. Shahida Parveen</td>
                    <td className="px-4 py-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">In Progress</span>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-low/60 transition-colors h-[54px]">
                    <td className="px-4 py-2 font-code-sm text-code-sm text-primary font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                        <span>EX-2027-0106</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-primary">Business &amp; Social (B-NAT)</td>
                    <td className="px-4 py-2 text-on-surface-variant">IBA Main Campus, City Lab</td>
                    <td className="px-4 py-2 font-code-sm text-label-sm">01:00 - 03:00 PM</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-label-sm font-semibold text-primary">185/200</span>
                        <div className="w-12 bg-surface-container rounded-full h-1 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '92.5%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-body-sm text-body-sm text-on-surface">Dr. Zeeshan Haider</td>
                    <td className="px-4 py-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase">Scheduled</span>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-surface-container-low/60 transition-colors h-[54px]">
                    <td className="px-4 py-2 font-code-sm text-code-sm text-primary font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                        <span>EX-2027-0107</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-primary">General Science (G-CAT)</td>
                    <td className="px-4 py-2 text-on-surface-variant">UET Peshawar, CC Lab 02</td>
                    <td className="px-4 py-2 font-code-sm text-label-sm">01:30 - 03:30 PM</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-label-sm font-semibold text-primary">140/150</span>
                        <div className="w-12 bg-surface-container rounded-full h-1 overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '93.3%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-body-sm text-body-sm text-on-surface">Engr. Kamran Khan</td>
                    <td className="px-4 py-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase">Scheduled</span>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-surface-container-low/60 transition-colors h-[54px]">
                    <td className="px-4 py-2 font-code-sm text-code-sm text-on-surface-variant font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-outline"></span>
                        <span>EX-2027-0103</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-on-surface-variant">Pre-Engineering Early Slot</td>
                    <td className="px-4 py-2 text-on-surface-variant">FAST-NUCES Islamabad</td>
                    <td className="px-4 py-2 font-code-sm text-label-sm">07:30 - 09:30 AM</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm text-label-sm font-semibold text-outline">180/180</span>
                        <div className="w-12 bg-surface-container rounded-full h-1 overflow-hidden">
                          <div className="bg-outline h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-body-sm text-body-sm text-on-surface">Dr. M. R. Siddiqui</td>
                    <td className="px-4 py-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold uppercase">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer */}
            <div className="px-4 py-3 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant/10">
              <span className="font-code-sm text-label-sm text-on-surface-variant">Showing 1 to 5 of 18 today's sessions</span>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm font-semibold">Previous</button>
                <button className="px-2.5 py-1 rounded bg-primary text-on-primary font-code-sm text-label-sm font-semibold">1</button>
                <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-code-sm text-label-sm">2</button>
                <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-code-sm text-label-sm">3</button>
                <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm font-semibold">Next</button>
              </div>
            </div>
          </div>

          {/* Center Readiness & IP Authorization Grid */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary font-bold">Center Infrastructure &amp; IP Authorization Matrix</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">High-stakes environmental lock: Static whitelisting, backup power, and proctor feeds</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold uppercase">4 / 4 Regional Hubs Online</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Hub 1: NUST Islamabad */}
              <div className="bg-surface-container-low/60 rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/10">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">PK-ISB-01</span>
                    <h4 className="font-label-md text-label-md font-bold text-primary mt-0.5">NUST Sector H-12 Campus</h4>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Islamabad Capital Territory</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">100% OPERATIONAL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                    <span className="font-code-sm text-label-sm">IP: 111.68.96.0/24</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                    <span className="font-label-sm text-label-sm">350kVA Standby Auto</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">network_check</span>
                    <span className="font-label-sm text-label-sm">10Gbps PERN Link</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
                    <span className="font-label-sm text-label-sm">48 CCTV Proctors Live</span>
                  </div>
                </div>
              </div>

              {/* Hub 2: UET Lahore */}
              <div className="bg-surface-container-low/60 rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/10">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">PK-LHR-04</span>
                    <h4 className="font-label-md text-label-md font-bold text-primary mt-0.5">UET Grand Auditorium Hub</h4>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">GT Road, Lahore, Punjab</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">100% OPERATIONAL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                    <span className="font-code-sm text-label-sm">IP: 202.166.168.0/24</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                    <span className="font-label-sm text-label-sm">Dual Diesel Synced</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">network_check</span>
                    <span className="font-label-sm text-label-sm">PERN-III Fiber OK</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
                    <span className="font-label-sm text-label-sm">62 Stream Feeds OK</span>
                  </div>
                </div>
              </div>

              {/* Hub 3: NED UET Karachi */}
              <div className="bg-surface-container-low/60 rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/10">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">PK-KHI-02</span>
                    <h4 className="font-label-md text-label-md font-bold text-primary mt-0.5">NED Main IT Center</h4>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">University Road, Karachi</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">100% OPERATIONAL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                    <span className="font-code-sm text-label-sm">IP: 203.99.160.0/24</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                    <span className="font-label-sm text-label-sm">Solar + Grid + Genset</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">network_check</span>
                    <span className="font-label-sm text-label-sm">Redundant ISP-2 Online</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
                    <span className="font-label-sm text-label-sm">54 AI Face Monitors</span>
                  </div>
                </div>
              </div>

              {/* Hub 4: UET Peshawar */}
              <div className="bg-surface-container-low/60 rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/10">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">PK-PEW-01</span>
                    <h4 className="font-label-md text-label-md font-bold text-primary mt-0.5">UET Computer Systems Complex</h4>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Jamrud Road, Peshawar, KP</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">100% OPERATIONAL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                    <span className="font-code-sm text-label-sm">IP: 121.52.144.0/24</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                    <span className="font-label-sm text-label-sm">Standby Primary Test OK</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">network_check</span>
                    <span className="font-label-sm text-label-sm">1Gbps Dedicated LAN</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
                    <span className="font-label-sm text-label-sm">32 High-Def Proctors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Breakdown by Academic Stream */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary font-bold">National Registration Cohort Breakdown</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Distribution across provincial quotas and prioritized academic disciplines</p>
              </div>
              <span className="font-code-sm text-label-sm text-primary font-semibold">Total: 148,920 Enrolled</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider h-9">
                    <th className="px-4 font-semibold">Academic Stream</th>
                    <th className="px-4 font-semibold">Candidates</th>
                    <th className="px-4 font-semibold">Share</th>
                    <th className="px-4 font-semibold">Visual Ratio</th>
                    <th className="px-4 font-semibold text-right">Quota Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="px-4 py-2.5 font-medium text-primary">Computer Science &amp; Software Engineering</td>
                    <td className="px-4 py-2.5 font-code-sm text-code-sm text-primary font-semibold">62,400</td>
                    <td className="px-4 py-2.5 text-on-surface-variant">41.9%</td>
                    <td className="px-4 py-2.5">
                      <div className="w-32 bg-surface-container rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '41.9%' }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">Open</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="px-4 py-2.5 font-medium text-primary">Medical &amp; Bio-Sciences (Pre-Medical)</td>
                    <td className="px-4 py-2.5 font-code-sm text-code-sm text-primary font-semibold">51,200</td>
                    <td className="px-4 py-2.5 text-on-surface-variant">34.4%</td>
                    <td className="px-4 py-2.5">
                      <div className="w-32 bg-surface-container rounded-full h-1.5 overflow-hidden">
                        <div className="bg-secondary h-full rounded-full" style={{ width: '34.4%' }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">Open</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="px-4 py-2.5 font-medium text-primary">General Science &amp; IT Mathematics</td>
                    <td className="px-4 py-2.5 font-code-sm text-code-sm text-primary font-semibold">24,320</td>
                    <td className="px-4 py-2.5 text-on-surface-variant">16.3%</td>
                    <td className="px-4 py-2.5">
                      <div className="w-32 bg-surface-container rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary-container h-full rounded-full" style={{ width: '16.3%' }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">Open</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="px-4 py-2.5 font-medium text-primary">Business Analytics &amp; Social Sciences</td>
                    <td className="px-4 py-2.5 font-code-sm text-code-sm text-primary font-semibold">11,000</td>
                    <td className="px-4 py-2.5 text-on-surface-variant">7.4%</td>
                    <td className="px-4 py-2.5">
                      <div className="w-32 bg-surface-container rounded-full h-1.5 overflow-hidden">
                        <div className="bg-surface-tint h-full rounded-full" style={{ width: '7.4%' }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold uppercase">Filling Fast</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Approx 35% / 4 of 12 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Operational Incident & Escalation Feed */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-3.5 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-primary font-bold">Incident &amp; Escalation Feed</h3>
                <span className="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container font-code-sm text-label-sm font-semibold">
                  {recent_incidents.length || 2} Active
                </span>
              </div>
              <button className="text-secondary font-label-sm text-label-sm font-semibold hover:underline">View All</button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Live telemetry warnings from center invigilators and automated terminal health checks.</p>
            <div className="flex flex-col gap-3 mt-1">
              <div className="p-3 rounded-lg bg-surface-container-low/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold uppercase">Low Latency Jitter</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant">10:14 AM PKT</span>
                </div>
                <div className="font-body-sm text-body-sm text-primary font-semibold">East Campus Lab 4B IP Jitter Resolved</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Auto-switched to backup fiber route. Sub-second ping restored (1.4s), zero candidate state loss.</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-code-sm text-label-sm text-outline">Center: PK-ISB-01 (NUST)</span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">Resolved</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase">Hardware Swap</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant">09:48 AM PKT</span>
                </div>
                <div className="font-body-sm text-body-sm text-primary font-semibold">Workstation C-14 Hot-Spare Migration</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Candidate CA-2027-01052 transferred smoothly to spare unit C-99 due to key debounce issue.</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-code-sm text-label-sm text-outline">Lead: Engr. F. Durrani</span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">Logged</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">Biometric Match</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant">08:52 AM PKT</span>
                </div>
                <div className="font-body-sm text-body-sm text-primary font-semibold">NADRA Gateway Identity Handshake</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Batch verification completed for 6,400 morning entrants against CNIC smart card registry.</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-code-sm text-label-sm text-outline">Success rate: 99.8%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Cleared</span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Publication & Scoring Pipeline */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-primary font-bold">Scoring &amp; Merit Pipeline</h3>
                <span className="font-code-sm text-label-sm text-secondary font-semibold">Cycle Phase 3</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Automated psychometric equating and official merit validation</p>
            </div>
            {/* Stepper / Pipeline Progress */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary">CBT Auto-Scoring Engine</span>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">98.4%</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">94,280 attempts processed with raw normalization.</p>
                  <div className="w-full bg-surface-container rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '98.4%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary">AI Anomaly &amp; Cheating Audit</span>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">95.1%</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Rapid answer sequence anomalies and proctor flag reconciliation.</p>
                  <div className="w-full bg-surface-container rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '95.1%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary">Inter-University Audit Desk</span>
                    <span className="font-code-sm text-label-sm text-primary font-semibold">Underway</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Dean committee review on 3,140 contested question keys.</p>
                  <div className="w-full bg-surface-container rounded-full h-1 mt-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '44%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-60">
                <div className="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-on-surface">National Merit Compilation</span>
                    <span className="font-code-sm text-label-sm text-outline">Pending</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Final seat allocation algorithm scheduled for March 02, 2027.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Administrative Activity Log */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-3.5 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-primary font-bold">Audit Log &amp; System Changes</h3>
              <span className="font-code-sm text-label-sm text-outline">v2.4.1</span>
            </div>
            <div className="flex flex-col gap-3 font-body-sm text-body-sm">
              {audit_logs && audit_logs.length > 0 ? (
                audit_logs.slice(0, 3).map((log: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 pb-2.5 border-b border-surface-container last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                    <div className="flex flex-col">
                      <span className="text-primary font-medium">{log.action}</span>
                      <span className="text-on-surface-variant text-label-md font-label-md">{log.details || `Action by ${log.actor_name}`}</span>
                      <span className="font-code-sm text-label-sm text-outline mt-0.5">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2.5 pb-2.5 border-b border-surface-container">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                    <div className="flex flex-col">
                      <span className="text-primary font-medium">Examiner Reallocated to Session EX-0106</span>
                      <span className="text-on-surface-variant text-label-md font-label-md">Prof. Asim Farooq substituted for emergency cover.</span>
                      <span className="font-code-sm text-label-sm text-outline mt-0.5">Today at 10:22 AM • By Super Admin</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pb-2.5 border-b border-surface-container">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                    <div className="flex flex-col">
                      <span className="text-primary font-medium">IP Allowlist Updated for Center PK-KHI-02</span>
                      <span className="text-on-surface-variant text-label-md font-label-md">Added secondary failover range 203.99.160.128/28.</span>
                      <span className="font-code-sm text-label-sm text-outline mt-0.5">Today at 09:15 AM • Automated SecOps</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-surface-tint mt-1.5 shrink-0"></div>
                    <div className="flex flex-col">
                      <span className="text-primary font-medium">Merit Policy Formula v2.3 Signed Off</span>
                      <span className="text-on-surface-variant text-label-md font-label-md">Weightage: 50% Entry Test + 40% F.Sc / HSSC + 10% Matric.</span>
                      <span className="font-code-sm text-label-sm text-outline mt-0.5">Yesterday at 05:40 PM • Council Secretariat</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SuperAdminOverview;
