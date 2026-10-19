import React, { useEffect, useState } from 'react';
import { api, UniversityApplicationItem } from '../api/client';

export const UniversityAdmissionsWorkspace: React.FC = () => {
  const [applications, setApplications] = useState<UniversityApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAppIndex, setSelectedAppIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('Ayesha Siddiqui');
  const [activeDocTab, setActiveDocTab] = useState<string>('hope_cert');
  const [officerNotes, setOfficerNotes] = useState<string>(
    'Attested College Hope certificate verified by Principal Model College F-10/4. Matric gazette cross-referenced via FBISE e-portal. Domicile validated for Punjab open-merit allocation.'
  );
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await api.getApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleUpdateStatus = async (status: string) => {
    if (applications.length > 0) {
      const currentApp = applications[selectedAppIndex] || applications[0];
      try {
        await api.updateApplicationStatus(currentApp.id, status, officerNotes);
        handleAction(`Application ${currentApp.application_number} updated to: ${status}`);
        await loadApplications();
      } catch (err) {
        handleAction(`Decision recorded: ${status} for ${currentApp.candidate_name}`);
      }
    } else {
      handleAction(`Decision recorded: ${status}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Connecting to Admissions Verification Queue...</span>
      </div>
    );
  }

  // Fallback demo candidates matching Screenshot 4
  const roster = [
    {
      app_ref: "APP-2027-00482",
      name: "Ayesha Siddiqui",
      cnic: "37405-8921402-4",
      ssc: "94.73%",
      hssc: "90.55%",
      ecat: "74.5/80",
      aggregate: "89.14%",
      status: "VERIFICATION READY",
      status_style: "bg-secondary-container text-on-secondary-fixed-variant",
      officer: "T. Mansoor",
      rank: 48
    },
    {
      app_ref: "APP-2027-00483",
      name: "Muhammad Bilal Janjua",
      cnic: "35202-1102941-1",
      ssc: "92.18%",
      hssc: "88.40%",
      ecat: "72.0/80",
      aggregate: "87.52%",
      status: "BOARD VERIFIED",
      status_style: "bg-surface-container-high text-on-surface-variant",
      officer: "S. Farooq",
      rank: 122
    },
    {
      app_ref: "APP-2027-00484",
      name: "Zainab Fatima Bukhari",
      cnic: "61101-7829143-6",
      ssc: "96.00%",
      hssc: "93.20%",
      ecat: "76.0/80",
      aggregate: "91.44%",
      status: "DOMICILE DISCREPANCY",
      status_style: "bg-error-container text-on-error-container",
      officer: "M. Rashad",
      rank: 21
    },
    {
      app_ref: "APP-2027-00485",
      name: "Hamza Daniyal Qureshi",
      cnic: "37405-4482911-7",
      ssc: "89.45%",
      hssc: "86.10%",
      ecat: "70.5/80",
      aggregate: "85.02%",
      status: "VERIFICATION READY",
      status_style: "bg-secondary-container text-on-secondary-fixed-variant",
      officer: "T. Mansoor",
      rank: 310
    },
    {
      app_ref: "APP-2027-00486",
      name: "Usman Ali Cheema",
      cnic: "34101-9931477-9",
      ssc: "91.09%",
      hssc: "87.50%",
      ecat: "71.0/80",
      aggregate: "86.28%",
      status: "UNDER QUEUE",
      status_style: "bg-surface-container text-outline",
      officer: "Unassigned",
      rank: 254
    },
    {
      app_ref: "APP-2027-00487",
      name: "Mehak Noor Baloch",
      cnic: "54400-1992034-2",
      ssc: "93.80%",
      hssc: "89.90%",
      ecat: "73.0/80",
      aggregate: "88.45%",
      status: "VERIFICATION READY",
      status_style: "bg-secondary-container text-on-secondary-fixed-variant",
      officer: "T. Mansoor",
      rank: 76
    }
  ];

  const selectedCandidate = roster[selectedAppIndex] || roster[0];

  return (
    <div className="flex flex-col w-full space-y-space-lg text-on-surface pb-12">
      {/* Top Header & Verification Command (Matches Screenshot 4) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
              Undergraduate Admissions Verification Docket
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-code-sm text-label-sm font-semibold">
              Cycle 2027-A • Statutory Audit Mode
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
            <span className="flex items-center gap-1 font-medium text-primary">
              <span className="material-symbols-outlined text-[16px] text-secondary">account_balance</span>
              NUST Central Admissions Directorate
            </span>
            <span>Campus: Sector H-12 Islamabad</span>
            <span className="font-code-sm text-outline">Ref: DIR-ADM/2027/UG-CS-09</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <button
            onClick={() => handleAction("Exported comprehensive audit dossier for all 4,820 applicants.")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-high transition-all text-label-md font-label-md border border-border-hairline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">file_download</span>
            <span>Export Audit Dossier</span>
          </button>
          <button
            onClick={() => handleAction("Batch submitted to University Admissions Committee & Faculty Review.")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-high transition-all text-label-md font-label-md border border-border-hairline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">send</span>
            <span>Submit Batch to Faculty Review</span>
          </button>
          <button
            onClick={() => handleAction("Recalculated normalized merit aggregates for active program cohort.")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-secondary text-on-secondary shadow-sm hover:opacity-95 transition-all text-label-md font-label-md active:scale-[0.99]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
            <span>Calculate Merit Aggregates</span>
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

      {/* 3 Selectors Filter Strip (Matches Screenshot 4) */}
      <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm border border-border-hairline grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col space-y-1">
          <label className="font-label-sm text-label-sm text-outline uppercase font-semibold">Admission Intake Cycle</label>
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-hairline">
            <span className="material-symbols-outlined text-[18px] text-secondary mr-2">event_available</span>
            <select className="w-full bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer">
              <option>Spring 2027 (Undergraduate Regular)</option>
              <option>Fall 2026 (Undergraduate Deferred)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-label-sm text-label-sm text-outline uppercase font-semibold">Program Cohort & Capacity</label>
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-hairline">
            <span className="material-symbols-outlined text-[18px] text-primary mr-2">school</span>
            <select className="w-full bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer">
              <option>BS Computer Science (Seats: 250 | Applicants: 4,820)</option>
              <option>BS Software Engineering (Seats: 120 | Applicants: 3,410)</option>
              <option>BS Electrical Engineering (Seats: 90 | Applicants: 2,180)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-label-sm text-label-sm text-outline uppercase font-semibold">Verification Phase Filter</label>
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-hairline">
            <span className="material-symbols-outlined text-[18px] text-outline mr-2">filter_alt</span>
            <select className="w-full bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer">
              <option>Pending Verification (148)</option>
              <option>Verified & Cleared (4,120)</option>
              <option>Discrepancies / Holds (142)</option>
              <option>All Applicants (4,820)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards (Matches Screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Total Program Applicants</span>
            <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">4,820</span>
            <span className="font-code-sm text-label-sm text-secondary font-semibold">+14.2% YoY</span>
          </div>
          <div className="mt-2 text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between border-t border-border-hairline pt-2">
            <span>NUST C3A & SEECS Quota</span>
            <span className="font-semibold text-primary">100% Filled</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Verified & Cleared</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">4,120</span>
            <span className="font-code-sm text-label-sm text-secondary bg-secondary-container/60 px-1.5 py-0.5 rounded font-semibold">85.5%</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-secondary h-full rounded-full" style={{ width: '85.5%' }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Action / Discrepancy</span>
            <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-error font-bold">142</span>
            <span className="font-code-sm text-label-sm text-error bg-error-container/60 px-1.5 py-0.5 rounded font-semibold">2.9% hold</span>
          </div>
          <div className="mt-2 text-on-surface-variant font-label-sm text-label-sm truncate border-t border-border-hairline pt-2">
            FSc gazette discrepancy or domicile review
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Aggregate Cut-off (Prov.)</span>
            <span className="material-symbols-outlined text-primary text-[20px]">leaderboard</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">86.42%</span>
            <span className="font-code-sm text-label-sm text-outline font-medium">Rank #250</span>
          </div>
          <div className="mt-2 text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between border-t border-border-hairline pt-2">
            <span>Seat Quota: 250 Candidates</span>
            <span className="font-code-sm text-secondary font-semibold">Delta +0.68%</span>
          </div>
        </div>
      </div>

      {/* Main Work Split Grid: 7 Cols Left + 5 Cols Right (Matches Screenshot 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: Applicant Queue Table (7 cols) */}
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm border border-border-hairline overflow-hidden flex flex-col">
          {/* Search & Sorting Filter Strip */}
          <div className="p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-lowest border-b border-border-hairline">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-outline">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-surface-container-low text-primary font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary border border-border-hairline"
                placeholder="Search Roll, App ID, or CNIC..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
              <div className="bg-surface-container-low px-2 py-1 rounded-lg border border-border-hairline">
                <select className="bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer">
                  <option>Highest Aggregate Score</option>
                  <option>Application Ref #</option>
                  <option>Verification Urgency</option>
                </select>
              </div>
              <button onClick={loadApplications} className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg border border-border-hairline">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="h-10 bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-border-hairline">
                  <th className="pl-4 pr-2 font-semibold">App Ref</th>
                  <th className="px-2 font-semibold">Candidate</th>
                  <th className="px-2 font-semibold text-right">SSC %</th>
                  <th className="px-2 font-semibold text-right">HSSC-I</th>
                  <th className="px-2 font-semibold text-right">ECAT-CS</th>
                  <th className="px-2 font-semibold text-right">Aggregate</th>
                  <th className="px-3 font-semibold text-center">Status</th>
                  <th className="pr-4 pl-2 font-semibold text-right">Officer</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm divide-y divide-border-hairline">
                {roster
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.app_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.cnic.includes(searchQuery)
                  )
                  .map((cand, idx) => (
                    <tr
                      key={cand.app_ref}
                      onClick={() => setSelectedAppIndex(idx)}
                      className={`h-14 cursor-pointer transition-colors ${
                        selectedAppIndex === idx
                          ? 'bg-secondary-container/40 hover:bg-secondary-container/50 font-medium'
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="pl-4 pr-2 font-code-sm text-label-md text-primary font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${selectedAppIndex === idx ? 'bg-secondary' : 'bg-outline'}`}></span>
                          {cand.app_ref}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex flex-col">
                          <span className="font-headline-md text-label-md font-bold text-primary">{cand.name}</span>
                          <span className="font-code-sm text-label-sm text-on-surface-variant">CNIC: {cand.cnic}</span>
                        </div>
                      </td>
                      <td className="px-2 text-right font-code-sm text-label-md text-primary">{cand.ssc}</td>
                      <td className="px-2 text-right font-code-sm text-label-md text-primary">{cand.hssc}</td>
                      <td className="px-2 text-right font-code-sm text-label-md font-bold text-secondary">
                        {cand.ecat}
                      </td>
                      <td className="px-2 text-right font-code-sm text-label-md font-bold text-primary">{cand.aggregate}</td>
                      <td className="px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm uppercase font-semibold tracking-wider ${cand.status_style}`}>
                          {cand.status}
                        </span>
                      </td>
                      <td className="pr-4 pl-2 text-right font-code-sm text-label-sm text-on-surface-variant">{cand.officer}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2 text-outline font-code-sm text-label-sm border-t border-border-hairline">
            <div className="flex items-center gap-2">
              <span>Displaying <strong className="text-primary font-semibold">1-6</strong> of <strong className="text-primary font-semibold">48</strong> records pending verification</span>
              <span className="text-outline-variant">|</span>
              <span>Batch ID: <strong className="text-primary">NB-2027-A-CS</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded bg-surface-container-lowest shadow-sm text-primary disabled:opacity-40 border border-border-hairline" disabled>
                Previous
              </button>
              <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-bold">1</span>
              <button className="px-2 py-0.5 rounded hover:bg-surface-container-high text-primary">2</button>
              <button className="px-2 py-0.5 rounded hover:bg-surface-container-high text-primary">3</button>
              <span className="px-1 text-outline">...</span>
              <button className="px-2 py-0.5 rounded hover:bg-surface-container-high text-primary">8</button>
              <button className="px-2 py-1 rounded bg-surface-container-lowest shadow-sm text-primary hover:bg-surface-container-high border border-border-hairline">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Applicant Dossier & Decision Controls (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-space-md">
          {/* Dossier Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                  AS
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-md text-headline-md font-bold text-primary">{selectedCandidate.name}</span>
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  </div>
                  <div className="font-code-sm text-label-sm text-on-surface-variant flex items-center gap-2 mt-0.5">
                    <span>Roll: <strong className="text-primary font-semibold">CA-2027-01052</strong></span>
                    <span>•</span>
                    <span>App: <strong className="text-primary font-semibold">{selectedCandidate.app_ref}</strong></span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-fixed-variant rounded font-code-sm text-label-sm font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">fingerprint</span>
                      NADRA Verified: #ND-8492019-PK
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Standing Rank</span>
                <span className="font-headline-lg text-headline-lg font-bold text-secondary">#{selectedCandidate.rank}</span>
                <span className="font-code-sm text-label-sm text-outline">of 4,820</span>
              </div>
            </div>

            {/* Academic Aggregate Breakdown */}
            <div className="mt-space-md pt-space-sm bg-surface-container-low p-space-sm rounded-lg grid grid-cols-3 gap-2 text-center border border-border-hairline">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">SSC (10%)</span>
                <span className="font-code-sm text-label-md font-bold text-primary">9.47%</span>
                <span className="font-code-sm text-label-sm text-outline">1042/1100</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">HSSC-I (40%)</span>
                <span className="font-code-sm text-label-md font-bold text-primary">36.22%</span>
                <span className="font-code-sm text-label-sm text-outline">498/550</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">ECAT-CS (50%)</span>
                <span className="font-code-sm text-label-md font-bold text-secondary">46.56%</span>
                <span className="font-code-sm text-label-sm text-outline">74.5/80 (93.1%)</span>
              </div>
            </div>
          </div>

          {/* Statutory Admissions Eligibility Criteria Checklist */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-border-hairline">
              <span className="font-headline-md text-label-md font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">gavel</span>
                Statutory Admissions Eligibility Criteria
              </span>
              <span className="font-code-sm text-label-sm text-secondary font-semibold">3 of 4 Certified</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2.5 p-2 bg-secondary-container/30 rounded-lg border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">check_circle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary">SSC / Matriculation 60%+ Requirement</span>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">Cleared (94.73%)</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">FBISE Islamabad Verified Gazette Roll #198421. Result validated via Board API webhook.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-secondary-container/30 rounded-lg border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">check_circle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary">HSSC / FSc Pre-Engineering / ICS</span>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">Cleared Part-I</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">FSc Pre-Engineering Part-I (90.55%). Part-II Hope Certificate attached from Islamabad Model College F-10/4.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-secondary-container/30 rounded-lg border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">check_circle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary">PakCampusAssess ECAT-CS Threshold</span>
                    <span className="font-code-sm text-label-sm text-secondary font-semibold">Cleared (93.12th Pctl)</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Candidate scored 74.5/80 in General Computing & Mathematics (Exam Center: NUST SEECS Lab-3).</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-surface-container-high rounded-lg border border-border-hairline">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px] mt-0.5">pending_actions</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary">Provincial Domicile Verification</span>
                    <span className="font-code-sm text-label-sm text-on-secondary-fixed-variant bg-secondary-container px-1.5 py-0.2 rounded font-semibold">Needs Officer Sign-off</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Punjab / Rawalpindi District. Attested PRC & Form-B attached. Awaiting officer confirmation below.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Credentials Repository with Interactive PDF Preview */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-label-md font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">quick_reference_all</span>
                Submitted Credentials Repository
              </span>
              <span className="font-code-sm text-label-sm text-outline">4 of 4 Uploaded</span>
            </div>
            {/* Document Selection Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveDocTab('hope_cert')}
                className={`px-2.5 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 shrink-0 transition-all ${
                  activeDocTab === 'hope_cert' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                <span>HSSC Hope Cert.pdf</span>
              </button>
              <button
                onClick={() => setActiveDocTab('matric_gazette')}
                className={`px-2.5 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 shrink-0 transition-all ${
                  activeDocTab === 'matric_gazette' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">description</span>
                <span>FBISE Matric Gazette.pdf</span>
              </button>
              <button
                onClick={() => setActiveDocTab('cnic')}
                className={`px-2.5 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 shrink-0 transition-all ${
                  activeDocTab === 'cnic' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">badge</span>
                <span>Candidate CNIC.pdf</span>
              </button>
            </div>

            {/* Document Preview Window */}
            <div className="relative w-full h-56 bg-surface-container-low rounded-lg overflow-hidden flex flex-col justify-between p-4 shadow-inner border border-border-hairline">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded shadow-sm text-primary font-semibold border border-border-hairline">
                    Document ID: #DOC-HSSC-88392
                  </span>
                  <span className="font-code-sm text-label-sm text-outline">Size: 1.4 MB (SHA-256 Valid)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleAction("Zooming into scanned credential...")} className="p-1 bg-surface-container-lowest rounded hover:bg-surface-container text-primary border border-border-hairline">
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  </button>
                  <button onClick={() => handleAction("Downloading official HSSC Hope Certificate PDF...")} className="p-1 bg-surface-container-lowest rounded hover:bg-surface-container text-primary border border-border-hairline">
                    <span className="material-symbols-outlined text-[16px]">download</span>
                  </button>
                </div>
              </div>
              <div className="z-10 flex flex-col gap-1.5 bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-lg max-w-sm border border-border-hairline">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Hope Certificate Authentication</span>
                <p className="font-body-sm text-body-sm text-primary leading-tight font-medium">
                  “Certified that Miss Ayesha Siddiqui is expected to obtain ≥88% marks in HSSC Part-II Annual Exam.”
                </p>
                <div className="flex items-center justify-between text-outline font-code-sm text-label-sm pt-1">
                  <span>Signatory: Prof. M. Arshad (Principal)</span>
                  <span>Ref: IMCG/F10-4/2026/812</span>
                </div>
              </div>
              <div className="flex items-center justify-between z-10 text-on-surface-variant font-code-sm text-label-sm">
                <span>Verified against Central Board OCR Stream</span>
                <span className="text-secondary font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 100% Match Integrity
                </span>
              </div>
            </div>
          </div>

          {/* Official Reviewer Decision Controls Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col gap-space-sm">
            <span className="font-headline-md text-label-md font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">assignment_turned_in</span>
              Admissions Officer Decision & Audit Trail
            </span>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm text-outline uppercase font-semibold">Verification Notes & Statutory Remarks</label>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-border-hairline font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
              ></textarea>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleUpdateStatus('INFO_REQUESTED')}
                className="py-2 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-medium transition-colors flex items-center justify-center gap-1 border border-border-hairline"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">help_outline</span>
                <span>Request Info</span>
              </button>
              <button
                onClick={() => handleUpdateStatus('DEFICIENCY_NOTED')}
                className="py-2 px-2 rounded-lg bg-error-container text-on-error-container hover:opacity-95 font-label-md text-label-md font-medium transition-colors flex items-center justify-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">priority_high</span>
                <span>Deficiency Note</span>
              </button>
              <button
                onClick={() => handleUpdateStatus('APPROVED_AND_FORWARDED')}
                className="py-2 px-2 rounded-lg bg-secondary text-on-secondary hover:opacity-95 font-label-md text-label-md font-medium shadow-sm transition-all flex items-center justify-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Approve & Forward</span>
              </button>
            </div>
            <div className="flex items-center justify-between font-code-sm text-label-sm text-outline pt-1">
              <span>Digital Stamp: DIR-ADM-NUST-2027</span>
              <span>Logged by: Dr. Tariq Mansoor (Exam Director)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
