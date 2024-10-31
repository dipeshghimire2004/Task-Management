from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    name=models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    title=models.CharField(max_length=100)
    category=models.ForeignKey(Category, on_delete=models.CASCADE)
    assigned_to=models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    start_date=models.DateTimeField()
    end_date=models.DateTimeField()
    priority=models.IntegerField(default=1)
    description=models.TextField(default='')
    location=models.CharField(max_length=255, default='')
    completed=models.BooleanField(default=False)

    def __str__(self):
        return self.title