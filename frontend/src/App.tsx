import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api, User } from './api/client';
import { Navigation } from './components/Navigation';
import { CandidateDashboard } from './views/CandidateDashboard';
import { CandidateProfileView } from './views/CandidateProfile';
import { CandidateAcademicRecordsView } from './views/CandidateAcademicRecords';
import { AvailableTestsDiscovery } from './views/AvailableTestsDiscovery';
import { LiveCBTEngine } from './views/LiveCBTEngine';
import { SuperAdminOverview } from './views/SuperAdminOverview';
import { MeritPolicyEngine } from './views/MeritPolicyEngine';
import { IPAuthorizationConsole } from './views/IPAuthorizationConsole';
import { SeatAllocationConsole } from './views/SeatAllocationConsole';
import { LiveExamMonitoringConsole } from './views/LiveExamMonitoringConsole';
import { UniversityAdmissionsWorkspace } from './views/UniversityAdmissionsWorkspace';
import { FacultyReviewWorkspace } from './views/FacultyReviewWorkspace';
import { QuestionBankRepository } from './views/QuestionBankRepository';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.getCurrentUser();
      setCurrentUser(res.data.user);
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };

  const handleRoleChanged = () => {
    loadUser();
  };

  return (
    <BrowserRouter>
      <Navigation currentUser={currentUser} onRoleChanged={handleRoleChanged}>
        <Routes>
          {/* Candidate Experience */}
          <Route path="/" element={<CandidateDashboard />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfileView />} />
          <Route path="/candidate/academic-records" element={<CandidateAcademicRecordsView />} />
          <Route path="/examinations/available" element={<AvailableTestsDiscovery />} />

          {/* High-Stakes CBT Runner */}
          <Route path="/cbt/workspace" element={<LiveCBTEngine />} />

          {/* Central Ministry & Super Admin */}
          <Route path="/admin/overview" element={<SuperAdminOverview />} />
          <Route path="/admin/question-bank" element={<QuestionBankRepository />} />
          <Route path="/admin/merit-policies" element={<MeritPolicyEngine />} />
          <Route path="/admin/ip-authorization" element={<IPAuthorizationConsole />} />
          <Route path="/admin/examination-sessions" element={<SeatAllocationConsole />} />
          <Route path="/admin/seat-allocation" element={<SeatAllocationConsole />} />
          <Route path="/admin/live-exam-monitoring" element={<LiveExamMonitoringConsole />} />
          <Route path="/admin/live-monitoring" element={<LiveExamMonitoringConsole />} />

          {/* University Admissions & Committee */}
          <Route path="/university/admissions" element={<UniversityAdmissionsWorkspace />} />
          <Route path="/admin/applications-and-verification" element={<UniversityAdmissionsWorkspace />} />
          <Route path="/faculty/reviews" element={<FacultyReviewWorkspace />} />
          <Route path="/admin/merit-lists-and-publication" element={<FacultyReviewWorkspace />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Navigation>
    </BrowserRouter>
  );
};

export default App;
