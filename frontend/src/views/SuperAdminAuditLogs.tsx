import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const SuperAdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getSuperAdminAuditLogs();
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant">Retrieving Cryptographic Audit Ledger...</span>
      </div>
    );
  }

  const filteredLogs = logs.filter((l) =>
    (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.actor_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.entity_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Immutable Audit Trail &amp; System Logs
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">
            Tamper-evident administrative action ledger, authentication events, and role delegation tracking
          </p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, or entity..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider border-b border-outline-variant/20">
              <tr>
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Action</th>
                <th className="px-5 py-3 font-semibold">Actor</th>
                <th className="px-5 py-3 font-semibold">Target Entity</th>
                <th className="px-5 py-3 font-semibold">IP Address</th>
                <th className="px-5 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-body-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">
                    No matching audit records in ledger.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-4 font-code-sm text-[11px] text-on-surface-variant whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-code-sm text-label-sm font-bold text-primary px-2 py-0.5 rounded-md bg-surface-container">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-primary">
                      {log.actor_name || "System"}
                    </td>
                    <td className="px-5 py-4 font-code-sm text-secondary">
                      {log.entity_name} #{log.entity_id}
                    </td>
                    <td className="px-5 py-4 font-code-sm text-outline">
                      {log.ip_address}
                    </td>
                    <td className="px-5 py-4 font-code-sm text-[11px] text-on-surface-variant max-w-xs truncate">
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
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
