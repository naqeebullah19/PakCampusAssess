import React, { useEffect, useState } from 'react';
import { api, UniversityApplicationItem } from '../api/client';

export const FacultyReviewWorkspace: React.FC = () => {
  const [applications, setApplications] = useState<UniversityApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  // Review Form
  const [rec, setRec] = useState<string>('STRONG_ADMIT');
  const [notes, setNotes] = useState<string>('Candidate clears all academic and entry test statutory benchmarks with distinction. Recommended for departmental honors program and scholarship.');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [activeQuotaTab, setActiveQuotaTab] = useState<'open' | 'provincial' | 'defense' | 'waitlist'>('open');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setLoading(true);
      const res = await api.getApplications();
      setApplications(res.data || []);
      if (res.data?.length > 0) {
        setSelectedApp(res.data[0]);
      } else {
        // Fallback default selected candidate matching Stitch
        setSelectedApp({
          id: 48,
          candidate_name: 'Ayesha Siddiqui',
          candidate_roll_number: 'CA-2027-01052',
          application_number: 'APP-2027-00482',
          institution_name: 'NUST Islamabad',
          rank: 48,
          ssc_pct: 94.73,
          hssc_pct: 90.55,
          ecat_score: 74.5,
          net_aggregate: 92.253,
          standing: 'Selected (OM)',
          domicile: 'Rawalpindi (Punjab)',
        });
      }
    } catch (err) {
      console.error("Failed to load applications for faculty:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setSubmitting(true);
      setSuccessNotice(null);
      await api.submitFacultyReview({
        application_id: selectedApp.id,
        academic_score: 9.5,
        test_score: 9.2,
        recommendation: rec,
        notes: notes
      });
      setSuccessNotice(`Statutory faculty evaluation ratified for ${selectedApp.candidate_name}.`);
      await loadApps();
    } catch (err) {
      console.error("Failed to submit faculty review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Connecting to Faculty Admissions Committee Workspace...</span>
      </div>
    );
  }

  const meritRoster = [
    { rank: '#01', name: 'Hamza Daniyal Qureshi', roll: 'CA-2027-00214', domicile: 'Rawalpindi (Punjab)', ssc: 9.820, hssc: 37.840, ecat: 48.755, agg: '96.415%', status: 'Selected (OM)' },
    { rank: '#02', name: 'Zainab Fatima Bukhari', roll: 'CA-2027-00892', domicile: 'Islamabad Capital', ssc: 9.750, hssc: 37.520, ecat: 48.550, agg: '95.820%', status: 'Selected (OM)' },
    { rank: '#48', name: 'Ayesha Siddiqui', roll: 'CA-2027-01052', domicile: 'Rawalpindi (Punjab)', ssc: 9.473, hssc: 36.218, ecat: 46.562, agg: '92.253%', status: 'Selected (OM)', active: true },
    { rank: '#79', name: 'Muhammad Bilal Khan', roll: 'CA-2027-00481', domicile: 'Lahore (Punjab)', ssc: 9.210, hssc: 35.800, ecat: 45.000, agg: '90.010%', status: 'Selected (OM)' },
    { rank: '#180', name: 'Usman Ali Cheema', roll: 'CA-2027-00486', domicile: 'Gujranwala (Punjab)', ssc: 9.189, hssc: 35.036, ecat: 42.195, agg: '86.420%', status: 'Cut-Off (OM)' },
  ];

  return (
    <div className="flex flex-col w-full font-body-md text-body-md text-on-surface">
      {/* Top Academic Context Header & Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-1">
            <span>Faculty Admissions Workspace</span>
            <span className="text-outline">/</span>
            <span className="font-code-sm text-primary">BSCS-CYCLE-2027-A</span>
            <span className="text-outline">/</span>
            <span className="text-secondary font-semibold">Official Docket</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Admissions Committee Merit Ranking &amp; Final Selection Docket
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Statutory faculty adjudication suite for Quota Allocation, Tie-Breaker Resolution, and Official Merit List Gazette Publication.
          </p>

          {/* Institutional Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[15px] text-primary">school</span>
              <span>National University of Sciences &amp; Technology (NUST)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[15px] text-secondary">computer</span>
              <span>Program: BS Computer Science</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>Intake: Fall 2027 / Cycle 2027-A</span>
            </div>
          </div>
        </div>

        {/* Governance Action Bar */}
        <div className="flex items-center flex-wrap gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container transition-all shadow-sm font-label-md text-label-md border border-outline-variant/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Export Gazetted PDF</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container transition-all shadow-sm font-label-md text-label-md border border-outline-variant/20" type="button">
            <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            <span>Conflict Sign-Off</span>
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant transition-all shadow-sm font-label-md text-label-md font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span>Publish Provisional Merit List</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="mb-space-md p-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold flex items-center gap-2 border border-secondary">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{successNotice}</span>
        </div>
      )}

      {/* KPI Statistical Ribbon (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
        {/* Total Seats */}
        <div className="flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Total Program Capacity</span>
            <span className="p-1.5 rounded-md bg-surface-container text-primary material-symbols-outlined text-[18px]">chair_alt</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">250 Seats</span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">100% Allocated</span>
          </div>
          <div className="mt-2 pt-2 flex items-center justify-between font-code-sm text-label-sm text-on-surface-variant bg-surface-container-low px-2 py-1 rounded">
            <span>Open: 180</span>
            <span>Prov: 50</span>
            <span>Def: 20</span>
          </div>
        </div>

        {/* Eligible Candidates */}
        <div className="flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Verified Eligible Pool</span>
            <span className="p-1.5 rounded-md bg-surface-container text-primary material-symbols-outlined text-[18px]">how_to_reg</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">4,120</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/ 4,820 applicants</span>
          </div>
          <div className="mt-2 pt-2 flex items-center gap-1.5 text-label-sm text-secondary font-semibold">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>100% Pre-Requisite &amp; ECAT Clear</span>
          </div>
        </div>

        {/* Projected Cut-Off Aggregate */}
        <div className="flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Open Merit Threshold</span>
            <span className="p-1.5 rounded-md bg-secondary-container text-on-secondary-container material-symbols-outlined text-[18px]">trending_up</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">86.420%</span>
            <span className="font-code-sm text-label-sm text-secondary font-semibold">+0.68% YoY</span>
          </div>
          <div className="mt-2 pt-2 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>Rank #180 (Bilal A. Khan)</span>
            <span className="font-code-sm text-primary font-semibold">Δ +0.030% to W#1</span>
          </div>
        </div>

        {/* Faculty Signatures Status */}
        <div className="flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Statutory Quorum</span>
            <span className="p-1.5 rounded-md bg-secondary-container text-secondary material-symbols-outlined text-[18px]">draw</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-secondary">4 / 4 Sign-Offs</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">Quorum Met</span>
          </div>
          <div className="mt-2 pt-2 flex items-center gap-1.5 font-code-sm text-label-sm text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="truncate">Secured via ECDSA HSM</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: 65% (8 of 12 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* List Controls & Category Tabs Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 flex flex-col gap-3 border border-outline-variant/20">
            {/* Quota Segregation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-surface-container">
              <button
                onClick={() => setActiveQuotaTab('open')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all ${
                  activeQuotaTab === 'open' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Open Merit National</span>
                <span className="font-code-sm text-label-sm bg-surface-container-high text-primary px-1.5 py-0.2 rounded font-semibold">180/180</span>
              </button>
              <button
                onClick={() => setActiveQuotaTab('provincial')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-all ${
                  activeQuotaTab === 'provincial' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Provincial Quota</span>
                <span className="font-code-sm text-label-sm text-on-surface-variant">50/50</span>
              </button>
              <button
                onClick={() => setActiveQuotaTab('defense')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-all ${
                  activeQuotaTab === 'defense' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Armed Forces &amp; Martyrs</span>
                <span className="font-code-sm text-label-sm text-on-surface-variant">20/20</span>
              </button>
              <button
                onClick={() => setActiveQuotaTab('waitlist')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-all ${
                  activeQuotaTab === 'waitlist' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Waitlist Pool</span>
                <span className="font-code-sm text-label-sm text-secondary font-semibold">#181-300</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary border border-outline-variant/10"
                  placeholder="Search Merit Rank, Roll #, Candidate Name..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <div className="flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg font-label-sm text-label-sm text-on-surface-variant gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">sort</span>
                  <span>Sort: <strong className="text-primary font-semibold">Net Aggregate (Desc)</strong></span>
                </div>
                <div className="hidden md:flex items-center bg-secondary-container/60 text-on-secondary-container px-2.5 py-1.5 rounded-lg font-label-sm text-label-sm gap-1">
                  <span className="material-symbols-outlined text-[15px]">balance</span>
                  <span>Tie-Breaker Rule: <strong>Active</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Merit Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/20">
            <div className="px-4 py-3 bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-headline-md font-semibold text-primary">Official Merit Standing</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  Showing Active Roster: Open Merit #01 - #181
                </span>
              </div>
              <span className="font-code-sm text-label-sm text-outline">Formula: SSC(10%) + HSSC(40%) + ECAT(50%)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container">
                    <th className="py-2.5 px-3 font-semibold text-center w-16">Rank</th>
                    <th className="py-2.5 px-3 font-semibold">Candidate Identifier</th>
                    <th className="py-2.5 px-3 font-semibold">Domicile</th>
                    <th className="py-2.5 px-2 font-semibold text-right">SSC (10)</th>
                    <th className="py-2.5 px-2 font-semibold text-right">HSSC (40)</th>
                    <th className="py-2.5 px-2 font-semibold text-right">ECAT (50)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Net Agg.</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Standing</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {meritRoster.map((c, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedApp(c)}
                      className={`cursor-pointer transition-colors ${
                        c.active ? 'bg-surface-container-low/90 ring-1 ring-secondary/30' : 'hover:bg-surface-container-low/60'
                      }`}
                    >
                      <td className={`py-3 px-3 text-center font-code-sm font-bold ${c.active ? 'text-secondary' : 'text-primary'}`}>
                        {c.active && <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-1"></span>}
                        {c.rank}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">{c.name}</span>
                          <span className="font-code-sm text-label-sm text-on-surface-variant">{c.roll}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant">{c.domicile}</td>
                      <td className="py-3 px-2 text-right font-code-sm">{c.ssc.toFixed(3)}</td>
                      <td className="py-3 px-2 text-right font-code-sm">{c.hssc.toFixed(3)}</td>
                      <td className="py-3 px-2 text-right font-code-sm font-medium">{c.ecat.toFixed(3)}</td>
                      <td className="py-3 px-3 text-right font-code-sm font-bold text-secondary text-body-md">{c.agg}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-primary hover:text-secondary font-label-sm text-label-sm font-semibold underline underline-offset-2" type="button">
                          Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 35% (4 of 12 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Candidate Selection Dossier */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 bg-surface-container-low -mx-space-md -mt-space-md p-space-md rounded-t-xl">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold block">Committee Adjudication</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">Candidate Evaluation Dossier</span>
              </div>
              <span className="font-code-sm text-headline-md font-bold text-secondary">
                Rank #48
              </span>
            </div>

            {/* Candidate Header */}
            <div className="flex items-center gap-space-sm pt-1">
              <img
                alt="Ayesha Siddiqui"
                className="w-14 h-16 rounded object-cover shadow-sm bg-surface-container ring-1 ring-surface-container-highest"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCoeYTNR4IxsqNWhXdPeMyqRrM_Hr66mos4YgP44kwA-62Hg7NykiMiGLVVE05J2_I2JhpSaInk2w2aCXXGSjm5l--z_P-lEGrCUFrN2_YDDFAiTcEw6zfpbAgiQszeRZuwse580e2Odr9sebGHJGQsxhHMVHA8OPGuPSyf_UvGQ2auohHxFne2lt7J-t-LZxVVMGePMfV-_gS_YD0ZkENB7FrS91vwpWZEnWalOmm7k1ApPjRRARylQ"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-headline-md text-headline-md text-primary font-bold truncate">Ayesha Siddiqui</span>
                <span className="font-code-sm text-label-sm text-on-surface-variant">Roll: CA-2027-01052</span>
                <span className="font-code-sm text-label-sm text-secondary font-semibold">Aggregate: 92.253%</span>
              </div>
            </div>

            {/* Merit Breakdown Equation */}
            <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1.5 font-body-sm text-body-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Statutory Equated Scores</span>
              <div className="flex justify-between font-code-sm text-label-sm">
                <span>SSC Component (10%):</span>
                <strong className="text-primary">9.473%</strong>
              </div>
              <div className="flex justify-between font-code-sm text-label-sm">
                <span>HSSC Component (40%):</span>
                <strong className="text-primary">36.218%</strong>
              </div>
              <div className="flex justify-between font-code-sm text-label-sm">
                <span>ECAT-CS Entrance (50%):</span>
                <strong className="text-primary">46.562%</strong>
              </div>
              <div className="flex justify-between font-code-sm text-label-md pt-1.5 border-t border-outline-variant/20 text-secondary font-bold">
                <span>Final Statutory Merit:</span>
                <span>92.253%</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Committee Recommendation</label>
                <select
                  value={rec}
                  onChange={(e) => setRec(e.target.value)}
                  className="p-2 bg-surface-container-low rounded-lg font-semibold text-primary border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option value="STRONG_ADMIT">Strong Admit • Department Honors</option>
                  <option value="ADMIT">Admit • Regular Seat</option>
                  <option value="CONDITIONAL">Conditional • Awaiting HSSC-II</option>
                  <option value="WAITLIST">Waitlist Pool</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Review Notes &amp; Statutory Remarks</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="p-2.5 bg-surface-container-low rounded-lg text-body-sm text-primary border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-secondary"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-secondary text-white font-label-md text-label-md font-bold hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{submitting ? 'Ratifying...' : 'Sign & Ratify Selection'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FacultyReviewWorkspace;
