# Generated by Django 5.1.2 on 2024-11-05 20:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_jobapplication_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='category',
            field=models.CharField(choices=[('hr', 'HR'), ('it', 'IT'), ('accounting', 'Accounting'), ('marketing', 'Marketing'), ('design', 'Design'), ('sales', 'Sales'), ('engineering', 'Engineering'), ('customer_service', 'Customer Service'), ('finance', 'Finance'), ('administration', 'Administration')], default='it', max_length=50),
        ),
        migrations.AlterField(
            model_name='job',
            name='employment_type',
            field=models.CharField(choices=[('full_time', 'Full Time'), ('part_time', 'Part Time'), ('internship', 'Internship')], default='full_time', max_length=50),
        ),
        migrations.AlterField(
            model_name='job',
            name='level',
            field=models.CharField(choices=[('apprentice', 'Apprentice'), ('junior', 'Junior'), ('intermediate', 'Intermediate'), ('senior', 'Senior')], max_length=50),
        ),
    ]
