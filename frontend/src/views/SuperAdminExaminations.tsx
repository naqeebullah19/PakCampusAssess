import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const SuperAdminExaminations: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    code: '',
    category_id: '',
    duration_minutes: '120',
    total_marks: '100',
    passing_marks: '50',
    registration_fee: '3000.00',
    negative_marking: true
  });

  useEffect(() => {
    loadExaminations();
  }, []);

  const loadExaminations = async () => {
    try {
      setLoading(true);
      const res = await api.getSuperAdminExaminations();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load examinations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      await api.createSuperAdminExamination(form);
      setShowModal(false);
      setForm({
        title: '',
        code: '',
        category_id: '',
        duration_minutes: '120',
        total_marks: '100',
        passing_marks: '50',
        registration_fee: '3000.00',
        negative_marking: true
      });
      await loadExaminations();
    } catch (err) {
      console.error("Failed to create examination:", err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant">Loading National Examinations Registry...</span>
      </div>
    );
  }

  const examinations = data?.examinations || [];
  const categories = data?.categories || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            National Examinations Management
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">
            Configure standardized entry assessments, scoring schemes, and registration windows
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 shadow-sm transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Create Examination</span>
        </button>
      </div>

      {/* Examinations Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="px-5 py-3 font-semibold">Exam Title &amp; Code</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Duration &amp; Marks</th>
                <th className="px-5 py-3 font-semibold">Registration Fee</th>
                <th className="px-5 py-3 font-semibold">Sessions</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-body-sm">
              {examinations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">
                    No examination records found in the database.
                  </td>
                </tr>
              ) : (
                examinations.map((exam: any) => (
                  <tr key={exam.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-primary">{exam.title}</div>
                      <div className="font-code-sm text-[11px] text-secondary font-medium">{exam.code}</div>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {exam.category_name || "General Standard"}
                    </td>
                    <td className="px-5 py-4">
                      <div>{exam.duration_minutes} Mins ({exam.total_marks} Marks)</div>
                      <div className="font-code-sm text-[10px] text-outline">Pass: {exam.passing_marks} • Negative: {exam.negative_marking ? "Yes (-0.25)" : "No"}</div>
                    </td>
                    <td className="px-5 py-4 font-code-sm font-semibold text-primary">
                      PKR {parseFloat(exam.registration_fee).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-[11px] font-semibold text-primary">
                        {exam.sessions?.length || 0} Sessions
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-[11px] font-semibold ${
                        exam.status === 'REGISTRATION_OPEN' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {exam.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h2 className="font-headline-md text-headline-md font-bold text-primary">Create New Examination</h2>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="flex flex-col gap-3.5">
              <div>
                <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                  Examination Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. National Computing Entrance Assessment (NCEA 2027)"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                    Exam Code
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary font-code-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm font-code-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={form.total_marks}
                    onChange={(e) => setForm({ ...form, total_marks: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm font-code-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                    Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={form.registration_fee}
                    onChange={(e) => setForm({ ...form, registration_fee: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm font-code-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="neg-marking"
                  checked={form.negative_marking}
                  onChange={(e) => setForm({ ...form, negative_marking: e.target.checked })}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <label htmlFor="neg-marking" className="font-body-sm text-body-sm text-on-surface cursor-pointer">
                  Enable Statutory Negative Marking (-0.25 per incorrect response)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 shadow-sm disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Save Examination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
