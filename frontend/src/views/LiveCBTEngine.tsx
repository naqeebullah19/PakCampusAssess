import React, { useEffect, useState, useRef } from 'react';
import { api, CBTActiveAttempt, CBTQuestion } from '../api/client';
import { useNavigate } from 'react-router-dom';

export const LiveCBTEngine: React.FC = () => {
  const [attemptData, setAttemptData] = useState<CBTActiveAttempt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // CBT Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [syncStatus, setSyncStatus] = useState<string>("Synced • WAL Authoritative");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(74 * 60 + 18);
  const [walVersion, setWalVersion] = useState<number>(49);

  // Submission Modal
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [receiptToken, setReceiptToken] = useState<string | null>(null);

  const navigate = useNavigate();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    loadAttempt();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadAttempt = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCBTAttempt();
      const d = res.data;
      setAttemptData(d);
      setSecondsRemaining(d.timing?.remaining_seconds || 4458);
      setWalVersion(d.terminal?.wal_version || 49);

      // Hydrate saved answers
      const answersMap: Record<number, string> = {};
      const flagMap: Record<number, boolean> = {};
      if (d.saved_answers) {
        Object.entries(d.saved_answers).forEach(([qId, ans]: [string, any]) => {
          if (ans.selected_option) answersMap[parseInt(qId)] = ans.selected_option;
          if (ans.is_flagged) flagMap[parseInt(qId)] = true;
        });
      }
      setSelectedAnswers(answersMap);
      setFlaggedQuestions(flagMap);

      // Start authoritative countdown
      startTimer();
    } catch (err: any) {
      console.error("Failed to load CBT session:", err);
      setError("Unable to authenticate CBT workstation with testing cluster.");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = async (questionId: number, optionKey: string) => {
    // Update local state immediately for responsive feel
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
    setSyncStatus("Saving to WAL Ledger...");

    try {
      if (!attemptData) return;
      const res = await api.saveCBTAnswer({
        attempt_id: attemptData.attempt_id,
        question_id: questionId,
        selected_option: optionKey,
        is_flagged: flaggedQuestions[questionId] || false
      });
      setWalVersion(res.data.wal_version);
      setSyncStatus(`Synced 1s ago • WAL v${res.data.wal_version}`);
    } catch (err) {
      console.error("Save answer failed:", err);
      setSyncStatus("Sync Pending • Retrying...");
    }
  };

  const handleToggleFlag = async (questionId: number) => {
    const newFlag = !flaggedQuestions[questionId];
    setFlaggedQuestions((prev) => ({ ...prev, [questionId]: newFlag }));

    try {
      if (!attemptData) return;
      const res = await api.saveCBTAnswer({
        attempt_id: attemptData.attempt_id,
        question_id: questionId,
        selected_option: selectedAnswers[questionId] || '',
        is_flagged: newFlag
      });
      setWalVersion(res.data.wal_version);
      setSyncStatus(`Flag Saved • WAL v${res.data.wal_version}`);
    } catch (err) {
      console.error("Flag save failed:", err);
    }
  };

  const handleClearResponse = async (questionId: number) => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });

    try {
      if (!attemptData) return;
      const res = await api.saveCBTAnswer({
        attempt_id: attemptData.attempt_id,
        question_id: questionId,
        selected_option: '',
        is_flagged: flaggedQuestions[questionId] || false
      });
      setWalVersion(res.data.wal_version);
      setSyncStatus(`Response Cleared • WAL v${res.data.wal_version}`);
    } catch (err) {
      console.error("Clear response failed:", err);
    }
  };

  const handleFinalSubmit = async () => {
    if (!attemptData) return;
    try {
      setSubmitting(true);
      const res = await api.submitCBTExam(attemptData.attempt_id);
      setReceiptToken(res.data.receipt_token);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-white gap-3">
        <span className="material-symbols-outlined text-[48px] text-secondary-fixed animate-spin">sync</span>
        <span className="font-headline-md text-headline-md font-bold">Locking Secure CBT Workstation Environment...</span>
        <span className="font-mono text-label-sm text-on-primary-container">Verifying Network CIDR 10.14.8.118 & Biometric Token</span>
      </div>
    );
  }

  if (error || !attemptData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6">
        <div className="bg-error-container text-on-error-container p-6 rounded-xl max-w-lg border border-error">
          <h2 className="font-bold text-headline-md mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">gpp_bad</span>
            <span>Security Lockout / Terminal Unbound</span>
          </h2>
          <p className="text-body-sm">{error || "No authorized exam attempt available."}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-error text-white font-bold rounded-lg text-label-md"
          >
            Return to Candidate Dashboard
          </button>
        </div>
      </div>
    );
  }

  const questions: CBTQuestion[] = attemptData.questions || [];
  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface flex flex-col p-space-md select-none">
      {/* SECURE CBT HUD / SYSTEM BANNER */}
      <div className="w-full bg-primary-container text-on-primary rounded-xl p-space-md shadow-md mb-space-md border border-primary/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-y-3 pb-space-sm border-b border-primary/40">
          <div className="flex items-center gap-space-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-pulse"></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-headline-md tracking-tight font-semibold text-white">
                  {attemptData.examination?.code}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-highest/20 text-inverse-primary font-mono text-label-sm uppercase tracking-wider">
                  Session #02 • Morning Shift
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-primary-container">
                National Admissions CBT Secure Console • Strict Proctor Mode Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-space-md">
            {/* Live Server Countdown */}
            <div className="flex items-center gap-2 px-space-md py-1.5 rounded-lg bg-primary border border-secondary/30">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">timer</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider">Remaining Time</span>
                <span className="font-mono text-headline-md text-white font-bold tabular-nums">
                  {formatTime(secondsRemaining)}
                </span>
              </div>
            </div>

            {/* Terminal Verification */}
            <div className="flex items-center gap-2 px-space-md py-1.5 rounded-lg bg-primary/60 border border-primary/80">
              <span className="material-symbols-outlined text-[18px] text-inverse-primary">desktop_windows</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider">Terminal</span>
                <span className="font-mono text-body-sm text-white">{attemptData.terminal.lab_name} • {attemptData.terminal.desk_number}</span>
              </div>
            </div>

            {/* Sync Heartbeat */}
            <div className="flex items-center gap-2 px-space-md py-1.5 rounded-lg bg-primary/60 border border-primary/80">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">cloud_done</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider">Sync Status</span>
                <span className="font-mono text-body-sm text-white">{syncStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between text-on-primary-container font-mono text-label-sm pt-space-xs gap-y-1">
          <div className="flex items-center gap-3">
            <span>Candidate: <strong className="text-white font-medium">{attemptData.candidate.name}</strong></span>
            <span>•</span>
            <span>Roll No: <strong className="text-white font-medium">{attemptData.candidate.roll_number}</strong></span>
            <span>•</span>
            <span>CNIC: <strong className="text-white font-medium">{attemptData.candidate.cnic}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Static CIDR: <strong className="text-white font-medium">{attemptData.terminal.ip_address}</strong></span>
            <span>•</span>
            <span className="text-secondary-fixed">Encrypted Keystroke Stream Ready</span>
          </div>
        </div>
      </div>

      {/* MAIN CBT LAYOUT: SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start flex-1">
        {/* LEFT & CENTER: ACTIVE EXAMINATION PANE (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface-container rounded-lg overflow-x-auto border border-border-hairline">
            {['Mathematics', 'Physics', 'Computer Science', 'English & Analytical'].map((sec, sIdx) => {
              const isActive = (currentQuestion?.subject?.toLowerCase().includes(sec.toLowerCase().substring(0, 4)));
              return (
                <button
                  key={sIdx}
                  className={`px-space-md py-2 rounded-md font-label-md text-label-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                  }`}
                >
                  {isActive && <span className="w-2 h-2 rounded-full bg-secondary"></span>}
                  <span>Sec {sIdx + 1}: {sec}</span>
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          {currentQuestion && (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-border-hairline flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Question Header */}
                <div className="flex items-center justify-between pb-space-sm border-b border-border-hairline mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-headline-md font-bold text-primary">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <span className="font-mono text-label-sm text-secondary bg-secondary-container px-2 py-0.5 rounded-full font-semibold">
                      +{currentQuestion.marks} Marks
                    </span>
                    {attemptData.examination.negative_marking && (
                      <span className="font-mono text-label-sm text-error bg-error-container px-2 py-0.5 rounded-full font-semibold">
                        -0.25 on wrong
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleFlag(currentQuestion.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                      flaggedQuestions[currentQuestion.id]
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-border-hairline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {flaggedQuestions[currentQuestion.id] ? 'bookmark_added' : 'bookmark_border'}
                    </span>
                    <span>{flaggedQuestions[currentQuestion.id] ? 'Flagged for Review' : 'Mark for Review'}</span>
                  </button>
                </div>

                {/* Question Topic & Text */}
                <div className="mb-space-lg">
                  <span className="font-label-sm text-outline uppercase tracking-wider block mb-1">
                    {currentQuestion.subject} • {currentQuestion.topic}
                  </span>
                  <div className="font-headline-md text-headline-md text-primary font-medium leading-relaxed font-sans">
                    {currentQuestion.question_text}
                  </div>
                </div>

                {/* Multiple Choice Options List */}
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === opt.option_key;
                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.option_key)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-secondary-container/20 border-secondary ring-1 ring-secondary text-primary font-bold shadow-sm'
                            : 'bg-surface-container-low/50 hover:bg-surface-container border-border-hairline text-on-surface'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-label-md font-bold transition-all ${
                            isSelected ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {opt.option_key}
                        </div>
                        <span className="font-sans text-body-md flex-1">{opt.option_text}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Actions Bar */}
              <div className="pt-space-md border-t border-border-hairline flex items-center justify-between mt-space-lg">
                <button
                  type="button"
                  onClick={() => handleClearResponse(currentQuestion.id)}
                  disabled={!selectedAnswers[currentQuestion.id]}
                  className="px-3 py-1.5 text-label-md font-medium text-error hover:bg-error-container/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Clear Selection
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    className="px-5 py-2 rounded-lg bg-secondary text-white font-label-md text-label-md font-bold hover:opacity-95 shadow-sm transition-all flex items-center gap-1 disabled:opacity-40"
                  >
                    <span>Next</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: PALETTE & SESSION SUMMARY (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Question Palette Surface */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-border-hairline mb-3">
              <span className="font-headline-md text-headline-md font-bold text-primary">Question Palette</span>
              <span className="font-mono text-label-sm text-outline">{answeredCount} of {totalQuestions} Answered</span>
            </div>

            {/* Legend Pills */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-1.5 rounded-lg bg-secondary-container/30 border border-secondary/20 flex flex-col items-center">
                <span className="font-mono font-bold text-secondary text-headline-md">{answeredCount}</span>
                <span className="font-label-sm text-[10px] text-on-secondary-container uppercase">Answered</span>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 flex flex-col items-center">
                <span className="font-mono font-bold text-amber-800 text-headline-md">{flaggedCount}</span>
                <span className="font-label-sm text-[10px] text-amber-800 uppercase">Flagged</span>
              </div>
              <div className="p-1.5 rounded-lg bg-surface-container border border-border-hairline flex flex-col items-center">
                <span className="font-mono font-bold text-outline text-headline-md">{totalQuestions - answeredCount}</span>
                <span className="font-label-sm text-[10px] text-outline uppercase">Pending</span>
              </div>
            </div>

            {/* Matrix of Question Tiles */}
            <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isFlagged = Boolean(flaggedQuestions[q.id]);

                let bgClass = "bg-surface-container text-on-surface-variant hover:bg-surface-container-high";
                if (isAnswered) {
                  bgClass = "bg-secondary text-white font-bold";
                }
                if (isFlagged) {
                  bgClass = "bg-amber-500 text-white font-bold ring-2 ring-amber-300";
                }
                if (isCurrent) {
                  bgClass += " ring-2 ring-primary ring-offset-1";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-lg font-mono text-label-md flex items-center justify-center transition-all ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Final Submission Trigger */}
            <div className="pt-space-md border-t border-border-hairline mt-space-md">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 bg-primary text-white font-label-md text-label-md font-bold rounded-lg hover:opacity-95 shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Review & Final Submit</span>
              </button>
            </div>
          </div>

          {/* Hardware & Network Verification Box */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-border-hairline text-body-sm text-on-surface-variant">
            <span className="font-bold text-primary block mb-1">CBT Security Protocol:</span>
            <p className="text-[12px] leading-relaxed">
              Keystrokes and answers are synchronized continuously to the institutional audit server. In the event of a power fluctuation or workstation replacement, all answers remain permanently secured under WAL state v{walVersion}.
            </p>
          </div>
        </div>
      </div>

      {/* Final Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full border border-border-hairline overflow-hidden flex flex-col">
            <div className="bg-primary text-white p-space-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-secondary-fixed">assignment_turned_in</span>
                <span className="font-headline-md text-headline-md font-bold">Final Examination Submission</span>
              </div>
              {!receiptToken && (
                <button onClick={() => setShowSubmitModal(false)} className="text-white/80 hover:text-white">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            <div className="p-space-lg flex flex-col gap-space-md text-body-sm">
              {!receiptToken ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-secondary-container/30 border border-secondary/30 rounded-lg">
                    <span className="material-symbols-outlined text-secondary text-[32px]">info</span>
                    <div>
                      <span className="font-bold text-primary block">Ready to Submit Attempt?</span>
                      <span className="text-[12px] text-on-surface-variant">
                        Once confirmed, answers will be sealed permanently for automated deterministic scoring.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2 border-y border-border-hairline">
                    <div>
                      <span className="font-label-sm text-outline uppercase block">Total Questions</span>
                      <span className="font-mono text-primary font-bold">{totalQuestions}</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-outline uppercase block">Answered Count</span>
                      <span className="font-mono text-secondary font-bold">{answeredCount}</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-outline uppercase block">Flagged for Review</span>
                      <span className="font-mono text-amber-800 font-bold">{flaggedCount}</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-outline uppercase block">Unanswered</span>
                      <span className="font-mono text-outline font-bold">{totalQuestions - answeredCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 border rounded-lg text-label-md"
                    >
                      Return to Test
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={submitting}
                      className="px-6 py-2 bg-secondary text-white font-bold rounded-lg text-label-md hover:opacity-95 shadow flex items-center gap-2"
                    >
                      {submitting && <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>}
                      <span>{submitting ? "Submitting Attempt..." : "Confirm & Submit Now"}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center gap-3 py-4">
                  <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">verified</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg font-bold text-primary">Examination Successfully Submitted</h3>
                  <p className="text-body-sm text-on-surface-variant max-w-sm">
                    Your answers have been cryptographically committed to the Central Admissions Ledger.
                  </p>

                  <div className="p-3 bg-surface-container-low border border-border-hairline rounded-lg w-full flex flex-col items-center">
                    <span className="font-label-sm text-outline uppercase">Submission Receipt Token</span>
                    <span className="font-mono font-bold text-primary text-headline-md tracking-wider mt-1">
                      {receiptToken}
                    </span>
                    <span className="font-mono text-[11px] text-secondary mt-1">Status: ARCHIVED_IN_LEDGER</span>
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded-lg text-label-md hover:opacity-95 shadow"
                  >
                    Return to Candidate Portal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
