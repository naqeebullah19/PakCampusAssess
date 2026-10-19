import React, { useState, useEffect } from 'react';
import { pakCampusApi } from '../api/client';

export const SeatAllocationConsole: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorkstation, setSelectedWorkstation] = useState<string>('WS-18');
  const [filterTab, setFilterTab] = useState<'all' | 'today' | 'roster' | 'special'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCycle, setSelectedCycle] = useState('UG 2027-A');
  const [selectedCategory, setSelectedCategory] = useState('All Tests');
  const [selectedHub, setSelectedHub] = useState('All Hubs');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await pakCampusApi.getSeatAllocationData();
        setData(res.data || res);
      } catch (err) {
        console.warn('Using local fallback for Seat Allocation Console', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Workstation mapping grid rows
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const rowSeatMap: Record<string, { num: string; code: string; type: 'regular' | 'special' | 'spare' | 'hold'; candidate?: string; cnic?: string }[]> = {
    A: [
      { num: 'WS-01', code: '#01004', type: 'special' },
      { num: 'WS-02', code: '#01012', type: 'regular' },
      { num: 'WS-03', code: '#01018', type: 'regular' },
      { num: 'WS-04', code: '#01021', type: 'regular' },
      { num: 'WS-05', code: 'SPARE', type: 'spare' },
      { num: 'WS-06', code: '#01029', type: 'regular' },
      { num: 'WS-07', code: '#01033', type: 'regular' },
      { num: 'WS-08', code: '#01039', type: 'regular' },
      { num: 'WS-09', code: '#01045', type: 'regular' },
      { num: 'WS-10', code: '#01048', type: 'regular' },
    ],
    B: [
      { num: 'WS-11', code: '#01050', type: 'regular' },
      { num: 'WS-12', code: '#01055', type: 'regular' },
      { num: 'WS-13', code: '#01062', type: 'regular' },
      { num: 'WS-14', code: '#01068', type: 'regular' },
      { num: 'WS-15', code: 'HOLD', type: 'hold' },
      { num: 'WS-16', code: '#01074', type: 'regular' },
      { num: 'WS-17', code: '#01080', type: 'regular' },
      { num: 'WS-18', code: '#01052', type: 'regular', candidate: 'Ayesha Siddiqui', cnic: '61101-*******-4' },
      { num: 'WS-19', code: '#01089', type: 'regular' },
      { num: 'WS-20', code: '#01094', type: 'regular' },
    ],
    C: [
      { num: 'WS-21', code: '#01102', type: 'regular' },
      { num: 'WS-22', code: '#01108', type: 'regular' },
      { num: 'WS-23', code: '#01114', type: 'special' },
      { num: 'WS-24', code: '#01120', type: 'regular' },
      { num: 'WS-25', code: 'SPARE', type: 'spare' },
      { num: 'WS-26', code: '#01131', type: 'regular' },
      { num: 'WS-27', code: '#01135', type: 'regular' },
      { num: 'WS-28', code: '#01140', type: 'regular' },
      { num: 'WS-29', code: '#01145', type: 'regular' },
      { num: 'WS-30', code: '#01150', type: 'regular' },
    ],
    D: [
      { num: 'WS-31', code: '#01152', type: 'regular' },
      { num: 'WS-32', code: '#01156', type: 'regular' },
      { num: 'WS-33', code: '#01160', type: 'regular' },
      { num: 'WS-34', code: '#01165', type: 'regular' },
      { num: 'WS-35', code: 'SPARE', type: 'spare' },
      { num: 'WS-36', code: '#01170', type: 'regular' },
      { num: 'WS-37', code: '#01174', type: 'regular' },
      { num: 'WS-38', code: '#01178', type: 'regular' },
      { num: 'WS-39', code: '#01182', type: 'regular' },
      { num: 'WS-40', code: '#01187', type: 'regular' },
    ],
    E: [
      { num: 'WS-41', code: '#01190', type: 'regular' },
      { num: 'WS-42', code: '#01195', type: 'regular' },
      { num: 'WS-43', code: '#01201', type: 'regular' },
      { num: 'WS-44', code: 'HOLD', type: 'hold' },
      { num: 'WS-45', code: 'SPARE', type: 'spare' },
      { num: 'WS-46', code: '#01208', type: 'regular' },
      { num: 'WS-47', code: '#01213', type: 'regular' },
      { num: 'WS-48', code: '#01219', type: 'regular' },
      { num: 'WS-49', code: '#01224', type: 'regular' },
      { num: 'WS-50', code: '#01230', type: 'regular' },
    ],
  };

  const sessions = data?.sessions || [
    {
      id: 'EX-2027-0104',
      title: 'ECAT-CS Morning Batch',
      center: 'NUST Islamabad',
      lab: 'Lab C3A + SEECS Hall',
      date: 'Feb 18, 2027',
      time: '09:00 - 11:00 AM (Rep: 08:15)',
      capacity: '250/250',
      percent: '100%',
      invigilator: 'Prof. Haris Munir',
      dept: 'SEECS Computing',
      status: 'Sealed',
      selected: true,
    },
    {
      id: 'EX-2027-0105',
      title: 'MDCAT Standard Slot 1',
      center: 'KEMU Lahore',
      lab: 'Auditorium Labs 1 & 2',
      date: 'Feb 19, 2027',
      time: '10:00 - 01:30 PM (Rep: 09:00)',
      capacity: '320/320',
      percent: '100%',
      invigilator: 'Dr. Shahida Parveen',
      dept: 'KEMU Academic',
      status: 'Pre-Synced',
      selected: false,
    },
    {
      id: 'EX-2027-0106',
      title: 'B-NAT Business Analytics',
      center: 'IBA Karachi',
      lab: 'City Campus Lab 1',
      date: 'Feb 20, 2027',
      time: '02:00 - 04:30 PM (Rep: 01:15)',
      capacity: '185/200',
      percent: '92.5%',
      invigilator: 'Dr. Zeeshan Haider',
      dept: 'Dean Computer Sci',
      status: 'Allocation Open',
      selected: false,
    },
    {
      id: 'EX-2027-0107',
      title: 'G-CAT General Science',
      center: 'UET Peshawar',
      lab: 'Main Computer Center Lab 02',
      date: 'Feb 21, 2027',
      time: '09:00 - 11:30 AM (Rep: 08:30)',
      capacity: '140/150',
      percent: '93.3%',
      invigilator: 'Engr. Kamran Khan',
      dept: 'UET Faculty Ops',
      status: 'Allocation Open',
      selected: false,
    },
    {
      id: 'EX-2027-0108',
      title: 'ECAT-CS Afternoon Slot',
      center: 'NED Karachi',
      lab: 'IT Center Hall A',
      date: 'Feb 22, 2027',
      time: '02:00 - 04:00 PM (Rep: 01:15)',
      capacity: '280/280',
      percent: '100%',
      invigilator: 'Prof. Asim Farooq',
      dept: 'NED Engineering',
      status: 'Sealed',
      selected: false,
    },
  ];

  return (
    <div className="w-full flex flex-col font-body-md text-body-md text-on-surface">
      {/* Top Context Header & Actions Bar */}
      <div className="flex flex-col gap-space-xs pb-space-lg">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
          <span className="hover:text-primary transition-colors cursor-pointer">PakCampusAssess</span>
          <span className="text-outline-variant">/</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Examination Ops</span>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-semibold">Sessions &amp; Seat Allocation</span>
        </div>

        {/* Title & Primary Control CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-1">
          <div className="max-w-3xl">
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
              Examination Sessions &amp; Candidate Seat Allocation Management
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
              Coordinate test cycles, laboratory capacity schedules, automated seat mapping, and invigilator rosters across 42 nationwide CBT centers.
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-space-sm self-start lg:self-center shrink-0">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md hover:bg-surface-container transition-all shadow-sm border border-outline-variant/30" type="button">
              <span className="material-symbols-outlined text-[18px] text-outline">file_download</span>
              <span>Export Capacity Report</span>
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md hover:bg-surface-container transition-all shadow-sm border border-outline-variant/30" type="button">
              <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
              <span>Automated Batch Allocation</span>
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container active:bg-primary transition-all shadow-sm" type="button">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Schedule New Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Scheduled Sessions</span>
            <span className="p-1 rounded-full bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[18px]">event_note</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">18 Active Sessions</div>
            <div className="flex items-center gap-1 text-on-surface-variant font-code-sm text-label-sm mt-0.5">
              <span>Cycle 2027-A</span>
              <span className="text-outline">·</span>
              <span>42 CBT Centers</span>
            </div>
          </div>
          <div className="mt-3 pt-2 bg-surface-container-low/50 -mx-space-md -mb-space-md px-space-md py-1.5 flex items-center justify-between text-secondary font-label-sm text-label-sm">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>All Centers Live</span>
            <span className="font-code-sm font-semibold">100% Online</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Seat Capacity Allocated</span>
            <span className="p-1 rounded-full bg-secondary-container/50 text-secondary">
              <span className="material-symbols-outlined text-[18px]">event_seat</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">6,412</span>
              <span className="font-label-md text-label-md text-on-surface-variant">/ 6,800 Seats</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-secondary h-full rounded-full" style={{ width: '94.3%' }}></div>
            </div>
          </div>
          <div className="mt-3 pt-2 bg-surface-container-low/50 -mx-space-md -mb-space-md px-space-md py-1.5 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span className="font-semibold text-primary">94.3% Booked</span>
            <span className="font-code-sm text-secondary font-semibold">388 Spare/Buffer</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Invigilation Roster</span>
            <span className="p-1 rounded-full bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">142 / 142</div>
            <div className="text-on-surface-variant font-label-md text-label-md mt-0.5">Examiners Confirmed</div>
          </div>
          <div className="mt-3 pt-2 bg-surface-container-low/50 -mx-space-md -mb-space-md px-space-md py-1.5 flex items-center justify-between text-secondary font-label-sm text-label-sm">
            <span className="flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">fingerprint</span> Biometric Synced
            </span>
            <span className="font-code-sm font-semibold">100% Ready</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Conflicts &amp; Holds</span>
            <span className="p-1 rounded-full bg-secondary-container/40 text-secondary">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="font-headline-lg text-headline-lg font-bold text-secondary tracking-tight">0 Unresolved</div>
            <div className="text-on-surface-variant font-label-md text-label-md mt-0.5">No Collisions Detected</div>
          </div>
          <div className="mt-3 pt-2 bg-surface-container-low/50 -mx-space-md -mb-space-md px-space-md py-1.5 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span className="font-code-sm">3 Special Accommodations</span>
            <span className="px-1.5 py-0.2 rounded bg-surface-container font-semibold text-primary text-[10px]">ROUTED</span>
          </div>
        </div>
      </div>

      {/* Main Institutional Workspace Grid (68% Left Main Workspace, 32% Right Detail Drawer) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT MAIN WORKSPACE: 68% (xl:col-span-8) */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg">
          {/* Filter Bar & Quick Category Tabs */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            {/* Quick State Filter Tabs */}
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-medium shrink-0 flex items-center gap-2 transition-all ${
                  filterTab === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                }`}
                type="button"
              >
                <span>All Active Sessions</span>
                <span className={`px-1.5 py-0.5 rounded font-code-sm text-label-sm ${filterTab === 'all' ? 'bg-surface-container-lowest/20' : 'bg-surface-container'}`}>18</span>
              </button>
              <button
                onClick={() => setFilterTab('today')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-medium shrink-0 flex items-center gap-2 transition-all ${
                  filterTab === 'today' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                }`}
                type="button"
              >
                <span>Today's Batches</span>
                <span className={`px-1.5 py-0.5 rounded font-code-sm text-label-sm ${filterTab === 'today' ? 'bg-surface-container-lowest/20' : 'bg-surface-container'}`}>6</span>
              </button>
              <button
                onClick={() => setFilterTab('roster')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-medium shrink-0 flex items-center gap-2 transition-all ${
                  filterTab === 'roster' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                }`}
                type="button"
              >
                <span>Awaiting Roster Sign-Off</span>
                <span className={`px-1.5 py-0.5 rounded font-code-sm text-label-sm ${filterTab === 'roster' ? 'bg-surface-container-lowest/20' : 'bg-surface-container'}`}>2</span>
              </button>
              <button
                onClick={() => setFilterTab('special')}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md font-medium shrink-0 flex items-center gap-2 transition-all ${
                  filterTab === 'special' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                }`}
                type="button"
              >
                <span>Special Accommodations</span>
                <span className={`px-1.5 py-0.5 rounded font-code-sm text-label-sm ${filterTab === 'special' ? 'bg-surface-container-lowest/20' : 'bg-surface-container'}`}>3</span>
              </button>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm pt-1">
              <div className="md:col-span-4 relative flex items-center">
                <span className="material-symbols-outlined text-[18px] absolute left-3 text-outline">search</span>
                <input
                  className="w-full pl-9 pr-3 py-2 bg-surface-container-low text-on-surface rounded-lg font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all placeholder:text-outline"
                  placeholder="Search Session ID, Center, Test Code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                />
              </div>
              <div className="md:col-span-2">
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                  className="w-full px-2.5 py-2 bg-surface-container-low text-primary rounded-lg font-label-md text-label-md focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>UG 2027-A</option>
                  <option>UG 2027-B</option>
                  <option>Postgrad 2027</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-2.5 py-2 bg-surface-container-low text-primary rounded-lg font-label-md text-label-md focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>All Tests</option>
                  <option>ECAT-CS</option>
                  <option>MDCAT</option>
                  <option>B-NAT</option>
                  <option>G-CAT</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="w-full px-2.5 py-2 bg-surface-container-low text-primary rounded-lg font-label-md text-label-md focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>All Hubs</option>
                  <option>Islamabad</option>
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Peshawar</option>
                  <option>Quetta</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-2.5 py-2 bg-surface-container-low text-primary rounded-lg font-label-md text-label-md focus:outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>All Statuses</option>
                  <option>Roster Sealed</option>
                  <option>In-Progress</option>
                  <option>Allocation Open</option>
                </select>
              </div>
            </div>
          </div>

          {/* Master Schedule Table Section */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col border border-outline-variant/20">
            <div className="p-space-md flex items-center justify-between bg-surface-container-low/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">Master Session Timetable</span>
                <span className="font-code-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Cycle 2027-A</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Reload Roster Table" type="button">
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
                <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Filter Columns" type="button">
                  <span className="material-symbols-outlined text-[18px]">view_column</span>
                </button>
              </div>
            </div>

            {/* Table Responsive Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="h-10 bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="px-space-md">Session Ref &amp; Category</th>
                    <th className="px-space-md">Center &amp; Laboratory</th>
                    <th className="px-space-md">Date &amp; Window</th>
                    <th className="px-space-md">Capacity &amp; Fill</th>
                    <th className="px-space-md">Chief Invigilator</th>
                    <th className="px-space-md">Status</th>
                    <th className="px-space-md text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0">
                  {sessions.map((s: any, idx: number) => (
                    <tr
                      key={s.id || idx}
                      className={`h-14 transition-colors ${
                        s.selected ? 'bg-surface-container-low/60 hover:bg-surface-container-low' : 'bg-surface-container-lowest hover:bg-surface-container-low/40'
                      }`}
                    >
                      <td className="px-space-md py-2">
                        <div className="flex items-center gap-2">
                          {s.selected && <span className="w-1.5 h-7 rounded-full bg-secondary"></span>}
                          <div className={`flex flex-col ${!s.selected ? 'pl-3.5' : ''}`}>
                            <span className="font-code-sm text-label-md font-bold text-primary">{s.id}</span>
                            <span className={`font-label-sm text-label-sm ${s.selected ? 'text-secondary font-medium' : 'text-on-surface-variant'}`}>{s.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-space-md py-2">
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md font-semibold text-primary">{s.center}</span>
                          <span className="font-body-sm text-on-surface-variant text-[12px]">{s.lab}</span>
                        </div>
                      </td>
                      <td className="px-space-md py-2">
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-primary">{s.date}</span>
                          <span className="font-code-sm text-label-sm text-on-surface-variant">{s.time}</span>
                        </div>
                      </td>
                      <td className="px-space-md py-2">
                        <div className="flex flex-col w-32">
                          <div className="flex justify-between font-code-sm text-label-sm">
                            <span className="font-bold text-primary">{s.capacity}</span>
                            <span className={s.percent === '100%' ? 'text-secondary font-semibold' : 'text-on-surface-variant'}>{s.percent}</span>
                          </div>
                          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-1">
                            <div className={`${s.percent === '100%' ? 'bg-secondary' : 'bg-primary'} h-full`} style={{ width: s.percent }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-space-md py-2">
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-primary">{s.invigilator}</span>
                          <span className="font-code-sm text-label-sm text-on-surface-variant">{s.dept}</span>
                        </div>
                      </td>
                      <td className="px-space-md py-2">
                        {s.status === 'Sealed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Sealed
                          </span>
                        )}
                        {s.status === 'Pre-Synced' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[13px] text-secondary">fingerprint</span> Pre-Synced
                          </span>
                        )}
                        {s.status === 'Allocation Open' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                            Allocation Open
                          </span>
                        )}
                      </td>
                      <td className="px-space-md py-2 text-right">
                        <button
                          className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-medium transition-all ${
                            s.selected ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface-container text-primary hover:bg-surface-container-high'
                          }`}
                          type="button"
                        >
                          {s.selected ? 'Active Lab Map' : 'Manage Seats'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer */}
            <div className="px-space-md py-3 bg-surface-container-lowest flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant border-t border-outline-variant/10">
              <span>Showing <strong>1-5</strong> of 18 scheduled sessions</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-surface-container text-primary font-medium disabled:opacity-50" disabled type="button">Previous</button>
                <span className="px-2 py-1 rounded bg-primary text-on-primary font-code-sm">1</span>
                <button className="px-2 py-1 rounded bg-surface-container text-primary font-medium hover:bg-surface-container-high" type="button">2</button>
                <button className="px-2 py-1 rounded bg-surface-container text-primary font-medium hover:bg-surface-container-high" type="button">3</button>
                <button className="px-2 py-1 rounded bg-surface-container text-primary font-medium hover:bg-surface-container-high" type="button">Next</button>
              </div>
            </div>
          </div>

          {/* WORKSTATION SEAT VISUALIZER: Selected Lab C3A (Interactive Floorplan Grid) */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            {/* Visualizer Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-secondary">grid_on</span>
                  <h2 className="font-headline-md text-headline-md text-primary font-bold">
                    Session EX-2027-0104: Lab C3A Real-Time Workstation Seat Map
                  </h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  NUST SEECS Hall Array • 250 Terminals Total (Previewing Rows A through E • Cluster 1)
                </p>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-code-sm text-label-sm text-outline mr-2">Zoom: 100%</span>
                <button className="p-1 rounded bg-surface-container-low text-primary hover:bg-surface-container" title="Zoom in" type="button">
                  <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                </button>
                <button className="p-1 rounded bg-surface-container-low text-primary hover:bg-surface-container" title="Zoom out" type="button">
                  <span className="material-symbols-outlined text-[16px]">zoom_out</span>
                </button>
                <button className="p-1 rounded bg-surface-container-low text-primary hover:bg-surface-container" title="Reset layout" type="button">
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                </button>
              </div>
            </div>

            {/* Legend Ribbon */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-2.5 rounded-lg bg-surface-container-low/60 font-label-sm text-label-sm text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-primary"></span>
                <span>Allocated &amp; Biometric Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-secondary-container"></span>
                <span>Spare / Buffer Terminal (Failover)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-primary-fixed"></span>
                <span>Special Accommodation (Priority)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-surface-container-highest"></span>
                <span>Hot-Spare Offline Hold</span>
              </div>
              <div className="ml-auto flex items-center gap-1 text-secondary font-code-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Grid Integrity Certified</span>
              </div>
            </div>

            {/* CBT Workstation Matrix (50 Seat Dense Viewport) */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[700px] flex flex-col gap-2 p-3 bg-surface-container-low rounded-lg">
                {/* Front of Exam Hall Marker */}
                <div className="w-full py-1.5 mb-1 bg-surface-container text-center rounded text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">podium</span>
                  <span>Front of Hall • Invigilator Dais &amp; Biometric Gateway Alpha</span>
                </div>

                {/* Rows A through E */}
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="font-code-sm text-label-sm font-bold text-outline w-6 text-center">{row}</span>
                    <div className="grid grid-cols-10 gap-1.5 flex-1">
                      {rowSeatMap[row].map((seat) => {
                        const isSelected = selectedWorkstation === seat.num;

                        if (isSelected) {
                          return (
                            <div
                              key={seat.num}
                              onClick={() => setSelectedWorkstation(seat.num)}
                              className="p-1.5 rounded bg-secondary text-on-secondary shadow-md ring-2 ring-primary cursor-pointer transition-all flex flex-col items-center justify-between text-center scale-105"
                              title={`Active Focus: Workstation C3A-${seat.num} (Ayesha Siddiqui)`}
                            >
                              <span className="font-code-sm text-[10px] font-bold text-secondary-container">{seat.num}</span>
                              <span className="material-symbols-outlined text-[14px] text-secondary-container animate-pulse">check_circle</span>
                              <span className="font-code-sm text-[9px] font-bold text-white truncate w-full">{seat.code}</span>
                            </div>
                          );
                        }

                        if (seat.type === 'special') {
                          return (
                            <div
                              key={seat.num}
                              onClick={() => setSelectedWorkstation(seat.num)}
                              className="p-1.5 rounded bg-primary-fixed hover:bg-inverse-primary cursor-pointer transition-all flex flex-col items-center justify-between text-center"
                              title={`${seat.num} - Special Desk`}
                            >
                              <span className="font-code-sm text-[10px] font-bold text-on-primary-fixed">{seat.num}</span>
                              <span className="material-symbols-outlined text-[13px] text-on-primary-fixed">accessible</span>
                              <span className="font-code-sm text-[9px] text-on-primary-fixed truncate w-full">{seat.code}</span>
                            </div>
                          );
                        }

                        if (seat.type === 'spare') {
                          return (
                            <div
                              key={seat.num}
                              onClick={() => setSelectedWorkstation(seat.num)}
                              className="p-1.5 rounded bg-secondary-container hover:bg-secondary-fixed cursor-pointer transition-all flex flex-col items-center justify-between text-center"
                              title="Spare Hot Terminal"
                            >
                              <span className="font-code-sm text-[10px] font-bold text-on-secondary-container">{seat.num}</span>
                              <span className="material-symbols-outlined text-[13px] text-secondary">tune</span>
                              <span className="font-code-sm text-[9px] text-secondary font-semibold">SPARE</span>
                            </div>
                          );
                        }

                        if (seat.type === 'hold') {
                          return (
                            <div
                              key={seat.num}
                              onClick={() => setSelectedWorkstation(seat.num)}
                              className="p-1.5 rounded bg-surface-container-highest cursor-pointer transition-all flex flex-col items-center justify-between text-center"
                              title="Reserved Hot-Spare"
                            >
                              <span className="font-code-sm text-[10px] font-bold text-on-surface-variant">{seat.num}</span>
                              <span className="material-symbols-outlined text-[13px] text-outline">dns</span>
                              <span className="font-code-sm text-[9px] text-outline font-semibold">HOLD</span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={seat.num}
                            onClick={() => setSelectedWorkstation(seat.num)}
                            className="p-1.5 rounded bg-primary text-on-primary hover:bg-primary-container cursor-pointer transition-all flex flex-col items-center justify-between text-center"
                          >
                            <span className="font-code-sm text-[10px] text-surface-container">{seat.num}</span>
                            <span className="material-symbols-outlined text-[13px] text-secondary-container">desktop_windows</span>
                            <span className="font-code-sm text-[9px] text-outline-variant truncate w-full">{seat.code}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Hall Back Exit Bar */}
                <div className="w-full py-1 bg-surface-container-highest/60 text-center rounded text-outline font-label-sm text-label-sm uppercase tracking-widest text-[10px] mt-1">
                  Rear Access Corridor • Exit Turnstiles Bravo &amp; Charlie (Rows F-Z in Cluster 2)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT DETAIL DRAWER: 32% (xl:col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-space-lg">
          {/* Panel 1: Candidate Allocation Dossier */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-2 bg-surface-container-low -mx-space-md -mt-space-md p-space-md rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">how_to_reg</span>
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block font-semibold">Desk Inspector</span>
                  <span className="font-headline-md text-headline-md text-primary font-bold">Workstation C3A-{selectedWorkstation}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                OCCUPIED
              </span>
            </div>

            {/* Candidate Identity & Card */}
            <div className="flex items-start gap-space-sm pt-1">
              <img
                className="w-14 h-16 rounded object-cover shadow-sm bg-surface-container ring-1 ring-surface-container-highest"
                alt="Ayesha Siddiqui"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCoeYTNR4IxsqNWhXdPeMyqRrM_Hr66mos4YgP44kwA-62Hg7NykiMiGLVVE05J2_I2JhpSaInk2w2aCXXGSjm5l--z_P-lEGrCUFrN2_YDDFAiTcEw6zfpbAgiQszeRZuwse580e2Odr9sebGHJGQsxhHMVHA8OPGuPSyf_UvGQ2auohHxFne2lt7J-t-LZxVVMGePMfV-_gS_YD0ZkENB7FrS91vwpWZEnWalOmm7k1ApPjRRARylQ"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-headline-md text-headline-md text-primary font-bold truncate">Ayesha Siddiqui</span>
                <div className="flex items-center gap-1 font-code-sm text-label-sm text-on-surface-variant mt-0.5">
                  <span>Roll:</span>
                  <span className="font-bold text-primary">CA-2027-01052</span>
                </div>
                <span className="font-code-sm text-label-sm text-outline">CNIC: 61101-*******-4</span>
              </div>
            </div>

            {/* Technical Specification Metadata Table */}
            <div className="flex flex-col gap-2 font-body-sm text-body-sm bg-surface-container-low p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Exam Track:</span>
                <span className="font-semibold text-primary">Pre-Engineering / ECAT-CS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Desk Hardware:</span>
                <span className="text-primary font-code-sm text-label-sm">Standard Right-Hand (1080p)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">HSM Card Reader:</span>
                <span className="text-secondary font-code-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active &amp; Ready
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Biometric Status:</span>
                <span className="text-secondary font-code-sm text-label-sm font-semibold">NADRA-8492019-PK</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Admit Slip Token:</span>
                <span className="text-on-surface font-code-sm text-label-sm">Dispatched Feb 02, 2027</span>
              </div>
            </div>

            {/* Candidate Actions Toolbar */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5" type="button">
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  <span>Swap Workstation</span>
                </button>
                <button className="px-3 py-2 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5" type="button">
                  <span className="material-symbols-outlined text-[16px]">transfer_within_a_station</span>
                  <span>Reallocate</span>
                </button>
              </div>
              <button className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-1.5" type="button">
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Candidate Exam Dossier Slip</span>
              </button>
            </div>
          </div>

          {/* Panel 2: Automated Allocation Invariants */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center gap-2 pb-1">
              <span className="material-symbols-outlined text-[20px] text-primary">gavel</span>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">Algorithmic Seat Invariants</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Strict deterministic constraints enforced by the automated central allocation daemon prior to roster sealing:
            </p>
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-start gap-2.5 p-2.5 rounded bg-surface-container-low">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">shuffle</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-primary">Randomized Dispersion</span>
                  <span className="font-body-sm text-on-surface-variant text-[12px] leading-tight mt-0.5">
                    Students from the same secondary college or intermediate board are dispersed ≥3 physical terminals apart.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded bg-surface-container-low">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">shield</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-primary">Failover Buffer Guarantee</span>
                  <span className="font-body-sm text-on-surface-variant text-[12px] leading-tight mt-0.5">
                    Strict minimum of 5% hot-spare terminals reserved in each CBT cluster for zero-delay hardware failover.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded bg-surface-container-low">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">accessible_forward</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-primary">Special Needs Accessibility</span>
                  <span className="font-body-sm text-on-surface-variant text-[12px] leading-tight mt-0.5">
                    Front-row and doorway stations automatically prioritized for documented physical accommodations.
                  </span>
                </div>
              </div>
            </div>
            {/* Cryptographic Audit Hash */}
            <div className="mt-2 p-2 bg-surface-container rounded flex items-center justify-between font-code-sm text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-1 truncate mr-2">
                <span className="material-symbols-outlined text-[14px] text-outline">fingerprint</span>
                <span className="font-semibold text-primary">SHA-256:</span>
                <span className="truncate">7c4e09f1...849a902a</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-secondary font-bold shrink-0">RATIFIED</span>
            </div>
          </div>

          {/* Panel 3: Duty Invigilation Team */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">groups</span>
                <h3 className="font-headline-md text-headline-md text-primary font-bold">Duty Invigilation Team</h3>
              </div>
              <span className="font-code-sm text-label-sm text-secondary font-semibold">5 Personnel</span>
            </div>
            <div className="flex flex-col divide-y divide-surface-container">
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-full bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-[16px]">supervisor_account</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary">Prof. Haris Munir</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Chief Invigilator • Dean Computing</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-secondary" title="Biometric Cleared">verified</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-full bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-[16px]">person_check</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary">4 Lab Attendants &amp; Proctors</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Conflict-of-interest sworn &amp; cleared</span>
                  </div>
                </div>
                <span className="font-code-sm text-label-sm text-secondary font-medium">Synced</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-full bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-[16px]">military_tech</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-primary">Dr. Tariq Mansoor</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Center Superintendent • Director Ops</span>
                  </div>
                </div>
                <span className="font-label-sm text-[10px] uppercase font-bold text-primary bg-surface-container px-1.5 py-0.5 rounded">PRESIDING</span>
              </div>
            </div>
            <div className="p-3 mt-1 rounded-lg bg-secondary-container/40 flex items-center gap-2 text-on-secondary-container">
              <span className="material-symbols-outlined text-[20px] text-secondary">lock_clock</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm font-bold text-secondary uppercase">Payload Sealed &amp; Armored</span>
                <span className="font-body-sm text-[12px] text-primary">Encrypted exam package keys dispatchable T-15 mins.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeatAllocationConsole;
