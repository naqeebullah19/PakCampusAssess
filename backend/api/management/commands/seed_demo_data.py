import uuid
from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import (
    UserRole, UserProfile, Institution, AdmissionsCycle, AcademicProgram,
    CandidateProfile, AcademicRecord, CandidateDocument, ExaminationCategory,
    ExaminationCenter, Laboratory, Workstation, Examination, ExaminationSession,
    ExaminationRegistration, AdmitCard, Question, QuestionOption,
    ExaminationBlueprint, CandidateAttempt, CandidateAnswer, CandidateResult,
    MeritPolicy, MeritList, MeritListEntry, UniversityApplication,
    ApplicationProgramPreference, FacultyReview, OperationalIncident, AuditLog
)

class Command(BaseCommand):
    help = 'Seeds realistic development/demo data for PakCampusAssess testing and admissions platform.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Initializing PakCampusAssess Development Dataset..."))

        # 1. Admissions Cycle
        cycle, _ = AdmissionsCycle.objects.get_or_create(
            code="2027-A-UG",
            defaults={
                "name": "Cycle 2027-A Undergraduate",
                "status": "ACTIVE",
                "start_date": date(2027, 1, 15),
                "end_date": date(2027, 6, 30),
                "description": "National centralized admissions and entry testing cycle for undergraduate computing and engineering degrees."
            }
        )

        # 2. Institutions
        nust, _ = Institution.objects.get_or_create(
            code="NUST",
            defaults={
                "name": "National University of Sciences & Technology",
                "province": "Federal Capital",
                "city": "Islamabad",
                "address": "Sector H-12, Islamabad",
                "logo_url": "https://lh3.googleusercontent.com/aida/AEtjO1XPA3GhxpteIRiyC5IF2_hH-dLr9Dj7PrDQQySz-4DfW8Mf9u1P1fAmxvdQp6ZeWfg9LxA2_1oF82UzLDSpnLWRS078dcs45lMBXIbjwVpSEVSqnRxP6ZLWDc3D-DX5D1yq6Ij7TDMVNLe6qyEb0QGFfIqmtxMxPdj6dbS6t308tuZloW6mQo57qFupIsgzO4h1HcEgTjHtElK0BvIdjGJW6d3KARfy2rJKVJnxogHKsE4aON1bSfN2hvMN"
            }
        )
        fast, _ = Institution.objects.get_or_create(
            code="FAST-NU",
            defaults={
                "name": "National University of Computer and Emerging Sciences",
                "province": "Federal Capital",
                "city": "Islamabad",
                "address": "A.K. Brohi Road, H-11/4, Islamabad",
            }
        )
        giki, _ = Institution.objects.get_or_create(
            code="GIKI",
            defaults={
                "name": "Ghulam Ishaq Khan Institute of Engineering Sciences and Technology",
                "province": "Khyber Pakhtunkhwa",
                "city": "Topi",
                "address": "Topi, District Swabi",
            }
        )

        # 3. Academic Programs
        prog_cs, _ = AcademicProgram.objects.get_or_create(
            institution=nust,
            name="BS Computer Science",
            defaults={
                "discipline": "Computing",
                "degree_level": "Undergraduate",
                "total_seats": 120,
                "open_merit_seats": 100,
                "quota_seats": 20,
                "min_ssc_percentage": 60.00,
                "min_hssc_percentage": 60.00
            }
        )
        prog_se, _ = AcademicProgram.objects.get_or_create(
            institution=nust,
            name="BS Software Engineering",
            defaults={
                "discipline": "Computing",
                "degree_level": "Undergraduate",
                "total_seats": 90,
                "open_merit_seats": 75,
                "quota_seats": 15,
                "min_ssc_percentage": 60.00,
                "min_hssc_percentage": 60.00
            }
        )
        prog_ee, _ = AcademicProgram.objects.get_or_create(
            institution=giki,
            name="BS Electrical Engineering",
            defaults={
                "discipline": "Engineering",
                "degree_level": "Undergraduate",
                "total_seats": 80,
                "open_merit_seats": 65,
                "quota_seats": 15,
                "min_ssc_percentage": 60.00,
                "min_hssc_percentage": 60.00
            }
        )

        # 4. Administrative Users & Staff
        admin_user, _ = User.objects.get_or_create(
            username="admin@pakcampusassess.edu.pk",
            defaults={
                "first_name": "Dr. Tariq",
                "last_name": "Mansoor",
                "email": "admin@pakcampusassess.edu.pk",
                "is_staff": True,
                "is_superuser": True
            }
        )
        admin_user.set_password("AdminPass2027!")
        admin_user.save()
        UserProfile.objects.get_or_create(
            user=admin_user,
            defaults={"role": UserRole.SUPER_ADMIN, "phone_number": "0300-1122334", "is_verified": True}
        )

        dean_user, _ = User.objects.get_or_create(
            username="dean@nust.edu.pk",
            defaults={
                "first_name": "Dr. Sajjad",
                "last_name": "Qureshi",
                "email": "dean@nust.edu.pk",
                "is_staff": True
            }
        )
        dean_user.set_password("DeanPass2027!")
        dean_user.save()
        UserProfile.objects.get_or_create(
            user=dean_user,
            defaults={"role": UserRole.FACULTY_REVIEWER, "institution": nust, "phone_number": "0312-9988776", "is_verified": True}
        )

        examiner_user, _ = User.objects.get_or_create(
            username="proctor@nust.edu.pk",
            defaults={
                "first_name": "Engr. Farooq",
                "last_name": "Ahmed",
                "email": "proctor@nust.edu.pk",
                "is_staff": True
            }
        )
        examiner_user.set_password("ProctorPass2027!")
        examiner_user.save()
        UserProfile.objects.get_or_create(
            user=examiner_user,
            defaults={"role": UserRole.INVIGILATOR, "institution": nust, "is_verified": True}
        )

        # 5. Candidate User: Ayesha Siddiqui (as seen in Stitch designs)
        cand_user, _ = User.objects.get_or_create(
            username="ayesha.siddiqui@gmail.com",
            defaults={
                "first_name": "Ayesha",
                "last_name": "Siddiqui",
                "email": "ayesha.siddiqui@gmail.com"
            }
        )
        cand_user.set_password("Candidate2027!")
        cand_user.save()
        UserProfile.objects.get_or_create(
            user=cand_user,
            defaults={"role": UserRole.CANDIDATE, "phone_number": "0333-5123456", "is_verified": True}
        )

        cand_profile, _ = CandidateProfile.objects.get_or_create(
            user=cand_user,
            defaults={
                "roll_number": "CA-2027-01052",
                "cnic": "61101-1234567-4",
                "father_name": "Muhammad Siddiqui",
                "date_of_birth": date(2007, 4, 18),
                "gender": "FEMALE",
                "domicile_district": "Islamabad",
                "domicile_province": "Federal Capital",
                "permanent_address": "House 142, Street 35, Sector F-10/1, Islamabad",
                "current_address": "House 142, Street 35, Sector F-10/1, Islamabad",
                "nadRA_verification_status": "VERIFIED",
                "profile_photo_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCgTwsGPYOHGhvqwxWqktGhuAfDlgCyr2MTDHKk71SjBtDae-k3J7R8V1eLdSFm1LDHXetNbpqVzsMpML2xH1GL39Hb-AVrW7h8kh--MjKnxMes3GKMtwkd6QRQS9Y-nNvHgP1CjLTPQLnoOVD9k6776-8x90lUvpogFMlkaeCFXRAJ7rasipqd5yizfCJ4qnIhXV4UFegxVSQDY7sLmpp7hzscCXB-EBl85n1Z7vH-fqHGVPT0JNwtsA",
                "completion_percentage": 85
            }
        )

        # Candidate Academic Records
        AcademicRecord.objects.get_or_create(
            candidate=cand_profile,
            level="MATRIC",
            defaults={
                "institution_name": "Islamabad Model College for Girls, F-7/2",
                "board_or_university": "FBISE Islamabad",
                "degree_title": "Science (Computer Science)",
                "passing_year": 2024,
                "total_marks": 1100.00,
                "obtained_marks": 1012.00,
                "roll_number": "FB-2024-99120"
            }
        )
        AcademicRecord.objects.get_or_create(
            candidate=cand_profile,
            level="FSC",
            defaults={
                "institution_name": "Army Public College, Sector E-9, Islamabad",
                "board_or_university": "FBISE Islamabad",
                "degree_title": "FSc Pre-Engineering",
                "passing_year": 2026,
                "total_marks": 1100.00,
                "obtained_marks": 986.00,
                "roll_number": "FB-2026-44012"
            }
        )

        # Candidate Documents
        CandidateDocument.objects.get_or_create(
            candidate=cand_profile,
            document_type="CNIC_FRONT",
            defaults={
                "file_path": "/media/docs/ca202701052_cnic_front.jpg",
                "file_size_bytes": 1024 * 340,
                "mime_type": "image/jpeg",
                "verification_status": "VERIFIED",
                "verified_by": admin_user,
                "verified_at": timezone.now()
            }
        )
        CandidateDocument.objects.get_or_create(
            candidate=cand_profile,
            document_type="MATRIC_CERTIFICATE",
            defaults={
                "file_path": "/media/docs/ca202701052_matric_sanad.pdf",
                "file_size_bytes": 1024 * 720,
                "mime_type": "application/pdf",
                "verification_status": "VERIFIED",
                "verified_by": admin_user,
                "verified_at": timezone.now()
            }
        )
        CandidateDocument.objects.get_or_create(
            candidate=cand_profile,
            document_type="FSC_TRANSCRIPT",
            defaults={
                "file_path": "/media/docs/ca202701052_fsc_dmc.pdf",
                "file_size_bytes": 1024 * 512,
                "mime_type": "application/pdf",
                "verification_status": "PENDING",
                "reviewer_notes": "Awaiting final verified copy of Part-II FSc transcript from FBISE board."
            }
        )

        cand_profile.calculate_completion()

        # 6. Examination Center & Labs
        center_isb, _ = ExaminationCenter.objects.get_or_create(
            code="CTR-ISB-01",
            defaults={
                "name": "NUST Sector H-12 Campus Examination Center",
                "city": "Islamabad",
                "province": "Federal Capital",
                "address": "C3A Complex, Gate #4, NUST H-12 Islamabad",
                "authorized_ip_range": "10.14.8.0/24",
                "total_capacity": 450,
                "readiness_status": "READY"
            }
        )
        lab_b, _ = Laboratory.objects.get_or_create(
            center=center_isb,
            lab_name="Lab B",
            defaults={"floor": "1st Floor, C3A Building", "capacity": 60, "is_operational": True}
        )
        ws_118, _ = Workstation.objects.get_or_create(
            laboratory=lab_b,
            workstation_number="Desk #118",
            defaults={"ip_address": "10.14.8.118", "mac_address": "A4:83:E7:22:90:1B", "status": "ASSIGNED"}
        )

        # 7. Examination Category & Examination
        cat_ecat, _ = ExaminationCategory.objects.get_or_create(
            code="ECAT-CS",
            defaults={
                "name": "ECAT & CS Standard Entry Test",
                "description": "Standardized computer-based entrance assessment for engineering and computing degree admissions."
            }
        )
        exam_ecat, _ = Examination.objects.get_or_create(
            code="EX-2027-0104",
            defaults={
                "category": cat_ecat,
                "admissions_cycle": cycle,
                "title": "ECAT & CS Standard Entry Test Cycle 2027",
                "duration_minutes": 120,
                "total_marks": 100,
                "passing_marks": 50,
                "negative_marking": True,
                "negative_marking_penalty": 0.25,
                "registration_fee": 3000.00,
                "registration_start": timezone.now() - timedelta(days=20),
                "registration_end": timezone.now() + timedelta(days=15),
                "status": "REGISTRATION_OPEN",
                "instructions": "Bring original CNIC/B-Form and printed Admit Card. Arrive 30 minutes before reporting time."
            }
        )

        # Examination Session
        session_02, _ = ExaminationSession.objects.get_or_create(
            examination=exam_ecat,
            center=center_isb,
            session_date=date(2027, 2, 18),
            shift="MORNING",
            defaults={
                "session_number": 2,
                "reporting_time": time(8, 0),
                "start_time": time(8, 30),
                "end_time": time(10, 30),
                "max_seats": 250,
                "allocated_seats": 1
            }
        )

        # Candidate Registration & Admit Card
        cand_reg, _ = ExaminationRegistration.objects.get_or_create(
            candidate=cand_profile,
            examination=exam_ecat,
            defaults={
                "preferred_center": center_isb,
                "assigned_session": session_02,
                "challan_number": "CHL-2027-088192",
                "fee_status": "VERIFIED",
                "fee_amount": 3000.00,
                "registration_status": "SEAT_ASSIGNED"
            }
        )

        AdmitCard.objects.get_or_create(
            registration=cand_reg,
            defaults={
                "candidate": cand_profile,
                "session": session_02,
                "workstation": ws_118,
                "desk_number": "Desk #118",
                "qr_token": uuid.UUID("3f82169b-2a78-43d9-95cb-64f33190a421"),
                "status": "ISSUED"
            }
        )

        # 8. Questions & Blueprint
        q_math_1, _ = Question.objects.get_or_create(
            subject="Mathematics",
            topic="Calculus: Definite Integrals",
            defaults={
                "difficulty": "MEDIUM",
                "question_text": "Evaluate the definite integral: \\int_{0}^{\\pi/2} \\frac{\\sin(x)}{\\sin(x) + \\cos(x)} dx",
                "explanation": "By applying the property \\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx, we obtain 2I = \\pi/2, hence I = \\pi/4.",
                "marks": 1.00,
                "review_status": "APPROVED",
                "created_by": admin_user,
                "approved_by": admin_user
            }
        )
        QuestionOption.objects.get_or_create(question=q_math_1, option_key="A", defaults={"option_text": "\\pi / 2", "is_correct": False})
        QuestionOption.objects.get_or_create(question=q_math_1, option_key="B", defaults={"option_text": "\\pi / 4", "is_correct": True})
        QuestionOption.objects.get_or_create(question=q_math_1, option_key="C", defaults={"option_text": "1", "is_correct": False})
        QuestionOption.objects.get_or_create(question=q_math_1, option_key="D", defaults={"option_text": "0", "is_correct": False})

        q_phys_1, _ = Question.objects.get_or_create(
            subject="Physics",
            topic="Electromagnetism: Faraday's Law",
            defaults={
                "difficulty": "HARD",
                "question_text": "A magnetic flux through a stationary loop of wire with resistance R varies with time as \\Phi_B = \\alpha t(\\tau - t). What is the total electric charge that passes through any cross section of the wire between t = 0 and t = \\tau?",
                "explanation": "Current i(t) = -\\frac{1}{R}\\frac{d\\Phi}{dt}. Total charge is \\int i dt = \\Delta \\Phi / R = 0.",
                "marks": 1.00,
                "review_status": "APPROVED",
                "created_by": admin_user,
                "approved_by": admin_user
            }
        )
        QuestionOption.objects.get_or_create(question=q_phys_1, option_key="A", defaults={"option_text": "\\frac{\\alpha \\tau^2}{2R}", "is_correct": False})
        QuestionOption.objects.get_or_create(question=q_phys_1, option_key="B", defaults={"option_text": "0", "is_correct": True})
        QuestionOption.objects.get_or_create(question=q_phys_1, option_key="C", defaults={"option_text": "\\frac{\\alpha \\tau}{R}", "is_correct": False})
        QuestionOption.objects.get_or_create(question=q_phys_1, option_key="D", defaults={"option_text": "\\frac{2\\alpha \\tau^2}{R}", "is_correct": False})

        q_cs_1, _ = Question.objects.get_or_create(
            subject="Computer Science",
            topic="Data Structures & Algorithms: Balanced Trees",
            defaults={
                "difficulty": "MEDIUM",
                "question_text": "What is the worst-case time complexity of searching for an element in an AVL tree with n nodes?",
                "explanation": "AVL trees are height-balanced binary search trees with height O(\\log n), so search is O(\\log n).",
                "marks": 1.00,
                "review_status": "APPROVED",
                "created_by": admin_user,
                "approved_by": admin_user
            }
        )
        QuestionOption.objects.get_or_create(question=q_cs_1, option_key="A", defaults={"option_text": "O(1)", "is_correct": False})
        QuestionOption.objects.get_or_create(question=q_cs_1, option_key="B", defaults={"option_text": "O(\\log n)", "is_correct": True})
        QuestionOption.objects.get_or_create(question=q_cs_1, option_key="C", defaults={"option_text": "O(n)", "is_correct": False})
        QuestionOption.objects.get_or_create(question=q_cs_1, option_key="D", defaults={"option_text": "O(n \\log n)", "is_correct": False})

        q_eng_1, _ = Question.objects.get_or_create(
            subject="English",
            topic="Verbal Reasoning: Analogies",
            defaults={
                "difficulty": "EASY",
                "question_text": "PALEONTOLOGY : FOSSILS :: EPIGRAPHY : ?",
                "explanation": "Paleontology is the study of fossils; epigraphy is the study of inscriptions.",
                "marks": 1.00,
                "review_status": "APPROVED",
                "created_by": admin_user,
                "approved_by": admin_user
            }
        )
        QuestionOption.objects.get_or_create(question=q_eng_1, option_key="A", defaults={"option_text": "Inscriptions", "is_correct": True})
        QuestionOption.objects.get_or_create(question=q_eng_1, option_key="B", defaults={"option_text": "Coins", "is_correct": False})
        QuestionOption.objects.get_or_create(question=q_eng_1, option_key="C", defaults={"option_text": "Maps", "is_correct": False})
        QuestionOption.objects.get_or_create(question=q_eng_1, option_key="D", defaults={"option_text": "Manuscripts", "is_correct": False})

        # Examination Blueprint
        ExaminationBlueprint.objects.get_or_create(
            examination=exam_ecat,
            defaults={
                "title": "National Undergraduate Computing Blueprint 2027",
                "structure_json": [
                    {"section": "Sec 1: Mathematics", "count": 30, "marks": 30},
                    {"section": "Sec 2: Physics", "count": 25, "marks": 25},
                    {"section": "Sec 3: Computer Science", "count": 15, "marks": 15},
                    {"section": "Sec 4: English & Analytical", "count": 10, "marks": 10}
                ]
            }
        )

        # 9. Candidate Attempt (Active In Progress)
        cand_attempt, _ = CandidateAttempt.objects.get_or_create(
            registration=cand_reg,
            defaults={
                "candidate": cand_profile,
                "session": session_02,
                "workstation": ws_118,
                "started_at": timezone.now() - timedelta(minutes=45),
                "scheduled_end_time": timezone.now() + timedelta(minutes=75),
                "attempt_status": "IN_PROGRESS",
                "ip_address": "10.14.8.118",
                "wal_version": 49
            }
        )
        CandidateAnswer.objects.get_or_create(
            attempt=cand_attempt,
            question=q_math_1,
            defaults={"selected_option": "B", "is_flagged": False, "client_wal_version": 12}
        )
        CandidateAnswer.objects.get_or_create(
            attempt=cand_attempt,
            question=q_phys_1,
            defaults={"selected_option": "B", "is_flagged": True, "client_wal_version": 24}
        )

        # 10. Merit Policy
        policy_nust, _ = MeritPolicy.objects.get_or_create(
            institution=nust,
            admissions_cycle=cycle,
            title="Undergraduate Computing & Engineering Statutory Merit Formula 2027",
            defaults={
                "version": "v1.2",
                "test_weightage": 50.00,
                "hssc_weightage": 40.00,
                "ssc_weightage": 10.00,
                "min_aggregate_threshold": 65.00,
                "tie_breaking_rules": "1. Higher Entry Test Score\n2. Higher FSc Mathematics Marks\n3. Higher FSc Physics Marks\n4. Age seniority",
                "status": "ACTIVE"
            }
        )

        # 11. University Applications
        app_nust, _ = UniversityApplication.objects.get_or_create(
            application_number="APP-2027-NUST-01052",
            defaults={
                "candidate": cand_profile,
                "institution": nust,
                "cycle": cycle,
                "status": "DOCS_VERIFIED",
                "verified_by": admin_user,
                "verification_notes": "Matriculation certificate and NADRA CNIC verified against FBISE database."
            }
        )
        ApplicationProgramPreference.objects.get_or_create(
            application=app_nust,
            preference_order=1,
            defaults={"program": prog_cs}
        )
        ApplicationProgramPreference.objects.get_or_create(
            application=app_nust,
            preference_order=2,
            defaults={"program": prog_se}
        )

        FacultyReview.objects.get_or_create(
            application=app_nust,
            reviewer=dean_user,
            defaults={
                "academic_evaluation_score": 9.2,
                "test_suitability_score": 8.8,
                "recommendation": "STRONG_ADMIT",
                "evaluation_notes": "Exceptional academic background in FBISE Pre-Engineering. Recommended for Dean's Honors List consideration.",
                "conflict_of_interest_declared": False
            }
        )

        # 12. Operational Incident
        OperationalIncident.objects.get_or_create(
            session=session_02,
            center=center_isb,
            laboratory=lab_b,
            workstation=ws_118,
            title="Workstation Display Peripheral Swap",
            defaults={
                "category": "HARDWARE_FAULT",
                "severity": "LOW",
                "status": "RESOLVED",
                "description": "Loose HDMI cable on Desk #118 caused momentary screen blink during warm-up. Cable reseated and display verified by IT staff.",
                "resolution_notes": "Tested for 15 minutes prior to session start; verified no test data loss.",
                "logged_by": examiner_user,
                "resolved_at": timezone.now()
            }
        )

        # 13. Audit Log
        AuditLog.objects.get_or_create(
            actor=admin_user,
            action="MERIT_POLICY_SIGNED",
            entity_name="MeritPolicy",
            entity_id=str(policy_nust.id),
            defaults={
                "details": {
                    "policy_code": policy_nust.title,
                    "weights": {"test": 50, "hssc": 40, "ssc": 10},
                    "signed_by": "Dr. Tariq Mansoor, Exam Director"
                }
            }
        )

        self.stdout.write(self.style.SUCCESS("[SUCCESS] PakCampusAssess Development Dataset Seeded Successfully!"))
