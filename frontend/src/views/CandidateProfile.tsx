import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const CandidateProfileView: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [showFullCnic, setShowFullCnic] = useState<boolean>(false);

  // Form State
  const [fatherName, setFatherName] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [permAddress, setPermAddress] = useState<string>('');
  const [currAddress, setCurrAddress] = useState<string>('');
  const [emergencyName, setEmergencyName] = useState<string>('');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('');
  const [disability, setDisability] = useState<boolean>(false);
  const [disabilityDetails, setDisabilityDetails] = useState<string>('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getCandidateProfile();
      const p = res.data;
      setProfile(p);
      setFatherName(p.father_name || 'Muhammad Tariq Siddiqui');
      setDistrict(p.domicile_district || 'Rawalpindi');
      setProvince(p.domicile_province || 'Punjab');
      setPermAddress(p.permanent_address || 'House 142, Street 18, Sector F-10/2, Islamabad Capital Territory');
      setCurrAddress(p.current_address || 'House 142, Street 18, Sector F-10/2, Islamabad Capital Territory');
      setEmergencyName(p.emergency_contact_name || 'Muhammad Tariq Siddiqui');
      setEmergencyPhone(p.emergency_contact_phone || '+92 51 5******8');
      setDisability(p.disability_support_required || false);
      setDisabilityDetails(p.disability_details || '');
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);
      const res = await api.updateCandidateProfile({
        father_name: fatherName,
        domicile_district: district,
        domicile_province: province,
        permanent_address: permAddress,
        current_address: currAddress,
        emergency_contact_name: emergencyName,
        emergency_contact_phone: emergencyPhone,
        disability_support_required: disability,
        disability_details: disabilityDetails,
      });
      setProfile(res.data);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Retrieving NADRA Verified Identity...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full font-body-md text-body-md text-on-surface">
      {/* Top Context Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs font-code-sm text-label-sm text-on-surface-variant">
            <span>CANDIDATE DOSSIER</span>
            <span>•</span>
            <span className="text-primary font-semibold">APP-2027-00482</span>
            <span>•</span>
            <span className="text-secondary font-semibold">ROLL: {profile?.roll_number || 'CA-2027-01052'}</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">Candidate Profile &amp; Verification</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Manage your verified personal details, national identity credentials, contact information, and residential address registered for the 2027 academic admissions cycle.
          </p>
        </div>

        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center gap-space-xs shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">edit_square</span>
            <span>{isEditing ? 'Cancel Edit' : 'Edit Editable Fields'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!isEditing || saving}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md transition-all shadow-sm ${
              !isEditing ? 'opacity-40 cursor-not-allowed' : 'hover:bg-secondary/90'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-primary font-label-md text-label-md transition-colors shadow-sm border border-outline-variant/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span className="hidden sm:inline">Print Summary</span>
          </button>
          <button
            onClick={loadProfile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>NADRA Re-verify</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-space-md p-3 bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-label-md font-semibold flex items-center gap-2 border border-secondary/30">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Profile particulars updated and synchronized with national testing database ledger successfully.</span>
        </div>
      )}

      {/* Status Summary Banner */}
      <div className="rounded-xl bg-surface-container-lowest p-space-md mb-space-lg shadow-sm border border-outline-variant/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-start sm:items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-headline-md text-headline-md text-primary font-bold">Identity Verification: NADRA Gateway Cleared</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Tier-1 Authenticated
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 font-code-sm text-label-sm text-on-surface-variant mt-0.5">
                <span>Biometric Stamp: <strong className="text-primary font-medium">12-Jan-2027 14:22:08 PKT</strong></span>
                <span>•</span>
                <span>NADRA Reference: <strong className="text-primary font-medium">ND-8492019-PK</strong></span>
                <span>•</span>
                <span className="text-secondary font-semibold">Live Citizen Sync Valid</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low px-3 py-2 rounded-lg max-w-sm shrink-0 border border-outline-variant/10">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">lock_clock</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                Identity attributes matched against the national citizen registry are locked against unilateral web modification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-space-lg scrollbar-none">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md font-medium shrink-0 transition-colors flex items-center gap-1.5 ${
            activeTab === 'personal' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">person</span>
          <span>Personal Information</span>
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md font-medium shrink-0 transition-colors flex items-center gap-1.5 ${
            activeTab === 'contact' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">contact_mail</span>
          <span>Contact &amp; Address</span>
        </button>
        <button
          onClick={() => setActiveTab('nadra')}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md font-medium shrink-0 transition-colors flex items-center gap-1.5 ${
            activeTab === 'nadra' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">badge</span>
          <span>Identification &amp; NADRA</span>
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md font-medium shrink-0 transition-colors flex items-center gap-1.5 ${
            activeTab === 'emergency' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">contact_emergency</span>
          <span>Emergency Contact</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-xl">
        {/* Left Column: Personal Information & Photograph (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Card 1: Personal Information Card */}
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-sm bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg pt-space-md rounded-t-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">id_card</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">1. Civil &amp; Personal Record</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                Registry Locked
              </span>
            </div>

            {/* Photograph & Core Identity Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-space-md pt-space-xs">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-32 h-40 rounded-lg overflow-hidden bg-surface-container shadow-sm p-1 border border-outline-variant/20">
                  <img
                    alt="Official passport photo of Ayesha Siddiqui"
                    className="w-full h-full object-cover rounded"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCoeYTNR4IxsqNWhXdPeMyqRrM_Hr66mos4YgP44kwA-62Hg7NykiMiGLVVE05J2_I2JhpSaInk2w2aCXXGSjm5l--z_P-lEGrCUFrN2_YDDFAiTcEw6zfpbAgiQszeRZuwse580e2Odr9sebGHJGQsxhHMVHA8OPGuPSyf_UvGQ2auohHxFne2lt7J-t-LZxVVMGePMfV-_gS_YD0ZkENB7FrS91vwpWZEnWalOmm7k1ApPjRRARylQ"
                  />
                </div>
                <div className="mt-2 text-center flex flex-col items-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-label-sm font-semibold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    Approved Photo
                  </span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant mt-0.5">By Central Registrar</span>
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Legal Full Name</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-headline-md text-headline-md text-primary font-bold">{profile?.user?.full_name || 'Ayesha Siddiqui'}</span>
                    <span className="material-symbols-outlined text-[16px] text-secondary" title="Verified against NADRA">lock</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-secondary mt-0.5">Verified Legal Name</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Father's Full Name</span>
                  <div className="flex items-center justify-between mt-1">
                    {isEditing ? (
                      <input
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="bg-white px-2 py-0.5 rounded border border-outline-variant/40 text-primary font-bold text-headline-md w-full"
                      />
                    ) : (
                      <span className="font-headline-md text-headline-md text-primary font-bold">{fatherName}</span>
                    )}
                    <span className="material-symbols-outlined text-[16px] text-secondary" title="Parent Record">lock</span>
                  </div>
                  <span className="font-code-sm text-label-sm text-secondary mt-0.5">Parental Record Synced</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Date of Birth</span>
                  <span className="font-headline-md text-headline-md text-primary font-bold mt-1">14-Aug-2006</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant mt-0.5">Calculated Age: 20 Yrs, 5 Mos</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Gender &amp; Marital</span>
                  <span className="font-headline-md text-headline-md text-primary font-bold mt-1">Female</span>
                  <span className="font-code-sm text-label-sm text-on-surface-variant mt-0.5">Status: Unmarried</span>
                </div>
              </div>
            </div>

            {/* Domicile & Territorial Quota Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Domicile Province</span>
                {isEditing ? (
                  <input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="bg-white px-2 py-1 rounded border border-outline-variant/40 font-bold text-primary text-body-lg mt-1"
                  />
                ) : (
                  <span className="font-headline-md text-body-lg text-primary font-bold mt-1">{province}</span>
                )}
                <span className="font-code-sm text-label-sm text-on-surface-variant">Quota Code: PB-GEN</span>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Domicile District</span>
                {isEditing ? (
                  <input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="bg-white px-2 py-1 rounded border border-outline-variant/40 font-bold text-primary text-body-lg mt-1"
                  />
                ) : (
                  <span className="font-headline-md text-body-lg text-primary font-bold mt-1">{district}</span>
                )}
                <span className="font-code-sm text-label-sm text-on-surface-variant">Attested PRC Attached</span>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Religion / Creed</span>
                <span className="font-headline-md text-body-lg text-primary font-bold mt-1">Islam</span>
                <span className="font-code-sm text-label-sm text-on-surface-variant">Declared on Registry</span>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Details */}
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-sm bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg pt-space-md rounded-t-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">mark_email_read</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">2. Verified Contact Coordinates</span>
              </div>
              <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 2-Factor Auth Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Primary Email Address</label>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low">
                  <span className="font-code-sm text-body-md text-primary font-semibold truncate">{profile?.user?.email || 'ayesha.siddiqui@email.pk'}</span>
                  <span className="inline-flex items-center gap-0.5 font-label-sm text-label-sm text-secondary font-semibold shrink-0">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Verified
                  </span>
                </div>
                <span className="font-body-sm text-label-sm text-on-surface-variant">Direct channel for Admit Card distribution</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Mobile Number (SMS Alert)</label>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low">
                  <span className="font-code-sm text-body-md text-primary font-semibold">+92 300 5******1</span>
                  <span className="inline-flex items-center gap-0.5 font-label-sm text-label-sm text-secondary font-semibold shrink-0">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    OTP Verified
                  </span>
                </div>
                <span className="font-body-sm text-label-sm text-on-surface-variant">Linked to PTA Biometric SIM registry</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Permanent Residential Address</label>
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1">
                {isEditing ? (
                  <input
                    value={permAddress}
                    onChange={(e) => setPermAddress(e.target.value)}
                    className="w-full bg-white px-2 py-1 rounded border border-outline-variant/40 font-body-md text-body-md text-primary font-medium"
                  />
                ) : (
                  <span className="font-body-md text-body-md text-primary font-medium">{permAddress}</span>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-surface-container-highest font-code-sm text-label-sm text-on-surface-variant">
                  <span>Postal / Zip Code: <strong className="text-primary font-bold">44000</strong></span>
                  <span>Police Jurisdiction: Shalimar PS</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Alternate Contact (Father's Number)</label>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low">
                  {isEditing ? (
                    <input
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="bg-white px-2 py-1 rounded border border-outline-variant/40 font-code-sm text-body-md text-primary font-medium w-full"
                    />
                  ) : (
                    <span className="font-code-sm text-body-md text-primary font-medium">{emergencyPhone}</span>
                  )}
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 ml-2">Emergency Backup</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Preferred Exam City Center</label>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low">
                  <span className="font-body-md text-body-md text-primary font-semibold">Islamabad / Rawalpindi (Zone A)</span>
                  <span className="material-symbols-outlined text-[18px] text-secondary">pin_drop</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Identification, NADRA Docs, Special Needs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Card 3: Identification Credentials & Masking Toggle */}
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-sm bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg pt-space-md rounded-t-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">fingerprint</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">3. National ID &amp; NADRA Verification</span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Smart CNIC / B-Form Number</span>
                <button
                  type="button"
                  onClick={() => setShowFullCnic(!showFullCnic)}
                  className="text-secondary font-label-sm text-label-sm font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">{showFullCnic ? 'visibility_off' : 'visibility'}</span>
                  <span>{showFullCnic ? 'Mask' : 'Reveal'}</span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-headline-md font-bold text-primary tracking-wider">
                  {showFullCnic ? (profile?.cnic || '61101-1234567-4') : '61101-*******-4'}
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-code-sm text-label-sm font-semibold">
                  CHIP VERIFIED
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-surface-container-highest font-code-sm text-label-sm text-on-surface-variant">
                <span>Family Tree #: 104-B-99</span>
                <span>Expiry: 14-Aug-2034</span>
              </div>
            </div>

            {/* Special Needs & Accommodations */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">accessible</span>
                  <span className="font-headline-md text-body-md font-bold text-primary">Special Accommodations</span>
                </div>
                <span className="font-code-sm text-label-sm text-on-surface-variant">Central Exam Board</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={disability}
                  onChange={(e) => setDisability(e.target.checked)}
                  disabled={!isEditing}
                  className="mt-1 h-4 w-4 text-secondary rounded focus:ring-secondary cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-semibold text-primary">Request Physical / Visual Disability Accommodation</span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                    Ground-floor lab assignment, screen magnifier, or extra 15 minutes compensatory time per statutory regulations.
                  </span>
                </div>
              </div>
            </div>

            {/* Statutory Legal Declaration */}
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex flex-col gap-2 text-body-sm">
              <div className="flex items-center gap-1.5 text-secondary font-semibold font-label-sm text-label-sm uppercase">
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                <span>Statutory Legal Declaration</span>
              </div>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                I hereby solemnly affirm that all entries made in this profile dossier are true and correct to the best of my knowledge under Section 14 of the Higher Education Ordinance. Any false statement shall render this application null and void.
              </p>
              <div className="flex items-center justify-between text-[11px] font-code-sm text-outline pt-1 border-t border-outline-variant/10">
                <span>Digital Hash: SHA256: 7b2e...9a41</span>
                <span>Ratified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CandidateProfileView;
