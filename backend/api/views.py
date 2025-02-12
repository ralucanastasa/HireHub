import base64
from datetime import datetime, timedelta
from email.mime.text import MIMEText

from django.conf import settings
from django.db.models import Q
from google.oauth2.credentials import Credentials
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import get_object_or_404


from api.models import User, Job, JobApplication, Interviewer, EmployerProfile, InterviewInvitation, Note, \
    CandidateProfile, InterviewerProfile
from backend import settings
from .serializers import UserSerializer, JobSerializer, CustomTokenObtainPairSerializer, JobApplicationSerializer, \
    InviteInterviewerSerializer, InterviewerSerializer, InterviewInvitationSerializer, NoteSerializer, \
    InterviewerProfileSerializer, InterviewDetailsSerializer


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class JobListCreate(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Job.objects.filter(employer=self.request.user)
        category = self.request.query_params.getlist("category", [])
        work_type = self.request.query_params.getlist("work_type", [])
        level = self.request.query_params.getlist("level", [])
        employment_type = self.request.query_params.getlist("employment_type", [])

        if category:
            queryset = queryset.filter(category__in=category)
        if work_type:
            queryset = queryset.filter(work_type__in=work_type)
        if level:
            queryset = queryset.filter(level__in=level)
        if employment_type:
            queryset = queryset.filter(employment_type__in=employment_type)

        return queryset

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)


