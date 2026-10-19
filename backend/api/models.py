from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

# ==============================================================================
# 1. USER PROFILES & INSTITUTIONAL MEMBERSHIP
# ==============================================================================

class UserRole(models.TextChoices):
    SUPER_ADMIN = 'SUPER_ADMIN', 'Super Administrator'
    EXAM_CONTROLLER = 'EXAM_CONTROLLER', 'Examination Controller'
    QUESTION_SETTER = 'QUESTION_SETTER', 'Question Setter'
    QUESTION_REVIEWER = 'QUESTION_REVIEWER', 'Question Reviewer'
    CENTER_ADMIN = 'CENTER_ADMIN', 'Center Administrator'
    INVIGILATOR = 'INVIGILATOR', 'Invigilator / Proctor'
    RESULTS_OFFICER = 'RESULTS_OFFICER', 'Results Officer'
    UNIVERSITY_ADMIN = 'UNIVERSITY_ADMIN', 'University Admissions Administrator'
    FACULTY_REVIEWER = 'FACULTY_REVIEWER', 'Faculty Reviewer'
    CANDIDATE = 'CANDIDATE', 'Candidate / Applicant'

class Institution(models.Model):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True) # e.g. NUST, FAST-NU, GIKI, UET
    logo_url = models.URLField(blank=True, default='')
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=40, choices=UserRole.choices, default=UserRole.CANDIDATE)
    phone_number = models.CharField(max_length=30, blank=True, default='')
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff_members')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} [{self.role}]"

# ==============================================================================
# 2. ADMISSIONS CYCLES, PROGRAMS & SEAT MATRIX
# ==============================================================================

class AdmissionsCycle(models.Model):
    STATUS_CHOICES = (
        ('PLANNING', 'Planning'),
        ('ACTIVE', 'Active / In Progress'),
        ('CONCLUDED', 'Concluded'),
    )
    name = models.CharField(max_length=150) # e.g. "Cycle 2027-A Undergraduate"
    code = models.CharField(max_length=50, unique=True) # e.g. "2027-A-UG"
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.name} ({self.code})"

class AcademicProgram(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='programs')
    name = models.CharField(max_length=200) # e.g. "BS Computer Science"
    degree_level = models.CharField(max_length=50, default='Undergraduate') # Undergraduate, Postgraduate
    discipline = models.CharField(max_length=100) # Computing, Engineering, Medical, Business
    total_seats = models.PositiveIntegerField(default=100)
    open_merit_seats = models.PositiveIntegerField(default=80)
    quota_seats = models.PositiveIntegerField(default=20)
    min_ssc_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=60.00)
    min_hssc_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=60.00)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('institution', 'name')

    def __str__(self):
        return f"{self.name} - {self.institution.code}"

# ==============================================================================
# 3. CANDIDATE PROFILE, ACADEMIC RECORDS & VERIFICATION
# ==============================================================================

class CandidateProfile(models.Model):
    VERIFICATION_STATUS = (
        ('PENDING', 'Pending NADRA Verification'),
        ('VERIFIED', 'NADRA Verified'),
        ('REJECTED', 'Verification Failed'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    roll_number_prefix = models.CharField(max_length=20, default='CA-2027')
    roll_number = models.CharField(max_length=50, unique=True) # e.g. "CA-2027-01052"
    cnic = models.CharField(max_length=25, unique=True) # e.g. "61101-1234567-1"
    father_name = models.CharField(max_length=150)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20, choices=(('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')))
    domicile_district = models.CharField(max_length=100)
    domicile_province = models.CharField(max_length=100)
    permanent_address = models.TextField()
    current_address = models.TextField()
    disability_support_required = models.BooleanField(default=False)
    disability_details = models.TextField(blank=True, default='')
    emergency_contact_name = models.CharField(max_length=150, blank=True, default='')
    emergency_contact_phone = models.CharField(max_length=30, blank=True, default='')
    nadRA_verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='PENDING')
    profile_photo_url = models.URLField(blank=True, default='')
    completion_percentage = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_completion(self):
        score = 30 # Basic profile
        if self.nadRA_verification_status == 'VERIFIED':
            score += 20
        if self.academic_records.count() >= 2:
            score += 30
        if self.documents.filter(verification_status='VERIFIED').count() >= 2:
            score += 20
        self.completion_percentage = min(score, 100)
        self.save(update_fields=['completion_percentage'])
        return self.completion_percentage

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.roll_number})"

