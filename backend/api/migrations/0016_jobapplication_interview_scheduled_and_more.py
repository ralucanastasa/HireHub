# Generated by Django 5.1.2 on 2025-01-21 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_interviewinvitation_date_interviewinvitation_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobapplication',
            name='interview_scheduled',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='interviewer',
            name='token',
            field=models.CharField(default='szMQqp41bTuhGYmjS3892JOOS4WbxUD8XHz3qGc62q2uFxNWZRu18JpMcwlkr1GU', max_length=64, unique=True),
        ),
    ]
