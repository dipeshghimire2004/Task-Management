from rest_framework import serializers
from .models import Category, Task
# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, authenticate

User=get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password= serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model=User
        fields=['username', 'email', 'password']

    def validate_email(self,value):
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists")
            return value

    def create(self, validated_data):
        user= User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            # password=validated_data['password']
        )
        user.set_password(validated_data['password'])     #hash the password
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email= serializers.EmailField()
    password =serializers.CharField(write_only=True)

    def validate(self, data):
        user =authenticate(username=data['email'], password=data['password'])
        if user and user.is_active:
            return user
        
        raise serializers.ValidationError("Invalid Credentials")




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id','name')
        # fields='__all__'


class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    # user_name=serializers.CharField(source='assigned_to.username', read_only=True)
    class Meta:
        model=Task
        # fields=('title', 'category','category_name','user_name', 'assigned_to','start_date','end_date','priority','description','location','completed')
        # fields='__all__' 
        fields=('id','title','category_name', 'assigned_to','start_date','end_date','priority','description','location','completed')