class AcademicRecord(models.Model):
    LEVEL_CHOICES = (
        ('MATRIC', 'Matriculation / SSC'),
        ('FSC', 'Intermediate / HSSC / FSc'),
        ('O_LEVEL', 'O-Level / Cambridge GCSE'),
        ('A_LEVEL', 'A-Level / Cambridge GCE'),
        ('BACHELORS', 'Bachelors / 16-Year Degree'),
    )
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='academic_records')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    institution_name = models.CharField(max_length=255)
    board_or_university = models.CharField(max_length=200)
    degree_title = models.CharField(max_length=150) # e.g. "Pre-Engineering", "Computer Science", "Science"
    passing_year = models.PositiveIntegerField()
    total_marks = models.DecimalField(max_digits=7, decimal_places=2)
    obtained_marks = models.DecimalField(max_digits=7, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    roll_number = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('candidate', 'level')

    def save(self, *args, **kwargs):
        if self.total_marks > 0:
            self.percentage = round((self.obtained_marks / self.total_marks) * 100, 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.candidate.roll_number} - {self.level} ({self.percentage}%)"

class CandidateDocument(models.Model):
    DOC_TYPES = (
        ('CNIC_FRONT', 'CNIC / B-Form Front'),
        ('CNIC_BACK', 'CNIC Back'),
        ('MATRIC_CERTIFICATE', 'Matriculation / SSC Sanad Certificate'),
        ('FSC_TRANSCRIPT', 'FSc / HSSC Detailed Marks Certificate (DMC)'),
        ('DOMICILE', 'Domicile / PRC Certificate'),
        ('PHOTOGRAPH', 'Passport Size Photograph with White Background'),
    )
    VERIFY_STATUS = (
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'Verified & Approved'),
        ('REJECTED', 'Rejected / Re-upload Requested'),
    )
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=30, choices=DOC_TYPES)
    file_path = models.CharField(max_length=500) # relative or storage path
    file_size_bytes = models.PositiveIntegerField(default=0)
    mime_type = models.CharField(max_length=100, default='application/pdf')
    verification_status = models.CharField(max_length=20, choices=VERIFY_STATUS, default='PENDING')
    reviewer_notes = models.TextField(blank=True, default='')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_candidate_docs')
    verified_at = models.DateTimeField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('candidate', 'document_type')

    def __str__(self):
        return f"{self.candidate.roll_number} - {self.document_type} [{self.verification_status}]"

# ==============================================================================
# 4. EXAMINATION MANAGEMENT, CENTERS, LABS & SESSIONS
# ==============================================================================

class ExaminationCategory(models.Model):
    name = models.CharField(max_length=150, unique=True) # e.g. "Engineering Entrance Test (ECAT)", "Computing Standard Test"
    code = models.CharField(max_length=50, unique=True) # e.g. "ECAT-ENG", "CS-STD", "MDCAT"
    description = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class ExaminationCenter(models.Model):
    STATUS_CHOICES = (
        ('READY', 'Readiness Confirmed & Operational'),
        ('INSPECTION_PENDING', 'Inspection Pending'),
        ('MAINTENANCE', 'Maintenance / Restricted'),
    )
    name = models.CharField(max_length=255) # e.g. "NUST Sector H-12 Campus", "FAST CFD Campus"
    code = models.CharField(max_length=50, unique=True) # e.g. "CTR-ISB-01"
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    address = models.TextField()
    authorized_ip_range = models.CharField(max_length=255, default='10.14.8.0/24')
    total_capacity = models.PositiveIntegerField(default=500)
    superintendent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_centers')
    readiness_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='READY')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} [{self.code}]"

class Laboratory(models.Model):
    center = models.ForeignKey(ExaminationCenter, on_delete=models.CASCADE, related_name='laboratories')
    lab_name = models.CharField(max_length=100) # e.g. "Lab B", "C3A High-Density Lab"
    floor = models.CharField(max_length=50, default='Ground Floor')
    capacity = models.PositiveIntegerField(default=60)
    is_operational = models.BooleanField(default=True)

    class Meta:
        unique_together = ('center', 'lab_name')

    def __str__(self):
        return f"{self.center.code} - {self.lab_name} (Cap: {self.capacity})"

