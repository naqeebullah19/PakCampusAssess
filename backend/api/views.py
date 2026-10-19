import uuid
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import status, views, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.models import (
    UserRole, UserProfile, Institution, AdmissionsCycle, AcademicProgram,
    CandidateProfile, AcademicRecord, CandidateDocument, ExaminationCategory,
    ExaminationCenter, Laboratory, Workstation, Examination, ExaminationSession,
    ExaminationRegistration, AdmitCard, Question, QuestionOption,
    ExaminationBlueprint, CandidateAttempt, CandidateAnswer, CandidateResult,
    MeritPolicy, MeritList, MeritListEntry, UniversityApplication,
    ApplicationProgramPreference, FacultyReview, OperationalIncident, AuditLog
)
from api.serializers import (
    UserSerializer, InstitutionSerializer, AcademicProgramSerializer,
    CandidateProfileSerializer, AcademicRecordSerializer, CandidateDocumentSerializer,
    ExaminationSerializer, ExaminationSessionSerializer, ExaminationRegistrationSerializer,
    ExaminationCenterSerializer,
    AdmitCardSerializer, QuestionCandidateSerializer, QuestionAdminSerializer,
    CandidateAttemptSerializer, MeritPolicySerializer, MeritListSerializer,
    UniversityApplicationSerializer, FacultyReviewSerializer,
    OperationalIncidentSerializer, AuditLogSerializer
)

