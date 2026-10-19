from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import (
    UserProfile, Institution, AdmissionsCycle, AcademicProgram,
    CandidateProfile, AcademicRecord, CandidateDocument, ExaminationCategory,
    ExaminationCenter, Laboratory, Workstation, Examination, ExaminationSession,
    ExaminationRegistration, AdmitCard, Question, QuestionOption,
    ExaminationBlueprint, CandidateAttempt, CandidateAnswer, CandidateResult,
    MeritPolicy, MeritList, MeritListEntry, UniversityApplication,
    ApplicationProgramPreference, FacultyReview, OperationalIncident, AuditLog
)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'phone_number', 'is_verified', 'institution']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'profile', 'is_staff', 'is_superuser']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = '__all__'

class AcademicProgramSerializer(serializers.ModelSerializer):
    institution_code = serializers.CharField(source='institution.code', read_only=True)
    institution_name = serializers.CharField(source='institution.name', read_only=True)

    class Meta:
        model = AcademicProgram
        fields = '__all__'

class AcademicRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicRecord
        fields = '__all__'

class CandidateDocumentSerializer(serializers.ModelSerializer):
    verified_by_name = serializers.SerializerMethodField()

    class Meta:
        model = CandidateDocument
        fields = '__all__'

    def get_verified_by_name(self, obj):
        return obj.verified_by.get_full_name() if obj.verified_by else ""

class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    academic_records = AcademicRecordSerializer(many=True, read_only=True)
    documents = CandidateDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = CandidateProfile
        fields = '__all__'

class ExaminationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExaminationCategory
        fields = '__all__'

class ExaminationCenterSerializer(serializers.ModelSerializer):
    superintendent_name = serializers.SerializerMethodField()
    lab_count = serializers.SerializerMethodField()

    class Meta:
        model = ExaminationCenter
        fields = '__all__'

    def get_superintendent_name(self, obj):
        return obj.superintendent.get_full_name() if obj.superintendent else ""

    def get_lab_count(self, obj):
        return obj.laboratories.count()

class LaboratorySerializer(serializers.ModelSerializer):
    center_code = serializers.CharField(source='center.code', read_only=True)
    center_name = serializers.CharField(source='center.name', read_only=True)
    workstation_count = serializers.SerializerMethodField()

    class Meta:
        model = Laboratory
        fields = '__all__'

    def get_workstation_count(self, obj):
        return obj.workstations.count()

class WorkstationSerializer(serializers.ModelSerializer):
    lab_name = serializers.CharField(source='laboratory.lab_name', read_only=True)

    class Meta:
        model = Workstation
        fields = '__all__'

class ExaminationSessionSerializer(serializers.ModelSerializer):
    center_name = serializers.CharField(source='center.name', read_only=True)
    center_city = serializers.CharField(source='center.city', read_only=True)
    examination_code = serializers.CharField(source='examination.code', read_only=True)
    examination_title = serializers.CharField(source='examination.title', read_only=True)

    class Meta:
        model = ExaminationSession
        fields = '__all__'

class ExaminationSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    admissions_cycle_name = serializers.CharField(source='admissions_cycle.name', read_only=True)
    sessions = ExaminationSessionSerializer(many=True, read_only=True)

    class Meta:
        model = Examination
        fields = '__all__'

class AdmitCardSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    candidate_roll_number = serializers.CharField(source='candidate.roll_number', read_only=True)
    candidate_cnic = serializers.CharField(source='candidate.cnic', read_only=True)
    examination_title = serializers.CharField(source='session.examination.title', read_only=True)
    examination_code = serializers.CharField(source='session.examination.code', read_only=True)
    session_date = serializers.DateField(source='session.session_date', read_only=True)
    shift = serializers.CharField(source='session.shift', read_only=True)
    reporting_time = serializers.TimeField(source='session.reporting_time', read_only=True)
    start_time = serializers.TimeField(source='session.start_time', read_only=True)
    center_name = serializers.CharField(source='session.center.name', read_only=True)
    center_address = serializers.CharField(source='session.center.address', read_only=True)

    class Meta:
        model = AdmitCard
        fields = '__all__'

    def get_candidate_name(self, obj):
        return obj.candidate.user.get_full_name() if obj.candidate and obj.candidate.user else ""

