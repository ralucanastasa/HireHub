from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from api.models import User, Job, JobApplication, Interviewer, EmployerProfile, InterviewInvitation, Note, \
    CandidateProfile, InterviewerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email', 'role']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token


class InterviewerSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = Interviewer
        fields = ['id', 'first_name', 'last_name', 'email', 'company', 'is_active', 'invited_at', 'activated_at']


class InviteInterviewerSerializer(serializers.Serializer):
    email = serializers.EmailField()


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'company_name', 'description', 'location', 'work_type', 'level', 'employment_type',
                  'posted_date', 'closing_date', 'employer', 'category']
        extra_kwargs = {
            'employer': {'read_only': True},
            'posted_date': {'read_only': True}
        }


def validate_resume(value):
    if not value.name.endswith('.pdf'):
        raise serializers.ValidationError("Doar fișiere de tip PDF sunt permise.")
    return value


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company_name', read_only=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'job_title', 'company_name', 'user', 'name', 'email', 'resume', 'status',
                  'interview_scheduled', 'rejection_reason']
        extra_kwargs = {'job': {'read_only': True}}

    def create(self, validated_data):
        return JobApplication.objects.create(**validated_data)


class InterviewInvitationSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField()
    interviewers = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    candidate_email = serializers.EmailField()
    date = serializers.DateField()
    time = serializers.TimeField()
    meeting_link = serializers.CharField(read_only=True)

    class Meta:
        model = InterviewInvitation
        fields = ['application_id', 'interviewers', 'candidate_email', 'date', 'time', 'meeting_link', 'sent_at',
                  'status']

    def create(self, validated_data):
        application_id = validated_data.pop('application_id')
        interviewers = validated_data.pop('interviewers')
        invitation = InterviewInvitation.objects.create(
            application_id=application_id,
            **validated_data
        )
        invitation.interviewers.set(interviewers)
        return invitation


class InterviewDetailsSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source="application.name", read_only=True)
    job_title = serializers.CharField(source="application.job.title", read_only=True)
    job_level = serializers.CharField(source="application.job.level", read_only=True)
    resume = serializers.SerializerMethodField()

    class Meta:
        model = InterviewInvitation
        fields = ["id", "candidate_name", "job_title", "job_level", "resume", "date", "time"]

    def get_resume(self, obj):
        if obj.application and obj.application.resume:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.application.resume.url)
            return obj.application.resume.url
        return None


class NoteSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = ["id", "user_email", "full_name", "content", "created_at", "updated_at"]

    @staticmethod
    def get_full_name(obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['company_name', 'industry', 'location', 'website', 'phone_number', 'company_description']


class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['phone', 'location', 'resume']


class InterviewerProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    class Meta:
        model = InterviewerProfile
        fields = ["name", "email", "phone", "location", "company_name"]

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_email(self, obj):
        return obj.user.email

