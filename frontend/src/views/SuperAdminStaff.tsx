import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const SuperAdminStaff: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await api.getSuperAdminStaff();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      setUpdating(userId);
      await api.updateStaffRole(userId, newRole);
      await loadStaff();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant">Loading Administrative Staff Accounts...</span>
      </div>
    );
  }

  const staff = data?.staff || [];
  const availableRoles = data?.available_roles || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Administrative Staff &amp; Role Assignments
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">
            Institutional role delegations, statutory permissions, and proctoring personnel
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="px-5 py-3 font-semibold">Staff Official</th>
                <th className="px-5 py-3 font-semibold">Institutional Email</th>
                <th className="px-5 py-3 font-semibold">Assigned Institution</th>
                <th className="px-5 py-3 font-semibold">Current Role</th>
                <th className="px-5 py-3 font-semibold">Role Delegation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-body-sm">
              {staff.map((member: any) => (
                <tr key={member.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-primary">{member.full_name}</div>
                    <div className="font-code-sm text-[11px] text-outline">User ID: #{member.id}</div>
                  </td>
                  <td className="px-5 py-4 font-code-sm text-on-surface">
                    {member.email || member.username}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">
                    {member.profile?.institution ? "NUST (Federal H-12)" : "Central Ministry Directorate"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-[11px] font-bold ${
                      member.profile?.role === 'SUPER_ADMIN'
                        ? 'bg-primary text-on-primary'
                        : member.profile?.role === 'EXAM_CONTROLLER'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container-high text-primary'
                    }`}>
                      {member.profile?.role || "UNASSIGNED"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={member.profile?.role || ''}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      disabled={updating === member.id}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-body-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      {availableRoles.map((r: string) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