class Workstation(models.Model):
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE, related_name='workstations')
    workstation_number = models.CharField(max_length=50) # e.g. "Desk #118"
    ip_address = models.GenericIPAddressField(default='10.14.8.118')
    mac_address = models.CharField(max_length=50, blank=True, default='')
    status = models.CharField(max_length=20, choices=(
        ('AVAILABLE', 'Available'),
        ('ASSIGNED', 'Assigned'),
        ('MAINTENANCE', 'Under Maintenance'),
        ('FAULTY', 'Faulty')
    ), default='AVAILABLE')

    class Meta:
        unique_together = ('laboratory', 'workstation_number')

    def __str__(self):
        return f"{self.laboratory.lab_name} - {self.workstation_number}"

class Examination(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('REGISTRATION_OPEN', 'Registration Open'),
        ('REGISTRATION_CLOSED', 'Registration Closed'),
        ('IN_PROGRESS', 'Active / Testing Window'),
        ('SCORING', 'Scoring & Evaluation'),
        ('RESULTS_PUBLISHED', 'Results Published'),
        ('CONCLUDED', 'Concluded'),
    )
    category = models.ForeignKey(ExaminationCategory, on_delete=models.CASCADE, related_name='examinations')
    admissions_cycle = models.ForeignKey(AdmissionsCycle, on_delete=models.CASCADE, related_name='examinations')
    title = models.CharField(max_length=255) # e.g. "ECAT & CS Standard Entry Test Cycle 2027"
    code = models.CharField(max_length=50, unique=True) # e.g. "EX-2027-0104"
    duration_minutes = models.PositiveIntegerField(default=120)
    total_marks = models.PositiveIntegerField(default=100)
    passing_marks = models.PositiveIntegerField(default=50)
    negative_marking = models.BooleanField(default=True)
    negative_marking_penalty = models.DecimalField(max_digits=4, decimal_places=2, default=0.25) # -0.25 marks per wrong answer
    registration_fee = models.DecimalField(max_digits=8, decimal_places=2, default=3000.00)
    registration_start = models.DateTimeField()
    registration_end = models.DateTimeField()
    instructions = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.code})"

class ExaminationSession(models.Model):
    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='sessions')
    center = models.ForeignKey(ExaminationCenter, on_delete=models.CASCADE, related_name='sessions')
    session_number = models.PositiveSmallIntegerField(default=1) # e.g. 1, 2
    session_date = models.DateField()
    shift = models.CharField(max_length=20, choices=(('MORNING', 'Morning 08:30 AM'), ('AFTERNOON', 'Afternoon 02:00 PM')))
    reporting_time = models.TimeField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_seats = models.PositiveIntegerField(default=300)
    allocated_seats = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('examination', 'center', 'session_date', 'shift')

    def __str__(self):
        return f"{self.examination.code} @ {self.center.name} - {self.session_date} ({self.shift})"

class ExaminationRegistration(models.Model):
    FEE_STATUS = (
        ('UNPAID', 'Awaiting Challan Payment'),
        ('VERIFIED', 'Payment Confirmed & Settled'),
        ('WAIVED', 'Scholarship / Fee Waived'),
    )
    REG_STATUS = (
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Registration Submitted'),
        ('APPROVED', 'Approved for Seat Allocation'),
        ('SEAT_ASSIGNED', 'Seat Assigned & Admit Card Ready'),
        ('REJECTED', 'Ineligible / Rejected'),
    )
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='registrations')
    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='registrations')
    preferred_center = models.ForeignKey(ExaminationCenter, on_delete=models.SET_NULL, null=True, related_name='preferred_registrations')
    assigned_session = models.ForeignKey(ExaminationSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='registered_candidates')
    challan_number = models.CharField(max_length=50, unique=True)
    fee_status = models.CharField(max_length=20, choices=FEE_STATUS, default='UNPAID')
    fee_amount = models.DecimalField(max_digits=8, decimal_places=2, default=3000.00)
    registration_status = models.CharField(max_length=20, choices=REG_STATUS, default='SUBMITTED')
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('candidate', 'examination')

    def __str__(self):
        return f"{self.candidate.roll_number} - {self.examination.code} [{self.registration_status}]"

