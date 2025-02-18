from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.crypto import get_random_string
from django.utils import timezone


def validate_file_type(value):
    if not value.name.endswith('.pdf') or value.name.endswith('.PDF'):
        raise ValidationError("Doar fisierele de tip PDF sunt permise.")


# Create your models here.
class User(AbstractUser):
    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"

    ROLE_CHOICES = [
        ('Candidate', 'Candidate'),
        ('Employer', 'Employer'),
        ('Interviewer', 'Interviewer'),
    ]
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    REQUIRED_FIELDS = ['role', 'email', 'first_name', 'last_name']


class Interviewer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='interviewer_profile')
    company = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interviewers', limit_choices_to={'role': 'Employer'})
    token = models.CharField(max_length=64, unique=True, default=get_random_string(64))
    is_active = models.BooleanField(default=False)
    invited_at = models.DateTimeField(auto_now_add=True)
    activated_at = models.DateTimeField(null=True, blank=True)

    def activate(self):
        self.is_active = True
        self.activated_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.user.email} - {self.company}"


class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    company_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.company_name} - {self.user.email}"


class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="candidate_profile")
    phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class InterviewerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="interviewer_account")
    phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=255)


class Job(models.Model):
    employer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255, blank=True, null=True)
    work_type = models.CharField(
        max_length=50,
        choices=[
            ('full_remote', 'Full Remote'),
            ('hybrid', 'Hybrid'),
        ]
    )
    level = models.CharField(
        max_length=50,
        choices=[
            ('apprentice', 'Apprentice'),
            ('junior', 'Junior'),
            ('intermediate', 'Intermediate'),
            ('senior', 'Senior'),
        ]
    )
    employment_type = models.CharField(
        max_length=50,
        choices=[
            ('full_time', 'Full Time'),
            ('part_time', 'Part Time'),
            ('internship', 'Internship'),
        ],
        default='full_time',
    )
    posted_date = models.DateTimeField(auto_now_add=True)
    closing_date = models.DateTimeField(blank=True, null=True)
    category = models.CharField(
        max_length=50, choices=[
            ('hr', 'HR'),
            ('it', 'IT'),
            ('accounting', 'Accounting'),
            ('marketing', 'Marketing'),
            ('design', 'Design'),
            ('sales', 'Sales'),
            ('engineering', 'Engineering'),
            ('customer_service', 'Customer Service'),
            ('finance', 'Finance'),
            ('administration', 'Administration'),
        ],
        default='it')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Job"
        verbose_name_plural = "Jobs"
        ordering = ['-posted_date']


class JobApplication(models.Model):
    job = models.ForeignKey(Job, related_name="applications", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='applications', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    resume = models.FileField(upload_to='resumes/', validators=[validate_file_type])
    status = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')],
        default='pending'
    )
    interview_scheduled = models.BooleanField(default=False)
    rejection_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.job.title}"


class InterviewInvitation(models.Model):
    meeting_link = models.URLField()
    posted_date = models.DateTimeField(auto_now_add=True)
    application = models.ForeignKey('JobApplication', on_delete=models.CASCADE)
    interviewers = models.ManyToManyField('Interviewer')
    candidate_email = models.EmailField()
    event_id = models.CharField(max_length=255, null=True, blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField(default='2025-01-01')
    time = models.TimeField(default='00:00:00')
    status = models.CharField(
        max_length=10,
        choices=[('sent', 'Sent'), ('accepted', 'Accepted'), ('declined', 'Declined')],
        default='sent'
    )

    def __str__(self):
        return f"Invitation for {self.application} - Status: {self.status}"

    class Meta:
        verbose_name = "InterviewInvitation"
        verbose_name_plural = "InterviewInvitation"
        ordering = ['-posted_date']


class Note(models.Model):
    interview = models.ForeignKey(InterviewInvitation, related_name="notes", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="notes", on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note by {self.user.email} on {self.interview}"

