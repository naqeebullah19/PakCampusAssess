import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { api, User } from './api/client';
import { SuperAdminRoute, CandidateRoute } from './components/ProtectedRoute';

// Views - Candidate
import { CandidateDashboard } from './views/CandidateDashboard';
import { CandidateProfileView } from './views/CandidateProfile';
import { CandidateAcademicRecordsView } from './views/CandidateAcademicRecords';
import { AvailableTestsDiscovery } from './views/AvailableTestsDiscovery';
import { LiveCBTEngine } from './views/LiveCBTEngine';

// Views - Super Admin
import { SuperAdminOverview } from './views/SuperAdminOverview';
import { SuperAdminExaminations } from './views/SuperAdminExaminations';
import { SuperAdminCategories } from './views/SuperAdminCategories';
import { QuestionBankRepository } from './views/QuestionBankRepository';
import { SeatAllocationConsole } from './views/SeatAllocationConsole';
import { IPAuthorizationConsole } from './views/IPAuthorizationConsole';
import { SuperAdminUsers } from './views/SuperAdminUsers';
import { SuperAdminStaff } from './views/SuperAdminStaff';
import { LiveExamMonitoringConsole } from './views/LiveExamMonitoringConsole';
import { SuperAdminResults } from './views/SuperAdminResults';
import { SuperAdminUniversities } from './views/SuperAdminUniversities';
import { UniversityAdmissionsWorkspace } from './views/UniversityAdmissionsWorkspace';
import { SuperAdminReports } from './views/SuperAdminReports';
import { SuperAdminAuditLogs } from './views/SuperAdminAuditLogs';
import { SuperAdminSettings } from './views/SuperAdminSettings';
import { FacultyReviewWorkspace } from './views/FacultyReviewWorkspace';

// Views - Auth & Access
import { LoginPage } from './views/LoginPage';
import { UnauthorizedPage } from './views/UnauthorizedPage';

export const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await api.getCurrentUser();
      if (res.data.is_authenticated && res.data.user) {
        setCurrentUser(res.data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setCurrentUser(null);
      navigate('/login');
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleRoleChanged = () => {
    loadUser();
  };

  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* CBT Runner Workspace (Full Screen, Minimal Header) */}
      <Route path="/cbt/workspace" element={<LiveCBTEngine />} />

      {/* Candidate Portal Routes (Protected by CandidateRoute & CandidateLayout) */}
      <Route
        path="/dashboard"
        element={
          <CandidateRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <CandidateDashboard />
          </CandidateRoute>
        }
      />
      <Route
        path="/candidate/profile"
        element={
          <CandidateRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <CandidateProfileView />
          </CandidateRoute>
        }
      />
      <Route
        path="/candidate/academic-records"
        element={
          <CandidateRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <CandidateAcademicRecordsView />
          </CandidateRoute>
        }
      />
      <Route
        path="/examinations/available"
        element={
          <CandidateRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <AvailableTestsDiscovery />
          </CandidateRoute>
        }
      />
      <Route path="/candidate/dashboard" element={<Navigate to="/dashboard" replace />} />

      {/* Super Admin Dedicated Routes (Protected by SuperAdminRoute & SuperAdminLayout) */}
      <Route
        path="/super-admin"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminOverview />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/examinations"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminExaminations />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/exam-categories"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminCategories />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/question-bank"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <QuestionBankRepository />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/exam-sessions"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SeatAllocationConsole />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/centers"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <IPAuthorizationConsole />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/users"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminUsers />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/staff"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminStaff />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/monitoring"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <LiveExamMonitoringConsole />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/results"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminResults />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/universities"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminUniversities />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/admissions"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <UniversityAdmissionsWorkspace />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/reports"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminReports />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/audit-logs"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminAuditLogs />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/super-admin/settings"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <SuperAdminSettings />
          </SuperAdminRoute>
        }
      />

      {/* University & Committee Auxiliary Routes */}
      <Route
        path="/university/admissions"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <UniversityAdmissionsWorkspace />
          </SuperAdminRoute>
        }
      />
      <Route
        path="/faculty/reviews"
        element={
          <SuperAdminRoute
            currentUser={currentUser}
            loading={loading}
            onLogout={handleLogout}
            onRoleChanged={handleRoleChanged}
          >
            <FacultyReviewWorkspace />
          </SuperAdminRoute>
        }
      />

      {/* Legacy /admin/* redirects to /super-admin/* */}
      <Route path="/admin/overview" element={<Navigate to="/super-admin" replace />} />
      <Route path="/admin/question-bank" element={<Navigate to="/super-admin/question-bank" replace />} />
      <Route path="/admin/seat-allocation" element={<Navigate to="/super-admin/exam-sessions" replace />} />
      <Route path="/admin/examination-sessions" element={<Navigate to="/super-admin/exam-sessions" replace />} />
      <Route path="/admin/ip-authorization" element={<Navigate to="/super-admin/centers" replace />} />
      <Route path="/admin/live-monitoring" element={<Navigate to="/super-admin/monitoring" replace />} />
      <Route path="/admin/live-exam-monitoring" element={<Navigate to="/super-admin/monitoring" replace />} />

      {/* Root Route Smart Redirection */}
      <Route
        path="/"
        element={
          loading ? (
            <div className="min-h-screen bg-surface flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : currentUser?.profile?.role === 'SUPER_ADMIN' ? (
            <Navigate to="/super-admin" replace />
          ) : currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