class AdmitCard(models.Model):
    STATUS_CHOICES = (
        ('ISSUED', 'Issued & Validated'),
        ('REVOKED', 'Revoked / Barred'),
        ('ATTENDED', 'Attended Examination'),
    )
    registration = models.OneToOneField(ExaminationRegistration, on_delete=models.CASCADE, related_name='admit_card')
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='admit_cards')
    session = models.ForeignKey(ExaminationSession, on_delete=models.CASCADE, related_name='admit_cards')
    workstation = models.ForeignKey(Workstation, on_delete=models.SET_NULL, null=True, blank=True)
    desk_number = models.CharField(max_length=50, default='Desk #118')
    qr_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ISSUED')
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AdmitCard {self.candidate.roll_number} - {self.session.examination.code}"

# ==============================================================================
# 5. QUESTION BANK, BLUEPRINTS & CBT TEST ENGINE
# ==============================================================================

class Question(models.Model):
    DIFFICULTY_CHOICES = (
        ('EASY', 'Easy'),
        ('MEDIUM', 'Medium'),
        ('HARD', 'Hard'),
    )
    REVIEW_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_REVIEW', 'Pending Peer Review'),
        ('APPROVED', 'Statutorily Approved'),
        ('CHANGES_REQUESTED', 'Changes Requested'),
    )
    subject = models.CharField(max_length=100) # Mathematics, Physics, Computer Science, English
    topic = models.CharField(max_length=150) # e.g. "Calculus: Definite Integrals", "Electromagnetism"
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='MEDIUM')
    question_text = models.TextField()
    explanation = models.TextField(blank=True, default='')
    marks = models.DecimalField(max_digits=4, decimal_places=2, default=1.00)
    review_status = models.CharField(max_length=25, choices=REVIEW_CHOICES, default='DRAFT')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='authored_questions')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_questions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.subject}] {self.topic} ({self.difficulty}) - {self.review_status}"

class QuestionOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_key = models.CharField(max_length=5) # 'A', 'B', 'C', 'D'
    option_text = models.TextField()
    is_correct = models.BooleanField(default=False) # Server authoritative, never exposed to examinee

    class Meta:
        unique_together = ('question', 'option_key')

    def __str__(self):
        return f"Q{self.question.id} [{self.option_key}]: {self.option_text[:40]}"

class ExaminationBlueprint(models.Model):
    examination = models.OneToOneField(Examination, on_delete=models.CASCADE, related_name='blueprint')
    title = models.CharField(max_length=200)
    structure_json = models.JSONField(default=dict) # sections breakdown: [{"section": "Sec 1: Mathematics", "count": 30, "marks": 30}, ...]
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Blueprint: {self.examination.title}"

class CandidateAttempt(models.Model):
    ATTEMPT_STATUS = (
        ('INITIALIZED', 'Initialized / Verification Passed'),
        ('IN_PROGRESS', 'Active In Progress'),
        ('PAUSED', 'Paused by Proctor'),
        ('SUBMITTED', 'Final Submitted'),
        ('AUTO_SUBMITTED', 'Auto Submitted by System Timer'),
        ('TERMINATED', 'Terminated Due to Incident'),
    )
    registration = models.OneToOneField(ExaminationRegistration, on_delete=models.CASCADE, related_name='attempt')
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='attempts')
    session = models.ForeignKey(ExaminationSession, on_delete=models.CASCADE, related_name='attempts')
    workstation = models.ForeignKey(Workstation, on_delete=models.SET_NULL, null=True)
    started_at = models.DateTimeField(null=True, blank=True)
    scheduled_end_time = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    attempt_status = models.CharField(max_length=25, choices=ATTEMPT_STATUS, default='INITIALIZED')
    ip_address = models.GenericIPAddressField(default='10.14.8.118')
    submission_receipt_token = models.CharField(max_length=100, blank=True, default='')
    last_heartbeat_at = models.DateTimeField(auto_now=True)
    wal_version = models.PositiveIntegerField(default=1) # Write-Ahead Logging sync count

    def __str__(self):
        return f"Attempt {self.candidate.roll_number} - {self.session.examination.code} [{self.attempt_status}]"

class CandidateAnswer(models.Model):
    attempt = models.ForeignKey(CandidateAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=5, blank=True, default='') # 'A', 'B', 'C', 'D' or empty
    is_flagged = models.BooleanField(default=False)
    saved_at = models.DateTimeField(auto_now=True)
    client_wal_version = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('attempt', 'question')

    def __str__(self):
        return f"Attempt {self.attempt.id} - Q{self.question_id}: Ans {self.selected_option} (Flag: {self.is_flagged})"

