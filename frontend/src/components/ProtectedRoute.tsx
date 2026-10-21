import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from '../api/client';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';
import { CandidateLayout } from '../layouts/CandidateLayout';

interface SuperAdminRouteProps {
  currentUser: User | null;
  loading: boolean;
  onLogout: () => void;
  onRoleChanged: () => void;
  children: React.ReactNode;
}

export const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({
  currentUser,
  loading,
  onLogout,
  onRoleChanged,
  children,
}) => {
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-label-md text-on-surface-variant font-medium">
          Verifying Statutory Super Administrator Privileges...
        </span>
      </div>
    );
  }

  // If user is unauthenticated, redirect directly to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict role check: Only SUPER_ADMIN may enter
  const role = currentUser.profile?.role;
  if (role !== 'SUPER_ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <SuperAdminLayout
      currentUser={currentUser}
      onLogout={onLogout}
      onRoleChanged={onRoleChanged}
    >
      {children}
    </SuperAdminLayout>
  );
};

interface CandidateRouteProps {
  currentUser: User | null;
  loading: boolean;
  onLogout: () => void;
  onRoleChanged: () => void;
  children: React.ReactNode;
}

export const CandidateRoute: React.FC<CandidateRouteProps> = ({
  currentUser,
  loading,
  onLogout,
  onRoleChanged,
  children,
}) => {
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-label-md text-on-surface-variant font-medium">
          Loading Candidate Dossier...
        </span>
      </div>
    );
  }

  // Unauthenticated users go to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <CandidateLayout
      currentUser={currentUser}
      onLogout={onLogout}
      onRoleChanged={onRoleChanged}
    >
      {children}
    </CandidateLayout>
  );
};
