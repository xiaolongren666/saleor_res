# Generated by Django 2.0.3 on 2018-09-27 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checkout', '0008_rename_tables'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartline',
            name='param_file',
            field=models.FileField(blank=True, null=True, upload_to='saved_files/param_files'),
        ),
    ]