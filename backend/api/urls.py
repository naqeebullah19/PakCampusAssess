from django.urls import path
from api import views

urlpatterns = [
    # Authoritative Auth & Role Management
    path('auth/login/', views.login_user, name='auth-login'),
    path('auth/logout/', views.logout_user, name='auth-logout'),
    path('auth/me/', views.get_current_user, name='auth-me'),
    path('auth/switch-role/', views.switch_active_role, name='auth-switch-role'),

    # Candidate Workspace
    path('candidate/dashboard/', views.get_candidate_dashboard, name='candidate-dashboard'),
    path('candidate/profile/', views.candidate_profile_view, name='candidate-profile'),
    path('candidate/academic-records/', views.candidate_academic_records, name='candidate-academic-records'),

    # Examinations & Registration
    path('examinations/discovery/', views.list_available_examinations, name='examinations-discovery'),
    path('examinations/register/', views.register_for_examination, name='examinations-register'),

    # Authoritative CBT Examination Engine
    path('cbt/active-attempt/', views.get_cbt_active_attempt, name='cbt-active-attempt'),
    path('cbt/save-answer/', views.save_cbt_answer, name='cbt-save-answer'),
    path('cbt/submit/', views.submit_cbt_examination, name='cbt-submit'),

    # Statutory Merit Policy Engine
    path('merit/policies/', views.merit_policies_view, name='merit-policies'),
    path('merit/simulate/', views.simulate_merit_batch, name='merit-simulate'),

    # University Admissions & Faculty Review
    path('admissions/applications/', views.list_university_applications, name='admissions-applications'),
    path('admissions/update-status/', views.update_application_status, name='admissions-update-status'),
    path('faculty/submit-review/', views.submit_faculty_review, name='faculty-submit-review'),

    # Dedicated Super Admin Platform Routes (Strict RBAC: SUPER_ADMIN Only)
    path('super-admin/overview/', views.super_admin_overview, name='super-admin-overview'),
    path('super-admin/examinations/', views.super_admin_examinations, name='super-admin-examinations'),
    path('super-admin/exam-categories/', views.super_admin_exam_categories, name='super-admin-exam-categories'),
    path('super-admin/question-bank/', views.super_admin_question_bank, name='super-admin-question-bank'),
    path('super-admin/exam-sessions/', views.super_admin_exam_sessions, name='super-admin-exam-sessions'),
    path('super-admin/centers/', views.super_admin_centers, name='super-admin-centers'),
    path('super-admin/users/', views.super_admin_users, name='super-admin-users'),
    path('super-admin/staff/', views.super_admin_staff, name='super-admin-staff'),
    path('super-admin/monitoring/', views.super_admin_monitoring, name='super-admin-monitoring'),
    path('super-admin/results/', views.super_admin_results, name='super-admin-results'),
    path('super-admin/universities/', views.super_admin_universities, name='super-admin-universities'),
    path('super-admin/admissions/', views.super_admin_admissions, name='super-admin-admissions'),
    path('super-admin/reports/', views.super_admin_reports, name='super-admin-reports'),
    path('super-admin/audit-logs/', views.super_admin_audit_logs, name='super-admin-audit-logs'),
    path('super-admin/settings/', views.super_admin_settings, name='super-admin-settings'),

    # Dedicated Proctor & Examiner Routes (Strict RBAC & Assignment Isolation)
    path('proctor/overview/', views.proctor_overview, name='proctor-overview'),
    path('proctor/examinations/', views.proctor_examinations, name='proctor-examinations'),
    path('proctor/sessions/', views.proctor_sessions, name='proctor-sessions'),
    path('proctor/sessions/<int:session_id>/', views.proctor_session_detail, name='proctor-session-detail'),
    path('proctor/sessions/<int:session_id>/candidates/', views.proctor_session_candidates, name='proctor-session-candidates'),
    path('proctor/sessions/<int:session_id>/attendance/', views.proctor_session_attendance, name='proctor-session-attendance'),
    path('proctor/sessions/<int:session_id>/monitoring/', views.proctor_session_monitoring, name='proctor-session-monitoring'),
    path('proctor/sessions/<int:session_id>/reports/', views.proctor_session_report, name='proctor-session-report'),
    path('proctor/incidents/', views.proctor_incidents, name='proctor-incidents'),
    path('proctor/incidents/<int:incident_id>/', views.proctor_incident_detail, name='proctor-incident-detail'),
    path('proctor/reports/', views.proctor_reports, name='proctor-reports'),
    path('proctor/notifications/', views.proctor_notifications, name='proctor-notifications'),
    path('proctor/notifications/<int:notification_id>/read/', views.proctor_notification_mark_read, name='proctor-notification-mark-read'),
    path('proctor/centers/', views.proctor_centers, name='proctor-centers'),

    # Backward Compatibility / Stitch Reference Consoles (All Strictly Super Admin Protected)
    path('admin/overview/', views.get_super_admin_overview, name='admin-overview'),
    path('admin/ip-authorization/', views.get_ip_authorization_data, name='admin-ip-authorization'),
    path('admin/seat-allocation/', views.get_seat_allocation_data, name='admin-seat-allocation'),
    path('admin/live-monitoring/', views.get_live_monitoring_data, name='admin-live-monitoring'),
    path('admin/question-bank/', views.get_question_bank_data, name='admin-question-bank'),
]

