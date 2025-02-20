# Generated by Django 5.1.2 on 2025-01-09 16:25

import django.db.models.deletion
import django.utils.crypto
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_job_category_alter_job_employment_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('Candidate', 'Candidate'), ('Employer', 'Employer'), ('Interviewer', 'Interviewer')], max_length=15),
        ),
        migrations.CreateModel(
            name='Interviewer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(default=django.utils.crypto.get_random_string, max_length=64, unique=True)),
                ('is_active', models.BooleanField(default=False)),
                ('invited_at', models.DateTimeField(auto_now_add=True)),
                ('activated_at', models.DateTimeField(blank=True, null=True)),
                ('company', models.ForeignKey(limit_choices_to={'role': 'Employer'}, on_delete=django.db.models.deletion.CASCADE, related_name='interviewers', to=settings.AUTH_USER_MODEL)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='interviewer_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