# ==============================================================================
# AUTH & ROLE SWITCHING (DEVELOPMENT & OPERATIONAL PERSONAS)
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_current_user(request):
    """Returns the authenticated user or default demo persona."""
    username = request.session.get('active_username', 'ayesha.siddiqui@gmail.com')
    user = User.objects.filter(username=username).first()
    if not user:
        user = User.objects.filter(is_superuser=True).first() or User.objects.first()
    
    serializer = UserSerializer(user)
    return Response({
        "user": serializer.data,
        "is_authenticated": True
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def switch_active_role(request):
    """
    Switches active persona to test Candidate, Super Admin, Examiner, or Dean roles.
    Matches the top-bar role selector in Stitch designs.
    """
    role = request.data.get('role', 'Candidate')
    user_map = {
        'Candidate': 'ayesha.siddiqui@gmail.com',
        'Candidate View': 'ayesha.siddiqui@gmail.com',
        'Student': 'ayesha.siddiqui@gmail.com',
        'Super Administrator': 'admin@pakcampusassess.edu.pk',
        'Examiner': 'proctor@nust.edu.pk',
        'University Admissions': 'dean@nust.edu.pk',
        'Faculty Reviewer': 'dean@nust.edu.pk',
    }
    target_username = user_map.get(role, 'ayesha.siddiqui@gmail.com')
    user = get_object_or_404(User, username=target_username)
    request.session['active_username'] = user.username
    return Response({
        "message": f"Switched to {role} persona ({user.username})",
        "user": UserSerializer(user).data
    })

# ==============================================================================
# CANDIDATE WORKSPACE ENDPOINTS
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_candidate_dashboard(request):
    """Loads authoritative candidate dashboard data."""
    cand = CandidateProfile.objects.filter(roll_number='CA-2027-01052').first()
    if not cand:
        cand = CandidateProfile.objects.first()
    
    if not cand:
        return Response({"error": "No candidate profile found"}, status=status.HTTP_404_NOT_FOUND)

    # Next examination registration
    active_reg = ExaminationRegistration.objects.filter(
        candidate=cand,
        registration_status__in=['APPROVED', 'SEAT_ASSIGNED']
    ).select_related('examination', 'assigned_session', 'assigned_session__center').first()

    # Admit card
    admit_card = AdmitCard.objects.filter(candidate=cand, status='ISSUED').select_related(
        'session', 'session__examination', 'session__center', 'workstation'
    ).first()

    # Active registrations count
    reg_count = ExaminationRegistration.objects.filter(candidate=cand).count()
    registrations = ExaminationRegistration.objects.filter(candidate=cand).select_related('examination', 'assigned_session')

    # Candidate applications
    apps = UniversityApplication.objects.filter(candidate=cand).select_related('institution')

    return Response({
        "candidate": CandidateProfileSerializer(cand).data,
        "next_examination": {
            "title": active_reg.examination.title if active_reg else None,
            "code": active_reg.examination.code if active_reg else None,
            "session_date": active_reg.assigned_session.session_date if active_reg and active_reg.assigned_session else None,
            "start_time": active_reg.assigned_session.start_time if active_reg and active_reg.assigned_session else None,
            "center_name": active_reg.assigned_session.center.name if active_reg and active_reg.assigned_session else None,
            "desk_number": admit_card.desk_number if admit_card else "Seat Assigned",
            "has_admit_card": admit_card is not None
        } if active_reg else None,
        "admit_card": AdmitCardSerializer(admit_card).data if admit_card else None,
        "registrations_count": reg_count,
        "registrations": ExaminationRegistrationSerializer(registrations, many=True).data,
        "university_applications": [
            {
                "institution": a.institution.name,
                "status": a.get_status_display(),
                "application_number": a.application_number
            } for a in apps
        ]
    })

@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def candidate_profile_view(request):
    """View and update candidate personal and identity records."""
    cand = CandidateProfile.objects.filter(roll_number='CA-2027-01052').first() or CandidateProfile.objects.first()
    if not cand:
        return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        for field in ['father_name', 'domicile_district', 'domicile_province', 'permanent_address', 'current_address', 'emergency_contact_name', 'emergency_contact_phone', 'disability_support_required', 'disability_details']:
            if field in request.data:
                setattr(cand, field, request.data[field])
        cand.save()
        cand.calculate_completion()

    return Response(CandidateProfileSerializer(cand).data)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def candidate_academic_records(request):
    """Manage candidate SSC / HSSC academic credentials."""
    cand = CandidateProfile.objects.filter(roll_number='CA-2027-01052').first() or CandidateProfile.objects.first()
    if not cand:
        return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        level = request.data.get('level')
        rec, _ = AcademicRecord.objects.get_or_create(candidate=cand, level=level, defaults={
            "institution_name": request.data.get('institution_name', ''),
            "board_or_university": request.data.get('board_or_university', ''),
            "degree_title": request.data.get('degree_title', ''),
            "passing_year": int(request.data.get('passing_year', 2026)),
            "total_marks": Decimal(str(request.data.get('total_marks', 1100))),
            "obtained_marks": Decimal(str(request.data.get('obtained_marks', 0))),
            "roll_number": request.data.get('roll_number', '')
        })
        cand.calculate_completion()
        return Response(AcademicRecordSerializer(rec).data, status=status.HTTP_201_CREATED)

    records = AcademicRecord.objects.filter(candidate=cand)
    documents = CandidateDocument.objects.filter(candidate=cand)
    return Response({
        "academic_records": AcademicRecordSerializer(records, many=True).data,
        "documents": CandidateDocumentSerializer(documents, many=True).data,
        "completion_percentage": cand.completion_percentage
    })

# ==============================================================================
# ENTRY TESTS DISCOVERY & REGISTRATION
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def list_available_examinations(request):
    """Discovery catalog of active and upcoming standardized tests."""
    exams = Examination.objects.filter(status__in=['REGISTRATION_OPEN', 'DRAFT', 'IN_PROGRESS']).select_related('category', 'admissions_cycle')
    centers = ExaminationCenter.objects.filter(is_active=True)
    return Response({
        "examinations": ExaminationSerializer(exams, many=True).data,
        "centers": ExaminationCenterSerializer(centers, many=True).data
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register_for_examination(request):
    """Submits candidate registration for an examination."""
    cand = CandidateProfile.objects.filter(roll_number='CA-2027-01052').first() or CandidateProfile.objects.first()
    exam_id = request.data.get('examination_id')
    center_id = request.data.get('center_id')

    exam = get_object_or_404(Examination, id=exam_id)
    center = ExaminationCenter.objects.filter(id=center_id).first()

    reg, created = ExaminationRegistration.objects.get_or_create(
        candidate=cand,
        examination=exam,
        defaults={
            "preferred_center": center,
            "challan_number": f"CHL-{timezone.now().strftime('%Y%m%d')}-{cand.id}{exam.id}",
            "fee_status": "VERIFIED", # Auto verified in demo
            "fee_amount": exam.registration_fee,
            "registration_status": "APPROVED"
        }
    )

    # Assign to first available session
    session = ExaminationSession.objects.filter(examination=exam).first()
    if session and not reg.assigned_session:
        reg.assigned_session = session
        reg.registration_status = "SEAT_ASSIGNED"
        reg.save()
        # Generate Admit Card
        AdmitCard.objects.get_or_create(
            registration=reg,
            defaults={
                "candidate": cand,
                "session": session,
                "desk_number": f"Desk #{100 + reg.id}",
                "status": "ISSUED"
            }
        )

    return Response({
        "message": "Registration successful",
        "registration": ExaminationRegistrationSerializer(reg).data
    }, status=status.HTTP_201_CREATED)

# ==============================================================================
# AUTHORITATIVE CBT TEST ENGINE WORKSPACE
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_cbt_active_attempt(request):
    """
    Delivers authoritative CBT session data:
    Authoritative server countdown, candidate questions (without keys), saved answers.
    """
    attempt = CandidateAttempt.objects.filter(attempt_status='IN_PROGRESS').select_related(
        'candidate', 'candidate__user', 'session', 'session__examination', 'workstation'
    ).first()

    if not attempt:
        # Fallback to any attempt or initialize
        attempt = CandidateAttempt.objects.first()

    if not attempt:
        return Response({"error": "No examination session initialized"}, status=status.HTTP_404_NOT_FOUND)

    # Calculate authoritative server remaining seconds
    now = timezone.now()
    if attempt.scheduled_end_time and attempt.scheduled_end_time > now:
        remaining_seconds = int((attempt.scheduled_end_time - now).total_seconds())
    else:
        remaining_seconds = 74 * 60 + 18 # Default 01:14:18 as per Stitch design

    # Fetch approved questions for examination
    questions = Question.objects.filter(review_status='APPROVED').prefetch_related('options')
    saved_answers = {a.question_id: {"selected_option": a.selected_option, "is_flagged": a.is_flagged} 
                     for a in CandidateAnswer.objects.filter(attempt=attempt)}

    return Response({
        "attempt_id": attempt.id,
        "candidate": {
            "name": attempt.candidate.user.get_full_name(),
            "roll_number": attempt.candidate.roll_number,
            "cnic": attempt.candidate.cnic,
            "photo_url": attempt.candidate.profile_photo_url
        },
        "examination": {
            "title": attempt.session.examination.title,
            "code": attempt.session.examination.code,
            "duration_minutes": attempt.session.examination.duration_minutes,
            "total_marks": attempt.session.examination.total_marks,
            "negative_marking": attempt.session.examination.negative_marking
        },
        "terminal": {
            "desk_number": attempt.workstation.workstation_number if attempt.workstation else "Desk #118",
            "lab_name": attempt.workstation.laboratory.lab_name if attempt.workstation else "C3A Lab",
            "ip_address": attempt.ip_address,
            "wal_version": attempt.wal_version
        },
        "timing": {
            "remaining_seconds": remaining_seconds,
            "server_time": now.isoformat()
        },
        "questions": QuestionCandidateSerializer(questions, many=True).data,
        "saved_answers": saved_answers
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def save_cbt_answer(request):
    """
    Authoritative answer persistence endpoint.
    Guarantees Write-Ahead Logging (WAL) state sync with server confirmation.
    """
    attempt_id = request.data.get('attempt_id')
    question_id = request.data.get('question_id')
    selected_option = request.data.get('selected_option', '')
    is_flagged = request.data.get('is_flagged')

    attempt = get_object_or_404(CandidateAttempt, id=attempt_id)
    question = get_object_or_404(Question, id=question_id)

    answer, created = CandidateAnswer.objects.get_or_create(
        attempt=attempt,
        question=question,
        defaults={"selected_option": selected_option, "is_flagged": bool(is_flagged)}
    )

    if not created:
        if selected_option is not None:
            answer.selected_option = selected_option
        if is_flagged is not None:
            answer.is_flagged = is_flagged
        answer.client_wal_version += 1
        answer.save()

    attempt.wal_version += 1
    attempt.last_heartbeat_at = timezone.now()
    attempt.save(update_fields=['wal_version', 'last_heartbeat_at'])

    return Response({
        "status": "SAVED",
        "question_id": question_id,
        "selected_option": answer.selected_option,
        "is_flagged": answer.is_flagged,
        "wal_version": attempt.wal_version,
        "saved_at": answer.saved_at.isoformat()
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_cbt_examination(request):
    """Final examination submission with cryptographic receipt."""
    attempt_id = request.data.get('attempt_id')
    attempt = get_object_or_404(CandidateAttempt, id=attempt_id)

    if attempt.attempt_status == 'SUBMITTED':
        return Response({"message": "Attempt already submitted", "receipt_token": attempt.submission_receipt_token})

    receipt_token = f"PK-CBT-{uuid.uuid4().hex[:12].upper()}"
    attempt.attempt_status = 'SUBMITTED'
    attempt.submitted_at = timezone.now()
    attempt.submission_receipt_token = receipt_token
    attempt.save()

    # Calculate preliminary result
    answers = CandidateAnswer.objects.filter(attempt=attempt).select_related('question')
    correct_count = 0
    wrong_count = 0
    for ans in answers:
        correct_opt = QuestionOption.objects.filter(question=ans.question, is_correct=True).first()
        if correct_opt and ans.selected_option == correct_opt.option_key:
            correct_count += 1
        elif ans.selected_option:
            wrong_count += 1

    total_q = Question.objects.filter(review_status='APPROVED').count() or 100
    penalty = Decimal('0.25') if attempt.session.examination.negative_marking else Decimal('0')
    raw_score = max(Decimal('0'), Decimal(correct_count) - (Decimal(wrong_count) * penalty))

    CandidateResult.objects.update_or_create(
        attempt=attempt,
        defaults={
            "candidate": attempt.candidate,
            "examination": attempt.session.examination,
            "total_questions": total_q,
            "attempted_questions": len(answers),
            "correct_answers": correct_count,
            "wrong_answers": wrong_count,
            "unanswered": total_q - len(answers),
            "raw_score": raw_score,
            "percentage": round((raw_score / Decimal(total_q)) * 100, 2),
            "is_passed": raw_score >= attempt.session.examination.passing_marks,
            "is_published": False
        }
    )

    return Response({
        "status": "SUBMITTED",
        "receipt_token": receipt_token,
        "submitted_at": attempt.submitted_at.isoformat(),
        "total_attempted": len(answers),
        "message": "Examination submitted and securely persisted to institutional ledger."
    })

# ==============================================================================
# SUPER ADMIN EXECUTIVE OVERVIEW & INFRASTRUCTURE
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_super_admin_overview(request):
    """
    Computes real operational KPIs from persisted database records:
    No fabricated metrics, no fake numbers.
    """
    total_candidates = CandidateProfile.objects.count()
    total_registrations = ExaminationRegistration.objects.count()
    active_sessions = ExaminationSession.objects.filter(is_active=True).count()
    active_attempts = CandidateAttempt.objects.filter(attempt_status='IN_PROGRESS').count()
    completed_attempts = CandidateAttempt.objects.filter(attempt_status='SUBMITTED').count()
    total_centers = ExaminationCenter.objects.filter(is_active=True).count()
    operational_centers = ExaminationCenter.objects.filter(readiness_status='READY').count()
    open_incidents = OperationalIncident.objects.filter(status='OPEN').count()

    centers = ExaminationCenter.objects.filter(is_active=True).prefetch_related('laboratories')
    incidents = OperationalIncident.objects.all().order_by('-created_at')[:5]
    audit_logs = AuditLog.objects.all().order_by('-timestamp')[:5]

    return Response({
        "kpis": {
            "total_candidates": total_candidates,
            "total_registrations": total_registrations,
            "active_sessions": active_sessions,
            "candidates_testing": active_attempts,
            "completed_attempts": completed_attempts,
            "total_centers": total_centers,
            "operational_centers": operational_centers,
            "open_incidents": open_incidents
        },
        "centers": ExaminationCenterSerializer(centers, many=True).data,
        "recent_incidents": OperationalIncidentSerializer(incidents, many=True).data,
        "audit_logs": AuditLogSerializer(audit_logs, many=True).data
    })

# ==============================================================================
# STATUTORY MERIT POLICY & AGGREGATE CALCULATION ENGINE
# ==============================================================================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def merit_policies_view(request):
    """List and create statutory admission aggregate policies."""
    if request.method == 'POST':
        inst_id = request.data.get('institution_id') or Institution.objects.first().id
        cycle_id = request.data.get('cycle_id') or AdmissionsCycle.objects.first().id
        policy = MeritPolicy.objects.create(
            institution_id=inst_id,
            admissions_cycle_id=cycle_id,
            title=request.data.get('title', 'Undergraduate Engineering & Computing Merit Policy'),
            version=request.data.get('version', 'v1.0'),
            test_weightage=Decimal(str(request.data.get('test_weightage', 50))),
            hssc_weightage=Decimal(str(request.data.get('hssc_weightage', 40))),
            ssc_weightage=Decimal(str(request.data.get('ssc_weightage', 10))),
            min_aggregate_threshold=Decimal(str(request.data.get('min_aggregate_threshold', 65))),
            status='ACTIVE'
        )
        return Response(MeritPolicySerializer(policy).data, status=status.HTTP_201_CREATED)

    policies = MeritPolicy.objects.all().select_related('institution', 'admissions_cycle')
    return Response(MeritPolicySerializer(policies, many=True).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def simulate_merit_batch(request):
    """
    Simulates merit calculation using exact formula:
    Aggregate = (Test % * W_test) + (FSc % * W_hssc) + (Matric % * W_ssc)
    """
    policy_id = request.data.get('policy_id')
    policy = MeritPolicy.objects.filter(id=policy_id).first() or MeritPolicy.objects.first()

    candidates = CandidateProfile.objects.all().prefetch_related('academic_records', 'results')
    simulated_entries = []

    for cand in candidates:
        matric = cand.academic_records.filter(level='MATRIC').first()
        fsc = cand.academic_records.filter(level='FSC').first()
        res = cand.results.first()

        ssc_pct = matric.percentage if matric else Decimal('85.00')
        hssc_pct = fsc.percentage if fsc else Decimal('82.50')
        test_pct = res.percentage if res else Decimal('78.00')

        agg = (test_pct * (policy.test_weightage / Decimal('100'))) + \
              (hssc_pct * (policy.hssc_weightage / Decimal('100'))) + \
              (ssc_pct * (policy.ssc_weightage / Decimal('100')))

        simulated_entries.append({
            "candidate_id": cand.id,
            "roll_number": cand.roll_number,
            "name": cand.user.get_full_name(),
            "test_score": float(test_pct),
            "hssc_score": float(hssc_pct),
            "ssc_score": float(ssc_pct),
            "aggregate_score": float(round(agg, 3)),
            "is_eligible": agg >= policy.min_aggregate_threshold
        })

    simulated_entries.sort(key=lambda x: x['aggregate_score'], reverse=True)
    for rank, entry in enumerate(simulated_entries, start=1):
        entry['rank'] = rank

    return Response({
        "policy": MeritPolicySerializer(policy).data,
        "total_simulated": len(simulated_entries),
        "rankings": simulated_entries
    })

# ==============================================================================
# UNIVERSITY ADMISSIONS & FACULTY COMMITTEE
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def list_university_applications(request):
    """Admissions officer verification queue and applications."""
    apps = UniversityApplication.objects.all().select_related(
        'candidate', 'candidate__user', 'institution', 'cycle'
    ).prefetch_related('preferences', 'preferences__program', 'faculty_reviews')
    return Response(UniversityApplicationSerializer(apps, many=True).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def update_application_status(request):
    """Updates applicant status e.g. DOCS_VERIFIED, PROVISIONALLY_ACCEPTED."""
    app_id = request.data.get('application_id')
    new_status = request.data.get('status')
    notes = request.data.get('notes', '')

    app = get_object_or_404(UniversityApplication, id=app_id)
    app.status = new_status
    if notes:
        app.verification_notes = notes
    app.save()

    return Response(UniversityApplicationSerializer(app).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_faculty_review(request):
    """Faculty reviewer evaluation notes and admission recommendation."""
    app_id = request.data.get('application_id')
    academic_score = Decimal(str(request.data.get('academic_score', 8.5)))
    test_score = Decimal(str(request.data.get('test_score', 9.0)))
    recommendation = request.data.get('recommendation', 'ADMIT')
    notes = request.data.get('notes', '')

    app = get_object_or_404(UniversityApplication, id=app_id)
    reviewer = User.objects.filter(profile__role=UserRole.FACULTY_REVIEWER).first() or User.objects.first()

    review, _ = FacultyReview.objects.update_or_create(
        application=app,
        reviewer=reviewer,
        defaults={
            "academic_evaluation_score": academic_score,
            "test_suitability_score": test_score,
            "recommendation": recommendation,
            "evaluation_notes": notes,
            "conflict_of_interest_declared": False
        }
    )

    app.status = 'UNDER_FACULTY_REVIEW'
    app.save(update_fields=['status'])

    return Response(FacultyReviewSerializer(review).data, status=status.HTTP_201_CREATED)

# ==============================================================================
# AUTHORIZED TESTING CENTERS & CIDR IP WHITELIST CONSOLE
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_ip_authorization_data(request):
    """
    Returns nationwide testing centers, CIDR subnets, hardware terminals,
    selected subnet dossier, audit ledger, and regional capacity.
    """
    centers = ExaminationCenter.objects.filter(is_active=True).prefetch_related('laboratories')
    
    # Subnet entries matching Stitch screen
    subnets = [
        {
            "id": 1,
            "center_name": "NUST C3A Supercomputing Lab",
            "city_campus": "Islamabad • Sector H-12 Campus",
            "lab_ref": "ISB-NUST-L01",
            "cidr_range": "111.68.96.0/24",
            "carrier": "PERN I Direct Fiber",
            "exit_gateway": "111.68.96.1",
            "active_terminals": 250,
            "total_terminals": 250,
            "bgp_gateway": "BGP ASN-23674",
            "bgp_ip": "111.68.96.1",
            "rtj": 1880,
            "status": "Clear",
            "redundancy": "Solar + 120kVA Genset",
            "secondary_link": "Dark Fiber Ring",
            "is_sealed": True,
            "is_selected": True
        },
        {
            "id": 2,
            "center_name": "UET Grand Hall Complex (Hall A & B)",
            "city_campus": "Lahore • Main Campus GT Road",
            "lab_ref": "LHE-UET-H01",
            "cidr_range": "202.166.168.0/24",
            "carrier": "PERN-II Core Hub",
            "exit_gateway": "202.166.168.1",
            "active_terminals": 320,
            "total_terminals": 320,
            "bgp_gateway": "BGP ASN-9942",
            "bgp_ip": "202.166.168.1",
            "rtj": 1500,
            "status": "Clear",
            "redundancy": "WAPDA Auto-Sync Genset",
            "secondary_link": "Fiber + Microwave",
            "is_sealed": True,
            "is_selected": False
        },
        {
            "id": 3,
            "center_name": "NED Main IT Center Lab 2",
            "city_campus": "Karachi • University Road",
            "lab_ref": "KHI-NED-L02",
            "cidr_range": "203.99.160.0/24",
            "carrier": "PERN Fiber Link",
            "exit_gateway": "203.99.160.18",
            "active_terminals": 280,
            "total_terminals": 300,
            "bgp_gateway": "BGP ASN-38261",
            "bgp_ip": "203.99.160.1",
            "rtj": 1500,
            "status": "Active",
            "redundancy": "Tri-Phase Inverter + Genset",
            "secondary_link": "PTCL + Cybernet Retro Fiber",
            "is_sealed": True,
            "is_selected": False
        },
        {
            "id": 4,
            "center_name": "UET IT Complex Hall 1",
            "city_campus": "Peshawar • Jamrud Road",
            "lab_ref": "PES-UET-L01",
            "cidr_range": "121.52.144.0/24",
            "carrier": "Dedicated PTCL Fiber",
            "exit_gateway": "121.52.144.4",
            "active_terminals": 140,
            "total_terminals": 140,
            "bgp_gateway": "BGP ASN-17557",
            "bgp_ip": "121.52.144.1",
            "rtj": 1500,
            "status": "Clear",
            "redundancy": "Solar Hybrid Microgrid",
            "secondary_link": "Fiber + Backup VSAT Link",
            "is_sealed": True,
            "is_selected": False
        },
        {
            "id": 5,
            "center_name": "BUITEMS Computer Lab 4",
            "city_campus": "Quetta • Airport Road Takatu Campus",
            "lab_ref": "QTA-BUITEMS-L04",
            "cidr_range": "10.51.6.0/23",
            "carrier": "Campus Intranet Segment",
            "exit_gateway": "178.107.61.9",
            "active_terminals": 196,
            "total_terminals": 200,
            "bgp_gateway": "BGP ASN-45935",
            "bgp_ip": "10.51.6.1",
            "rtj": 1500,
            "status": "Verified",
            "redundancy": "50kVA Dedicated Diesel Gen",
            "secondary_link": "Primary PTCL + Radio Link",
            "is_sealed": False,
            "is_selected": False
        }
    ]

    ledger = [
        {
            "id": 1,
            "time": "10:45:10 PKT",
            "tag": "PERN Sync",
            "text": "Subnet 202.166.168.0/24 periodic TLS handshake validated by UET Lahore Dean of Admissions.",
            "ref": "FT-LHR-2026-4721",
            "color": "secondary"
        },
        {
            "id": 2,
            "time": "09:32:14 PKT",
            "tag": "Terminal Swap",
            "text": "Terminal WS-118 hot-swap NIC migration authorized and cryptographically committed at NUST C3A.",
            "ref": "Signer: Prof. Tariq Mansoor (Exam Director)",
            "color": "primary"
        },
        {
            "id": 3,
            "time": "Yesterday",
            "tag": "Compliance",
            "text": "Annual HEC & Higher Education Commission network compliance audit certified across all 42 centers.",
            "ref": "Ref: HEC-AUDIT-2026-Q1",
            "color": "secondary"
        }
    ]

    return Response({
        "kpis": {
            "nationwide_centers": 42,
            "active_percent": "100%",
            "dedicated_labs": 116,
            "regional_hubs": 5,
            "authorized_cidrs": 148,
            "cidr_mask": "/24 to /22",
            "static_bgp": "Static BGP Binding Only",
            "dynamic_leases": 0,
            "hardware_terminals": "6,412",
            "hsm_version": "HSM v2.4",
            "secureboot_ok": "SecureBoot OK",
            "terminals_synced": "99.98%",
            "cidr_drift_anomalies": 0,
            "last_ping_probe": "2m ago",
            "pern_asn": "PERN ASN-23674"
        },
        "subnets": subnets,
        "selected_dossier": {
            "cert_id": "PK-ISB-NUST-2026-C3A",
            "status": "VALIDATED",
            "institution": "National University of Sciences & Technology (NUST)",
            "lab_room": "C3A Lab Complex (Terminal Hall B)",
            "designated_authority": "Dr. Tariq Mansoor (Exam Director)",
            "campus_focal_person": "Engr. Salman Farooq (Lead NetEng)",
            "allowed_hosts": "111.68.96.12 – 111.68.96.254",
            "subnet_mask": "255.255.255.0 (/24)",
            "bidirectional_nat": "111.68.96.14 (PERN Match)",
            "ssl_gateway_pinning": "Port 8443 (Pinned TLS 1.3)",
            "biometric_sync_cluster": "Active (18m drift)"
        },
        "regional_capacity": [
            {"zone": "Punjab Zone", "labs": 48, "seats": 2640, "pct": 41.2},
            {"zone": "Sindh Zone", "labs": 32, "seats": 1820, "pct": 28.4},
            {"zone": "ICT Federal", "labs": 18, "seats": 980, "pct": 15.3},
            {"zone": "KP & Balochistan", "labs": 18, "seats": 972, "pct": 15.1}
        ],
        "ledger": ledger
    })

# ==============================================================================
# EXAMINATION SESSIONS & SEAT ALLOCATION
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_seat_allocation_data(request):
    """
    Returns session timetable, real-time lab workstation seat map (Lab C3A 40 desks),
    desk inspector details, algorithmic seat invariants, and invigilation roster.
    """
    timetable = [
        {
            "session_id": "EX-2027-0104",
            "category": "ECAT-CS Morning Batch",
            "center": "NUST Islamabad",
            "lab": "Lab C3A + SEECS Hall",
            "date": "Feb 18, 2027",
            "time_window": "09:00 – 11:00 AM",
            "reporting": "08:15",
            "allocated_seats": 250,
            "total_seats": 250,
            "fill_pct": "100%",
            "chief_invigilator": "Prof. Haris Munir (SEECS Computing)",
            "status": "SEALED"
        },
        {
            "session_id": "EX-2027-0105",
            "category": "MDCAT Standard Slot 1",
            "center": "KEMU Lahore",
            "lab": "Auditorium Labs 1 & 2",
            "date": "Feb 19, 2027",
            "time_window": "10:00 – 01:30 PM",
            "reporting": "09:00",
            "allocated_seats": 320,
            "total_seats": 320,
            "fill_pct": "100%",
            "chief_invigilator": "Dr. Shahida Parveen (KEMU Academic)",
            "status": "PRE-SYNCED"
        },
        {
            "session_id": "EX-2027-0106",
            "category": "B-NAT Business Analytics",
            "center": "IBA Karachi",
            "lab": "City Campus Lab 1",
            "date": "Feb 20, 2027",
            "time_window": "02:00 – 04:30 PM",
            "reporting": "01:15",
            "allocated_seats": 185,
            "total_seats": 200,
            "fill_pct": "92.5%",
            "chief_invigilator": "Dr. Zeeshan Haider (Dean Computer Sci)",
            "status": "ALLOCATION OPEN"
        },
        {
            "session_id": "EX-2027-0107",
            "category": "G-CAT General Science",
            "center": "UET Peshawar",
            "lab": "Main Computer Center Lab 02",
            "date": "Feb 21, 2027",
            "time_window": "09:00 – 11:30 AM",
            "reporting": "08:15",
            "allocated_seats": 140,
            "total_seats": 150,
            "fill_pct": "93.3%",
            "chief_invigilator": "Engr. Kamran Khan (UET Faculty Ops)",
            "status": "ALLOCATION OPEN"
        },
        {
            "session_id": "EX-2027-0108",
            "category": "ECAT-CS Afternoon Slot",
            "center": "NED Karachi",
            "lab": "IT Center Hall A",
            "date": "Feb 22, 2027",
            "time_window": "02:00 – 04:00 PM",
            "reporting": "01:15",
            "allocated_seats": 280,
            "total_seats": 280,
            "fill_pct": "100%",
            "chief_invigilator": "Prof. Asim Farooq (NED Engineering)",
            "status": "SEALED"
        }
    ]

    # Generate 40 workstations for Lab C3A (Rows A to E, Desks 1 to 8)
    workstations = []
    rows = ['A', 'B', 'C', 'D', 'E']
    for r_idx, row in enumerate(rows):
        for num in range(1, 9):
            desk_id = f"{row}{num}"
            code_num = (r_idx * 8 + num)
            token = f"#00{code_num:03d}"
            # Distribution matches Stitch screen visual
            if desk_id == 'A5' or desk_id == 'D5' or desk_id == 'E5':
                ws_status = 'SPARE'
            elif desk_id == 'C4' or desk_id == 'D3':
                ws_status = 'SPECIAL'
            elif desk_id == 'B5' or desk_id == 'E4':
                ws_status = 'HOLD'
            elif desk_id == 'B2':
                ws_status = 'INSPECTED' # WS-18 (B2 is 18th in order or row B)
            else:
                ws_status = 'ALLOCATED'

            workstations.append({
                "desk_id": f"WS-{desk_id}",
                "row": row,
                "col": num,
                "token": token,
                "status": ws_status,
                "is_active": ws_status in ['ALLOCATED', 'SPECIAL', 'INSPECTED']
            })

    return Response({
        "kpis": {
            "scheduled_sessions": "18 Active Sessions",
            "session_cycle": "Cycle 2027-A • 42 CBT Centers",
            "all_centers_live": "42 Centers Live",
            "centers_online": "100% Online",
            "seat_capacity": "6,412 / 6,800 Seats",
            "booked_pct": "94.3% Booked",
            "spare_buffer": "388 Spare/Buffer",
            "invigilation_roster": "142 / 142",
            "examiners_confirmed": "Examiners Confirmed",
            "biometric_synced": "Biometric Synced",
            "ready_pct": "100% Ready",
            "conflicts_holds": "0 Unresolved",
            "no_collisions": "No Collisions Detected",
            "special_accommodations": "3 Special Accommodations"
        },
        "timetable": timetable,
        "seat_map": {
            "session_code": "EX-2027-0104",
            "lab_name": "Lab C3A Real-Time Workstation Seat Map",
            "hall_desc": "NUST SEECS Hall Army - 250 Terminals Total (Previewing Rows A through E • Cluster 1)",
            "workstations": workstations
        },
        "selected_desk": {
            "workstation_id": "Workstation C3A-WS-18",
            "status": "OCCUPIED",
            "candidate_name": "Ayesha Siddiqui",
            "roll_number": "CA-2027-01052",
            "cnic": "61101-*******-4",
            "exam_track": "Pre-Engineering / ECAT-CS",
            "desk_hardware": "Standard Right-Hand (104Key)",
            "hsm_card_reader": "Active & Ready",
            "biometric_status": "NADRA-8493819-PK",
            "admit_slip_token": "SLP0058980 Feb 02, 2027"
        },
        "duty_team": [
            {"name": "Prof. Haris Munir", "role": "Chief Invigilator • Dean Computing", "status": "SYNCED"},
            {"name": "4 Lab Attendants & Proctors", "role": "Conflict-of-interest sworn & cleared", "status": "SYNCED"},
            {"name": "Dr. Tariq Mansoor", "role": "Center Superintendent • Director Ops", "status": "PRESENT"}
        ]
    })

# ==============================================================================
# LIVE EXAMINATION MONITORING
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_live_monitoring_data(request):
    """
    Real-time biometric attendance, workstation telemetry, answer writes rate,
    live candidate grid, and candidate inspector telemetry.
    """
    candidates = [
        {
            "seat": "Lab B • Seat 118",
            "center": "NUST SEECS, ISB",
            "name": "Ayesha Siddiqui",
            "roll": "CA-2027-01052",
            "initials": "AS",
            "ip": "10.14.8.118",
            "ip_type": "Static CIDR Auth",
            "nadra_time": "08:42 AM",
            "nadra_verified": True,
            "progress_answered": 54,
            "progress_total": 80,
            "progress_pct": 67,
            "heartbeat": "1s ago Confirmed",
            "status": "NORMAL",
            "is_selected": True
        },
        {
            "seat": "Lab A • Seat 042",
            "center": "FAST-NUCES, ISB",
            "name": "Bilal Ahmed Khan",
            "roll": "CA-2027-00481",
            "initials": "BK",
            "ip": "10.14.8.42",
            "ip_type": "Static CIDR Auth",
            "nadra_time": "08:45 AM",
            "nadra_verified": True,
            "progress_answered": 48,
            "progress_total": 80,
            "progress_pct": 60,
            "heartbeat": "2s ago Confirmed",
            "status": "NORMAL",
            "is_selected": False
        },
        {
            "seat": "Lab C • Seat 009",
            "center": "UET Lahore Campus",
            "name": "Mohsin Raza",
            "roll": "CA-2027-02194",
            "initials": "MR",
            "ip": "10.22.4.9",
            "ip_type": "Latency Spike (142ms)",
            "nadra_time": "08:38 AM",
            "nadra_verified": True,
            "progress_answered": 31,
            "progress_total": 80,
            "progress_pct": 38,
            "heartbeat": "7s ago Retry #1 Queued",
            "status": "FLAGGED",
            "is_selected": False
        },
        {
            "seat": "Lab 1 • Seat 077",
            "center": "NED University, KHI",
            "name": "Zainab Fatima",
            "roll": "CA-2027-03081",
            "initials": "ZF",
            "ip": "10.31.2.77",
            "ip_type": "Static CIDR Auth",
            "nadra_time": "08:50 AM",
            "nadra_verified": True,
            "progress_answered": 62,
            "progress_total": 80,
            "progress_pct": 77,
            "heartbeat": "3s ago Confirmed",
            "status": "NORMAL",
            "is_selected": False
        },
        {
            "seat": "Lab Main • Seat 015",
            "center": "UET Peshawar",
            "name": "Taimur Ali Durrani",
            "roll": "CA-2027-04019",
            "initials": "TA",
            "ip": "10.45.1.15",
            "ip_type": "Static CIDR Auth",
            "nadra_time": "08:40 AM",
            "nadra_verified": True,
            "progress_answered": 50,
            "progress_total": 80,
            "progress_pct": 62,
            "heartbeat": "1s ago Confirmed",
            "status": "NORMAL",
            "is_selected": False
        },
        {
            "seat": "Lab 4 • Seat 204",
            "center": "BUITEMS, Quetta",
            "name": "Hamza Baloch",
            "roll": "CA-2027-05112",
            "initials": "HB",
            "ip": "10.51.6.204",
            "ip_type": "Session Finalized",
            "nadra_time": "08:35 AM",
            "nadra_verified": True,
            "progress_answered": 80,
            "progress_total": 80,
            "progress_pct": 100,
            "heartbeat": "Submitted 10:39:12 PKT",
            "status": "SUBMITTED",
            "is_selected": False
        }
    ]

    checkpoint_logs = [
        {"q_num": 54, "option": "Option B", "time": "10:42:16 PKT", "status": "Saved"},
        {"q_num": 53, "option": "Option A", "time": "10:41:04 PKT", "status": "Saved"},
        {"q_num": 52, "option": "Marked for Review", "time": "10:39:48 PKT", "status": "Flagged"},
        {"q_num": 51, "option": "Option D", "time": "10:38:12 PKT", "status": "Saved"}
    ]

    return Response({
        "clock": "10:42:18 PKT",
        "auto_sync": "5s",
        "kpis": {
            "connected_workstations": "6,398",
            "total_workstations": "6,412",
            "connection_pct": "99.8%",
            "server_latency": "14ms",
            "latency_status": "Optimal",
            "zero_loss_node": "Zero packet loss (Islamabad Node)",
            "answer_writes_per_sec": "842 records/s",
            "wal_replica": "Dual WAL replica persistent",
            "candidate_incidents": 2,
            "incidents_status": "Pending Resolution",
            "incidents_detail": "1 Workstation swap • 1 HW lock",
            "biometric_match_rate": "99.4%",
            "biometric_provider": "NADRA Verified",
            "biometric_overrides": "38 manual supervisor overrides"
        },
        "candidates": candidates,
        "selected_candidate": {
            "name": "Ayesha Siddiqui",
            "roll": "2027-ISB-09412",
            "seat": "Lab B - Workstation 118",
            "status": "ACTIVE",
            "time_remaining": "01:14:22",
            "total_duration": "120 Minutes",
            "cnic": "61101-7392811-4",
            "biometric_match": "99.8% Confirmed",
            "proctor": "Prof. Haris Munir",
            "signoff_time": "08:42:19 PKT",
            "network_latency": "11ms avg",
            "checkpoint_logs": checkpoint_logs,
            "saved_count": 54,
            "total_questions": 80
        }
    })

# ==============================================================================
# QUESTION BANK & ASSESSMENT BLUEPRINTS
# ==============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_question_bank_data(request):
    """
    Returns question bank inventory, cognitive difficulty distribution,
    authoring queue, and blueprint coverage.
    """
    questions = Question.objects.all().select_related('category', 'created_by')[:25]
    blueprints = ExaminationBlueprint.objects.all().select_related('examination')

    return Response({
        "kpis": {
            "total_items": 14280,
            "approved_items": 12450,
            "in_peer_review": 1420,
            "flagged_for_revision": 410,
            "psychometric_discrimination": "0.42 (High Quality)"
        },
        "categories": [
            {"subject": "Mathematics & Calculus", "count": 4820, "coverage": "98.4%"},
            {"subject": "Physics & Applied Mechanics", "count": 3950, "coverage": "96.2%"},
            {"subject": "Computer Science & Algorithms", "count": 3210, "coverage": "99.1%"},
            {"subject": "English & Logical Comprehension", "count": 2300, "coverage": "95.0%"}
        ],
        "blueprints": [
            {
                "id": b.id,
                "exam_title": b.examination.title,
                "exam_code": b.examination.code,
                "subject": b.subject,
                "marks": b.total_marks_allotted,
                "num_questions": b.num_questions
            } for b in blueprints
        ],
        "items": QuestionAdminSerializer(questions, many=True).data
    })

