import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const IPAuthorizationConsole: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending' | 'suspended'>('approved');
  const [selectedSubnetId, setSelectedSubnetId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getIPAuthorizationData();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load IP authorization data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Connecting to PERN National CIDR Ledger...</span>
      </div>
    );
  }

  const { kpis, subnets = [], selected_dossier, regional_capacity = [], ledger = [] } = data || {};
  const selectedSubnet = subnets.find((s: any) => s.id === selectedSubnetId) || subnets[0] || {};

  return (
    <div className="flex flex-col w-full space-y-space-lg text-on-surface pb-12">
      {/* Top Utility Context & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 font-code-sm text-label-sm text-outline">
            <span className="hover:text-primary transition-colors cursor-pointer">PakCampusAssess</span>
            <span className="text-outline-variant">/</span>
            <span className="hover:text-primary transition-colors cursor-pointer">3. Infrastructure & Staff</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">IP Authorization Console</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Authorized Testing Centers & CIDR Whitelist Repository
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-4xl">
            Supervised network access control, static CIDR subnet binding, and hardware terminal cryptographic lock across 42 nationwide university examination centers on Pakistan Education & Research Network (PERN).
          </p>
        </div>

        {/* Contextual Control Button Group */}
        <div className="flex flex-wrap items-center gap-space-sm self-start lg:self-center shrink-0">
          <button
            onClick={() => handleAction("Initiated automated ICMP / TLS Ping Sweep across 148 authorized CIDR subnets.")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-high transition-all text-label-md font-label-md border border-border-hairline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">network_ping</span>
            <span>Run Subnet Ping Sweep</span>
          </button>
          <button
            onClick={() => handleAction("Downloaded PERN Layer-3 BGP Autonomous Systems (ASN-23674) topology dossier.")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-high transition-all text-label-md font-label-md border border-border-hairline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">file_download</span>
            <span>PERN Topology Map</span>
          </button>
          <button
            onClick={() => handleAction("Opened statutory cryptographic IP authorization request protocol modal.")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-secondary text-on-secondary shadow-sm hover:opacity-95 transition-all text-label-md font-label-md active:scale-[0.99]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_moderator</span>
            <span>+ Request IP Authorization</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded-lg flex items-center justify-between text-body-sm font-medium border border-secondary/20 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-secondary hover:text-primary">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Metric KPI Scaffolding (4 Institutional Tiles matching Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Nationwide Centers</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">{kpis?.nationwide_centers || 42}</span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">{kpis?.active_percent || '100% Active'}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[22px]">domain</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between font-code-sm text-label-sm text-on-surface-variant border-t border-border-hairline">
            <span>{kpis?.dedicated_labs || 116} Dedicated Computer Labs</span>
            <span className="text-secondary font-semibold">{kpis?.regional_hubs || 5} Regional Hubs</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Authorized CIDR Subnets</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">{kpis?.authorized_cidrs || 148}</span>
                <span className="font-code-sm text-label-sm text-secondary font-semibold">{kpis?.cidr_mask || '/24 to /22'}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[22px]">lan</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between font-code-sm text-label-sm text-on-surface-variant border-t border-border-hairline">
            <span>{kpis?.static_bgp || 'Static BGP Binding Only'}</span>
            <span className="text-primary font-semibold">{kpis?.dynamic_leases || 0} Dynamic Leases</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Hardware Encrypted Terminals</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-primary font-bold">{kpis?.hardware_terminals || '6,412'}</span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">{kpis?.hsm_version || 'HSM v2.4'}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[22px]">lock</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between font-code-sm text-label-sm text-on-surface-variant border-t border-border-hairline">
            <span>{kpis?.secureboot_ok || 'SecureBoot OK'}</span>
            <span className="text-secondary font-semibold">{kpis?.terminals_synced || '99.98% Synced'}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">CIDR Drift / Spoof Anomaly</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-xl text-headline-xl text-secondary font-bold">{kpis?.cidr_drift_anomalies || 0}</span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">Clear</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between font-code-sm text-label-sm text-on-surface-variant border-t border-border-hairline">
            <span>Last Ping Probe: {kpis?.last_ping_probe || '2m ago'}</span>
            <span className="text-secondary font-medium">{kpis?.pern_asn || 'PERN ASN-23674'}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
        </div>
      </div>

      {/* Main Asymmetric Workspace Layout: 8 Cols Left + 4 Cols Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left / Center Primary Table & Filter Container (8 cols) */}
        <div className="xl:col-span-8 flex flex-col space-y-4">
          {/* Subnet Tabbed Navigation Strip */}
          <div className="bg-surface-container-lowest rounded-xl p-1.5 shadow-sm border border-border-hairline flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-medium shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  activeTab === 'approved' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Approved Subnets</span>
                <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest/30 text-on-primary font-code-sm text-label-sm">148</span>
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  activeTab === 'pending' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Pending Authorization Requests</span>
                <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-outline font-code-sm text-label-sm">3</span>
              </button>
              <button
                onClick={() => setActiveTab('suspended')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  activeTab === 'suspended' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Suspended / Revoked Ranges</span>
                <span className="px-1.5 py-0.2 rounded-full bg-error-container text-on-error-container font-code-sm text-label-sm">5</span>
              </button>
            </div>
            <div className="flex items-center gap-2 pr-2 text-outline font-code-sm text-label-sm">
              <span>Synced: HEC Network NOC</span>
            </div>
          </div>

          {/* Advanced Filter & Multi-Criteria Search Panel */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-border-hairline flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary border border-border-hairline"
                placeholder="Filter by Center Name, Lab Room Code, CIDR IPv4 Range, or BGP ASN..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-border-hairline">
                <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">location_on</span>
                <select className="bg-transparent font-label-sm text-label-sm text-on-surface font-semibold focus:outline-none cursor-pointer pr-1">
                  <option>All Hubs (ICT, Punjab, Sindh, KP, Bal)</option>
                  <option>Federal Capital (ICT)</option>
                  <option>Punjab Zone</option>
                  <option>Sindh Zone</option>
                  <option>Khyber Pakhtunkhwa</option>
                  <option>Balochistan Region</option>
                </select>
              </div>
              <div className="flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-border-hairline">
                <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">cell_tower</span>
                <select className="bg-transparent font-label-sm text-label-sm text-on-surface font-semibold focus:outline-none cursor-pointer pr-1">
                  <option>All Carriers (PERN / Fiber / VSAT)</option>
                  <option>PERN Fiber Core (Primary)</option>
                  <option>PTCL Enterprise Lease</option>
                  <option>Standby Secure VSAT</option>
                </select>
              </div>
              <div className="flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-border-hairline">
                <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">toggle_on</span>
                <select className="bg-transparent font-label-sm text-label-sm text-on-surface font-semibold focus:outline-none cursor-pointer pr-1">
                  <option>Status: Sealed & Active</option>
                  <option>Audit In Progress</option>
                  <option>Pending Sign-off</option>
                  <option>Revoked</option>
                </select>
              </div>
            </div>
          </div>

          {/* High-Density National Network Subnet Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-border-hairline overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low font-label-sm text-label-sm uppercase tracking-wider text-outline border-b border-border-hairline">
                    <th className="py-2.5 px-4 font-semibold">Center & Dedicated Lab Reference</th>
                    <th className="py-2.5 px-3 font-semibold">Approved CIDR Range</th>
                    <th className="py-2.5 px-3 font-semibold">Active Terminals</th>
                    <th className="py-2.5 px-3 font-semibold">ISP Gateway & BGP ASN</th>
                    <th className="py-2.5 px-3 font-semibold">Grid / Redundancy</th>
                    <th className="py-2.5 px-3 font-semibold">Cryptographic Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline text-body-sm font-body-sm">
                  {subnets
                    .filter((s: any) =>
                      s.center_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.cidr_range.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.lab_ref.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((subnet: any) => (
                      <tr
                        key={subnet.id}
                        onClick={() => setSelectedSubnetId(subnet.id)}
                        className={`transition-colors cursor-pointer ${
                          selectedSubnetId === subnet.id
                            ? 'bg-surface-container-low/80 font-medium'
                            : 'hover:bg-surface-container-low/40'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2.5">
                            <span className={`w-2 h-2 rounded-full mt-1.5 ${subnet.is_sealed ? 'bg-secondary' : 'bg-outline'}`}></span>
                            <div className="flex flex-col">
                              <span className="font-headline-md text-body-sm font-semibold text-primary">{subnet.center_name}</span>
                              <span className="font-label-sm text-label-sm text-on-surface-variant">{subnet.city_campus}</span>
                              <span className="font-code-sm text-label-sm text-outline">LAB-REF: {subnet.lab_ref}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-code-sm text-label-md font-semibold text-primary">{subnet.cidr_range}</span>
                            <span className="font-label-sm text-label-sm text-secondary font-medium">{subnet.carrier}</span>
                            <span className="font-code-sm text-label-sm text-outline">Exit NAT: {subnet.exit_gateway}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                              <span className="font-headline-md text-body-sm font-bold text-primary">{subnet.active_terminals}</span>
                              <span className="font-code-sm text-label-sm text-outline">/ {subnet.total_terminals}</span>
                            </div>
                            <div className="w-20 bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
                              <div
                                className={`h-full rounded-full ${subnet.is_sealed ? 'bg-secondary' : 'bg-outline'}`}
                                style={{ width: `${(subnet.active_terminals / subnet.total_terminals) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`font-code-sm text-label-sm mt-0.5 ${subnet.is_sealed ? 'text-secondary' : 'text-outline'}`}>
                              {subnet.is_sealed ? '100% Locked' : 'Spares Free'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col font-code-sm text-label-sm">
                            <span className="text-on-surface font-medium">{subnet.bgp_gateway}</span>
                            <span className="text-outline">GW: {subnet.bgp_ip}</span>
                            <span className="text-outline">MTU: 1500 ({subnet.status})</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-[14px] text-secondary">solar_power</span>
                              <span>{subnet.redundancy}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 font-code-sm text-label-sm text-outline">
                              <span className="material-symbols-outlined text-[14px] text-primary">alt_route</span>
                              <span>{subnet.secondary_link}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold tracking-wide ${
                              subnet.is_sealed
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-surface-container-highest text-primary'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${subnet.is_sealed ? 'bg-secondary' : 'bg-outline'}`}></span>
                            <span>{subnet.is_sealed ? 'SEALED & ACTIVE' : 'PENDING SIGN-OFF'}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(`Inspected terminals for ${subnet.center_name}`);
                              }}
                              className="p-1 rounded-lg hover:bg-surface-container-high text-primary"
                              title="Terminal Inspection"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">terminal</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(`Fetched cryptographic certificate for ${subnet.cidr_range}`);
                              }}
                              className="p-1 rounded-lg hover:bg-surface-container-high text-outline hover:text-primary"
                              title="View Audit Dossier"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer */}
            <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2 text-outline font-code-sm text-label-sm border-t border-border-hairline">
              <div className="flex items-center gap-2">
                <span>Showing <strong className="text-primary font-semibold">1-5</strong> of <strong className="text-primary font-semibold">148</strong> Authorized Network CIDR Ranges</span>
                <span className="text-outline-variant">|</span>
                <span>All subnets synchronized with PERN ASN database</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded bg-surface-container-lowest shadow-sm text-primary disabled:opacity-40" disabled type="button">
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-bold">1</span>
                <button className="px-2 py-0.5 rounded hover:bg-surface-container-high text-primary" type="button">2</button>
                <button className="px-2 py-0.5 rounded hover:bg-surface-container-high text-primary" type="button">3</button>
                <span className="px-1 text-outline">...</span>
                <button className="px-2 py-0.5 rounded hover:bg-surface-container-high text-primary" type="button">30</button>
                <button className="p-1 rounded bg-surface-container-lowest shadow-sm text-primary hover:bg-surface-container-high" type="button">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Network Perimeter Security Banner */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border border-border-hairline">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-surface-container-lowest text-secondary shadow-sm">
                <span className="material-symbols-outlined text-[24px]">vpn_lock</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-body-sm font-semibold text-primary">High-Stakes Examination Lock Active</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Any attempt to access examination clusters from non-whitelisted IPs triggers immediate IP packet drop and an automated dispatch to National CERT & HEC Audit Division.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-code-sm text-label-sm bg-surface-container-lowest px-2.5 py-1 rounded-lg text-primary font-semibold border border-border-hairline">
                IP-RULE: STRICT-DENY-ANY
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar Panel: Selected Subnet Dossier & Cryptographic Inspector (4 cols) */}
        <div className="xl:col-span-4 flex flex-col space-y-space-md">
          {/* Subnet Detail Dossier Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-border-hairline p-space-md flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 bg-surface-container-low -mx-space-md -mt-space-md p-space-md rounded-t-xl border-b border-border-hairline">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-semibold leading-tight">Selected Subnet Dossier</span>
                  <span className="font-code-sm text-label-sm text-outline">
                    CERT-ID: {selected_dossier?.cert_id || 'PK-ISB-NUST-2024-C3A'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                {selected_dossier?.status || 'VALIDATED'}
              </span>
            </div>

            {/* Center Metadata Card */}
            <div className="flex flex-col space-y-2.5 pt-1">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-outline shrink-0">Target Institution:</span>
                <span className="font-label-md text-label-md font-semibold text-primary text-right">
                  {selectedSubnet.center_name ? selectedSubnet.center_name.split('(')[0] : selected_dossier?.institution}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-outline shrink-0">Facility Lab Room:</span>
                <span className="font-label-md text-label-md text-primary text-right">
                  {selectedSubnet.lab_ref ? `${selectedSubnet.lab_ref} (${selectedSubnet.city_campus})` : selected_dossier?.lab_room}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-outline shrink-0">Designated Authority:</span>
                <span className="font-label-md text-label-md font-semibold text-primary text-right">
                  {selected_dossier?.designated_authority || 'Dr. Tariq Mansoor (Exam Director)'}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-outline shrink-0">Campus Focal Person:</span>
                <span className="font-label-md text-label-md text-primary text-right">
                  {selected_dossier?.campus_focal_person || 'Engr. Salman Farooq (Lead NetEng)'}
                </span>
              </div>
            </div>

            <div className="h-px bg-border-hairline w-full"></div>

            {/* Cryptographic & Network Parameters Scaffolding */}
            <div className="flex flex-col space-y-3">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Security & Network Invariants</span>
              <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col space-y-1 font-code-sm text-label-sm border border-border-hairline">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Allowed Host Bounds:</span>
                  <span className="font-semibold text-primary">{selected_dossier?.allowed_hosts || '111.68.96.12 — 111.68.96.254'}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subnet Mask / Bitcount:</span>
                  <span className="font-semibold text-primary">{selected_dossier?.subnet_mask || '255.255.255.0 (/24)'}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Observed Perimeter NAT:</span>
                  <span className="font-semibold text-secondary">{selected_dossier?.bidirectional_nat || '111.68.96.14 [PERN Match]'}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>SSL Gateway Pinning:</span>
                  <span className="font-semibold text-secondary">{selected_dossier?.ssl_gateway_pinning || 'Port 8443 (Pinned TLS 1.3)'}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Biometric Sync State:</span>
                  <span className="font-semibold text-secondary">{selected_dossier?.biometric_sync_cluster || 'Active (0ms drift)'}</span>
                </div>
              </div>
            </div>

            {/* Emergency Terminal Provisioning Directive */}
            <div className="p-3 rounded-lg bg-surface-container-high/60 flex flex-col space-y-1.5 border border-border-hairline">
              <div className="flex items-center gap-1.5 text-primary font-headline-md text-body-sm font-semibold">
                <span className="material-symbols-outlined text-[16px] text-secondary">shield_locked</span>
                <span>Emergency Hot-Swap Protocol</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Strict 1-to-1 workstation MAC binding. Replacing a malfunctioning terminal requires the Chief Center Superintendent to execute biometric dual-authorization before new NIC activation.
              </p>
            </div>

            {/* Operational Action Button Triggers */}
            <div className="flex flex-col space-y-2 pt-2">
              <button
                onClick={() => handleAction("Authorized temporary hot-spare terminal with SHA-256 MAC re-binding.")}
                className="w-full py-2 px-3 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-medium shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>Authorize Temporary Hot-Spare</span>
              </button>
              <button
                onClick={() => handleAction("Downloaded X.509 Cryptographic Certificate for the active subnet.")}
                className="w-full py-2 px-3 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5 border border-border-hairline"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Download Cryptographic Certificate</span>
              </button>
              <button
                onClick={() => handleAction("WARNING: Network isolation trigger sent to router BGP daemon.")}
                className="w-full py-2 px-3 rounded-lg bg-surface-container-low text-error font-label-md text-label-md font-medium hover:bg-error-container hover:text-on-error-container transition-all flex items-center justify-center gap-1.5 border border-error/20"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">power_off</span>
                <span>Trigger Immediate Network Isolation</span>
              </button>
            </div>
          </div>

          {/* Live Subnet Telemetry & Audit Activity Log */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-border-hairline p-space-md flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">history_edu</span>
                <span className="font-headline-md text-headline-md text-primary font-semibold">Network Audit Ledger</span>
              </div>
              <span className="font-code-sm text-label-sm text-outline">Real-time Stream</span>
            </div>
            {/* Timeline Items */}
            <div className="flex flex-col space-y-3 pt-1">
              {ledger.map((item: any) => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color === 'secondary' ? 'bg-secondary' : 'bg-primary'}`}></span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-code-sm text-label-sm text-outline font-semibold">{item.time}</span>
                      <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded bg-surface-container-low text-primary">
                        {item.tag}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium mt-0.5">
                      {item.text}
                    </span>
                    <span className="font-code-sm text-label-sm text-outline">{item.ref}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Capacity Bars */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-border-hairline p-space-md flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-headline-md text-primary font-semibold">Regional Lab Workstation Capacity</span>
              <span className="font-code-sm text-label-sm text-outline">Total: 6,412 Seats</span>
            </div>
            <div className="flex flex-col space-y-2.5 pt-1">
              {regional_capacity.map((reg: any, i: number) => (
                <div key={i} className="flex flex-col space-y-1">
                  <div className="flex justify-between text-body-sm font-medium text-on-surface">
                    <span>{reg.zone} ({reg.labs} Labs)</span>
                    <span className="font-code-sm">{reg.seats} seats ({reg.pct}%)</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${reg.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
