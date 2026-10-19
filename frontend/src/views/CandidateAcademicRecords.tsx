import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const CandidateAcademicRecordsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Form State
  const [level, setLevel] = useState<string>('FSC');
  const [institution, setInstitution] = useState<string>('');
  const [board, setBoard] = useState<string>('FBISE Islamabad');
  const [degree, setDegree] = useState<string>('FSc Pre-Engineering');
  const [year, setYear] = useState<string>('2026');
  const [totalMarks, setTotalMarks] = useState<string>('1100');
  const [obtainedMarks, setObtainedMarks] = useState<string>('');
  const [rollNo, setRollNo] = useState<string>('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await api.getAcademicRecords();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load academic records:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/v1/candidate/academic-records/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          institution_name: institution,
          board_or_university: board,
          degree_title: degree,
          passing_year: parseInt(year),
          total_marks: parseFloat(totalMarks),
          obtained_marks: parseFloat(obtainedMarks),
          roll_number: rollNo
        })
      });
      setShowAddModal(false);
      loadRecords();
    } catch (err) {
      console.error("Failed to add record:", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadSuccess(`Uploaded "${file.name}" (attested). Submitting to IBCC OCR Verification Stream...`);
      setTimeout(() => setUploadSuccess(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Loading Academic Credentials &amp; Certificates...</span>
      </div>
    );
  }

  const { academic_records = [] } = data || {};

  return (
    <div className="flex flex-col w-full font-body-md text-body-md text-on-surface">
      {/* Subtle top metadata bar */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 mb-space-md text-on-surface-variant font-code-sm text-label-sm">
        <div className="flex items-center gap-space-sm">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-semibold">
            <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
            IBCC Secure API v4.2 Connected
          </span>
          <span>|</span>
          <span>Session Key: <span className="font-semibold text-primary">PK-VERIF-982103-X</span></span>
        </div>
        <div className="flex items-center gap-space-sm">
          <span>Candidate ID: <span className="font-semibold text-primary">CA-2027-01052</span></span>
          <span>•</span>
          <span>NADRA CNIC: <span className="font-semibold text-primary">61101-*******-4</span></span>
        </div>
      </div>

      {/* Primary Page Header Block */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-lg">
        <div className="flex flex-col max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-code-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Verification Docket // Cycle 2027-A</span>
            <span className="text-outline">•</span>
            <span className="font-code-sm text-label-sm text-on-surface-variant">Central IBCC Node: Islamabad</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">Academic Records &amp; Document Repository</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Submit, review, and verify secondary and higher secondary school qualifications. Documents are verified by the Inter-Board Coordination Commission (IBCC) protocol.
          </p>
        </div>

        {/* Overall Verification Status Card */}
        <div className="w-full lg:w-80 bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Overall Verification</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              75% Complete
            </span>
          </div>
          <div className="font-headline-md text-headline-md text-primary font-bold mb-1">Partially Verified</div>
          <div className="font-body-sm text-body-sm text-on-surface-variant mb-2.5">3 of 4 Core Documents Approved by Board Registry</div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {uploadSuccess && (
        <div className="mb-space-md p-3.5 bg-secondary-container text-on-secondary-container rounded-lg font-bold flex items-center gap-2 border border-secondary">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Top Action Required Amber Banner */}
      <div className="w-full p-space-md rounded-lg bg-surface-container-low mb-space-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-sm border border-outline-variant/20">
        <div className="flex items-start gap-space-sm">
          <div className="p-2 rounded-lg bg-surface-container-highest text-primary shrink-0 mt-0.5 sm:mt-0">
            <span className="material-symbols-outlined text-[20px] text-tertiary">priority_high</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md font-semibold text-primary">Action Required: Intermediate (HSSC Part-II) Original Marks Sheet / Hope Certificate Pending</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest font-code-sm text-label-sm font-semibold text-on-surface-variant">Deadline: Feb 22, 2027</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Your undergraduate application index remains conditional. Upload your attested Part-II Gazette Marks Sheet or institutional Hope Certificate prior to central aggregate compilation.
            </p>
          </div>
        </div>
        <a className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-medium shrink-0 hover:bg-primary-container transition-colors shadow-sm" href="#hssc-upload-section">
          <span className="material-symbols-outlined text-[16px]">upload_file</span>
          <span>Upload Document</span>
        </a>
      </div>

      {/* Grid layout: 8 Columns Primary Records + 4 Columns Audit / Guidelines Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Primary Qualification Blocks */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* SECTION 1: SSC / Matriculation (Fully Verified) */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20">
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md mb-space-md bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg pt-space-md rounded-t-xl">
              <div className="flex items-center gap-space-sm">
                <span className="p-2 rounded-lg bg-secondary-container text-on-secondary-container">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </span>
                <div>
                  <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Tier-1 Qualification</div>
                  <h2 className="font-headline-md text-headline-md text-primary font-bold">Secondary School Certificate (SSC / Matric)</h2>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Verified by FBISE Central Database</span>
              </div>
            </div>

            {/* Academic Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md mb-space-lg">
              <div className="p-space-sm rounded-lg bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">Examining Board</span>
                <span className="font-headline-md text-body-md text-primary font-semibold mt-1 block">FBISE Islamabad</span>
                <span className="font-code-sm text-label-sm text-on-surface-variant">Federal Jurisdiction</span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">Program / Group</span>
                <span className="font-headline-md text-body-md text-primary font-semibold mt-1 block">Science (CS Group)</span>
                <span className="font-code-sm text-label-sm text-on-surface-variant">Physics, Chem, CS, Math</span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">Roll No &amp; Year</span>
                <span className="font-code-sm text-headline-md text-primary font-bold mt-1 block">184920</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Annual Exam 2023</span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">Performance</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-code-sm text-headline-lg text-secondary font-bold">1042</span>
                  <span className="font-code-sm text-body-sm text-on-surface-variant">/ 1100</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">94.73% • Grade A+</span>
              </div>
            </div>

            {/* Subject-Wise Marks Snapshot (Compact Table) */}
            <div className="mb-space-lg bg-surface-container-low rounded-lg p-space-sm overflow-x-auto border border-outline-variant/10">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="text-on-surface-variant font-label-sm uppercase tracking-wider">
                    <th className="py-1 px-2 font-semibold">Subject</th>
                    <th className="py-1 px-2 font-semibold">Theory</th>
                    <th className="py-1 px-2 font-semibold">Practical</th>
                    <th className="py-1 px-2 font-semibold">Total</th>
                    <th className="py-1 px-2 font-semibold">Percentile</th>
                    <th className="py-1 px-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high font-code-sm">
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="py-2 px-2 font-label-md text-primary font-bold">Mathematics</td>
                    <td className="py-2 px-2">75 / 75</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2 font-bold text-primary">75 / 75</td>
                    <td className="py-2 px-2 text-secondary">99.8th</td>
                    <td className="py-2 px-2 text-right"><span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-label-sm font-semibold">Passed</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="py-2 px-2 font-label-md text-primary font-bold">Computer Science</td>
                    <td className="py-2 px-2">55 / 55</td>
                    <td className="py-2 px-2">20 / 20</td>
                    <td className="py-2 px-2 font-bold text-primary">75 / 75</td>
                    <td className="py-2 px-2 text-secondary">99.9th</td>
                    <td className="py-2 px-2 text-right"><span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-label-sm font-semibold">Passed</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="py-2 px-2 font-label-md text-primary font-bold">Physics</td>
                    <td className="py-2 px-2">61 / 65</td>
                    <td className="py-2 px-2">10 / 10</td>
                    <td className="py-2 px-2 font-bold text-primary">71 / 75</td>
                    <td className="py-2 px-2 text-secondary">95.4th</td>
                    <td className="py-2 px-2 text-right"><span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-label-sm font-semibold">Passed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Attached File & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
              <div className="flex items-center gap-space-sm min-w-0">
                <span className="material-symbols-outlined text-primary text-[28px] shrink-0">picture_as_pdf</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md font-semibold text-primary truncate">SSC_Detailed_Marks_Certificate_Ayesha.pdf</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant">1.8 MB • SHA-256 Verified: 4a9f...38bc • Cleared Jan 14, 2027</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-medium hover:bg-surface-container-high transition-colors shadow-sm inline-flex items-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View</span>
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-medium hover:bg-surface-container-high transition-colors shadow-sm inline-flex items-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2: HSSC / Intermediate (Action Required) */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20" id="hssc-upload-section">
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md mb-space-md bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg pt-space-md rounded-t-xl">
              <div className="flex items-center gap-space-sm">
                <span className="p-2 rounded-lg bg-surface-container-highest text-primary">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </span>
                <div>
                  <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Tier-2 Qualification</div>
                  <h2 className="font-headline-md text-headline-md text-primary font-bold">Higher Secondary School Certificate (HSSC / FSc)</h2>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                Part-II Marks Sheet Pending
              </span>
            </div>

            {/* Academic Breakdown Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-lg">
              <div className="p-space-sm rounded-lg bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">Board &amp; Discipline</span>
                <span className="font-headline-md text-body-md text-primary font-semibold mt-1 block">FBISE Islamabad</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">FSc Pre-Engineering / CS</span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">HSSC Part-I Result</span>
                  <span className="font-code-sm text-label-sm text-secondary font-semibold">Verified</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-code-sm text-headline-lg text-primary font-bold">498</span>
                  <span className="font-code-sm text-body-sm text-on-surface-variant">/ 550</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">90.55% • Grade A+ (Roll: 519204)</span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">HSSC Part-II Status</span>
                <span className="font-headline-md text-body-md text-tertiary font-semibold mt-1 block">Awaiting Final Attestation</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">College Hope Cert Required</span>
              </div>
            </div>

            {/* Interactive Drag & Drop Upload Zone */}
            <div className="mb-space-md">
              <label className="block font-label-md text-label-md text-primary font-semibold mb-2">
                Upload HSSC Part-II Result Card or College Principal Hope Certificate
              </label>
              <div className="relative group p-space-xl rounded-xl bg-surface-container-low hover:bg-surface-container transition-all text-center cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40" id="drop-zone">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-secondary mb-space-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
                </div>
                <div className="font-headline-md text-body-lg text-primary font-semibold">
                  Drop your attested document here, or <span className="text-secondary underline decoration-1 underline-offset-4">Browse Local Files</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-md">
                  Supported Formats: PDF, JPEG, PNG (Maximum file size: 5 MB). Document must be sealed &amp; signed by the College Principal or Controller of Examinations.
                </p>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="mt-space-md flex flex-wrap items-center justify-center gap-3 font-code-sm text-label-sm text-on-surface-variant">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                    Cryptographic Hash Checked
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">security</span>
                    Anti-Tamper OCR Verified
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: IBCC Guidelines & Hash Ledger */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Statutory Equivalence Rules */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
            <div className="flex items-center gap-2 pb-1">
              <span className="material-symbols-outlined text-secondary text-[22px]">gavel</span>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">IBCC Statutory Rules</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Centralized formula mandated under National Admissions Policy (2027):
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-md text-label-md font-bold text-primary">Cambridge O/A-Levels</span>
                <span className="text-[12px] text-on-surface-variant mt-0.5">Equivalence certificate mandatory from IBCC Secretariat Islamabad.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-md text-label-md font-bold text-primary">Pre-Engineering Minimum</span>
                <span className="text-[12px] text-on-surface-variant mt-0.5">Minimum 60.0% aggregate in HSSC / FSc for ECAT eligibility.</span>
              </div>
            </div>
          </div>

          {/* Verification Audit Hash Ledger */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-1">
              <span className="font-headline-md text-headline-md text-primary font-bold">Verification Ledger</span>
              <span className="font-code-sm text-label-sm text-secondary font-semibold">Active</span>
            </div>
            <div className="flex flex-col divide-y divide-surface-container text-body-sm">
              <div className="py-2 flex items-center justify-between">
                <span className="text-primary font-medium">FBISE SSC Record</span>
                <span className="font-code-sm text-label-sm text-secondary font-semibold">CLEARED</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-primary font-medium">HSSC Part-I Gazette</span>
                <span className="font-code-sm text-label-sm text-secondary font-semibold">CLEARED</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-primary font-medium">HSSC Part-II Certificate</span>
                <span className="font-code-sm text-label-sm text-error font-semibold">PENDING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CandidateAcademicRecordsView;
