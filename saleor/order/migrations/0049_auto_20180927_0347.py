# Generated by Django 2.0.3 on 2018-09-27 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0048_auto_20180629_1055'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='quantity',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='orderline',
            name='download_name',
            field=models.CharField(blank=True, default='results.zip', max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='orderline',
            name='exe_name',
            field=models.CharField(default='exe.py', max_length=255),
        ),
        migrations.AddField(
            model_name='orderline',
            name='param_file',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='orderline',
            name='result_file',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='orderline',
            name='status',
            field=models.CharField(choices=[('draft', 'Draft'), ('queue', 'Queue'), ('running', 'Running'), ('done', 'Done'), ('error', 'Error')], default='draft', max_length=32),
        ),
        migrations.AddField(
            model_name='orderline',
            name='upload_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='orderline',
            name='work_base',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='orderline',
            name='work_dir',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
