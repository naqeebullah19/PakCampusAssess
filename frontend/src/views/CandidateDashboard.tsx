import React, { useEffect, useState } from 'react';
import { api, CandidateDashboardData } from '../api/client';
import { Link } from 'react-router-dom';

export const CandidateDashboard: React.FC = () => {
  const [data, setData] = useState<CandidateDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCandidateDashboard();
      setData(res.data);
    } catch (err: any) {
      console.error("Failed to load dashboard:", err);
      setError("Unable to retrieve candidate operational records from national server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Connecting to National Testing Registry...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-error-container text-on-error-container p-space-md rounded-lg max-w-xl mx-auto my-8 border border-error/20 flex flex-col gap-2">
        <div className="flex items-center gap-2 font-bold text-headline-md">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>Database Connection Interrupted</span>
        </div>
        <p className="text-body-sm">{error || "No candidate record found."}</p>
        <button
          onClick={loadDashboard}
          className="self-start mt-2 px-3 py-1.5 bg-error text-white font-semibold rounded text-label-md hover:opacity-95"
        >
          Retry Verification
        </button>
      </div>
    );
  }

  const { candidate, next_examination, admit_card, registrations } = data;

  return (
    <div className="flex flex-col w-full font-body-md text-body-md text-on-surface">
      {/* Top Greeting & Cycle Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm mb-1">
            <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
              Welcome back, {candidate.user.first_name || 'Ayesha'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Cycle 2027-A Undergraduate
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body-sm text-body-sm text-on-surface-variant">
            <span>Candidate ID: <strong className="font-code-sm text-primary font-semibold">{candidate.roll_number}</strong></span>
            <span className="text-outline-variant">•</span>
            <span>CNIC: <strong className="font-code-sm text-primary font-semibold">{candidate.cnic}</strong></span>
            <span className="inline-flex items-center text-secondary font-medium gap-1 text-label-sm">
              <span className="material-symbols-outlined text-[16px]">verified</span> NADRA Verified
            </span>
          </div>
        </div>

        {/* Profile Completion Widget (Minimalist Bar Card) */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md lg:w-[420px]">
          <div className="flex flex-col flex-1 w-full">
            <div className="flex items-center justify-between font-label-md text-label-md mb-1.5">
              <span className="text-on-surface font-semibold">Profile Completion</span>
              <span className="font-code-sm font-bold text-secondary">{candidate.completion_percentage}%</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${candidate.completion_percentage}%` }}></div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1.5 truncate">
              {candidate.completion_percentage < 100 ? "Pending: FSc Detailed Marks Certificate Verification" : "Profile 100% Complete & Verified"}
            </span>
          </div>
          <Link
            to="/candidate/academic-records"
            className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1"
          >
            <span>Complete</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Priority Announcement Banner (Admit Card Ready) */}
      <div className="bg-secondary text-on-secondary p-space-md rounded-xl shadow-sm mb-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md relative overflow-hidden">
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md font-bold tracking-tight">
                Admit Card Available for {next_examination?.title || "ECAT & CS Standard Entry Test"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-code-sm text-label-sm uppercase font-semibold">
                {next_examination?.code || "EX-2027-0104"}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-secondary/90 mt-0.5">
              Examination scheduled for <strong>Sunday, Feb 18, 2027</strong> at {next_examination?.center_name || "NUST Sector H-12 Campus, Islamabad"}. Please download and print your standardized slip before reporting time.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={() => setShowSlipModal(true)}
            className="px-4 py-2 bg-white text-secondary rounded-lg font-label-md text-label-md font-bold hover:bg-surface-container-lowest transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Admit Card (PDF)</span>
          </button>
          <Link
            to="/cbt/workspace"
            className="px-4 py-2 bg-primary text-white rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">launch</span>
            <span>Launch CBT Console</span>
          </Link>
        </div>
      </div>

      {/* 4-Card Summary Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
        {/* Metric 1: Next Examination */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Next Examination</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">Seat Assigned</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-primary truncate">
              {next_examination?.title || "ECAT & CS Assessment"}
            </span>
            <div className="flex items-center gap-1.5 font-code-sm text-body-sm text-secondary font-semibold mt-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>{next_examination?.session_date || "Feb 18, 2027"} • {next_examination?.start_time || "08:30 AM PKT"}</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate">
              {next_examination?.center_name || "NUST H-12"}, {next_examination?.desk_number || "Lab B, Desk #118"}
            </span>
          </div>
        </div>

        {/* Metric 2: Registrations */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Application Status</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">In Progress</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-primary">{registrations.length || 2} Active Registrations</span>
            <div className="flex flex-col gap-0.5 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-center justify-between">
                <span>NUST (CS &amp; SE):</span>
                <span className="text-secondary font-semibold">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GIKI (Faculty of CS):</span>
                <span className="text-on-surface font-medium">Pending Marks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Fee Clearance */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Fee &amp; Challan Status</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">Reconciled</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-primary">All Fees Cleared (2/2)</span>
            <div className="font-code-sm text-body-sm text-on-surface-variant mt-1">Ref: PK-88294-01</div>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate">1Link e-Pay / Alfalah Automated Ledger</span>
          </div>
        </div>

        {/* Metric 4: Document Verification */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Document Verification</span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">1 Action Req.</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-primary">3 Verified, 1 Pending</span>
            <div className="flex items-center gap-2 mt-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <span className="inline-flex items-center text-secondary font-medium"><span className="material-symbols-outlined text-[14px] mr-0.5">check_circle</span>SSC</span>
              <span className="inline-flex items-center text-secondary font-medium"><span className="material-symbols-outlined text-[14px] mr-0.5">check_circle</span>HSSC-I</span>
              <span className="inline-flex items-center text-error font-medium"><span className="material-symbols-outlined text-[14px] mr-0.5">pending</span>HSSC-II</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Registered Active Exam Deep-Dive Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-code-sm text-label-sm font-bold text-secondary uppercase bg-surface-container px-2 py-0.5 rounded">
                    {next_examination?.code || "EX-2027-0104"}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Session #02 (Morning)</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-primary mt-1">
                  {next_examination?.title || "Engineering & Computer Science Combined Assessment (ECAT-CS)"}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-semibold self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Confirmed Slip
              </span>
            </div>

            {/* Venue & Time Mosaic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm bg-surface-container-low p-space-md rounded-lg">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Test Center</span>
                <span className="font-headline-md text-body-md font-bold text-primary mt-0.5">{next_examination?.center_name || "NUST Islamabad"}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Sector H-12, Main Computing Complex</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Desk Allocation</span>
                <span className="font-headline-md text-body-md font-bold text-primary mt-0.5">{next_examination?.desk_number || "Lab B (Terminal #118)"}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Biometric Desk Station 04</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Schedule &amp; Duration</span>
                <span className="font-headline-md text-body-md font-bold text-primary mt-0.5">09:00 AM – 11:00 AM</span>
                <span className="font-body-sm text-body-sm text-secondary font-medium">Reporting: 08:30 AM PKT Strict</span>
              </div>
            </div>

            {/* Test Structure Badges */}
            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Syllabus Composition (80 MCQs • 120 Minutes)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-container flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Mathematics</span>
                  <span className="font-code-sm text-body-md font-bold text-primary">30 MCQs</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Physics</span>
                  <span className="font-code-sm text-body-md font-bold text-primary">25 MCQs</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Computer Science</span>
                  <span className="font-code-sm text-body-md font-bold text-primary">15 MCQs</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">English &amp; Analytical</span>
                  <span className="font-code-sm text-body-md font-bold text-primary">10 MCQs</span>
                </div>
              </div>
            </div>

            {/* Verification Warning Note */}
            <div className="p-3 rounded-lg bg-surface-container flex items-start gap-2.5 text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">badge</span>
              <p className="font-body-sm text-body-sm leading-snug">
                <strong>Mandatory Verification protocol:</strong> Entry gate closes promptly at 08:45 AM. You must present your printed Admit Card along with your <strong>Original NADRA CNIC / Smart Card</strong> or original juvenile B-Form with matric certificate photo. Soft copies on mobile devices will not be accepted.
              </p>
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSlipModal(true)}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>View / Print Slip</span>
                </button>
                <button className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5" type="button">
                  <span className="material-symbols-outlined text-[18px]">policy</span>
                  <span>Examination Guidelines</span>
                </button>
              </div>
              <button className="px-3 py-2 rounded-lg text-secondary hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-1" type="button">
                <span className="material-symbols-outlined text-[18px]">navigation</span>
                <span>Center Navigation &amp; Gate 4 Pin</span>
              </button>
            </div>
          </div>

          {/* Application Lifecycle Timeline */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-space-lg flex flex-col">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex flex-col">
                <h3 className="font-headline-md text-headline-md font-bold text-primary">Undergraduate Cycle Progress</h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Real-time status tracking for Roll No. {candidate.roll_number}</span>
              </div>
              <span className="font-code-sm text-label-sm text-secondary font-semibold bg-secondary-container px-2 py-0.5 rounded-full">Stage 4 of 6 Active</span>
            </div>
            {/* Vertical Timeline Stepper */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
              {/* Step 1 (Completed) */}
              <div className="relative flex items-start gap-space-md">
                <span className="absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-on-secondary ring-4 ring-surface-container-lowest">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary">Account Created &amp; NADRA Identity Cleared</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Biometric e-KYC linked with National Database (CNIC verified).</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-on-surface-variant shrink-0 mt-0.5 sm:mt-0">Jan 12, 2027</span>
                </div>
              </div>
              {/* Step 2 (Completed) */}
              <div className="relative flex items-start gap-space-md">
                <span className="absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-on-secondary ring-4 ring-surface-container-lowest">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary">Test Registration &amp; Center Preference Locked</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Registered for ECAT &amp; CS Standard Assessment. Selected Islamabad North region.</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-on-surface-variant shrink-0 mt-0.5 sm:mt-0">Jan 15, 2027</span>
                </div>
              </div>
              {/* Step 3 (Completed) */}
              <div className="relative flex items-start gap-space-md">
                <span className="absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-on-secondary ring-4 ring-surface-container-lowest">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary">Fee Payment Reconciled via 1Link e-Pay</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">PKR 3,500 settled instantaneously. Payment Receipt #ALP-99120.</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-on-surface-variant shrink-0 mt-0.5 sm:mt-0">Jan 16, 2027</span>
                </div>
              </div>
              {/* Step 4 (Current Completed milestone) */}
              <div className="relative flex items-start gap-space-md">
                <span className="absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-on-secondary ring-4 ring-surface-container-lowest">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary">Seat Allocation &amp; Admit Slip Issued</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Allocated to Lab B Desk 118 at NUST H-12 Campus.</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-secondary font-semibold shrink-0 mt-0.5 sm:mt-0">Feb 02, 2027</span>
                </div>
              </div>
              {/* Step 5 (Upcoming) */}
              <div className="relative flex items-start gap-space-md">
                <span className="absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full bg-primary-container text-on-primary ring-4 ring-surface-container-lowest">
                  <span className="font-code-sm text-[11px] font-bold">5</span>
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary">Examination Day (CBT Assessment)</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Computer-based assessment at designated testing terminal.</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-primary font-semibold shrink-0 mt-0.5 sm:mt-0">Feb 18, 2027</span>
                </div>
              </div>
              {/* Step 6 (Scheduled) */}
              <div className="relative flex items-start gap-space-md">
                <span className="absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant ring-4 ring-surface-container-lowest">
                  <span className="font-code-sm text-[11px] font-bold">6</span>
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-semibold text-on-surface-variant">Standardized Merit Generation &amp; Seat Quota Allocation</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Automated score normalization and university merit list publishing.</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-on-surface-variant shrink-0 mt-0.5 sm:mt-0">Feb 25, 2027</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Action Center & Priority Deadlines */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-space-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-headline-md font-bold text-primary">Action Center</span>
              <span className="w-2 h-2 rounded-full bg-error"></span>
            </div>
            {/* Pending Upload Alert */}
            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-2 border border-outline-variant/10">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">error</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-primary">Upload FSc Part-II Marks Sheet</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Required for GIKI engineering quota evaluation. Submission closes Feb 22, 2027.</span>
                </div>
              </div>
              <Link
                to="/candidate/academic-records"
                className="w-full mt-1 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                <span>Upload Document</span>
              </Link>
            </div>
            {/* Deadline Notice Card */}
            <div className="p-space-sm rounded-lg bg-surface-container flex items-start gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">timelapse</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-primary">MDCAT Cycle Registration</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">National Medical &amp; Dental registration closes in <strong>4 days</strong> (Feb 14, 2027 at 11:59 PM).</span>
                <Link to="/examinations/available" className="font-label-md text-label-md text-secondary font-semibold mt-1 inline-flex items-center gap-0.5 hover:underline">
                  <span>Register interest</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Notifications Feed */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-space-md flex flex-col">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-headline-md text-headline-md font-bold text-primary">Activity &amp; Dispatch</span>
              <button className="font-label-sm text-label-sm text-secondary font-semibold hover:underline" type="button">Mark all read</button>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-md text-label-md font-bold text-primary truncate">Admit Card Generated ({next_examination?.code || "EX-2027-0104"})</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Seat assigned for ECAT-CS Session 02.</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant mt-1">2 hours ago</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg hover:bg-surface-container-low transition-colors flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-md text-label-md font-semibold text-primary truncate">Fee Payment Confirmation</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">PKR 3,500 settled via 1Link e-Pay.</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant mt-1">Yesterday, 04:15 PM</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg hover:bg-surface-container-low transition-colors flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-md text-label-md font-semibold text-primary truncate">NADRA Biometric Clearance Verified</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">CNIC profile records synced successfully.</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant mt-1">3 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Candidate Support Quick Panel */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">contact_support</span>
              <span className="font-headline-md text-headline-md font-bold text-primary">Candidate Assistance</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Encountering discrepancies in your admit slip, exam center allocation, or CNIC credentials? Contact the National Testing Directorate:
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant font-medium">Toll-Free Helpline:</span>
                <span className="font-code-sm font-bold text-primary">0800-CAMPUS</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant font-medium">Support Desk:</span>
                <span className="font-code-sm font-medium text-secondary truncate max-w-[170px]">support@pakcampusassess.gov.pk</span>
              </div>
            </div>
            <button className="w-full mt-2 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-label-md font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5" type="button">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span>Open Direct Help Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Official Admit Card / Roll No Slip */}
      {showSlipModal && admit_card && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-2xl w-full border border-outline-variant/30 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-primary text-white p-space-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-secondary-fixed">badge</span>
                <span className="font-headline-md text-headline-md font-bold">Standardized Roll Number Slip</span>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Slip Content */}
            <div className="p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex flex-col">
                  <span className="font-headline-lg text-headline-lg font-bold text-primary">{admit_card.candidate_name}</span>
                  <span className="font-code-sm text-body-sm text-on-surface-variant">Roll No: <strong>{admit_card.candidate_roll_number}</strong></span>
                  <span className="font-code-sm text-body-sm text-on-surface-variant">CNIC: <strong>{admit_card.candidate_cnic}</strong></span>
                </div>
                <div className="flex flex-col items-center p-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <div className="w-20 h-20 bg-white border border-outline-variant/20 rounded flex flex-col items-center justify-center p-1">
                    <span className="material-symbols-outlined text-[48px] text-primary">qr_code_2</span>
                  </div>
                  <span className="font-code-sm text-[9px] text-outline mt-1 font-semibold">NADRA SIGNED</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm text-body-sm">
                <div>
                  <span className="font-label-sm text-outline uppercase block">Examination</span>
                  <span className="font-bold text-primary">{admit_card.examination_title}</span>
                </div>
                <div>
                  <span className="font-label-sm text-outline uppercase block">Session Code</span>
                  <span className="font-code-sm text-primary font-semibold">{admit_card.examination_code}</span>
                </div>
                <div>
                  <span className="font-label-sm text-outline uppercase block">Reporting Date &amp; Time</span>
                  <span className="font-semibold text-primary">{admit_card.session_date} • {admit_card.reporting_time}</span>
                </div>
                <div>
                  <span className="font-label-sm text-outline uppercase block">Designated Workstation</span>
                  <span className="font-code-sm font-bold text-secondary">{admit_card.desk_number}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-label-sm text-outline uppercase block">Assigned Examination Center</span>
                  <span className="font-semibold text-primary">{admit_card.center_name}</span>
                  <span className="block text-body-sm text-on-surface-variant">{admit_card.center_address}</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 text-body-sm text-on-surface-variant">
                <span className="font-bold text-primary block mb-1">Mandatory Statutory Instructions:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[12px]">
                  <li>Candidate must present this slip along with original Computerized National Identity Card (CNIC) or NADRA Smart Card.</li>
                  <li>No electronic devices, programmable calculators, or smartwatches permitted inside the CBT terminal lab.</li>
                  <li>Biometric fingerprint authentication will take place at Center Entry Gate 30 minutes prior to session start.</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-surface-container-low p-space-md flex items-center justify-between border-t border-outline-variant/20">
              <span className="font-code-sm text-label-sm text-outline">Token: {admit_card.qr_token || '3F82169B-2A78-43D9'}</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:opacity-95 flex items-center gap-1.5 shadow-sm text-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Official Slip (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CandidateDashboard;
