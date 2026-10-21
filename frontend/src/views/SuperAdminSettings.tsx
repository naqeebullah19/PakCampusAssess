import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const SuperAdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSuperAdminSettings();
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updateSuperAdminSettings({ action: 'SAVE_GLOBAL_CONFIG' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant">Loading Platform Configuration...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/15">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Platform Settings &amp; Statutory Parameters
          </h1>
          <p className="font-body-md text-on-surface-variant mt-0.5">
            Centralized coordination controls, active admissions cycle, and security policies
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 shadow-sm transition-all self-start sm:self-auto disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>{saving ? "Saving..." : "Save Parameters"}</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-secondary-container text-on-secondary-container font-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Platform configuration updated and cryptographically signed to audit ledger.</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Active Cycle */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">
            Active Admissions Cycle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
            <div>
              <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                Cycle Identifier
              </label>
              <input
                type="text"
                readOnly
                value={settings?.current_cycle?.code || "2027-A-UG"}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm font-code-sm"
              />
            </div>
            <div>
              <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                Cycle Name
              </label>
              <input
                type="text"
                readOnly
                value={settings?.current_cycle?.name || "Cycle 2027-A Undergraduate"}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm"
              />
            </div>
          </div>
        </div>

        {/* Security & Infrastructure Parameters */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-3">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">
            CBT Infrastructure Security Protocol
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
            <div>
              <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                Security Policy Level
              </label>
              <input
                type="text"
                readOnly
                value={settings?.security_level || "High-Stakes Isolated BGP & Cryptographic WAL"}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm font-code-sm"
              />
            </div>
            <div>
              <label className="block font-label-sm text-[11px] uppercase text-on-surface-variant font-bold mb-1">
                Helpline Phone
              </label>
              <input
                type="text"
                readOnly
                value={settings?.helpline || "0800-CAMPUS"}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm"
              />
            </div>
          </div>
        </div>

        {/* Version Information */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-2">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">
            System Release Metadata
          </h3>
          <div className="flex items-center justify-between text-body-sm pt-1">
            <span className="text-on-surface-variant">Core Build Engine:</span>
            <span className="font-code-sm text-secondary font-bold">{settings?.version || "v2.4.1-rc"}</span>
          </div>
          <div className="flex items-center justify-between text-body-sm pt-1">
            <span className="text-on-surface-variant">National Coordination:</span>
            <span className="text-primary font-medium">Higher Education Commission (HEC) Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
