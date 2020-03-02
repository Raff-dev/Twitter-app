# Generated by Django 3.0.2 on 2020-02-29 21:58

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_auto_20200228_1437'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='alias',
            field=models.CharField(blank=True, max_length=16, validators=[django.core.validators.RegexValidator('^[0-9a-zA-Z ]*$', 'Only alphanumeric characters are allowed.')]),
        ),
        migrations.AlterField(
            model_name='profile',
            name='description',
            field=models.TextField(blank=True, max_length=300),
        ),
        migrations.AlterField(
            model_name='profile',
            name='name',
            field=models.CharField(blank=True, max_length=36, null=True, validators=[django.core.validators.RegexValidator('^[a-zA-Z ]*$', 'Only letters are allowed.')]),
        ),
    ]