# ==============================================================================
# 6. SCORING, RESULTS & STATUTORY MERIT POLICY ENGINE
# ==============================================================================

class CandidateResult(models.Model):
    attempt = models.OneToOneField(CandidateAttempt, on_delete=models.CASCADE, related_name='result')
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='results')
    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name='results')
    total_questions = models.PositiveIntegerField(default=100)
    attempted_questions = models.PositiveIntegerField(default=0)
    correct_answers = models.PositiveIntegerField(default=0)
    wrong_answers = models.PositiveIntegerField(default=0)
    unanswered = models.PositiveIntegerField(default=0)
    raw_score = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    total_marks = models.DecimalField(max_digits=6, decimal_places=2, default=100.00)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    percentile = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    is_passed = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    calculated_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.candidate.roll_number} - Score: {self.raw_score}/{self.total_marks} ({self.percentage}%)"

class MeritPolicy(models.Model):
    POLICY_STATUS = (
        ('DRAFT', 'Draft Policy'),
        ('ACTIVE', 'Statutorily Active'),
        ('SUPERSEDED', 'Superseded / Archived'),
    )
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='merit_policies')
    admissions_cycle = models.ForeignKey(AdmissionsCycle, on_delete=models.CASCADE, related_name='merit_policies')
    title = models.CharField(max_length=255) # e.g. "Undergraduate Engineering & Computing Merit Policy 2027"
    version = models.CharField(max_length=20, default='v1.0')
    test_weightage = models.DecimalField(max_digits=5, decimal_places=2, default=50.00) # 50%
    hssc_weightage = models.DecimalField(max_digits=5, decimal_places=2, default=40.00) # 40%
    ssc_weightage = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)  # 10%
    min_aggregate_threshold = models.DecimalField(max_digits=5, decimal_places=2, default=65.00)
    tie_breaking_rules = models.TextField(default="1. Higher Entry Test Score\n2. Higher FSc Mathematics Marks\n3. Higher FSc Physics Marks\n4. Age seniority")
    status = models.CharField(max_length=20, choices=POLICY_STATUS, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.institution.code} - {self.title} ({self.version})"

class MeritList(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft Ranking Generated'),
        ('PROVISIONAL', 'Provisional List Published (Objection Window Open)'),
        ('FINAL_APPROVED', 'Final Sealed & Statutory Published'),
    )
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='merit_lists')
    admissions_cycle = models.ForeignKey(AdmissionsCycle, on_delete=models.CASCADE, related_name='merit_lists')
    program = models.ForeignKey(AcademicProgram, on_delete=models.CASCADE, related_name='merit_lists')
    policy = models.ForeignKey(MeritPolicy, on_delete=models.PROTECT, related_name='merit_lists')
    title = models.CharField(max_length=255) # e.g. "1st Provisional Merit List - BS Computer Science"
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='DRAFT')
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} [{self.status}]"

class MeritListEntry(models.Model):
    ADMISSION_STATUS = (
        ('OFFERED', 'Admission Offered (Fee Voucher Issued)'),
        ('WAITLISTED', 'Waitlisted'),
        ('ADMITTED', 'Fee Paid & Admitted'),
        ('DECLINED', 'Offer Declined / Lapsed'),
    )
    merit_list = models.ForeignKey(MeritList, on_delete=models.CASCADE, related_name='entries')
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='merit_entries')
    rank = models.PositiveIntegerField()
    test_score = models.DecimalField(max_digits=5, decimal_places=2)
    hssc_score = models.DecimalField(max_digits=5, decimal_places=2)
    ssc_score = models.DecimalField(max_digits=5, decimal_places=2)
    aggregate_score = models.DecimalField(max_digits=6, decimal_places=3)
    quota_category = models.CharField(max_length=50, default='Open Merit')
    admission_status = models.CharField(max_length=25, choices=ADMISSION_STATUS, default='WAITLISTED')

    class Meta:
        unique_together = ('merit_list', 'rank')
        ordering = ['rank']

    def __str__(self):
        return f"Rank #{self.rank}: {self.candidate.roll_number} - Aggregate {self.aggregate_score}%"

