from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class CustomUser(AbstractUser):
    is_google_user = models.BooleanField(default=False)
    profile_picture=models.URLField(null=True, blank=True)
    # name=models.CharField(max_length=100, blank=True)
    email=models.EmailField(unique=True)

    USERNAME_FIELD='email'  #specify that email is used for unique identification instead of default username
    REQUIRED_FIELDS=['username']
  
    def __str__(self) :
        return self.email
    


class Category(models.Model):
    name=models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    title=models.CharField(max_length=100)
    category=models.ForeignKey(Category, on_delete=models.CASCADE)
    # assigned_to=models.CharField( max_length=50)
    assigned_to=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tasks')
    start_date=models.DateTimeField()
    end_date=models.DateTimeField()
    PRIORITY_CHOICES=[(1,'Low'),(2,'Medium'),(3,'High')]
    priority=models.IntegerField(choices=PRIORITY_CHOICES ,default=1)
    description=models.TextField(default='')
    location=models.CharField(max_length=255, default='')
    completed=models.BooleanField(default=False)
    bookmarked=models.BooleanField(default=False)

    def __str__(self):
        return self.title
    

