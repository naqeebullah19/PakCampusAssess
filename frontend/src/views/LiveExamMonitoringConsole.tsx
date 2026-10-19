import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const LiveExamMonitoringConsole: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('all');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // Poll telemetry every 10 seconds for real-time feel
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getLiveMonitoringData();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load live monitoring:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Synchronizing Active CBT Sessions Telemetry...</span>
      </div>
    );
  }

  const { clock = '10:42:18 PKT', auto_sync = '5s', kpis, candidates = [], selected_candidate } = data || {};
  const currentCandidate = candidates[selectedCandidateIndex] || candidates[0] || selected_candidate || {};

  return (
    <div className="flex flex-col w-full space-y-space-lg text-on-surface pb-12">
      {/* Top Header & Session Controls (Matches Screenshot 3) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
              Live Examination Monitoring
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-code-sm text-label-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>LIVE CLOCK: {clock}</span>
              <span className="text-secondary/70">• Auto-sync {auto_sync}</span>
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-4xl">
            Real-time biometric attendance, workstation telemetry, and session state tracking across national testing clusters.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <button
            onClick={() => handleAction("Exported full session telemetry stream (JSON/CSV) with cryptographic digest.")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-high transition-all text-label-md font-label-md border border-border-hairline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">file_download</span>
            <span>Export Session Telemetry</span>
          </button>
          <button
            onClick={() => handleAction("Incident notice broadcasted to 142 authorized proctors and center leads.")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-high transition-all text-label-md font-label-md border border-border-hairline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">campaign</span>
            <span>Broadcast Incident Notice</span>
          </button>
          <button
            onClick={() => handleAction("Restricted protocol: Requires dual-key authorization to pause active examination window.")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-error-container text-on-error-container shadow-sm hover:opacity-95 transition-all text-label-md font-label-md border border-error/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            <span>Pause Session Protocol (Restricted)</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded-lg flex items-center justify-between text-body-sm font-medium border border-secondary/20 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-secondary hover:text-primary">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* 5 KPI Metric Cards (Matches Screenshot 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Connected Workstations</span>
            <span className="material-symbols-outlined text-[18px] text-primary">devices</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">{kpis?.connected_workstations || '6,398'}</span>
              <span className="font-code-sm text-label-sm text-outline">/ {kpis?.total_workstations || '6,412'}</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-secondary h-full rounded-full" style={{ width: '99.8%' }}></div>
            </div>
            <span className="font-code-sm text-label-sm text-secondary mt-1 block font-medium">{kpis?.connection_pct || '99.8%'} Online</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Server Latency / Ping</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">wifi</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">{kpis?.server_latency || '14ms'}</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">{kpis?.latency_status || 'Optimal'}</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate">
              {kpis?.zero_loss_node || 'Zero packet loss (Islamabad Node)'}
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Answer Writes / Sec</span>
            <span className="material-symbols-outlined text-[18px] text-primary">rate_review</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">{kpis?.answer_writes_per_sec || '842 records/s'}</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              {kpis?.wal_replica || 'Dual WAL replica persistent'}
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Candidate Incidents</span>
            <span className="material-symbols-outlined text-[18px] text-error">flag</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-lg text-headline-lg font-bold text-error">{kpis?.candidate_incidents || 2}</span>
              <span className="font-label-sm text-label-sm text-error font-semibold">{kpis?.incidents_status || 'Pending Resolution'}</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate">
              {kpis?.incidents_detail || '1 Workstation swap • 1 HW lock'}
            </p>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Biometric Match Rate</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">fingerprint</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-lg text-headline-lg font-bold text-secondary">{kpis?.biometric_match_rate || '99.4%'}</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">{kpis?.biometric_provider || 'NADRA Verified'}</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate">
              {kpis?.biometric_overrides || '38 manual supervisor overrides'}
            </p>
          </div>
        </div>
      </div>

      {/* Session Filter Toolbar (Matches Screenshot 3) */}
      <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm border border-border-hairline flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-hairline">
            <span className="material-symbols-outlined text-[18px] text-secondary mr-2">badge</span>
            <span className="font-label-md text-label-md text-primary font-semibold">EX-2027-0104: CS</span>
          </div>
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-hairline">
            <span className="material-symbols-outlined text-[18px] text-outline mr-2">apartment</span>
            <select className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer">
              <option>All Participating University Labs</option>
              <option>NUST Sector H-12 Islamabad</option>
              <option>FAST-NUCES Islamabad</option>
              <option>UET Lahore Main Campus</option>
              <option>NED University Karachi</option>
              <option>BUITEMS Quetta</option>
            </select>
          </div>
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg flex-1 min-w-[200px] border border-border-hairline">
            <span className="material-symbols-outlined text-[18px] text-outline mr-2">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Roll #, Seat #, or Candidate Name"
              className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
              type="text"
            />
          </div>
        </div>

        {/* State Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              filterState === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
            }`}
          >
            All (6,412)
          </button>
          <button
            onClick={() => setFilterState('active')}
            className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              filterState === 'active' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Active (6,320)
          </button>
          <button
            onClick={() => setFilterState('flagged')}
            className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all flex items-center gap-1 ${
              filterState === 'flagged' ? 'bg-error text-white' : 'bg-surface-container-low text-error hover:bg-error-container'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            Flagged (14)
          </button>
          <button
            onClick={() => setFilterState('swapped')}
            className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              filterState === 'swapped' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Swapped (8)
          </button>
          <button
            onClick={() => setFilterState('submitted')}
            className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
              filterState === 'submitted' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Submitted (70)
          </button>
        </div>
      </div>

      {/* Main Work Area: 8 Cols Live Candidate Grid + 4 Cols Candidate Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* Operations Table (8 cols) */}
        <div className="xl:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-border-hairline overflow-hidden">
          <div className="p-space-md flex items-center justify-between bg-surface-container-lowest border-b border-border-hairline">
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-md text-headline-md font-semibold text-primary">Live Candidate Grid</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-label-sm">
                Displaying {candidates.length} of 6,412
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                title="Refresh Feed"
              >
                <span className="material-symbols-outlined text-[18px]">autorenew</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-border-hairline">
                  <th className="py-2.5 px-3">Seat / Lab</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">IP / Subnet</th>
                  <th className="py-2.5 px-3">NADRA Match</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Heartbeat</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-border-hairline">
                {candidates
                  .filter((c: any) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.seat.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((cand: any, idx: number) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedCandidateIndex(idx)}
                      className={`cursor-pointer transition-colors ${
                        selectedCandidateIndex === idx
                          ? 'bg-surface-container-high/60 font-medium'
                          : 'hover:bg-surface-container-low/60'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary font-code-sm">{cand.seat}</span>
                          <span className="text-label-sm text-on-surface-variant truncate">{cand.center}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-label-sm shrink-0">
                            {cand.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-primary leading-tight">{cand.name}</span>
                            <span className="font-code-sm text-label-sm text-outline">{cand.roll}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col font-code-sm text-label-sm">
                          <span className="text-primary font-medium">{cand.ip}</span>
                          <span className={`${cand.status === 'FLAGGED' ? 'text-error font-semibold' : 'text-secondary'} text-[10px]`}>
                            {cand.ip_type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[13px]">verified_user</span>
                          {cand.nadra_time}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col min-w-[110px]">
                          <div className="flex justify-between font-code-sm text-label-sm mb-1 text-primary">
                            <span>Q {cand.progress_answered}/{cand.progress_total}</span>
                            <span className="font-semibold">{cand.progress_pct}%</span>
                          </div>
                          <div className="w-full bg-surface-container rounded-full h-1 overflow-hidden">
                            <div className="bg-secondary h-1 rounded-full" style={{ width: `${cand.progress_pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-code-sm text-label-sm">
                        <span className={cand.status === 'FLAGGED' ? 'text-error font-medium' : 'text-secondary font-medium'}>
                          {cand.heartbeat.split(' ')[0]} {cand.heartbeat.split(' ')[1]}
                        </span>
                        <span className="block text-[10px] text-outline">{cand.heartbeat.split(' ').slice(2).join(' ')}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-code-sm text-label-sm font-semibold ${
                            cand.status === 'FLAGGED'
                              ? 'bg-error-container text-on-error-container'
                              : cand.status === 'SUBMITTED'
                              ? 'bg-surface-container text-on-surface-variant'
                              : 'bg-surface-container-low text-secondary'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              cand.status === 'FLAGGED'
                                ? 'bg-error animate-pulse'
                                : cand.status === 'SUBMITTED'
                                ? 'bg-outline'
                                : 'bg-secondary'
                            }`}
                          ></span>
                          {cand.status === 'FLAGGED' ? 'Packet Retry' : cand.status === 'SUBMITTED' ? 'Concluded' : 'Stable (11ms)'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidateIndex(idx);
                            handleAction(`Inspecting real-time packet stream for ${cand.name}`);
                          }}
                          className="p-1 rounded-md text-primary hover:bg-surface-container transition-colors"
                          title="View Candidate Telemetry"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination / Dense Status Footer */}
          <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between text-on-surface-variant gap-2 font-code-sm text-label-sm border-t border-border-hairline">
            <div className="flex items-center gap-2">
              <span>Data Cluster: <strong className="text-primary font-semibold">ISB-PRIMARY-01</strong></span>
              <span>•</span>
              <span>Streaming WebSocket: <strong className="text-secondary font-semibold">CONNECTED</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container transition-colors disabled:opacity-50 border border-border-hairline" disabled>
                Previous
              </button>
              <span className="px-2">Page 1 of 107</span>
              <button className="px-2.5 py-1 rounded bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container transition-colors border border-border-hairline">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Active Candidate Real-Time Telemetry Drawer (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline">
          {/* Candidate Profile & Biometric Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-14 h-14 rounded-lg bg-primary-container text-white flex items-center justify-center font-bold text-lg ring-2 ring-secondary/20 shadow-sm shrink-0">
                {currentCandidate.initials || 'AS'}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-md text-headline-md font-bold text-primary">{currentCandidate.name}</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                </div>
                <span className="font-code-sm text-label-sm text-on-surface-variant">Roll: {currentCandidate.roll}</span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">Seat: {currentCandidate.seat}</span>
              </div>
            </div>
            <span className="px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-semibold">
              {currentCandidate.status === 'SUBMITTED' ? 'Concluded' : 'Active'}
            </span>
          </div>

          {/* Live Session Stopwatch Bar */}
          <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-border-hairline">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">timer</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Time Remaining</span>
                <span className="font-code-sm text-body-lg font-bold text-primary tracking-wide">01:14:22</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Duration</span>
              <span className="font-code-sm text-label-md block text-primary font-medium">120 Minutes</span>
            </div>
          </div>

          {/* Institutional Verification Metadata Grid */}
          <div className="grid grid-cols-2 gap-space-xs p-space-sm rounded-lg bg-surface-container-high/40 font-code-sm text-label-sm border border-border-hairline">
            <div>
              <span className="text-on-surface-variant block text-[10px] uppercase">CNIC / B-Form</span>
              <span className="font-semibold text-primary">61101-7392811-4</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px] uppercase">Biometric Match</span>
              <span className="font-semibold text-secondary">99.8% Confirmed</span>
            </div>
            <div className="mt-1">
              <span className="text-on-surface-variant block text-[10px] uppercase">Authorized Proctor</span>
              <span className="font-semibold text-primary truncate">Prof. Haris Munir</span>
            </div>
            <div className="mt-1">
              <span className="text-on-surface-variant block text-[10px] uppercase">Sign-Off Time</span>
              <span className="font-semibold text-primary">08:42:19 PKT</span>
            </div>
          </div>

          {/* Latency Sparkline Graph */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Network Latency (Last 60s)</span>
              <span className="font-code-sm text-label-sm text-secondary font-semibold">11ms avg</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-container-low border border-border-hairline">
              <svg className="w-full h-12 overflow-visible" fill="none" viewBox="0 0 300 48">
                <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 2" x1="0" x2="300" y1="12" y2="12"></line>
                <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 2" x1="0" x2="300" y1="24" y2="24"></line>
                <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 2" x1="0" x2="300" y1="36" y2="36"></line>
                <path
                  className="text-secondary"
                  d="M0,28 L25,26 L50,29 L75,22 L100,24 L125,27 L150,21 L175,23 L200,20 L225,24 L250,22 L275,23 L300,21"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
                <path
                  className="text-secondary/10"
                  d="M0,28 L25,26 L50,29 L75,22 L100,24 L125,27 L150,21 L175,23 L200,20 L225,24 L250,22 L275,23 L300,21 L300,48 L0,48 Z"
                  fill="currentColor"
                ></path>
                <circle className="text-secondary animate-pulse" cx="300" cy="21" fill="currentColor" r="3.5"></circle>
              </svg>
              <div className="flex justify-between items-center text-[10px] text-outline font-code-sm mt-1">
                <span>-60 sec</span>
                <span>-30 sec</span>
                <span>Just Now (11ms)</span>
              </div>
            </div>
          </div>

          {/* Question Answer Audit Trail */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Answer Checkpoint Logs</span>
              <span className="font-code-sm text-label-sm text-primary font-medium">54 / 80 Logged</span>
            </div>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              <div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between font-code-sm text-label-sm border border-border-hairline">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span className="font-semibold text-primary">Q #54: Option B</span>
                </div>
                <span className="text-outline">10:42:16 PKT • <strong className="text-secondary">Saved</strong></span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between font-code-sm text-label-sm border border-border-hairline">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span className="font-semibold text-primary">Q #53: Option A</span>
                </div>
                <span className="text-outline">10:41:04 PKT • <strong className="text-secondary">Saved</strong></span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between font-code-sm text-label-sm border border-border-hairline">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="font-semibold text-primary">Q #52: Marked for Review</span>
                </div>
                <span className="text-outline">10:39:48 PKT • <strong className="text-primary font-semibold">Flagged</strong></span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between font-code-sm text-label-sm border border-border-hairline">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span className="font-semibold text-primary">Q #51: Option D</span>
                </div>
                <span className="text-outline">10:38:12 PKT • <strong className="text-secondary">Saved</strong></span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border-hairline">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAction(`Hot-swap NIC authorization initiated for ${currentCandidate.name}`)}
                className="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-medium transition-colors flex items-center justify-center gap-1 border border-border-hairline"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                <span>Authorize Swap</span>
              </button>
              <button
                onClick={() => handleAction(`Proctor security log note recorded for ${currentCandidate.roll}`)}
                className="py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-medium transition-colors flex items-center justify-center gap-1 border border-border-hairline"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">note_add</span>
                <span>Log Proctor Note</span>
              </button>
            </div>
            <button
              onClick={() => handleAction(`Granted +5 min compensatory time to ${currentCandidate.name}. Audit entry logged.`)}
              className="w-full py-2 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-medium shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">more_time</span>
              <span>Grant +5 Min Compensatory Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security & Invariant Footer Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary-container text-secondary">
            <span className="material-symbols-outlined text-[22px]">shield</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-body-sm font-semibold text-primary">National Integrity Protocol Active</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Cryptographic keystroke validation, synchronized time-drift mitigation, and live candidate camera checks are enabled nationwide.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-outline font-code-sm text-label-sm shrink-0">
          <span>Security Level: <strong className="text-secondary font-semibold">Tier-4 Encrypted</strong></span>
          <span>•</span>
          <span>Server Uptime: <strong className="text-primary font-semibold">100.0%</strong></span>
        </div>
      </div>
    </div>
  );
};
