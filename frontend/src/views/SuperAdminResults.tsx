import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const SuperAdminResults: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string>('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const res = await api.getSuperAdminResults();
      setData(res.data);
      if (res.data?.examinations?.[0]) {
        setSelectedExam(res.data.examinations[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedExam) return;
    try {
      setPublishing(true);
      await api.publishResults(parseInt(selectedExam));
      await loadResults();
    } catch (err) {
      console.error("Failed to publish results:", err);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant">Loading Examination Results &amp; Merit Aggregates...</span>
      </div>
    );
  }

  const results = data?.results || [];
  const examinations = data?.examinations || [];
  const meritPolicies = data?.merit_policies || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Results &amp; Merit Publication Desk
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">
            Cryptographic CBT scoring verification, statutory merit calculation, and official gazette publication
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {examinations.map((ex: any) => (
              <option key={ex.id} value={ex.id}>{ex.code} - {ex.title}</option>
            ))}
          </select>
          <button
            onClick={handlePublish}
            disabled={publishing || !selectedExam}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:opacity-95 shadow-sm transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{publishing ? "Publishing..." : "Publish Results Batch"}</span>
          </button>
        </div>
      </div>

      {/* Merit Policies Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {meritPolicies.map((p: any) => (
          <div key={p.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20">
            <span className="font-code-sm text-label-sm uppercase font-bold text-secondary">{p.institution_code} Policy</span>
            <h4 className="font-headline-md text-body-md font-bold text-primary mt-1 mb-2">{p.title}</h4>
            <div className="flex items-center justify-between text-body-xs text-on-surface-variant pt-2 border-t border-outline-variant/15">
              <span>Test: {parseFloat(p.test_weightage)}%</span>
              <span>FSc: {parseFloat(p.hssc_weightage)}%</span>
              <span>Matric: {parseFloat(p.ssc_weightage)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="px-5 py-3 font-semibold">Candidate &amp; Roll Number</th>
                <th className="px-5 py-3 font-semibold">Examination</th>
                <th className="px-5 py-3 font-semibold">Correct / Wrong</th>
                <th className="px-5 py-3 font-semibold">Raw Score / Total</th>
                <th className="px-5 py-3 font-semibold">Percentage</th>
                <th className="px-5 py-3 font-semibold">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-body-sm">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">
                    No evaluated examination results recorded in database.
                  </td>
                </tr>
              ) : (
                results.map((r: any) => (
                  <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-primary">{r.candidate_name}</div>
                      <div className="font-code-sm text-[11px] text-secondary font-semibold">{r.candidate_roll_number}</div>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {r.examination_title} ({r.examination_code})
                    </td>
                    <td className="px-5 py-4 font-code-sm">
                      <span className="text-secondary font-bold">{r.correct_answers}</span> Correct / <span className="text-error font-bold">{r.wrong_answers}</span> Wrong
                    </td>
                    <td className="px-5 py-4 font-code-sm font-bold text-primary">
                      {r.raw_score} / {r.total_marks}
                    </td>
                    <td className="px-5 py-4 font-code-sm font-bold text-secondary">
                      {r.percentage}%
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-[11px] font-semibold ${
                        r.is_published
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container-high text-on-surface'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {r.is_published ? "Published Officially" : "Draft / Sealed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
