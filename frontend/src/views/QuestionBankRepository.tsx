import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const QuestionBankRepository: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'review' | 'blueprint' | 'analytics'>('catalog');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('Pre-Engineering / CS');
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Moderate (Target 50%)');
  const [selectedStatus, setSelectedStatus] = useState<string>('Approved (Sealed)');
  const [searchQuery, setSearchQuery] = useState<string>('Photoelectric');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('Q-PHYS-2027-0412');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getQuestionBankData();
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch question bank data:", err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    {
      id: 'Q-PHYS-2027-0412',
      subject: 'Physics',
      topic: 'Quantum Physics & Photoelectric',
      type: 'Single Choice MCQ',
      taxonomy: 'Application',
      discrimination: '0.42',
      discriminationQuality: 'Optimal',
      difficulty: 'P = 0.58',
      difficultyLevel: 'Moderate',
      version: 'v2.1',
      status: 'Pending Peer Review',
      isSealed: true
    },
    {
      id: 'Q-MATH-2027-0891',
      subject: 'Mathematics',
      topic: 'Advanced Calculus • Integrals',
      type: 'Single Choice MCQ',
      taxonomy: 'Analysis',
      discrimination: '0.48',
      discriminationQuality: 'Excellent',
      difficulty: 'P = 0.38',
      difficultyLevel: 'Hard',
      version: 'v3.0',
      status: 'Approved',
      isSealed: true
    },
    {
      id: 'Q-PHYS-2027-0104',
      subject: 'Physics',
      topic: 'Electromagnetism • Biot-Savart',
      type: 'Single Choice MCQ',
      taxonomy: 'Comprehension',
      discrimination: '0.36',
      discriminationQuality: 'Acceptable',
      difficulty: 'P = 0.71',
      difficultyLevel: 'Easy',
      version: 'v1.4',
      status: 'Approved',
      isSealed: true
    },
    {
      id: 'Q-CS-2027-0552',
      subject: 'Computer Science',
      topic: 'Algorithms • Heap Traversal',
      type: 'Code Evaluation MCQ',
      taxonomy: 'Synthesis',
      discrimination: '0.51',
      discriminationQuality: 'Optimal',
      difficulty: 'P = 0.44',
      difficultyLevel: 'Moderate',
      version: 'v2.0',
      status: 'Pending Peer Review',
      isSealed: false
    },
    {
      id: 'Q-CHEM-2027-1120',
      subject: 'Chemistry',
      topic: 'Electrochemistry • Nernst Eq.',
      type: 'Numerical MCQ',
      taxonomy: 'Application',
      discrimination: '0.39',
      discriminationQuality: 'Good',
      difficulty: 'P = 0.52',
      difficultyLevel: 'Moderate',
      version: 'v1.1',
      status: 'Approved',
      isSealed: true
    }
  ];

  // Merge backend data with catalogue if present
  const totalApproved = data?.kpis?.total_approved_items || '24,850';
  const inReview = data?.kpis?.in_review_queue || '184';
  const fatigueRate = data?.kpis?.exposure_rate || '14.2%';
  const activeBlueprints = data?.kpis?.active_blueprints || '8 Configured';

  return (
    <div className="flex flex-col w-full">
      {/* Top Command & Status Notification */}
      <div className="flex items-center justify-between mb-space-md bg-surface-container-lowest p-space-sm px-space-md rounded-lg shadow-sm border border-border-hairline">
        <div className="flex items-center gap-space-sm">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="font-code-sm text-code-sm font-semibold text-primary">VAULT INTEGRITY: SHA-256 SECURED</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">HSM Keystore Active (Islamabad Data Center)</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md text-on-surface-variant">
          <span className="font-code-sm text-label-sm">Cycle: 2026/2027-Autumn</span>
          <span className="text-outline-variant font-code-sm">•</span>
          <span className="font-code-sm text-label-sm">IBCC Syllabus Rev: 4.8.1</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md mb-space-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded font-code-sm text-label-sm bg-surface-container-high text-primary font-semibold tracking-wide">SEC-OPS / QB-CORE</span>
            <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">Curriculum &amp; Psychometrics</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">Centralized Question Bank &amp; Assessment Blueprint Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Repository of 24,850 cryptographically sealed test items across 6 academic disciplines. Configure blueprints, review queues, and psychometric difficulty curves.</p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-low transition-colors shadow-sm font-label-md text-label-md font-semibold border border-border-hairline" type="button">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Import Batch (.csv/.qti)</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-low transition-colors shadow-sm font-label-md text-label-md font-semibold border border-border-hairline" type="button">
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Draft New Question</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant transition-colors shadow-sm font-label-md text-label-md font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">rule_folder</span>
            <span>Assemble Exam Paper Blueprint</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards (4 Bento KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm relative overflow-hidden border border-border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Total Approved Items</span>
            <span className="material-symbols-outlined text-[20px] text-secondary">inventory_2</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl font-bold text-primary">{totalApproved}</span>
            <span className="font-code-sm text-label-sm text-secondary font-semibold">+1,420</span>
          </div>
          <div className="mt-2 flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
            <span>FBISE / IBCC aligned catalog</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1 overflow-hidden">
            <div className="bg-secondary h-1 rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm relative overflow-hidden border border-border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">In Review Queue</span>
            <span className="material-symbols-outlined text-[20px] text-outline">pending_actions</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl font-bold text-primary">{inReview}</span>
            <span className="font-code-sm text-label-sm text-error font-semibold">High Priority</span>
          </div>
          <div className="mt-2 flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-outline">hourglass_empty</span>
            <span>Awaiting Senior Subject sign-off</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1 overflow-hidden">
            <div className="bg-primary h-1 rounded-full" style={{ width: '32%' }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm relative overflow-hidden border border-border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Exposure Rate / Fatigue</span>
            <span className="material-symbols-outlined text-[20px] text-secondary">analytics</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl font-bold text-primary">{fatigueRate}</span>
            <span className="px-1.5 py-0.5 rounded font-code-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold">SAFE</span>
          </div>
          <div className="mt-2 flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">shield</span>
            <span>Item rotation safety threshold: High</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1 overflow-hidden">
            <div className="bg-secondary h-1 rounded-full" style={{ width: '14.2%' }}></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm relative overflow-hidden border border-border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Active Blueprints</span>
            <span className="material-symbols-outlined text-[20px] text-primary">architecture</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl font-bold text-primary">{activeBlueprints}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-outline">tune</span>
            <span>ECAT, MDCAT, B-NAT, G-CAT v2.4</span>
          </div>
          <div className="mt-3 w-full bg-surface-container rounded-full h-1 overflow-hidden">
            <div className="bg-primary h-1 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Operational Navigation Tabs */}
      <div className="flex items-center gap-2 mb-space-md overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 rounded-lg font-label-md text-label-md font-semibold flex items-center gap-2 shadow-sm whitespace-nowrap transition-colors ${
            activeTab === 'catalog'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-border-hairline'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">dataset</span>
          <span>Approved Item Catalog</span>
          <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-code-sm text-label-sm">24,666</span>
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2.5 rounded-lg font-label-md text-label-md font-medium flex items-center gap-2 shadow-sm whitespace-nowrap transition-colors ${
            activeTab === 'review'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-border-hairline'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          <span>Peer Review &amp; Approval Queue</span>
          <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-code-sm text-label-sm font-bold">184</span>
        </button>
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`px-4 py-2.5 rounded-lg font-label-md text-label-md font-medium flex items-center gap-2 shadow-sm whitespace-nowrap transition-colors ${
            activeTab === 'blueprint'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-border-hairline'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">calculate</span>
          <span>Blueprint Formula &amp; Weightages</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-lg font-label-md text-label-md font-medium flex items-center gap-2 shadow-sm whitespace-nowrap transition-colors ${
            activeTab === 'analytics'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-border-hairline'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">monitoring</span>
          <span>Psychometric Item Exposure Analytics</span>
        </button>
      </div>

      {/* Main Workspace: Split Screen Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* LEFT PANEL: Filter and High-Density Table (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-space-md">
          {/* Filter Bar Card */}
          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-sm border border-border-hairline">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2 text-primary font-semibold font-headline-md text-headline-md">
                <span className="material-symbols-outlined text-[20px] text-secondary">filter_alt</span>
                <span>Taxonomy &amp; Item Calibration Filter</span>
              </div>
              <button
                onClick={() => {
                  setSelectedDiscipline('Pre-Engineering / CS');
                  setSelectedSubject('Physics');
                  setSelectedDifficulty('Moderate (Target 50%)');
                  setSelectedStatus('Approved (Sealed)');
                  setSearchQuery('');
                }}
                className="font-code-sm text-label-sm text-secondary hover:underline font-medium"
                type="button"
              >
                Reset Filters
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-xs">
              {/* Discipline */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Discipline</label>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg font-body-sm text-body-sm text-primary focus:outline-none focus:bg-surface-container cursor-pointer border border-border-hairline"
                >
                  <option>Pre-Engineering / CS</option>
                  <option>Pre-Medical</option>
                  <option>General Science</option>
                  <option>Humanities &amp; Law</option>
                </select>
              </div>
              {/* Subject */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg font-body-sm text-body-sm text-primary focus:outline-none focus:bg-surface-container cursor-pointer border border-border-hairline"
                >
                  <option>All Subjects</option>
                  <option>Physics</option>
                  <option>Mathematics</option>
                  <option>Computer Science</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                </select>
              </div>
              {/* Difficulty Level */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Target Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg font-body-sm text-body-sm text-primary focus:outline-none focus:bg-surface-container cursor-pointer border border-border-hairline"
                >
                  <option>All Curves</option>
                  <option>Easy (Target 30%)</option>
                  <option>Moderate (Target 50%)</option>
                  <option>Hard (Target 20%)</option>
                </select>
              </div>
              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">Vault Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg font-body-sm text-body-sm text-primary focus:outline-none focus:bg-surface-container cursor-pointer border border-border-hairline"
                >
                  <option>Approved (Sealed)</option>
                  <option>Pending Peer Review</option>
                  <option>Flagged Revision</option>
                  <option>Deprecated / Fatigued</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-space-sm mt-1 pt-space-xs">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-outline">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container placeholder:text-outline border border-border-hairline"
                  placeholder="Filter by Question ID, Keyword, Topic, or Author CNIC..."
                  type="text"
                />
              </div>
              <span className="font-code-sm text-label-sm text-on-surface-variant whitespace-nowrap">Showing 42 matching items</span>
            </div>
          </div>

          {/* High-Density Item Table Card */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col border border-border-hairline">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high h-10 border-b border-border-hairline">
                    <th className="px-3 font-code-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Q-ID</th>
                    <th className="px-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Subject &amp; Topic</th>
                    <th className="px-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Taxonomy</th>
                    <th className="px-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Discrim.</th>
                    <th className="px-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Diff.</th>
                    <th className="px-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Ver.</th>
                    <th className="px-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {sampleQuestions.map((q) => {
                    const isSelected = selectedQuestionId === q.id;
                    return (
                      <tr
                        key={q.id}
                        onClick={() => setSelectedQuestionId(q.id)}
                        className={`h-[52px] transition-colors cursor-pointer ${
                          isSelected ? 'bg-surface-container-low' : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <td className="px-3 font-code-sm text-label-md text-primary font-bold">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${q.isSealed ? 'bg-secondary' : 'bg-outline'}`}></span>
                            <span>{q.id}</span>
                          </div>
                        </td>
                        <td className="px-3">
                          <div className="flex flex-col">
                            <span className="font-body-md text-body-md font-semibold text-primary truncate max-w-[190px]">{q.topic}</span>
                            <span className="font-code-sm text-label-sm text-on-surface-variant">{q.type}</span>
                          </div>
                        </td>
                        <td className="px-3">
                          <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-surface-container text-primary font-medium">
                            {q.taxonomy}
                          </span>
                        </td>
                        <td className="px-3">
                          <span className="font-code-sm text-code-sm font-semibold text-secondary">{q.discrimination}</span>
                          <span className="block font-label-sm text-label-sm text-on-surface-variant">{q.discriminationQuality}</span>
                        </td>
                        <td className="px-3">
                          <span className="font-code-sm text-code-sm text-on-surface">{q.difficulty}</span>
                          <span className="block font-label-sm text-label-sm text-on-surface-variant">{q.difficultyLevel}</span>
                        </td>
                        <td className="px-3 font-code-sm text-label-sm text-outline">{q.version}</td>
                        <td className="px-3 text-right">
                          {isSelected ? (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-sm">
                              Active Inspect
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedQuestionId(q.id);
                              }}
                              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex items-center justify-between p-space-sm px-space-md bg-surface-container-high border-t border-border-hairline">
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <span>Rows per page:</span>
                <select className="bg-surface-container-lowest px-2 py-0.5 rounded font-code-sm text-label-sm text-primary border border-border-hairline">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>Showing 1-5 of 42 items</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-surface-container text-outline disabled:opacity-40" disabled type="button">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="px-2 py-0.5 font-code-sm text-label-sm font-semibold bg-primary text-on-primary rounded">1</span>
                <button className="px-2 py-0.5 font-code-sm text-label-sm hover:bg-surface-container rounded text-on-surface" type="button">2</button>
                <button className="p-1 rounded hover:bg-surface-container text-on-surface" type="button">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Item Psychometric Curve & Distribution Visualizer */}
          <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm border border-border-hairline">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Item Response Theory (IRT)</span>
                <span className="font-headline-md text-headline-md font-bold text-primary">Item Characteristic Curve (ICC) - 2PL Calibration</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-code-sm text-label-sm font-semibold">a = 1.62 | b = -0.15</span>
            </div>

            {/* Inline Micro SVG Chart for Psychometrics */}
            <div className="relative w-full h-36 bg-surface-container-low rounded-lg p-2 flex items-center justify-center border border-border-hairline">
              <svg className="w-full h-full text-secondary" fill="none" viewBox="0 0 400 120">
                {/* Grid Lines */}
                <line stroke="#c3c7cd" strokeDasharray="2 2" strokeWidth="0.75" x1="40" x2="380" y1="20" y2="20"></line>
                <line stroke="#c3c7cd" strokeDasharray="2 2" strokeWidth="0.75" x1="40" x2="380" y1="60" y2="60"></line>
                <line stroke="#c3c7cd" strokeWidth="0.75" x1="40" x2="380" y1="100" y2="100"></line>
                {/* IRT Logistic Curve */}
                <path d="M 40 100 C 140 100, 180 95, 210 60 C 240 25, 280 20, 380 20" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                {/* Inflection Point Indicator */}
                <circle cx="210" cy="60" fill="#082135" r="4"></circle>
                {/* Text Labels */}
                <text fill="#74777d" fontFamily="JetBrains Mono" fontSize="9" x="15" y="24">1.0</text>
                <text fill="#74777d" fontFamily="JetBrains Mono" fontSize="9" x="15" y="64">0.5</text>
                <text fill="#74777d" fontFamily="JetBrains Mono" fontSize="9" x="15" y="104">0.0</text>
                <text fill="#74777d" fontFamily="JetBrains Mono" fontSize="9" x="40" y="115">-3θ</text>
                <text fill="#082135" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" x="205" y="115">0θ</text>
                <text fill="#74777d" fontFamily="JetBrains Mono" fontSize="9" x="365" y="115">+3θ</text>
              </svg>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm mt-2">
              <span>Latent Ability Level (θ) vs Probability of Correct Response P(θ)</span>
              <span className="font-code-sm text-label-sm text-primary font-medium">Standard Error: ±0.024</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Item Detail & Review Drawer (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-space-md">
          {/* Main Question Verification Card */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-md flex flex-col border border-border-hairline">
            {/* Header of Card */}
            <div className="flex items-center justify-between pb-space-sm border-b border-border-hairline">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-primary text-on-primary font-code-sm text-label-sm font-bold">Q-PHYS-2027-0412</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase">Pending Peer Review</span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <button className="p-1 rounded hover:bg-surface-container" title="Item History Audit" type="button">
                  <span className="material-symbols-outlined text-[20px]">history</span>
                </button>
                <button className="p-1 rounded hover:bg-surface-container" title="View Source LaTeX" type="button">
                  <span className="material-symbols-outlined text-[20px]">code</span>
                </button>
              </div>
            </div>

            {/* Academic Context Tag Strip */}
            <div className="bg-surface-container-low p-2 rounded-lg my-space-md flex flex-wrap gap-x-4 gap-y-1 text-on-surface-variant font-label-sm text-label-sm border border-border-hairline">
              <div><strong className="text-primary font-semibold">Discipline:</strong> Pre-Engineering / Computer Science</div>
              <div><strong className="text-primary font-semibold">Subject:</strong> Physics (Class XII / Intermediate)</div>
              <div><strong className="text-primary font-semibold">Topic:</strong> Quantum Physics &amp; Photoelectric Emission</div>
            </div>

            {/* Question Body Box */}
            <div className="mb-space-md bg-surface-container-lowest p-space-sm rounded-lg border border-border-hairline">
              <div className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant mb-1">Stimulus / Problem Statement:</div>
              <p className="font-body-lg text-body-lg text-primary leading-relaxed">
                Light of wavelength <span className="font-code-sm text-label-md font-semibold text-primary px-1.5 py-0.5 bg-surface-container-high rounded">λ = 300 nm</span> illuminates a clean potassium metal cathode with work function <span className="font-code-sm text-label-md font-semibold text-primary px-1.5 py-0.5 bg-surface-container-high rounded">Φ = 2.29 eV</span>. Assuming Planck's constant <span className="font-code-sm text-label-md font-semibold text-primary px-1.5 py-0.5 bg-surface-container-high rounded">h = 6.63 × 10⁻³⁴ J⋅s</span> and speed of light <span className="font-code-sm text-label-md font-semibold text-primary px-1.5 py-0.5 bg-surface-container-high rounded">c = 3.0 × 10⁸ m/s</span>:
              </p>
              <div className="my-3 p-3 bg-surface-container-high rounded-lg font-code-sm text-body-md text-primary font-medium text-center">
                K_max = \left(\frac&#123;h \cdot c&#125;&#123;\lambda&#125;\right) - \Phi = V_0 \cdot e
              </div>
              <p className="font-body-md text-body-md text-primary font-medium">
                What is the stopping potential <span className="font-code-sm font-semibold">V_0</span> required to completely cut off the emitted photoelectrons?
              </p>
            </div>

            {/* Answer Key & Multiple Choice Options */}
            <div className="flex flex-col gap-2 mb-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant">Answer Options (Controller Decrypted Key):</span>
                <span className="font-code-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">lock_open</span> Authorized View
                </span>
              </div>
              {/* Option A */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-border-hairline">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-code-sm text-label-sm text-primary font-bold">A</span>
                  <span className="font-body-md text-body-md text-primary">0.85 V</span>
                </div>
                <span className="font-code-sm text-label-sm text-outline">Distractor (P=0.18)</span>
              </div>
              {/* Option B */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-border-hairline">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-code-sm text-label-sm text-primary font-bold">B</span>
                  <span className="font-body-md text-body-md text-primary">1.25 V</span>
                </div>
                <span className="font-code-sm text-label-sm text-outline">Distractor (P=0.12)</span>
              </div>
              {/* Option C (CORRECT KEY) */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary-container shadow-sm border border-secondary/30">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-code-sm text-label-sm font-bold">C</span>
                  <span className="font-body-md text-body-md text-on-secondary-fixed font-bold">1.85 V</span>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-secondary-container font-semibold uppercase">
                  <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
                  <span>Correct Authorized Key</span>
                </div>
              </div>
              {/* Option D */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-border-hairline">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-code-sm text-label-sm text-primary font-bold">D</span>
                  <span className="font-body-md text-body-md text-primary">4.14 V</span>
                </div>
                <span className="font-code-sm text-label-sm text-outline">Distractor (P=0.12)</span>
              </div>
            </div>

            {/* Academic Authority & Pedigree Metadata */}
            <div className="p-space-sm bg-surface-container-low rounded-lg mb-space-md flex flex-col gap-space-xs font-body-sm text-body-sm border border-border-hairline">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Author / Item Writer:</span>
                <span className="font-semibold text-primary">Prof. Asim Farooq (NUST Physics Dept)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Peer Reviewer:</span>
                <span className="font-semibold text-primary">Dr. Sarah Niazi (Quaid-e-Azam Univ)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">IBCC Standard Code:</span>
                <span className="font-code-sm text-label-sm text-primary">SEC-PHY-QNT-2026.04</span>
              </div>
            </div>

            {/* Approval & Verification Workflow Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border-hairline">
              <div className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant">Examination Controller Authorization:</div>
              <div className="grid grid-cols-3 gap-2">
                <button className="py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md font-semibold text-center transition-colors" type="button">
                  Request Revision
                </button>
                <button className="py-2 px-3 rounded-lg bg-error-container hover:bg-error/20 text-on-error-container font-label-md text-label-md font-semibold text-center transition-colors" type="button">
                  Reject Item
                </button>
                <button className="py-2 px-3 rounded-lg bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-md text-label-md font-semibold text-center transition-colors flex items-center justify-center gap-1 shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Approve &amp; Seal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Blueprint Distribution Blueprint Summary Tile */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-md border border-border-hairline">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Assigned To Blueprint</span>
              <span className="font-code-sm text-label-sm text-primary font-bold">ECAT Engineering 2027</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-primary font-medium">Physics Section Weightage</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant">30 / 100 Questions (30%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                  <div className="bg-secondary h-2" style={{ width: '30%' }}></div>
                  <div className="bg-primary h-2" style={{ width: '40%' }}></div>
                  <div className="bg-surface-tint h-2" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mt-1">
                  <span>Physics: 30%</span>
                  <span>Math: 40%</span>
                  <span>CS/Chem: 30%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
