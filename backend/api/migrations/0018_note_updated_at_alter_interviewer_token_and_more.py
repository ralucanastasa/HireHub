# Generated by Django 5.1.2 on 2025-01-24 13:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_interviewer_token_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='interviewer',
            name='token',
            field=models.CharField(default='EhCboKEuWMDz8jwgZWiPHlr8hdeQTwEzVz3rZ3lXuj3aGqqlBUWaDyYkdOBkyZuy', max_length=64, unique=True),
        ),
        migrations.AlterField(
            model_name='note',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notes', to=settings.AUTH_USER_MODEL),
        ),
    ]