# ==============================================================================
# 7. UNIVERSITY ADMISSIONS & FACULTY COMMITTEE WORKSPACE
# ==============================================================================

class UniversityApplication(models.Model):
    STATUS_CHOICES = (
        ('SUBMITTED', 'Submitted'),
        ('DOCS_VERIFIED', 'Documents Verified'),
        ('UNDER_FACULTY_REVIEW', 'Under Faculty Committee Review'),
        ('PROVISIONALLY_ACCEPTED', 'Provisionally Accepted'),
        ('WAITLISTED', 'Waitlisted'),
        ('ADMITTED', 'Admitted'),
        ('REJECTED', 'Rejected'),
    )
    application_number = models.CharField(max_length=50, unique=True) # e.g. "APP-2027-NUST-0091"
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='university_applications')
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='applications')
    cycle = models.ForeignKey(AdmissionsCycle, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='SUBMITTED')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_applications')
    verification_notes = models.TextField(blank=True, default='')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.application_number} - {self.candidate.roll_number} ({self.institution.code})"

class ApplicationProgramPreference(models.Model):
    application = models.ForeignKey(UniversityApplication, on_delete=models.CASCADE, related_name='preferences')
    program = models.ForeignKey(AcademicProgram, on_delete=models.CASCADE)
    preference_order = models.PositiveSmallIntegerField(default=1) # 1, 2, 3...

    class Meta:
        unique_together = ('application', 'preference_order')
        ordering = ['preference_order']

    def __str__(self):
        return f"{self.application.application_number} Pref #{self.preference_order}: {self.program.name}"

class FacultyReview(models.Model):
    application = models.ForeignKey(UniversityApplication, on_delete=models.CASCADE, related_name='faculty_reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conducted_reviews')
    academic_evaluation_score = models.DecimalField(max_digits=4, decimal_places=1, default=8.5) # out of 10
    test_suitability_score = models.DecimalField(max_digits=4, decimal_places=1, default=9.0) # out of 10
    recommendation = models.CharField(max_length=30, choices=(
        ('STRONG_ADMIT', 'Strongly Recommend Admission'),
        ('ADMIT', 'Recommend Admission'),
        ('WAITLIST', 'Waitlist Pending Second Shift'),
        ('REJECT', 'Do Not Recommend')
    ), default='ADMIT')
    evaluation_notes = models.TextField()
    conflict_of_interest_declared = models.BooleanField(default=False)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('application', 'reviewer')

    def __str__(self):
        return f"Review by {self.reviewer.username} on {self.application.application_number}"

# ==============================================================================
# 8. INCIDENTS, MONITORING & AUDIT LOGGING
# ==============================================================================

class OperationalIncident(models.Model):
    SEVERITY_CHOICES = (
        ('LOW', 'Low Priority'),
        ('MEDIUM', 'Medium Priority'),
        ('HIGH', 'High Priority'),
        ('CRITICAL', 'Critical Emergency'),
    )
    STATUS_CHOICES = (
        ('OPEN', 'Open / Investigating'),
        ('RESOLVED', 'Resolved'),
        ('ESCALATED', 'Escalated to Ministry'),
    )
    session = models.ForeignKey(ExaminationSession, on_delete=models.CASCADE, related_name='incidents')
    center = models.ForeignKey(ExaminationCenter, on_delete=models.CASCADE, related_name='incidents')
    laboratory = models.ForeignKey(Laboratory, on_delete=models.SET_NULL, null=True, blank=True)
    workstation = models.ForeignKey(Workstation, on_delete=models.SET_NULL, null=True, blank=True)
    candidate_attempt = models.ForeignKey(CandidateAttempt, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100) # e.g. "Workstation Replacement", "Network Latency Spike", "Biometric Mismatch"
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    description = models.TextField()
    resolution_notes = models.TextField(blank=True, default='')
    logged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='logged_incidents')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"[{self.severity}] {self.title} @ {self.center.code}"

class AuditLog(models.Model):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_actions')
    action = models.CharField(max_length=150) # e.g. "MERIT_POLICY_SIGNED", "ADMIT_CARD_GENERATED", "EXAM_SUBMITTED"
    entity_name = models.CharField(max_length=100)
    entity_id = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField(default='127.0.0.1')
    details = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')} | {self.actor} | {self.action}"
