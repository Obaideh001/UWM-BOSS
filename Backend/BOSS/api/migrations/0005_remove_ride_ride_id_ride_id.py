# Generated by Django 5.1.2 on 2024-10-10 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_user_user_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ride',
            name='ride_id',
        ),
        migrations.AddField(
            model_name='ride',
            name='id',
            field=models.BigAutoField(auto_created=True, default=-1, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
    ]