from django.urls import path
from api import views

urlpatterns = [
    # Auth & Role Switching
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

    # Super Admin Overview & Ops
    path('admin/overview/', views.get_super_admin_overview, name='admin-overview'),

    # Statutory Merit Policy Engine
    path('merit/policies/', views.merit_policies_view, name='merit-policies'),
    path('merit/simulate/', views.simulate_merit_batch, name='merit-simulate'),

    # University Admissions & Faculty Review
    path('admissions/applications/', views.list_university_applications, name='admissions-applications'),
    path('admissions/update-status/', views.update_application_status, name='admissions-update-status'),
    path('faculty/submit-review/', views.submit_faculty_review, name='faculty-submit-review'),

    # Infrastructure & Live Operations Consoles (Stitch Reference Consoles)
    path('admin/ip-authorization/', views.get_ip_authorization_data, name='admin-ip-authorization'),
    path('admin/seat-allocation/', views.get_seat_allocation_data, name='admin-seat-allocation'),
    path('admin/live-monitoring/', views.get_live_monitoring_data, name='admin-live-monitoring'),
    path('admin/question-bank/', views.get_question_bank_data, name='admin-question-bank'),
]
