import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface UserProfile {
  role: string;
  phone_number: string;
  is_verified: boolean;
  institution?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile?: UserProfile;
}

export interface CandidateDashboardData {
  candidate: {
    id: number;
    roll_number: string;
    cnic: string;
    father_name: string;
    nadRA_verification_status: string;
    completion_percentage: number;
    profile_photo_url: string;
    user: User;
  };
  next_examination: {
    title: string;
    code: string;
    session_date: string;
    start_time: string;
    center_name: string;
    desk_number: string;
    has_admit_card: boolean;
  } | null;
  admit_card: any | null;
  registrations_count: number;
  registrations: any[];
  university_applications: {
    institution: string;
    status: string;
    application_number: string;
  }[];
}

export interface CBTQuestion {
  id: number;
  subject: string;
  topic: string;
  difficulty: string;
  question_text: string;
  marks: string;
  options: {
    id: number;
    option_key: string;
    option_text: string;
  }[];
}

export interface CBTActiveAttempt {
  attempt_id: number;
  candidate: {
    name: string;
    roll_number: string;
    cnic: string;
    photo_url: string;
  };
  examination: {
    title: string;
    code: string;
    duration_minutes: number;
    total_marks: number;
    negative_marking: boolean;
  };
  terminal: {
    desk_number: string;
    lab_name: string;
    ip_address: string;
    wal_version: number;
  };
  timing: {
    remaining_seconds: number;
    server_time: string;
  };
  questions: CBTQuestion[];
  saved_answers: Record<number, { selected_option: string; is_flagged: boolean }>;
}

export interface SuperAdminOverviewData {
  kpis: {
    total_candidates: number;
    total_registrations: number;
    active_sessions: number;
    candidates_testing: number;
    completed_attempts: number;
    total_centers: number;
    operational_centers: number;
    open_incidents: number;
  };
  centers: any[];
  recent_incidents: any[];
  audit_logs: any[];
}

export interface MeritPolicy {
  id: number;
  institution_code: string;
  institution_name: string;
  title: string;
  version: string;
  test_weightage: string;
  hssc_weightage: string;
  ssc_weightage: string;
  min_aggregate_threshold: string;
  status: string;
}

export interface UniversityApplicationItem {
  id: number;
  application_number: string;
  candidate_name: string;
  candidate_roll_number: string;
  institution_name: string;
  institution_code: string;
  status: string;
  verification_notes: string;
  preferences: {
    program_name: string;
    preference_order: number;
  }[];
  faculty_reviews: {
    reviewer_name: string;
    recommendation: string;
    evaluation_notes: string;
    academic_evaluation_score: string;
    test_suitability_score: string;
  }[];
}

