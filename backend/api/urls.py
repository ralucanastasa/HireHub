from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

from .views import InviteInterviewerView, ActivateInterviewerView, \
    SetInterviewView, InterviewerListView, \
    InterviewerInterviewsView, NoteDetailView, EmployerInterviewsView, EmployerInterviewNotesView, CheckInterviewView, \
    CandidateApplicationView, EmployerProfileView, CandidateProfileView, InterviewerProfileView, ChangePasswordView, \
    NoteListCreateView, UpdateApplicationStatusView, EmployerInterviewDeleteView

urlpatterns = [
    path("jobs/", views.JobListCreate.as_view(), name="job-list"),
    path("all-jobs/", views.JobListCandidate.as_view(), name="all-jobs-list"),
    path("jobs/<int:pk>/", views.JobDetailUpdateDelete.as_view(), name="job-detail-update-delete"),
    path("jobs/<int:job_id>/application/", views.JobApplicationCreate.as_view(), name="apply-job"),
    path("jobs/<int:job_id>/applications/", views.ApplicationList.as_view(), name="job-applications"),
    path("applications/<int:pk>/", views.ApplicationDetail.as_view(), name="application-detail"),
    # path('applications/<int:app_id>/status/', UpdateApplicationStatus.as_view(), name='update-application-status'),
    path("applications/<int:pk>/", UpdateApplicationStatusView.as_view(), name="update-application"),

    path("user/applications/", CandidateApplicationView.as_view(), name="candidate-applications"),
    path('invitation/', InviteInterviewerView.as_view(), name="invite-interviewer"),
    path('account/<str:token>/', ActivateInterviewerView.as_view(), name="activate-interviewer"),
    path('interview/', SetInterviewView.as_view(), name='set-interview'),
    path('interviewers/', InterviewerListView.as_view(), name='interviewer-list'),
    path("interviewer/interviews/", InterviewerInterviewsView.as_view(), name="interviewer-interviews"),
    path("interviews/<int:interview_id>/notes/", NoteListCreateView.as_view(), name="note-list-create"),
    path("notes/<int:pk>/", NoteDetailView.as_view(), name="note-detail"),
    path("employer/interviews/", EmployerInterviewsView.as_view(), name="employer-interviews"),
    path("employer/interviews/<int:pk>/", EmployerInterviewDeleteView.as_view(), name="delete-interview"),
    path("employer/interviews/<int:interview_id>/notes/", EmployerInterviewNotesView.as_view(),
         name="employer-interview-notes"),
    path('applications/<int:application_id>/interview/', CheckInterviewView.as_view(), name='check-interview'),
    path('employer/profile/', EmployerProfileView.as_view(), name='employer-account'),
    path('candidate/profile/', CandidateProfileView.as_view(), name='candidate-profile'),
    path('interviewer/profile/', InterviewerProfileView.as_view(), name='interviewer-account'),
    path("user/password/", ChangePasswordView.as_view(), name="change-password"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
