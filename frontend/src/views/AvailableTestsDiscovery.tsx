import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

const CANONICAL_EXAMINATIONS = [
  {
    id: 1,
    code: 'ECAT-2027-A',
    title: 'National Engineering & Computing Admission Test (ECAT-CS)',
    status: 'OPEN_FOR_REGISTRATION',
    category: { name: 'Engineering & CS' },
    instructions: 'Federally accredited entrance qualification for NUST, UET, GIKI, FAST-NUCES, and PIEAS.',
    duration_minutes: 120,
    total_marks: 100,
    passing_marks: 50,
    registration_fee: '3,500',
    scheduled_date: 'Feb 18, 2027',
  },
  {
    id: 2,
    code: 'MDCAT-2027-01',
    title: 'Medical & Dental College Admission Test (MDCAT 2027)',
    status: 'CLOSING_SOON',
    category: { name: 'Medical & Dental' },
    instructions: 'Statutory standardized test mandated by PMDC for MBBS and BDS admissions across all public and private medical colleges in Pakistan.',
    duration_minutes: 210,
    total_marks: 200,
    passing_marks: 110,
    registration_fee: '4,000',
    scheduled_date: 'Feb 26, 2027',
  },
  {
    id: 3,
    code: 'B-NAT-2027-S1',
    title: 'National Aptitude Test — Business & Social Sciences (B-NAT)',
    status: 'OPEN_FOR_REGISTRATION',
    category: { name: 'Business & Social Sciences' },
    instructions: 'Standardized entrance examination accepted by IBA Karachi, LUMS (SDSBS), COMSATS, and NUST (NBS) for BBA, Accounting & Finance, and Economics.',
    duration_minutes: 120,
    total_marks: 100,
    passing_marks: 50,
    registration_fee: '3,000',
    scheduled_date: 'Mar 05, 2027',
  },
  {
    id: 4,
    code: 'G-CAT-2027-Q1',
    title: 'General Computer & Analytical Test (G-CAT General Science)',
    status: 'OPEN_FOR_REGISTRATION',
    category: { name: 'General Science / ICS' },
    instructions: 'Universal multi-institution entrance metric for Bachelor of Computer Science, Software Engineering, AI, and Data Science programs nationwide.',
    duration_minutes: 120,
    total_marks: 100,
    passing_marks: 50,
    registration_fee: '3,200',
    scheduled_date: 'Mar 12, 2027',
  }
];

const CANONICAL_CENTERS = [
  { id: 1, name: 'NUST SEECS Main Campus (Islamabad)', code: 'CTR-ISB-01' },
  { id: 2, name: 'FAST-NUCES Islamabad Campus (H-11)', code: 'CTR-ISB-02' },
  { id: 3, name: 'UET Lahore Grand Hall Complex (Lahore)', code: 'CTR-LHR-01' },
  { id: 4, name: 'NED University IT Center (Karachi)', code: 'CTR-KHI-01' },
  { id: 5, name: 'BUITEMS Airport Road Campus (Quetta)', code: 'CTR-QTA-01' },
];

