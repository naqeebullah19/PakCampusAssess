import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const SuperAdminUsers: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getSuperAdminUsers();
      setCandidates(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (candId: number, status: string) => {
    try {
      setUpdating(candId);
      await api.updateCandidateVerification(candId, status);
      await loadUsers();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant">Loading Registered Candidates Dossier...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Registered Candidates &amp; Identity Verification
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">
            NADRA identity validation, applicant dossiers, and statutory verification status
          </p>
        </div>
        <div className="flex items-center gap-2 font-code-sm text-body-sm text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/20">
          <span className="font-bold text-primary">{candidates.length}</span> Total Candidates Registered
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="px-5 py-3 font-semibold">Roll Number &amp; Candidate</th>
                <th className="px-5 py-3 font-semibold">CNIC / B-Form</th>
                <th className="px-5 py-3 font-semibold">Domicile &amp; Gender</th>
                <th className="px-5 py-3 font-semibold">Profile Completion</th>
                <th className="px-5 py-3 font-semibold">NADRA Verification</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-body-sm">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">
                    No candidate records found in database.
                  </td>
                </tr>
              ) : (
                candidates.map((cand: any) => (
                  <tr key={cand.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-primary">{cand.user?.full_name || "Applicant"}</div>
                      <div className="font-code-sm text-[11px] text-secondary font-semibold">{cand.roll_number}</div>
                    </td>
                    <td className="px-5 py-4 font-code-sm text-on-surface">
                      {cand.cnic}
                    </td>
                    <td className="px-5 py-4">
                      <div>{cand.domicile_district || "Islamabad"}</div>
                      <div className="font-code-sm text-[10px] text-outline">{cand.gender} • {cand.domicile_province}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div className="bg-secondary h-full rounded-full" style={{ width: `${cand.completion_percentage || 0}%` }} />
                        </div>
                        <span className="font-code-sm text-[11px] font-semibold">{cand.completion_percentage}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-[11px] font-semibold ${
                        cand.nadRA_verification_status === 'VERIFIED'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : cand.nadRA_verification_status === 'REJECTED'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-on-surface'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {cand.nadRA_verification_status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {cand.nadRA_verification_status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleUpdateStatus(cand.id, 'VERIFIED')}
                            disabled={updating === cand.id}
                            className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary text-[11px] font-semibold hover:opacity-90 disabled:opacity-50"
                          >
                            Verify
                          </button>
                        )}
                        {cand.nadRA_verification_status !== 'REJECTED' && (
                          <button
                            onClick={() => handleUpdateStatus(cand.id, 'REJECTED')}
                            disabled={updating === cand.id}
                            className="px-2.5 py-1 rounded-lg bg-surface-container-high text-error text-[11px] font-semibold hover:bg-error-container/30 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
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
