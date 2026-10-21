from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import (
    UserRole, UserProfile, Institution, AdmissionsCycle, AcademicProgram,
    CandidateProfile, AcademicRecord, CandidateDocument, ExaminationCategory,
    ExaminationCenter, Laboratory, Workstation, Examination, ExaminationSession,
    ExaminationRegistration, AdmitCard, Question, QuestionOption,
    CandidateAttempt, CandidateAnswer, CandidateResult, MeritPolicy,
    UniversityApplication, FacultyReview, OperationalIncident, AuditLog,
    SessionStaffAssignment, CandidateAttendance, SessionReport, StaffNotification
)

class PakCampusAssessCoreTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # 1. Base Setup
        self.cycle = AdmissionsCycle.objects.create(
            name="Cycle 2027-A", code="2027-A", status="ACTIVE",
            start_date=timezone.now().date(), end_date=timezone.now().date()
        )
        self.nust = Institution.objects.create(
            name="National University of Sciences & Technology", code="NUST",
            province="Federal Capital", city="Islamabad", address="H-12 Islamabad"
        )
        self.program = AcademicProgram.objects.create(
            institution=self.nust, name="BS Computer Science", total_seats=100
        )

        # 2. Super Admin User
        self.super_admin = User.objects.create_user(
            username="admin@pakcampusassess.edu.pk",
            first_name="Dr. Tariq", last_name="Mansoor", email="admin@pakcampusassess.edu.pk",
            password="AdminPass2027!"
        )
        UserProfile.objects.create(user=self.super_admin, role=UserRole.SUPER_ADMIN)

        # 3. Candidate User & Profile
        self.candidate_user = User.objects.create_user(
            username="ayesha.siddiqui@gmail.com",
            first_name="Ayesha", last_name="Siddiqui", email="ayesha.siddiqui@gmail.com",
            password="Candidate2027!"
        )
        self.cand_profile = UserProfile.objects.create(user=self.candidate_user, role=UserRole.CANDIDATE)
        self.cand = CandidateProfile.objects.create(
            user=self.candidate_user, roll_number="CA-2027-01052", cnic="61101-1234567-4",
            father_name="Muhammad Siddiqui", date_of_birth="2007-04-18",
            gender="FEMALE", domicile_district="Islamabad", domicile_province="Federal Capital",
            permanent_address="Sector F-10", current_address="Sector F-10"
        )
        self.matric = AcademicRecord.objects.create(
            candidate=self.cand, level="MATRIC", institution_name="Model College",
            board_or_university="FBISE", degree_title="Science", passing_year=2024,
            total_marks=1100, obtained_marks=990, roll_number="MAT-01"
        )
        self.fsc = AcademicRecord.objects.create(
            candidate=self.cand, level="FSC", institution_name="Public College",
            board_or_university="FBISE", degree_title="Pre-Engineering", passing_year=2026,
            total_marks=1100, obtained_marks=935, roll_number="FSC-01"
        )

        # 4. University Admissions Admin User
        self.univ_admin = User.objects.create_user(
            username="admissions@nust.edu.pk",
            first_name="Samina", last_name="Bilal", email="admissions@nust.edu.pk",
            password="AdmissionsPass2027!"
        )
        UserProfile.objects.create(user=self.univ_admin, role=UserRole.UNIVERSITY_ADMIN, institution=self.nust)

        # 5. Examination Controller Staff User
        self.exam_controller = User.objects.create_user(
            username="controller@pakcampusassess.edu.pk",
            first_name="Zahid", last_name="Iqbal", email="controller@pakcampusassess.edu.pk",
            password="ControllerPass2027!"
        )
        UserProfile.objects.create(user=self.exam_controller, role=UserRole.EXAM_CONTROLLER)

        # 6. Invigilator User
        self.invigilator = User.objects.create_user(
            username="proctor@nust.edu.pk",
            first_name="Farooq", last_name="Ahmed", email="proctor@nust.edu.pk",
            password="ProctorPass2027!"
        )
        UserProfile.objects.create(user=self.invigilator, role=UserRole.INVIGILATOR, institution=self.nust)

        # 7. Faculty Reviewer
        self.faculty_reviewer = User.objects.create_user(
            username="dean@nust.edu.pk",
            first_name="Sajjad", last_name="Qureshi", email="dean@nust.edu.pk",
            password="DeanPass2027!"
        )
        UserProfile.objects.create(user=self.faculty_reviewer, role=UserRole.FACULTY_REVIEWER, institution=self.nust)

        # 8. Exam, Center, Lab, Session
        self.cat = ExaminationCategory.objects.create(name="ECAT & CS Standard", code="ECAT-CS")
        self.center = ExaminationCenter.objects.create(
            name="NUST H-12 Center", code="CTR-ISB-01", city="Islamabad", province="Federal Capital",
            address="H-12 Islamabad", authorized_ip_range="10.14.8.0/24", total_capacity=450,
            readiness_status="READY"
        )
        self.lab = Laboratory.objects.create(center=self.center, lab_name="Lab B", capacity=60)
        self.ws = Workstation.objects.create(laboratory=self.lab, workstation_number="Desk #118")

        self.exam = Examination.objects.create(
            category=self.cat, admissions_cycle=self.cycle, title="ECAT Test Cycle 2027",
            code="EX-2027-0104", duration_minutes=120, total_marks=100, passing_marks=50,
            registration_start=timezone.now(), registration_end=timezone.now() + timezone.timedelta(days=10),
            status="REGISTRATION_OPEN"
        )
        self.session = ExaminationSession.objects.create(
            examination=self.exam, center=self.center, session_date=timezone.now().date(),
            shift="MORNING", reporting_time="08:00:00", start_time="08:30:00", end_time="10:30:00",
            max_seats=300, allocated_seats=1
        )
        self.reg = ExaminationRegistration.objects.create(
            candidate=self.cand, examination=self.exam, preferred_center=self.center,
            assigned_session=self.session, challan_number="CHL-101", registration_status="SEAT_ASSIGNED"
        )
        self.admit = AdmitCard.objects.create(
            registration=self.reg, candidate=self.cand, session=self.session,
            workstation=self.ws, desk_number="Desk #118"
        )

        # 9. Question Bank
        self.q1 = Question.objects.create(
            subject="Mathematics", topic="Calculus", question_text="What is derivative of sin(x)?",
            review_status="APPROVED", created_by=self.super_admin
        )
        QuestionOption.objects.create(question=self.q1, option_key="A", option_text="cos(x)", is_correct=True)
        QuestionOption.objects.create(question=self.q1, option_key="B", option_text="-cos(x)", is_correct=False)

        # 10. Attempt
        self.attempt = CandidateAttempt.objects.create(
            registration=self.reg, candidate=self.cand, session=self.session,
            workstation=self.ws, attempt_status="IN_PROGRESS"
        )

        # 11. Merit Policy
        self.policy = MeritPolicy.objects.create(
            institution=self.nust, admissions_cycle=self.cycle, title="NUST Merit Policy 2027",
            test_weightage=Decimal("50.00"), hssc_weightage=Decimal("40.00"), ssc_weightage=Decimal("10.00")
        )

        # 12. Proctor Staff Assignment & Attendance
        SessionStaffAssignment.objects.create(
            session=self.session, user=self.invigilator, role="CHIEF_PROCTOR", assigned_lab=self.lab
        )
        self.attendance = CandidateAttendance.objects.create(
            session=self.session, registration=self.reg, status="NOT_ARRIVED", desk_number="Desk #118"
        )
        self.notification = StaffNotification.objects.create(
            recipient=self.invigilator, title="Duty Assignment Active", message="Session #1 active in Lab B"
        )

        # 13. Unassigned Examination Session (Proctor is NOT assigned to this)
        self.unassigned_center = ExaminationCenter.objects.create(
            name="UET Lahore Center", code="CTR-LHR-02", city="Lahore", province="Punjab",
            address="GT Road Lahore", authorized_ip_range="10.20.4.0/24"
        )
        self.unassigned_session = ExaminationSession.objects.create(
            examination=self.exam, center=self.unassigned_center, session_date=timezone.now().date(),
            shift="AFTERNOON", reporting_time="13:30:00", start_time="14:00:00", end_time="16:00:00"
        )

    # --------------------------------------------------------------------------
    # TEST 1: Super Admin Access
    # --------------------------------------------------------------------------
    def test_super_admin_access_allowed(self):
        """TEST 1: Log in as a Super Admin and verify Super Admin Dashboard loads successfully."""
        self.client.force_login(self.super_admin)
        response = self.client.get('/api/v1/super-admin/overview/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("kpis", data)
        self.assertEqual(data["kpis"]["total_candidates"], 1)
        self.assertEqual(data["kpis"]["active_centers"], 1)
        self.assertEqual(data["kpis"]["active_sessions"], 1)

    # --------------------------------------------------------------------------
    # TEST 2: Candidate Access Denial
    # --------------------------------------------------------------------------
    def test_candidate_access_denied(self):
        """TEST 2: Log in as a candidate, open /super-admin endpoint directly, verify denied (403)."""
        self.client.force_login(self.candidate_user)
        response = self.client.get('/api/v1/super-admin/overview/')
        self.assertEqual(response.status_code, 403)
        self.assertIn("Access Denied", response.json().get("detail", ""))

    # --------------------------------------------------------------------------
    # TEST 3: University Admin Access Denial
    # --------------------------------------------------------------------------
    def test_university_admin_access_denied(self):
        """TEST 3: Log in as University Admissions Admin, verify Super Admin access is denied (403)."""
        self.client.force_login(self.univ_admin)
        response = self.client.get('/api/v1/super-admin/overview/')
        self.assertEqual(response.status_code, 403)

    # --------------------------------------------------------------------------
    # TEST 4: Examination Staff Access Denial
    # --------------------------------------------------------------------------
    def test_examination_staff_access_denied(self):
        """TEST 4: Log in as Examination Controller and Invigilator, verify Super Admin access denied."""
        # Controller
        self.client.force_login(self.exam_controller)
        response_controller = self.client.get('/api/v1/super-admin/overview/')
        self.assertEqual(response_controller.status_code, 403)

        # Invigilator
        self.client.force_login(self.invigilator)
        response_invigilator = self.client.get('/api/v1/super-admin/overview/')
        self.assertEqual(response_invigilator.status_code, 403)

    # --------------------------------------------------------------------------
    # TEST 5: Direct API Access
    # --------------------------------------------------------------------------
    def test_direct_api_access_protected(self):
        """TEST 5: Attempt to access protected Super Admin API endpoints using a candidate session."""
        self.client.force_login(self.candidate_user)
        endpoints = [
            '/api/v1/super-admin/overview/',
            '/api/v1/super-admin/examinations/',
            '/api/v1/super-admin/exam-categories/',
            '/api/v1/super-admin/question-bank/',
            '/api/v1/super-admin/exam-sessions/',
            '/api/v1/super-admin/centers/',
            '/api/v1/super-admin/users/',
            '/api/v1/super-admin/staff/',
            '/api/v1/super-admin/monitoring/',
            '/api/v1/super-admin/results/',
            '/api/v1/super-admin/universities/',
            '/api/v1/super-admin/admissions/',
            '/api/v1/super-admin/reports/',
            '/api/v1/super-admin/audit-logs/',
            '/api/v1/super-admin/settings/',
            '/api/v1/admin/overview/',
            '/api/v1/admin/ip-authorization/',
        ]
        for url in endpoints:
            res = self.client.get(url)
            self.assertEqual(res.status_code, 403, f"Endpoint {url} failed to reject candidate with 403")

    # --------------------------------------------------------------------------
    # TEST 6: Unauthenticated Access
    # --------------------------------------------------------------------------
    def test_unauthenticated_access_denied(self):
        """TEST 6: Open /super-admin endpoint without authenticated session, verify 401 or 403."""
        # Make request with completely anonymous client
        anon_client = APIClient()
        response = anon_client.get('/api/v1/super-admin/overview/')
        self.assertIn(response.status_code, [401, 403])

    # --------------------------------------------------------------------------
    # TEST 7: Role Manipulation
    # --------------------------------------------------------------------------
    def test_role_manipulation_prevented(self):
        """TEST 7: Attempt to send a forged role parameter or header while authenticated as candidate."""
        self.client.force_login(self.candidate_user)
        # Attempt via payload parameter
        response = self.client.get('/api/v1/super-admin/overview/?role=SUPER_ADMIN')
        self.assertEqual(response.status_code, 403)

        # Attempt via custom HTTP header
        response2 = self.client.get('/api/v1/super-admin/overview/', HTTP_X_USER_ROLE='SUPER_ADMIN')
        self.assertEqual(response2.status_code, 403)

    # --------------------------------------------------------------------------
    # TEST 8: Candidate Regression
    # --------------------------------------------------------------------------
    def test_candidate_regression(self):
        """TEST 8: Verify that the existing Candidate Dashboard and CBT functions still work."""
        response = self.client.get('/api/v1/candidate/dashboard/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["candidate"]["roll_number"], "CA-2027-01052")
        self.assertEqual(data["next_examination"]["code"], "EX-2027-0104")

        # CBT Answer saving
        initial_wal = self.attempt.wal_version
        ans_res = self.client.post('/api/v1/cbt/save-answer/', {
            "attempt_id": self.attempt.id,
            "question_id": self.q1.id,
            "selected_option": "A",
            "is_flagged": True
        }, format="json")
        self.assertEqual(ans_res.status_code, 200)
        self.attempt.refresh_from_db()
        self.assertGreater(self.attempt.wal_version, initial_wal)

    # --------------------------------------------------------------------------
    # TEST 9: Dashboard Data Integrity
    # --------------------------------------------------------------------------
    def test_dashboard_data_integrity(self):
        """TEST 9: Verify dashboard statistics are populated from real API responses."""
        self.client.force_login(self.super_admin)
        response = self.client.get('/api/v1/super-admin/overview/')
        self.assertEqual(response.status_code, 200)
        kpis = response.json()["kpis"]
        self.assertEqual(kpis["total_candidates"], CandidateProfile.objects.count())
        self.assertEqual(kpis["active_sessions"], ExaminationSession.objects.filter(is_active=True).count())
        self.assertEqual(kpis["registered_universities"], Institution.objects.count())

    # --------------------------------------------------------------------------
    # TEST 10: All Super Admin Subroutes Functional
    # --------------------------------------------------------------------------
    def test_super_admin_subroutes_functional(self):
        """TEST 10: Verify all dedicated Super Admin endpoints return 200 OK for Super Admin."""
        self.client.force_login(self.super_admin)
        routes = [
            '/api/v1/super-admin/examinations/',
            '/api/v1/super-admin/exam-categories/',
            '/api/v1/super-admin/question-bank/',
            '/api/v1/super-admin/exam-sessions/',
            '/api/v1/super-admin/centers/',
            '/api/v1/super-admin/users/',
            '/api/v1/super-admin/staff/',
            '/api/v1/super-admin/monitoring/',
            '/api/v1/super-admin/results/',
            '/api/v1/super-admin/universities/',
            '/api/v1/super-admin/admissions/',
            '/api/v1/super-admin/reports/',
            '/api/v1/super-admin/audit-logs/',
            '/api/v1/super-admin/settings/',
        ]
        for url in routes:
            try:
                res = self.client.get(url)
                self.assertEqual(res.status_code, 200, f"Super Admin subroute {url} returned {res.status_code}")
            except Exception as e:
                print(f"FAILED ON URL: {url} with error: {e}")
                raise

    # --------------------------------------------------------------------------
    # TEST 11: Proctor Access Allowed
    # --------------------------------------------------------------------------
    def test_proctor_access_allowed(self):
        """TEST 11: Authenticated proctor can access /api/v1/proctor/* endpoints."""
        self.client.force_login(self.invigilator)
        endpoints = [
            '/api/v1/proctor/overview/',
            '/api/v1/proctor/examinations/',
            '/api/v1/proctor/sessions/',
            f'/api/v1/proctor/sessions/{self.session.id}/',
            f'/api/v1/proctor/sessions/{self.session.id}/candidates/',
            f'/api/v1/proctor/sessions/{self.session.id}/monitoring/',
            f'/api/v1/proctor/sessions/{self.session.id}/reports/',
            '/api/v1/proctor/incidents/',
            '/api/v1/proctor/reports/',
            '/api/v1/proctor/notifications/',
            '/api/v1/proctor/centers/',
        ]
        for url in endpoints:
            res = self.client.get(url)
            self.assertEqual(res.status_code, 200, f"Proctor endpoint {url} failed with status {res.status_code}")

    # --------------------------------------------------------------------------
    # TEST 12: Candidate Denied Proctor Access
    # --------------------------------------------------------------------------
    def test_candidate_proctor_access_denied(self):
        """TEST 12: Candidate accounts cannot access any /api/v1/proctor/* endpoint (403 Forbidden)."""
        self.client.force_login(self.candidate_user)
        endpoints = [
            '/api/v1/proctor/overview/',
            '/api/v1/proctor/examinations/',
            '/api/v1/proctor/sessions/',
            f'/api/v1/proctor/sessions/{self.session.id}/',
            f'/api/v1/proctor/sessions/{self.session.id}/candidates/',
            f'/api/v1/proctor/sessions/{self.session.id}/monitoring/',
            '/api/v1/proctor/incidents/',
            '/api/v1/proctor/reports/',
            '/api/v1/proctor/notifications/',
            '/api/v1/proctor/centers/',
        ]
        for url in endpoints:
            res = self.client.get(url)
            self.assertEqual(res.status_code, 403, f"Candidate was not blocked from {url}")

    # --------------------------------------------------------------------------
    # TEST 13: Unassigned Session Denied (Object-Level Authorization)
    # --------------------------------------------------------------------------
    def test_unassigned_session_denied(self):
        """TEST 13: Proctor cannot access an examination session to which they are not assigned."""
        self.client.force_login(self.invigilator)
        unassigned_urls = [
            f'/api/v1/proctor/sessions/{self.unassigned_session.id}/',
            f'/api/v1/proctor/sessions/{self.unassigned_session.id}/candidates/',
            f'/api/v1/proctor/sessions/{self.unassigned_session.id}/attendance/',
            f'/api/v1/proctor/sessions/{self.unassigned_session.id}/monitoring/',
            f'/api/v1/proctor/sessions/{self.unassigned_session.id}/reports/',
        ]
        for url in unassigned_urls:
            res = self.client.get(url)
            self.assertEqual(res.status_code, 403, f"Proctor was not denied for unassigned session at {url}")

    # --------------------------------------------------------------------------
    # TEST 14: Candidate Attendance Recording & Audit Trail
    # --------------------------------------------------------------------------
    def test_proctor_attendance_recording(self):
        """TEST 14: Authorized proctor can record attendance; candidate cannot modify it."""
        self.client.force_login(self.invigilator)
        url = f'/api/v1/proctor/sessions/{self.session.id}/attendance/'
        res = self.client.post(url, {
            "registration_id": self.reg.id,
            "status": "CHECKED_IN",
            "desk_number": "Desk #118",
            "verification_notes": "Identity confirmed via NADRA Smart Card"
        }, format="json")
        self.assertEqual(res.status_code, 200)
        self.attendance.refresh_from_db()
        self.assertEqual(self.attendance.status, "CHECKED_IN")
        self.assertEqual(self.attendance.verified_by, self.invigilator)
        self.assertIsNotNone(self.attendance.check_in_time)

        # Candidate attempt to modify attendance must be blocked
        self.client.force_login(self.candidate_user)
        cand_res = self.client.post(url, {
            "registration_id": self.reg.id,
            "status": "ADMITTED"
        }, format="json")
        self.assertEqual(cand_res.status_code, 403)

    # --------------------------------------------------------------------------
    # TEST 15: Incident Management & Isolation
    # --------------------------------------------------------------------------
    def test_proctor_incident_management(self):
        """TEST 15: Proctor can file and update incidents on assigned session; cannot file on unassigned session."""
        self.client.force_login(self.invigilator)
        
        # File incident on assigned session
        res = self.client.post('/api/v1/proctor/incidents/', {
            "session_id": self.session.id,
            "title": "Loose HDMI Display Cable",
            "category": "HARDWARE_FAULT",
            "severity": "LOW",
            "description": "Flicker on Desk 118 monitor; cable reseated by technician."
        }, format="json")
        self.assertEqual(res.status_code, 201)
        inc_id = res.json()["id"]

        # Update resolution
        patch_res = self.client.patch(f'/api/v1/proctor/incidents/{inc_id}/', {
            "status": "RESOLVED",
            "resolution_notes": "Tested for 10 minutes without further signal drop."
        }, format="json")
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["status"], "RESOLVED")

        # Attempt to file incident on unassigned session must be rejected (403)
        unassigned_res = self.client.post('/api/v1/proctor/incidents/', {
            "session_id": self.unassigned_session.id,
            "title": "Unauthorized Attempt",
            "category": "SECURITY",
            "severity": "HIGH",
            "description": "Testing breach"
        }, format="json")
        self.assertEqual(unassigned_res.status_code, 403)

    # --------------------------------------------------------------------------
    # TEST 16: Live Monitoring Telemetry
    # --------------------------------------------------------------------------
    def test_proctor_monitoring_telemetry(self):
        """TEST 16: Monitoring console returns genuine DB metrics (workstations, attempts)."""
        self.client.force_login(self.invigilator)
        res = self.client.get(f'/api/v1/proctor/sessions/{self.session.id}/monitoring/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("telemetry", data)
        self.assertIn("workstations", data)
        self.assertEqual(data["telemetry"]["in_progress"], 1) # self.attempt is IN_PROGRESS
        self.assertGreaterEqual(len(data["workstations"]), 1)

    # --------------------------------------------------------------------------
    # TEST 17: Post-Examination Session Report Workflow
    # --------------------------------------------------------------------------
    def test_proctor_session_report_workflow(self):
        """TEST 17: Proctor can submit report; prevent silent overwrite once sealed."""
        self.client.force_login(self.invigilator)
        url = f'/api/v1/proctor/sessions/{self.session.id}/reports/'
        
        # Initial submission
        res = self.client.post(url, {
            "status": "SUBMITTED",
            "actual_start_time": "08:30:00",
            "actual_end_time": "10:30:00",
            "operational_observations": "Session concluded successfully according to HEC protocols.",
            "integrity_checklist_confirmed": True,
            "network_stability_notes": "Optimal CBT intranet latency."
        }, format="json")
        self.assertEqual(res.status_code, 200)
        data = res.json()["report"]
        self.assertEqual(data["status"], "SUBMITTED")
        self.assertEqual(data["submitted_by_name"], "Farooq Ahmed")

        # Attempt silent overwrite without AMENDED status should be rejected
        dup_res = self.client.post(url, {
            "status": "SUBMITTED",
            "operational_observations": "Malicious alteration attempt"
        }, format="json")
        self.assertEqual(dup_res.status_code, 400)