export const AvailableTestsDiscovery: React.FC = () => {
  const [examinations, setExaminations] = useState<any[]>(CANONICAL_EXAMINATIONS);
  const [centers, setCenters] = useState<any[]>(CANONICAL_CENTERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [selectedCenterId, setSelectedCenterId] = useState<number | null>(1);
  const [registering, setRegistering] = useState<boolean>(false);
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    loadDiscovery();
  }, []);

  const loadDiscovery = async () => {
    try {
      setLoading(true);
      const res = await api.getAvailableExaminations();
      if (res.data.examinations && res.data.examinations.length > 0) {
        setExaminations(res.data.examinations);
      } else {
        setExaminations(CANONICAL_EXAMINATIONS);
      }
      if (res.data.centers && res.data.centers.length > 0) {
        setCenters(res.data.centers);
        setSelectedCenterId(res.data.centers[0].id);
      }
    } catch (err) {
      console.warn("Using canonical examination catalog (offline/demo mode):", err);
      setExaminations(CANONICAL_EXAMINATIONS);
      setCenters(CANONICAL_CENTERS);
      setSelectedCenterId(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!selectedExam) return;
    try {
      setRegistering(true);
      await api.registerForExam(selectedExam.id, selectedCenterId || undefined);
      setRegistrationNotice(`Successfully registered for ${selectedExam.title}! Seat and Admit Card issued.`);
      setSelectedExam(null);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error("Failed to register:", err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Connecting to Central Entry Testing Registry...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full font-body-md text-body-md text-on-surface">
      {/* Top Ambient Banner & Header Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary p-space-lg mb-space-lg shadow-sm">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -bottom-20 w-64 h-64 rounded-full bg-surface-tint/20 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="max-w-3xl flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                Cycle 2027 Portal Active
              </span>
              <span className="font-code-sm text-label-sm text-surface-container-high tracking-wider uppercase">
                National Testing Authority Verified
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-primary font-bold tracking-tight">
              Entry Test Discovery &amp; Centralized Registration
            </h1>
            <p className="font-body-md text-body-md text-surface-container-high leading-relaxed">
              Discover and register for standardized computerized entrance tests conducted across authorized university testing laboratories nationwide. Verify prerequisites, generate unified 1Link PSID vouchers, and reserve your exam slot.
            </p>
          </div>

          {/* Quick Candidate Credential Chip */}
          <div className="flex items-center gap-space-sm bg-surface-container-lowest/10 backdrop-blur-md p-space-sm rounded-lg self-start lg:self-auto border border-white/10 shadow-inner">
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div className="flex flex-col pr-space-xs">
              <span className="font-label-sm text-label-sm text-surface-container-high uppercase tracking-wide">Candidate Verification</span>
              <span className="font-label-md text-label-md font-semibold text-on-primary">Ayesha Siddiqui</span>
              <span className="font-code-sm text-label-sm text-secondary-fixed">NADRA: 61101-*******-2</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Counters Bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-space-lg pt-space-md bg-primary-container/40 rounded-lg p-space-sm border border-white/5">
          <div className="flex items-center gap-3 px-space-xs">
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]">laptop_chromebook</span>
            <div className="flex flex-col">
              <span className="font-code-sm text-label-sm text-surface-container-high uppercase">Authorized Labs</span>
              <span className="font-headline-md text-headline-md font-bold text-on-primary">42 Nationwide</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-space-xs">
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]">schedule</span>
            <div className="flex flex-col">
              <span className="font-code-sm text-label-sm text-surface-container-high uppercase">Active Windows</span>
              <span className="font-headline-md text-headline-md font-bold text-on-primary">Feb 18 – Apr 25</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-space-xs">
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]">payments</span>
            <div className="flex flex-col">
              <span className="font-code-sm text-label-sm text-surface-container-high uppercase">Gateway Protocol</span>
              <span className="font-headline-md text-headline-md font-bold text-on-primary">1Link / Kuickpay</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-space-xs">
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]">assignment_turned_in</span>
            <div className="flex flex-col">
              <span className="font-code-sm text-label-sm text-surface-container-high uppercase">Your Status</span>
              <span className="font-headline-md text-headline-md font-bold text-secondary-fixed">1 Confirmed Slot</span>
            </div>
          </div>
        </div>
      </div>

      {registrationNotice && (
        <div className="p-4 mb-space-md bg-secondary-container text-on-secondary-container rounded-xl font-bold flex items-center gap-2 border border-secondary">
          <span className="material-symbols-outlined text-[24px]">verified</span>
          <span>{registrationNotice}</span>
        </div>
      )}

      {/* Filter & Discovery Control Deck */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-lg flex flex-col gap-space-sm border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-space-sm">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low pl-10 pr-4 py-2 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all"
              placeholder="Search by test title, academic stream, conducting consortium, or test code..."
              type="text"
            />
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 font-code-sm text-label-sm bg-surface-container-lowest px-1.5 py-0.5 rounded text-on-surface-variant shadow-sm border border-outline-variant/20">
              CTRL+K
            </kbd>
          </div>

          {/* Controls Group */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">school</span>
              <select
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                className="bg-transparent font-label-md text-label-md text-on-surface font-medium focus:outline-none cursor-pointer pr-2"
              >
                <option value="all">All Disciplines</option>
                <option value="eng">Engineering &amp; CS</option>
                <option value="med">Medical &amp; Dental (MDCAT)</option>
                <option value="biz">Business &amp; Social Sciences</option>
                <option value="gen">General Science / ICS</option>
              </select>
            </div>

            <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1.5 border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">tune</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-label-md text-label-md text-on-surface font-medium focus:outline-none cursor-pointer pr-2"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open for Registration</option>
                <option value="closing">Closing Soon</option>
                <option value="registered">Registered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Quick Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-body-sm text-body-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Quick Filters:</span>
          <button className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm hover:bg-surface-container-high transition-colors">
            Engineering &amp; CS (1 Registered)
          </button>
          <button className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity">
            Closing Soon (MDCAT: 4 Days Left)
          </button>
          <button className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-high transition-colors">
            Centres in Islamabad &amp; Rawalpindi
          </button>
        </div>
      </div>

      {/* Tests Catalogue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg mb-space-xl">
        {examinations.map((exam, idx) => (
          <div
            key={idx}
            className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group overflow-hidden border border-outline-variant/20"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${idx === 0 ? 'bg-secondary' : idx === 1 ? 'bg-error' : 'bg-primary'}`}></div>
            <div>
              <div className="flex items-start justify-between gap-space-sm mb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-code-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold">
                      CODE: {exam.code}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      {exam.status?.replace(/_/g, ' ') || 'Open for Registration'}
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-primary group-hover:text-secondary transition-colors">
                    {exam.title}
                  </h2>
                </div>
                <div className="w-12 h-12 shrink-0 rounded-lg bg-surface-container-low flex items-center justify-center text-primary font-headline-md font-bold">
                  <span className="material-symbols-outlined text-[26px]">
                    {idx === 0 ? 'precision_manufacturing' : idx === 1 ? 'medical_services' : 'school'}
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
                {exam.instructions || "Federally accredited entrance qualification for universities nationwide."}
              </p>

              {/* Metric & Spec Matrix */}
              <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-space-sm rounded-lg mb-space-md text-center">
                <div className="flex flex-col">
                  <span className="font-code-sm text-label-sm text-on-surface-variant uppercase">Duration</span>
                  <span className="font-headline-md text-body-sm font-semibold text-primary">{exam.duration_minutes} Mins</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-code-sm text-label-sm text-on-surface-variant uppercase">Total Marks</span>
                  <span className="font-headline-md text-body-sm font-semibold text-primary">{exam.total_marks} MCQs</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-code-sm text-label-sm text-on-surface-variant uppercase">Fee Voucher</span>
                  <span className="font-headline-md text-body-sm font-semibold text-secondary font-code-sm">PKR {exam.registration_fee}</span>
                </div>
              </div>

              {/* Centre Callout */}
              <div className="bg-surface-container-high/40 rounded-lg p-space-sm flex items-center justify-between text-body-sm mb-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">pin_drop</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Allocated Centre</span>
                    <span className="font-label-md text-label-md font-medium text-primary">NUST C3A Lab, Islamabad</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-code-sm text-label-sm text-secondary font-bold">1Link Ready</span>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant">Fee Settled</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-space-sm flex items-center justify-between gap-space-sm">
              <button
                onClick={() => setSelectedExam(exam)}
                className="px-4 py-2 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>View Details</span>
              </button>
              <button
                onClick={() => setSelectedExam(exam)}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:bg-on-secondary-container transition-all flex items-center gap-1.5 shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Register Slot</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Confirmation Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-lg w-full border border-outline-variant/30 overflow-hidden flex flex-col">
            <div className="bg-primary text-white p-space-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-secondary-fixed">app_registration</span>
                <span className="font-headline-md text-headline-md font-bold">Confirm Test Registration</span>
              </div>
              <button onClick={() => setSelectedExam(null)} className="text-white/80 hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-space-md flex flex-col gap-3 text-body-sm">
              <div className="flex flex-col">
                <span className="text-outline uppercase text-[11px] font-bold">Selected Examination</span>
                <span className="font-headline-md text-primary font-bold">{selectedExam.title}</span>
                <span className="font-code-sm text-secondary font-semibold">{selectedExam.code}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-outline uppercase text-[11px] font-bold">Select Preferred CBT Examination Center</label>
                <select
                  value={selectedCenterId || ''}
                  onChange={(e) => setSelectedCenterId(Number(e.target.value))}
                  className="p-2.5 bg-surface-container-low rounded-lg font-medium text-primary border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  {centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city}) - {c.total_capacity} Desks
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg text-[13px] text-on-surface-variant flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Registration Fee:</span>
                  <span className="font-bold text-primary font-code-sm">PKR {selectedExam.registration_fee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Gateway:</span>
                  <span className="font-semibold text-secondary">1Link e-Pay Instant Settlement</span>
                </div>
                <div className="flex justify-between">
                  <span>Identity Verification:</span>
                  <span className="font-semibold text-primary">NADRA Smart Card Linked</span>
                </div>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-low flex items-center justify-between border-t border-outline-variant/20">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-4 py-2 rounded-lg bg-surface-container text-primary font-semibold hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={registering}
                className="px-5 py-2 rounded-lg bg-secondary text-white font-bold hover:opacity-95 flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {registering ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    <span>Reserving Desk...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Confirm &amp; Issue Voucher</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AvailableTestsDiscovery;
