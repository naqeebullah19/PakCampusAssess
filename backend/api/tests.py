from decimal import Decimal
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import (
    UserRole, UserProfile, Institution, AdmissionsCycle, AcademicProgram,
    CandidateProfile, AcademicRecord, CandidateDocument, ExaminationCategory,
    ExaminationCenter, Laboratory, Workstation, Examination, ExaminationSession,
    ExaminationRegistration, AdmitCard, Question, QuestionOption,
    CandidateAttempt, CandidateAnswer, CandidateResult, MeritPolicy,
    UniversityApplication, FacultyReview
)

class PakCampusAssessCoreTests(TestCase):
    def setUp(self):
        self.client = Client()

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

        # 2. Candidate
        self.user = User.objects.create_user(
            username="test.candidate@pakcampusassess.edu.pk",
            first_name="Ayesha", last_name="Siddiqui", email="ayesha@example.com"
        )
        self.profile = UserProfile.objects.create(user=self.user, role=UserRole.CANDIDATE)
        self.cand = CandidateProfile.objects.create(
            user=self.user, roll_number="CA-2027-01052", cnic="61101-1234567-4",
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

        # 3. Exam & Session
        self.cat = ExaminationCategory.objects.create(name="ECAT", code="ECAT")
        self.center = ExaminationCenter.objects.create(
            name="NUST Center", code="CTR-01", city="Islamabad", province="ICT",
            address="H-12", authorized_ip_range="10.14.8.0/24"
        )
        self.lab = Laboratory.objects.create(center=self.center, lab_name="Lab B")
        self.ws = Workstation.objects.create(laboratory=self.lab, workstation_number="Desk #118")

        self.exam = Examination.objects.create(
            category=self.cat, admissions_cycle=self.cycle, title="ECAT Test",
            code="EX-2027-0104", duration_minutes=120, total_marks=100,
            registration_start=timezone.now(), registration_end=timezone.now() + timezone.timedelta(days=10),
            status="REGISTRATION_OPEN"
        )
        self.session = ExaminationSession.objects.create(
            examination=self.exam, center=self.center, session_date=timezone.now().date(),
            shift="MORNING", reporting_time="08:00:00", start_time="08:30:00", end_time="10:30:00"
        )
        self.reg = ExaminationRegistration.objects.create(
            candidate=self.cand, examination=self.exam, preferred_center=self.center,
            assigned_session=self.session, challan_number="CHL-101", registration_status="SEAT_ASSIGNED"
        )
        self.admit = AdmitCard.objects.create(
            registration=self.reg, candidate=self.cand, session=self.session,
            workstation=self.ws, desk_number="Desk #118"
        )

        # 4. Question Bank
        self.q1 = Question.objects.create(
            subject="Mathematics", topic="Calculus", question_text="What is derivative of sin(x)?",
            review_status="APPROVED"
        )
        QuestionOption.objects.create(question=self.q1, option_key="A", option_text="cos(x)", is_correct=True)
        QuestionOption.objects.create(question=self.q1, option_key="B", option_text="-cos(x)", is_correct=False)

        # 5. Attempt
        self.attempt = CandidateAttempt.objects.create(
            registration=self.reg, candidate=self.cand, session=self.session,
            workstation=self.ws, attempt_status="IN_PROGRESS"
        )

        # 6. Merit Policy
        self.policy = MeritPolicy.objects.create(
            institution=self.nust, admissions_cycle=self.cycle, title="NUST Merit Policy 2027",
            test_weightage=Decimal("50.00"), hssc_weightage=Decimal("40.00"), ssc_weightage=Decimal("10.00")
        )

    def test_candidate_dashboard_returns_real_data(self):
        """Verifies candidate dashboard returns real persisted records and next exam."""
        response = self.client.get('/api/v1/candidate/dashboard/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["candidate"]["roll_number"], "CA-2027-01052")
        self.assertEqual(data["next_examination"]["code"], "EX-2027-0104")
        self.assertEqual(data["admit_card"]["desk_number"], "Desk #118")

    def test_cbt_active_attempt_does_not_leak_correct_answers(self):
        """Verifies candidate CBT endpoint protects confidential answer keys."""
        response = self.client.get('/api/v1/cbt/active-attempt/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        questions = data["questions"]
        self.assertTrue(len(questions) > 0)
        for q in questions:
            for opt in q["options"]:
                self.assertNotIn("is_correct", opt)

    def test_cbt_save_answer_persists_wal_state(self):
        """Verifies real-time answer persistence and WAL version advancement."""
        initial_wal = self.attempt.wal_version
        response = self.client.post('/api/v1/cbt/save-answer/', {
            "attempt_id": self.attempt.id,
            "question_id": self.q1.id,
            "selected_option": "A",
            "is_flagged": True
        }, content_type="application/json")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "SAVED")
        self.assertEqual(data["selected_option"], "A")
        self.assertTrue(data["is_flagged"])

        # Check database persistence
        answer = CandidateAnswer.objects.get(attempt=self.attempt, question=self.q1)
        self.assertEqual(answer.selected_option, "A")
        self.assertTrue(answer.is_flagged)
        self.attempt.refresh_from_db()
        self.assertGreater(self.attempt.wal_version, initial_wal)

    def test_cbt_final_submit_and_idempotency(self):
        """Verifies final submission generates durable receipt and prevents duplicates."""
        # Answer the question
        CandidateAnswer.objects.create(attempt=self.attempt, question=self.q1, selected_option="A")

        response = self.client.post('/api/v1/cbt/submit/', {
            "attempt_id": self.attempt.id
        }, content_type="application/json")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "SUBMITTED")
        receipt_token = data["receipt_token"]
        self.assertTrue(receipt_token.startswith("PK-CBT-"))

        # Test idempotency
        second_response = self.client.post('/api/v1/cbt/submit/', {
            "attempt_id": self.attempt.id
        }, content_type="application/json")
        self.assertEqual(second_response.status_code, 200)
        self.assertEqual(second_response.json()["receipt_token"], receipt_token)

    def test_statutory_merit_calculation_formula(self):
        """Verifies deterministic formula: 50% Test + 40% FSc + 10% Matric."""
        # Setup Candidate Result: 80%
        CandidateResult.objects.create(
            attempt=self.attempt, candidate=self.cand, examination=self.exam,
            raw_score=Decimal("80.00"), total_marks=Decimal("100.00"), percentage=Decimal("80.00")
        )

        response = self.client.post('/api/v1/merit/simulate/', {
            "policy_id": self.policy.id
        }, content_type="application/json")

        self.assertEqual(response.status_code, 200)
        rankings = response.json()["rankings"]
        self.assertTrue(len(rankings) > 0)
        entry = rankings[0]
        # Expected:
        # Matric (990/1100 = 90.00%) * 0.10 = 9.000
        # FSc (935/1100 = 85.00%) * 0.40 = 34.000
        # Test (80.00%) * 0.50 = 40.000
        # Aggregate = 83.000%
        self.assertAlmostEqual(entry["aggregate_score"], 83.000, places=2)

    def test_admin_overview_kpis(self):
        """Verifies admin overview calculates real database counts."""
        response = self.client.get('/api/v1/admin/overview/')
        self.assertEqual(response.status_code, 200)
        kpis = response.json()["kpis"]
        self.assertEqual(kpis["total_candidates"], 1)
        self.assertEqual(kpis["total_centers"], 1)
        self.assertEqual(kpis["active_sessions"], 1)
