from rest_framework import serializers
from .models import Category, Task
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name',)

class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name')
    user_name=serializers.CharField(source='assigned_to.username')
    class Meta:
        model=Task
        # fields=('title', 'category','category_name','user_name', 'assigned_to','start_date','end_date','priority','description','location','completed')
        fields='__all__' 