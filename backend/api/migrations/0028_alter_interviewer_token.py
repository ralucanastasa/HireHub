# Generated by Django 5.1.2 on 2025-02-16 23:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_alter_interviewer_token_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interviewer',
            name='token',
            field=models.CharField(default='hzpu9822MB53Q9EIFJjFHlCJrZPwnrX3U5PaNnhd55QSDtMKqDxWdlzE3QtTEmzZ', max_length=64, unique=True),
        ),
    ]