// API Methods
export const api = {
  // Auth
  getCurrentUser: () => apiClient.get<{ user: User; is_authenticated: boolean }>('/auth/me/'),
  login: (username: string, password?: string) => apiClient.post<{ message: string; user: User; role: string; is_authenticated: boolean }>('/auth/login/', { username, password }),
  logout: () => apiClient.post<{ message: string; is_authenticated: boolean }>('/auth/logout/'),
  switchRole: (role: string) => apiClient.post('/auth/switch-role/', { role }),

  // Candidate
  getCandidateDashboard: () => apiClient.get<CandidateDashboardData>('/candidate/dashboard/'),
  getCandidateProfile: () => apiClient.get('/candidate/profile/'),
  updateCandidateProfile: (data: any) => apiClient.put('/candidate/profile/', data),
  getAcademicRecords: () => apiClient.get('/candidate/academic-records/'),

  // Examinations
  getAvailableExaminations: () => apiClient.get('/examinations/discovery/'),
  registerForExam: (examination_id: number, center_id?: number) => 
    apiClient.post('/examinations/register/', { examination_id, center_id }),

  // CBT Exam Engine
  getCBTAttempt: () => apiClient.get<CBTActiveAttempt>('/cbt/active-attempt/'),
  saveCBTAnswer: (data: { attempt_id: number; question_id: number; selected_option?: string; is_flagged?: boolean }) =>
    apiClient.post('/cbt/save-answer/', data),
  submitCBTExam: (attempt_id: number) => apiClient.post('/cbt/submit/', { attempt_id }),

  // Super Admin - Dedicated Platform Routes
  getSuperAdminOverview: () => apiClient.get<any>('/super-admin/overview/'),
  getSuperAdminExaminations: () => apiClient.get<any>('/super-admin/examinations/'),
  createSuperAdminExamination: (data: any) => apiClient.post('/super-admin/examinations/', data),
  getSuperAdminCategories: () => apiClient.get<any>('/super-admin/exam-categories/'),
  createSuperAdminCategory: (data: any) => apiClient.post('/super-admin/exam-categories/', data),
  getSuperAdminQuestionBank: () => apiClient.get<any>('/super-admin/question-bank/'),
  createSuperAdminQuestion: (data: any) => apiClient.post('/super-admin/question-bank/', data),
  approveSuperAdminQuestion: (question_id: number) => apiClient.post('/super-admin/question-bank/', { action: 'approve', question_id }),
  getSuperAdminExamSessions: () => apiClient.get<any>('/super-admin/exam-sessions/'),
  createSuperAdminExamSession: (data: any) => apiClient.post('/super-admin/exam-sessions/', data),
  getSuperAdminCenters: () => apiClient.get<any>('/super-admin/centers/'),
  createSuperAdminCenter: (data: any) => apiClient.post('/super-admin/centers/', data),
  getSuperAdminUsers: () => apiClient.get<any>('/super-admin/users/'),
  updateCandidateVerification: (candidate_id: number, nadra_status: string) => apiClient.post('/super-admin/users/', { candidate_id, nadra_status }),
  getSuperAdminStaff: () => apiClient.get<any>('/super-admin/staff/'),
  updateStaffRole: (user_id: number, role: string, institution_id?: number) => apiClient.post('/super-admin/staff/', { user_id, role, institution_id }),
  getSuperAdminMonitoring: () => apiClient.get<any>('/super-admin/monitoring/'),
  resolveIncident: (incident_id: number, status: string, resolution_notes?: string) => apiClient.post('/super-admin/monitoring/', { incident_id, status, resolution_notes }),
  getSuperAdminResults: () => apiClient.get<any>('/super-admin/results/'),
  publishResults: (examination_id: number) => apiClient.post('/super-admin/results/', { action: 'publish', examination_id }),
  getSuperAdminUniversities: () => apiClient.get<any>('/super-admin/universities/'),
  createSuperAdminUniversity: (data: any) => apiClient.post('/super-admin/universities/', data),
  getSuperAdminAdmissions: () => apiClient.get<any>('/super-admin/admissions/'),
  updateSuperAdminApplicationStatus: (application_id: number, status: string, verification_notes?: string) => apiClient.post('/super-admin/admissions/', { application_id, status, verification_notes }),
  getSuperAdminReports: () => apiClient.get<any>('/super-admin/reports/'),
  getSuperAdminAuditLogs: () => apiClient.get<any>('/super-admin/audit-logs/'),
  getSuperAdminSettings: () => apiClient.get<any>('/super-admin/settings/'),
  updateSuperAdminSettings: (data: any) => apiClient.post('/super-admin/settings/', data),

  // Merit Policies
  getMeritPolicies: () => apiClient.get<MeritPolicy[]>('/merit/policies/'),
  simulateMeritBatch: (policy_id?: number) => apiClient.post('/merit/simulate/', { policy_id }),

  // University Admissions & Faculty Reviews
  getApplications: () => apiClient.get<UniversityApplicationItem[]>('/admissions/applications/'),
  updateApplicationStatus: (application_id: number, status: string, notes?: string) =>
    apiClient.post('/admissions/update-status/', { application_id, status, notes }),
  submitFacultyReview: (data: { application_id: number; academic_score: number; test_score: number; recommendation: string; notes: string }) =>
    apiClient.post('/faculty/submit-review/', data),

  // Infrastructure & Live Operations Consoles (Legacy & Reference)
  getAdminOverview: () => apiClient.get<SuperAdminOverviewData>('/super-admin/overview/'),
  getIPAuthorizationData: () => apiClient.get<any>('/admin/ip-authorization/'),
  getSeatAllocationData: () => apiClient.get<any>('/admin/seat-allocation/'),
  getLiveMonitoringData: () => apiClient.get<any>('/admin/live-monitoring/'),
  getQuestionBankData: () => apiClient.get<any>('/admin/question-bank/'),
};

export const pakCampusApi = api;