class JobListCandidate(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Job.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(Q(category__iexact=category))

        return queryset


class JobDetailUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Job.objects.none()
        return Job.objects.filter(employer=self.request.user)


class JobApplicationCreate(generics.CreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        job_id = self.kwargs['job_id']
        job = generics.get_object_or_404(Job, id=job_id)
        serializer.save(job=job, user=self.request.user)


class CandidateApplicationView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)


class ApplicationList(generics.ListAPIView):
    serializer_class = JobApplicationSerializer

    def get_queryset(self):
        job_id = self.kwargs['job_id']
        return JobApplication.objects.filter(job_id=job_id)


class ApplicationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer


class UpdateApplicationStatusView(generics.UpdateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get("status")

        if new_status not in ["pending", "accepted", "rejected"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        instance.status = new_status
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InviteInterviewerView(APIView):

    @staticmethod
    def send_email_with_gmail_api(service_account_file, from_email, to_email, subject, message_body):
        credentials = Credentials.from_service_account_file(
            service_account_file,
            scopes=['https://www.googleapis.com/auth/gmail.send'],
            subject=from_email
        )

        service = build('gmail', 'v1', credentials=credentials)

        message = MIMEText(message_body)
        message['to'] = to_email
        message['from'] = from_email
        message['subject'] = subject
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        try:
            send_message = service.users().messages().send(
                userId="me",
                body={'raw': raw_message}
            ).execute()
            print(f"Message sent successfully: {send_message}")
            return send_message
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            raise

    def post(self, request):
        serializer = InviteInterviewerSerializer(data=request.data)
        from_email = request.user.email

        if serializer.is_valid():
            email = serializer.validated_data['email']
            employer = request.user

            if not employer.role == 'Employer':
                return Response({'error': 'Only employers can invite interviewers.'}, status=status.HTTP_403_FORBIDDEN)

            user, created = User.objects.get_or_create(email=email, defaults={'role': 'Interviewer', 'username': email})
            interviewer, created = Interviewer.objects.get_or_create(user=user, company=employer)

            activation_link = f"{settings.FRONTEND_URL}/account/{interviewer.token}/"

            subject = "Interviewer Invitation"
            message_body = (
                f"Dear {email},\n\n"
                f"You have been invited to join as an interviewer. "
                f"Activate your account here: {activation_link}\n\n"
                f"Best regards,\n"
                f"{employer.first_name} {employer.last_name}"
            )

            try:
                self.send_email_with_gmail_api(settings.GOOGLE_SERVICE_ACCOUNT_FILE, from_email, email, subject,
                                               message_body)
            except Exception as e:
                return Response({'error': f'An error occurred while sending the invitation: {str(e)}'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'message': 'Invitation sent successfully.', 'token': interviewer.token},
                            status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateInterviewerView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request, token):
        try:
            interviewer = Interviewer.objects.get(token=token)

            if interviewer.is_active:
                return Response({'error': 'This account is already activated.'}, status=status.HTTP_400_BAD_REQUEST)

            user = interviewer.user
            data = request.data

            user.username = data.get('username', user.username)
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.set_password(data.get('password'))
            user.save()

            interviewer.activate()

            return Response({'message': 'Account activated successfully.'}, status=status.HTTP_200_OK)
        except Interviewer.DoesNotExist:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InterviewerListView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        interviewers = Interviewer.objects.filter(company=request.user)
        serializer = InterviewerSerializer(interviewers, many=True)
        return Response(serializer.data)


class SetInterviewView(APIView):

    @staticmethod
    def send_email_with_gmail_api(service_account_file, from_email, to_email_list, subject, message_body):
        credentials = Credentials.from_service_account_file(
            service_account_file,
            scopes=['https://www.googleapis.com/auth/gmail.send'],
            subject=from_email
        )

        service = build('gmail', 'v1', credentials=credentials)

        message = MIMEText(message_body)
        message['to'] = ", ".join(to_email_list)
        message['from'] = from_email
        message['subject'] = subject
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        try:
            send_message = service.users().messages().send(
                userId="me",
                body={'raw': raw_message}
            ).execute()
            print(f"Message sent successfully: {send_message}")
            return send_message
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            raise

    def post(self, request):
        serializer = InterviewInvitationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        invitation = serializer.save()

        date_var = request.data.get("date")
        time_var = request.data.get("time")
        application_id = request.data.get("application_id")
        candidate_email = request.data.get("candidate_email")
        interviewer_ids = request.data.get("interviewers")

        if not date_var or not time_var or not candidate_email or not interviewer_ids:
            return Response({"error": "Date, time, candidate email, and interviewers are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            application = JobApplication.objects.get(id=application_id)
            employer_email = application.job.employer.email
            employer = application.job.employer
        except JobApplication.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            interviewers = Interviewer.objects.filter(id__in=interviewer_ids)
            interviewer_emails = [interviewer.user.email for interviewer in interviewers]
        except Exception as e:
            return Response({"error": f"Error fetching interviewers: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            meeting_link, event_id = self.create_meeting_link(
                candidate_email=candidate_email,
                interviewers=interviewers,
                date_var=date_var,
                time_var=time_var,
                employer_email=employer_email
            )
        except Exception as e:
            return Response({"error": f"Meeting link generation failed: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        subject = "Interview Meeting Link"
        message_body = (
            f"Dear Candidate and Interviewers,\n\n"
            f"You are invited to an interview. Please use the following meeting link to join:\n"
            f"{meeting_link}\n\n"
            f"Best regards,\n"
            f"{application.job.company_name}"
        )

        recipient_list = [candidate_email] + interviewer_emails

        try:
            self.send_email_with_gmail_api(
                settings.GOOGLE_SERVICE_ACCOUNT_FILE,
                from_email=employer_email,
                to_email_list=recipient_list,
                subject=subject,
                message_body=message_body
            )
        except Exception as e:
            return Response({'error': f'An error occurred while sending the email: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        invitation.meeting_link = meeting_link
        invitation.event_id = event_id
        invitation.save()
        application.interview_scheduled = True
        application.save()

        return Response({
            "message": "Interview scheduled successfully! Emails sent.",
            "meeting_link": meeting_link
        }, status=status.HTTP_201_CREATED)

    @staticmethod
    def create_meeting_link(candidate_email, interviewers, date_var, time_var, employer_email):
        credentials = Credentials.from_service_account_file(
            settings.GOOGLE_SERVICE_ACCOUNT_FILE,
            scopes=['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
            subject=employer_email
        )
        service = build('calendar', 'v3', credentials=credentials)

        start_datetime = f"{date_var}T{time_var}:00"
        end_datetime = (datetime.strptime(start_datetime, "%Y-%m-%dT%H:%M:%S") + timedelta(hours=1)).isoformat()

        attendees = [{"email": candidate_email}] + [{"email": interviewer.user.email} for interviewer in interviewers]

        event = {
            'summary': 'Interview',
            'description': 'Interview meeting.',
            'start': {'dateTime': start_datetime, 'timeZone': 'UTC'},
            'end': {'dateTime': end_datetime, 'timeZone': 'UTC'},
            'attendees': attendees,
            'conferenceData': {
                'createRequest': {
                    'requestId': 'interview-meeting',
                    'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                }
            }
        }

        try:
            event_result = service.events().insert(
                calendarId='primary',
                body=event,
                conferenceDataVersion=1
            ).execute()
            return event_result.get('hangoutLink'), event_result.get('id')
        except Exception as e:
            print("Google Calendar API Error:", str(e))
            raise


class InterviewerInterviewsView(generics.ListAPIView):
    serializer_class = InterviewDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InterviewInvitation.objects.filter(interviewers__user=self.request.user)


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        interview_id = self.kwargs["interview_id"]
        interview = get_object_or_404(InterviewInvitation, id=interview_id, interviewers__user=self.request.user)
        return interview.notes.all()

    def perform_create(self, serializer):
        interview_id = self.kwargs["interview_id"]
        interview = get_object_or_404(InterviewInvitation, id=interview_id, interviewers__user=self.request.user)
        serializer.save(interview=interview, user=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Note.objects.none()
        return Note.objects.filter(user=self.request.user)


class EmployerInterviewsView(generics.ListAPIView):
    serializer_class = InterviewDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InterviewInvitation.objects.filter(application__job__employer=self.request.user)


class EmployerInterviewDeleteView(generics.RetrieveDestroyAPIView):
    serializer_class = InterviewDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return InterviewInvitation.objects.none()
        return InterviewInvitation.objects.filter(application__job__employer=self.request.user)

    def perform_destroy(self, instance):
        event_id = instance.event_id
        employer_email = instance.application.job.employer.email

        if event_id:
            try:
                credentials = Credentials.from_service_account_file(
                    settings.GOOGLE_SERVICE_ACCOUNT_FILE,
                    scopes=['https://www.googleapis.com/auth/calendar'],
                    subject=employer_email
                )
                service = build('calendar', 'v3', credentials=credentials)

                service.events().delete(calendarId='primary', eventId=event_id).execute()
                print(f"Event {event_id} deleted from Google Calendar.")
            except Exception as e:
                print(f"Error deleting event {event_id} from Google Calendar: {str(e)}")
                raise Exception("Failed to delete interview from Google Calendar.")

        instance.delete()


class EmployerInterviewNotesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, interview_id, *args, **kwargs):
        if not request.user.role == "Employer":
            return Response({"error": "Access denied."}, status=403)

        interview = InterviewInvitation.objects.filter(id=interview_id, application__job__employer=request.user).first()
        if not interview:
            return Response({"error": "Interview not found or unauthorized."}, status=404)

        notes = Note.objects.filter(interview=interview)
        data = NoteSerializer(notes, many=True).data
        return Response(data, status=200)


class CheckInterviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, application_id, *args, **kwargs):
        try:
            application = JobApplication.objects.get(id=application_id)
            interview_exists = InterviewInvitation.objects.filter(application=application).exists()

            return Response({"interview_exists": interview_exists}, status=status.HTTP_200_OK)
        except JobApplication.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employer = request.user
        employer_profile, _ = EmployerProfile.objects.get_or_create(user=employer)

        data = {
            "name": employer.first_name + " " + employer.last_name,
            "email": employer.email,
            "company_name": employer_profile.company_name,
            "industry": employer_profile.industry,
            "location": employer_profile.location,
            "website": employer_profile.website,
            "phone_number": employer_profile.phone_number,
            "company_description": employer_profile.company_description,
        }
        return Response(data)

    def put(self, request):
        employer_profile, _ = EmployerProfile.objects.get_or_create(user=request.user)
        for key, value in request.data.items():
            if key in ["company_name", "role"]:
                continue
            setattr(employer_profile, key, value)
        employer_profile.save()
        return Response({"message": "Profile updated successfully"})


class CandidateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        candidate = request.user
        candidate_profile, _ = CandidateProfile.objects.get_or_create(user=candidate)

        data = {
            "name": f"{candidate.first_name} {candidate.last_name}",
            "email": candidate.email,
            "phone": candidate_profile.phone,
            "location": candidate_profile.location,
            "resume": request.build_absolute_uri(candidate_profile.resume.url) if candidate_profile.resume else None,
        }
        return Response(data)

    def put(self, request):
        candidate_profile, _ = CandidateProfile.objects.get_or_create(user=request.user)

        for key, value in request.data.items():
            if key in ["name", "email"]:
                continue
            if key == "resume":
                candidate_profile.resume = value
            else:
                setattr(candidate_profile, key, value)

        candidate_profile.save()
        return Response({"message": "Profile updated successfully"})


class InterviewerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            interviewer_profile = InterviewerProfile.objects.get(user=request.user)
            serializer = InterviewerProfileSerializer(interviewer_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except InterviewerProfile.DoesNotExist:
            return Response({"error": "Interviewer profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            interviewer_profile = InterviewerProfile.objects.get(user=request.user)
            data = request.data

            restricted_fields = ["company_name"]
            for field in restricted_fields:
                if field in data:
                    return Response({field: "This field cannot be updated."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = InterviewerProfileSerializer(interviewer_profile, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Profile updated successfully", "data": serializer.data},
                                status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except InterviewerProfile.DoesNotExist:
            return Response({"error": "Interviewer profile not found"}, status=status.HTTP_404_NOT_FOUND)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not user.check_password(current_password):
            return Response({"error": "Incorrect current password"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "New passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)

        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