class ExaminationRegistrationSerializer(serializers.ModelSerializer):
    examination = ExaminationSerializer(read_only=True)
    admit_card = AdmitCardSerializer(read_only=True)
    assigned_session_details = ExaminationSessionSerializer(source='assigned_session', read_only=True)

    class Meta:
        model = ExaminationRegistration
        fields = '__all__'

class QuestionOptionCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'option_key', 'option_text']

class QuestionCandidateSerializer(serializers.ModelSerializer):
    options = QuestionOptionCandidateSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'subject', 'topic', 'difficulty', 'question_text', 'marks', 'options']

class QuestionOptionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = '__all__'

class QuestionAdminSerializer(serializers.ModelSerializer):
    options = QuestionOptionAdminSerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = '__all__'

    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else ""

class CandidateAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateAnswer
        fields = '__all__'

class CandidateAttemptSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    candidate_roll_number = serializers.CharField(source='candidate.roll_number', read_only=True)
    candidate_cnic = serializers.CharField(source='candidate.cnic', read_only=True)
    examination_title = serializers.CharField(source='session.examination.title', read_only=True)
    examination_code = serializers.CharField(source='session.examination.code', read_only=True)
    answers = CandidateAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = CandidateAttempt
        fields = '__all__'

    def get_candidate_name(self, obj):
        return obj.candidate.user.get_full_name() if obj.candidate and obj.candidate.user else ""

class MeritPolicySerializer(serializers.ModelSerializer):
    institution_code = serializers.CharField(source='institution.code', read_only=True)
    institution_name = serializers.CharField(source='institution.name', read_only=True)

    class Meta:
        model = MeritPolicy
        fields = '__all__'

class MeritListEntrySerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    candidate_roll_number = serializers.CharField(source='candidate.roll_number', read_only=True)

    class Meta:
        model = MeritListEntry
        fields = '__all__'

    def get_candidate_name(self, obj):
        return obj.candidate.user.get_full_name() if obj.candidate and obj.candidate.user else ""

class MeritListSerializer(serializers.ModelSerializer):
    institution_code = serializers.CharField(source='institution.code', read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    entries = MeritListEntrySerializer(many=True, read_only=True)

    class Meta:
        model = MeritList
        fields = '__all__'

class ApplicationProgramPreferenceSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name', read_only=True)

    class Meta:
        model = ApplicationProgramPreference
        fields = '__all__'

class FacultyReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model = FacultyReview
        fields = '__all__'

    def get_reviewer_name(self, obj):
        return obj.reviewer.get_full_name() if obj.reviewer else ""

class UniversityApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    candidate_roll_number = serializers.CharField(source='candidate.roll_number', read_only=True)
    institution_name = serializers.CharField(source='institution.name', read_only=True)
    institution_code = serializers.CharField(source='institution.code', read_only=True)
    preferences = ApplicationProgramPreferenceSerializer(many=True, read_only=True)
    faculty_reviews = FacultyReviewSerializer(many=True, read_only=True)

    class Meta:
        model = UniversityApplication
        fields = '__all__'

    def get_candidate_name(self, obj):
        return obj.candidate.user.get_full_name() if obj.candidate and obj.candidate.user else ""

class OperationalIncidentSerializer(serializers.ModelSerializer):
    center_code = serializers.CharField(source='center.code', read_only=True)
    center_name = serializers.CharField(source='center.name', read_only=True)
    logged_by_name = serializers.SerializerMethodField()

    class Meta:
        model = OperationalIncident
        fields = '__all__'

    def get_logged_by_name(self, obj):
        return obj.logged_by.get_full_name() if obj.logged_by else "Staff"

class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = '__all__'

    def get_actor_name(self, obj):
        return obj.actor.get_full_name() if obj.actor else "System"
