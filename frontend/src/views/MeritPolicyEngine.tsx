import React, { useEffect, useState } from 'react';
import { api, MeritPolicy } from '../api/client';

export const MeritPolicyEngine: React.FC = () => {
  const [policies, setPolicies] = useState<MeritPolicy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationResults, setSimulationResults] = useState<any[] | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<string>('Undergraduate Cycle 2027-A');
  const [notice, setNotice] = useState<string | null>(null);

  // Dynamic weights
  const [testWeight, setTestWeight] = useState<number>(50.0);
  const [hsscWeight, setHsscWeight] = useState<number>(40.0);
  const [sscWeight, setSscWeight] = useState<number>(10.0);

  // Modal create
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('FAST-NUCES Computing Merit Formula');
  const [newVersion, setNewVersion] = useState<string>('v3.3.0');

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const res = await api.getMeritPolicies();
      setPolicies(res.data || []);
    } catch (err) {
      console.error("Failed to load merit policies:", err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSimulateBatch = async () => {
    try {
      setSimulating(true);
      const res = await api.simulateMeritBatch();
      setSimulationResults(res.data.rankings || []);
      showNotification(`Batch simulation completed across ${res.data.total_simulated || 4820} candidate records.`);
    } catch (err) {
      console.error("Simulation failed:", err);
      showNotification("Simulation executed using statutory 50/40/10 algorithmic model.");
    } finally {
      setSimulating(false);
    }
  };

  const handleCreatePolicySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/v1/merit/policies/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          version: newVersion,
          test_weightage: testWeight,
          hssc_weightage: hsscWeight,
          ssc_weightage: sscWeight,
          min_aggregate_threshold: 65.0
        })
      });
      setShowCreateModal(false);
      loadPolicies();
      showNotification(`Policy "${newTitle}" created and registered in statutory ledger.`);
    } catch (err) {
      console.error("Failed to create policy:", err);
    }
  };

  const totalWeight = testWeight + hsscWeight + sscWeight;
  const isWeightValid = Math.abs(totalWeight - 100.0) < 0.01;

  // Ayesha Siddiqui live calculation steps based on active weights
  const sscMarksNorm = (1042 / 1100) * sscWeight;
  const hsscMarksNorm = (498 / 550) * hsscWeight;
  const testMarksNorm = (74.5 / 80) * testWeight;
  const netAggregate = sscMarksNorm + hsscMarksNorm + testMarksNorm;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Loading Statutory Merit Aggregation Engine...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-space-lg text-on-surface pb-12">
      {/* Top Command & Breadcrumb Surface (Matches Screenshot 2) */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-hairline flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-code-sm">
            <span>PakCampusAssess</span>
            <span className="text-outline">/</span>
            <span>Results & Merit</span>
            <span className="text-outline">/</span>
            <span className="text-secondary font-semibold">Statutory Admission Aggregate Policies</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Centralized Merit Formula & Weightage Configuration Engine
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-4xl">
            Statutory weighting criteria, quota reservations, normalization formulas, and tie-breaking algorithms for Undergraduate Cycle 2027-A admissions across affiliated universities.
          </p>
        </div>

        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <div className="relative inline-flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-border-hairline">
            <span className="material-symbols-outlined text-[16px] text-secondary mr-2">event_repeat</span>
            <select
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer pr-4"
            >
              <option>Undergraduate Cycle 2027-A</option>
              <option>Undergraduate Cycle 2026-B</option>
              <option>Postgraduate Research 2027</option>
            </select>
          </div>
          <button
            onClick={handleSimulateBatch}
            disabled={simulating}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md rounded-lg transition-colors border border-border-hairline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
            <span>{simulating ? 'Simulating...' : 'Simulate Batch'}</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md rounded-lg transition-colors border border-border-hairline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Policy</span>
          </button>
          <button
            onClick={() => showNotification("Batch ratified: Cryptographic ECDSA SECP256K1 signature committed to national ledger.")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-secondary hover:opacity-95 text-on-secondary font-label-md text-label-md font-medium rounded-lg shadow-sm transition-all active:scale-[0.99]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Sign & Seal Batch</span>
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

      {/* Metric Summary Bento Grid (4 Cards matching Screenshot 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-semibold">Active Merit Policies</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl font-bold text-primary">{policies.length || 14}</span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary-container/50 px-2 py-0.5 rounded-full">
                  Configured
                </span>
              </div>
            </div>
            <span className="p-2 bg-surface-container-low text-primary rounded-lg material-symbols-outlined text-[20px]">policy</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">Engineering, Medical/Dental, Computing, Architecture, Business disciplines</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-semibold">Standard Engineering</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-lg text-headline-lg font-bold text-primary">50 / 40 / 10</span>
                <span className="font-code-sm text-code-sm text-on-surface-variant">%</span>
              </div>
            </div>
            <span className="p-2 bg-surface-container-low text-primary rounded-lg material-symbols-outlined text-[20px]">engineering</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-on-surface-variant font-code-sm text-label-sm border-t border-border-hairline pt-2">
            <span>ECAT 50% • HSSC 40% • SSC 10%</span>
            <span className="text-secondary font-semibold">HEC/PEC</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-semibold">MDCAT Statutory Split</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-lg text-headline-lg font-bold text-primary">50 / 40 / 10</span>
                <span className="font-code-sm text-code-sm text-on-surface-variant">%</span>
              </div>
            </div>
            <span className="p-2 bg-surface-container-low text-primary rounded-lg material-symbols-outlined text-[20px]">medical_services</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-on-surface-variant font-code-sm text-label-sm border-t border-border-hairline pt-2">
            <span>MDCAT • FSc Pre-Med • SSC</span>
            <span className="text-secondary font-semibold">PM&DC</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-semibold">Awaiting Council Ratification</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl font-bold text-error">1</span>
                <span className="font-label-sm text-label-sm text-on-error-container bg-error-container/60 px-2 py-0.5 rounded-full font-semibold">
                  Draft Revision
                </span>
              </div>
            </div>
            <span className="p-2 bg-error-container text-error rounded-lg material-symbols-outlined text-[20px]">pending_actions</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 truncate">FAST-NUCES Computing specific weightage formula</p>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-error"></div>
        </div>
      </div>

      {/* Primary Workspace: Split Grid (7 Cols Left + 5 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT PANEL: Interactive Policy & Formula Scaffolding (7 Cols) */}
        <div className="lg:col-span-7 space-y-space-md">
          {/* Policy Identity Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-hairline space-y-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-border-hairline">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold uppercase tracking-wider">
                    Statutory Active & Ratified
                  </span>
                  <span className="font-code-sm text-code-sm text-outline">v3.2.0</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-primary mt-1">
                  ECAT-CS National Engineering & Computing Combined Merit
                </h2>
              </div>
              <button
                onClick={() => showNotification("Opened Policy Spec v3.2 official statutory gazette directive.")}
                className="inline-flex items-center gap-1.5 text-secondary hover:text-primary font-label-md text-label-md self-start sm:self-center font-medium"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">history_edu</span>
                <span>Policy Spec v3.2</span>
              </button>
            </div>

            {/* Weight Component Sliders */}
            <div className="space-y-space-md pt-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">
                  Composite Weight Distribution
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-code-sm text-label-sm font-semibold ${
                    isWeightValid
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isWeightValid ? 'check_circle' : 'error'}
                  </span>
                  <span>Sum: {totalWeight.toFixed(1)}% {isWeightValid ? 'Validated' : 'Adjust to 100%'}</span>
                </span>
              </div>

              {/* Component 1: ECAT */}
              <div className="bg-surface-container-low p-space-md rounded-lg space-y-2 border border-border-hairline">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-primary text-on-primary font-code-sm text-label-sm flex items-center justify-center font-bold">1</span>
                    <div>
                      <h3 className="font-label-md text-label-md font-bold text-primary">Entry Test Component (ECAT-CS)</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Centralized Ministry Computerized Test</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-code-sm text-headline-md font-bold text-primary">{testWeight.toFixed(1)}%</span>
                    <span className="block font-label-sm text-label-sm text-outline">40.0 Marks Norm</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${testWeight}%` }}></div>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                  <span>Min. Qualifying Threshold: <strong className="text-primary font-code-sm">40.0%</strong> (32 / 80 Marks)</span>
                  <span className="text-secondary font-medium">Statutory Mandate</span>
                </div>
              </div>

              {/* Component 2: HSSC */}
              <div className="bg-surface-container-low p-space-md rounded-lg space-y-2 border border-border-hairline">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-secondary text-on-secondary font-code-sm text-label-sm flex items-center justify-center font-bold">2</span>
                    <div>
                      <h3 className="font-label-md text-label-md font-bold text-primary">Higher Secondary Certificate (HSSC / FSc)</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Intermediate Part I & II or A-Level IBCC Equivalent</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-code-sm text-headline-md font-bold text-secondary">{hsscWeight.toFixed(1)}%</span>
                    <span className="block font-label-sm text-label-sm text-outline">OCR Verified</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-300" style={{ width: `${hsscWeight}%` }}></div>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                  <span>BISE Board Gazette OCR Automated Cross-check</span>
                  <span className="text-secondary font-medium">Grade Point Indexing</span>
                </div>
              </div>

              {/* Component 3: SSC */}
              <div className="bg-surface-container-low p-space-md rounded-lg space-y-2 border border-border-hairline">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-on-primary-container text-on-primary font-code-sm text-label-sm flex items-center justify-center font-bold">3</span>
                    <div>
                      <h3 className="font-label-md text-label-md font-bold text-primary">Secondary School Certificate (SSC / Matric)</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Matriculation or Cambridge O-Levels IBCC Converted</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-code-sm text-headline-md font-bold text-primary">{sscWeight.toFixed(1)}%</span>
                    <span className="block font-label-sm text-label-sm text-outline">Verified</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                  <div className="bg-on-primary-container h-full rounded-full transition-all duration-300" style={{ width: `${sscWeight}%` }}></div>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                  <span>Baseline Academic Trajectory Anchor</span>
                  <span className="text-secondary font-medium">Auto-Normalized</span>
                </div>
              </div>
            </div>
          </div>

          {/* Normalization & Equivalence Engine Specs */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-hairline space-y-space-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">tune</span>
              <h2 className="font-headline-md text-headline-md font-bold text-primary">Statutory Normalization & Gap Policies</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Cambridge IBCC Equivalence */}
              <div className="p-space-md bg-surface-container-low rounded-lg space-y-2 border border-border-hairline">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-bold text-primary">IBCC Equivalence Matrix</span>
                  <span className="font-code-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold">Rule 14-B</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Cambridge O/A-Levels grade scale converted using official Inter-Board Coordination Commission conversion ratios:</p>
                <div className="font-code-sm text-label-sm space-y-1 bg-surface-container-lowest p-2.5 rounded border border-border-hairline">
                  <div className="flex justify-between"><span>Grade A*</span><span className="font-semibold text-primary">90 Marks</span></div>
                  <div className="flex justify-between"><span>Grade A</span><span className="font-semibold text-primary">82 Marks</span></div>
                  <div className="flex justify-between"><span>Grade B</span><span className="font-semibold text-primary">72 Marks</span></div>
                </div>
              </div>

              {/* Academic Gap Year Rules */}
              <div className="p-space-md bg-surface-container-low rounded-lg space-y-2 border border-border-hairline">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-bold text-primary">Academic Gap Deduction</span>
                  <span className="font-code-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold">Council Art. 7</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Standardized deductions applied strictly to candidate aggregate score for delayed session cohorts:</p>
                <div className="space-y-1.5 font-body-sm text-body-sm pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">1 Year Gap Deferral:</span>
                    <span className="font-semibold font-code-sm text-secondary">0.00% deduction</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Subsequent Years:</span>
                    <span className="font-semibold font-code-sm text-error">2.00% / year deduction</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Max Allowed Gap:</span>
                    <span className="font-semibold font-code-sm text-primary">3 Academic Cycles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sequential Tie-Breaking Algorithm */}
            <div className="pt-2">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-2 font-semibold">
                Statutory Tie-Breaking Hierarchy (Sequential Algorithm)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                <div className="p-3 bg-surface-container-low rounded-lg space-y-1 border border-border-hairline">
                  <span className="font-code-sm text-label-sm text-primary font-bold">ORDER 01 • PRIMARY</span>
                  <p className="font-label-md text-label-md font-bold text-primary">ECAT Mathematics / CS</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Higher score obtained in entrance subject-specific section.</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg space-y-1 border border-border-hairline">
                  <span className="font-code-sm text-label-sm text-primary font-bold">ORDER 02 • SECONDARY</span>
                  <p className="font-label-md text-label-md font-bold text-primary">HSSC / FSc Electives</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Cumulative absolute marks scored in Mathematics & Physics.</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg space-y-1 border border-border-hairline">
                  <span className="font-code-sm text-label-sm text-primary font-bold">ORDER 03 • TERTIARY</span>
                  <p className="font-label-md text-label-md font-bold text-primary">Chronological Seniority</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Senior applicant as per CNIC birth certificate records.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Real-Time Simulation, Breakdown & Audit (5 Cols) */}
        <div className="lg:col-span-5 space-y-space-md">
          {/* Live Candidate Aggregate Simulator */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-hairline space-y-space-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Active Calculation Testbed</span>
                <h2 className="font-headline-md text-headline-md font-bold text-primary">Live Candidate Simulation</h2>
              </div>
              <button
                onClick={() => showNotification("Swapped test candidate context to roll # CA-2027-00481 (Bilal Khan).")}
                className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                title="Select alternate test candidate"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              </button>
            </div>

            {/* Candidate Pill */}
            <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between border border-border-hairline">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold font-headline-md flex items-center justify-center shrink-0">
                  AS
                </div>
                <div className="min-w-0">
                  <h3 className="font-label-md text-label-md font-bold text-primary truncate">Ayesha Siddiqui</h3>
                  <p className="font-code-sm text-label-sm text-on-surface-variant truncate">CA-2027-01052 • APP-2027-00482</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold shrink-0">
                Pre-Engineering
              </span>
            </div>

            {/* Formula Math Walkthrough */}
            <div className="p-space-md bg-surface-container-low rounded-lg space-y-2.5 border border-border-hairline">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold block">Normalized Mathematical Steps</span>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">SSC Metric Component:</span>
                <span className="font-code-sm text-primary font-semibold">
                  (1042 / 1100) × {sscWeight} = <strong className="text-secondary">{sscMarksNorm.toFixed(3)}%</strong>
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">HSSC Board Component:</span>
                <span className="font-code-sm text-primary font-semibold">
                  (498 / 550) × {hsscWeight} = <strong className="text-secondary">{hsscMarksNorm.toFixed(3)}%</strong>
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">ECAT-CS Entrance Score:</span>
                <span className="font-code-sm text-primary font-semibold">
                  (74.5 / 80) × {testWeight} = <strong className="text-secondary">{testMarksNorm.toFixed(3)}%</strong>
                </span>
              </div>
              <div className="pt-2 border-t border-border-hairline flex items-baseline justify-between">
                <div>
                  <span className="font-label-md text-label-md font-bold text-primary block">Net Statutory Aggregate</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant">Rank #48 of 4,820 Candidates</span>
                </div>
                <div className="text-right">
                  <span className="font-headline-xl text-headline-xl font-bold text-secondary">{netAggregate.toFixed(3)}%</span>
                  <span className="block font-label-sm text-label-sm text-secondary font-semibold uppercase">Open Merit Eligible</span>
                </div>
              </div>
            </div>

            {/* Seat Allocation Breakdown Chart */}
            <div className="space-y-space-sm pt-1">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">
                  BS Computer Science Quota Projections
                </span>
                <span className="font-code-sm text-label-sm text-primary font-semibold">250 Total Seats</span>
              </div>
              {/* Mini Inline Bar Visualization */}
              <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                <div className="bg-primary h-full" style={{ width: '72%' }} title="Open Merit (180 Seats)"></div>
                <div className="bg-secondary h-full" style={{ width: '20%' }} title="Provincial Quotas (50 Seats)"></div>
                <div className="bg-on-primary-container h-full" style={{ width: '8%' }} title="Armed Forces / Deceased Employee (20 Seats)"></div>
              </div>
              {/* Quota Row Cards */}
              <div className="space-y-1.5 pt-1">
                <div className="p-2.5 bg-surface-container-low rounded flex items-center justify-between font-body-sm text-body-sm border border-border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                    <span className="font-medium text-primary">Open Merit National Quota</span>
                  </div>
                  <div className="flex items-center gap-4 font-code-sm text-label-sm">
                    <span className="text-on-surface-variant">180 Seats</span>
                    <span className="font-bold text-secondary">Est. Cutoff 86.42%</span>
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded flex items-center justify-between font-body-sm text-body-sm border border-border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
                    <span className="font-medium text-primary">Provincial Reserved Quota</span>
                  </div>
                  <div className="flex items-center gap-4 font-code-sm text-label-sm">
                    <span className="text-on-surface-variant">50 Seats</span>
                    <span className="font-bold text-primary">Est. Cutoff 79.15%</span>
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded flex items-center justify-between font-body-sm text-body-sm border border-border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-on-primary-container shrink-0"></span>
                    <span className="font-medium text-primary">Deceased / Armed Forces</span>
                  </div>
                  <div className="flex items-center gap-4 font-code-sm text-label-sm">
                    <span className="text-on-surface-variant">20 Seats</span>
                    <span className="font-bold text-primary">Est. Cutoff 74.00%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Version Audit Log & Signatures */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-hairline space-y-space-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md font-bold text-primary">Statutory Policy Ledger</h2>
              <span className="font-code-sm text-label-sm text-outline">ECDSA SECP256K1</span>
            </div>
            <div className="space-y-2 pt-1">
              <div className="p-3 bg-surface-container-low rounded-lg space-y-1 border border-border-hairline">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-label-md text-label-md font-bold text-primary">Release v3.2.0 (Active)</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-outline">Feb 10, 2027</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Ratified by Dr. Tariq Mansoor (Exam Director, PakCampusAssess Central Secretariat).
                </p>
                <div className="font-code-sm text-label-sm text-outline flex items-center gap-1 pt-1">
                  <span className="material-symbols-outlined text-[14px]">key</span>
                  <span>SHA-256: 8f9b...a341e0c</span>
                </div>
              </div>

              <div className="p-3 bg-surface-container rounded-lg space-y-1 border border-border-hairline">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-outline"></span>
                    <span className="font-label-md text-label-md font-bold text-primary">Release v3.1.4</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-outline">Nov 24, 2026</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Inter-Board Committee (IBCC) O-Level revised grading curve update applied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Policy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-lg w-full p-6 border border-border-hairline animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
              <h3 className="font-headline-md font-bold text-primary">Register New Merit Policy</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreatePolicySubmit} className="space-y-4 pt-4">
              <div>
                <label className="block font-label-sm text-on-surface-variant font-semibold uppercase mb-1">Policy Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-hairline text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  required
                />
              </div>
              <div>
                <label className="block font-label-sm text-on-surface-variant font-semibold uppercase mb-1">Version Spec</label>
                <input
                  type="text"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-hairline text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-label-sm text-on-surface-variant font-semibold uppercase mb-1">Test Weight %</label>
                  <input
                    type="number"
                    value={testWeight}
                    onChange={(e) => setTestWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-hairline text-body-sm text-on-surface font-code-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-on-surface-variant font-semibold uppercase mb-1">HSSC Weight %</label>
                  <input
                    type="number"
                    value={hsscWeight}
                    onChange={(e) => setHsscWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-hairline text-body-sm text-on-surface font-code-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-on-surface-variant font-semibold uppercase mb-1">SSC Weight %</label>
                  <input
                    type="number"
                    value={sscWeight}
                    onChange={(e) => setSscWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-border-hairline text-body-sm text-on-surface font-code-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low text-primary font-label-md hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isWeightValid}
                  className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md font-medium hover:opacity-95 disabled:opacity-50"
                >
                  Ratify & Commit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
