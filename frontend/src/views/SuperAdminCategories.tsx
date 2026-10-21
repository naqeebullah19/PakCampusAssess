import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const SuperAdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getSuperAdminCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      await api.createSuperAdminCategory(form);
      setShowModal(false);
      setForm({ name: '', code: '', description: '' });
      await loadCategories();
    } catch (err) {
      console.error("Failed to create category:", err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant">Loading Examination Categories...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Examination Categories
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">
            Discipline classifications, entrance test streams, and curriculum groupings
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 shadow-sm transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-code-sm text-label-sm uppercase font-bold text-secondary px-2 py-0.5 rounded-md bg-secondary-container/40">
                  {cat.code}
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                  {cat.examination_count || 0} Exams
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-primary mb-1">
                {cat.name}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {cat.description || "Central standard assessment track for national university entry."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-[11px] font-label-sm text-on-surface-variant">
              <span>Status: <strong className="text-secondary font-semibold">Active</strong></span>
              <span className="material-symbols-outlined text-[16px] text-outline">verified</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h2 className="font-headline-md text-headline-md font-bold text-primary">New Examination Category</h2>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3.5">
              <div>
                <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Medical &amp; Dental Standard Assessment (MDCAT)"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm"
                />
              </div>

              <div>
                <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                  Category Code *
                </label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. MED-STD"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm font-code-sm"
                />
              </div>

              <div>
                <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description of the academic stream and target degree programs..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-outline-variant/20">
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
                  {creating ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
