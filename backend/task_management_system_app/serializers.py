# from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Task
from django.contrib.auth import get_user_model, authenticate
from .models import CustomUser

User=get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password= serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model=User
        fields=['id','username', 'email', 'password']

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

class GoogleRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, default='googleuser')

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'profile_picture', 'is_google_user')

    def create(self, validated_data):
        user, created =CustomUser.objects.get_or_create(
            email=validated_data['email'],
            defaults={
                'username':validated_data['username'],
                'profile_picture':validated_data.get('profile_picture', ''),
                'is_google_user':True,
                'password':validated_data.get('password', ''),
            },
        )
        if created:
            #Is a new user is created, set the password
            user.set_password(validated_data['password'])
            user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email= serializers.EmailField()
    password =serializers.CharField(write_only=True)

    def validate(self, data):
        # user =authenticate(username=data['email'], password=data['password'])
        # if user and user.is_active:
        #     return user
        
        user = authenticate(username=data['email'],password=data['password'])
        if user and user.is_active:
            return user
        
        
        raise serializers.ValidationError("Invalid Credentials")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields=['id','username','email']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id','name')
        # fields='__all__'



class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    user = serializers.CharField(source='assigned_to.email', read_only=True)
    assigned_to_email = serializers.EmailField(write_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'user', 'bookmarked', 'title', 'category','category_name', 'start_date', 
            'end_date', 'priority', 'description', 'location', 'completed', 'assigned_to_email'
        )

    def create(self, validated_data):
        #remove the user if it exists
        validated_data.pop('user',None)
        # Extract the `assigned_to_email` field and remove it from `validated_data`
        assigned_to_email = validated_data.pop('assigned_to_email', None)

        # Assign the user if the email is provided and the user exists
        if assigned_to_email:
            try:
                assigned_to_user = User.objects.get(email=assigned_to_email)
                validated_data['assigned_to'] = assigned_to_user
            except User.DoesNotExist:
                raise serializers.ValidationError(f"User with email {assigned_to_email} does not exist.")

        # Create the task with remaining validated data
        task = Task.objects.create(**validated_data)
        return task
    

# class TaskSerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source='category.name', read_only=True)
#     user=serializers.CharField(source='assigned_to.email', read_only=True)

#     #accept an email for assigning a user to the task 
#     assigned_to_email = serializers.EmailField(write_only=True)

#     class Meta:
#         model=Task
#         # fields=('title', 'category','category_name','user_name', 'assigned_to','start_date','end_date','priority','description','location','completed')
#         # fields='__all__' 
#         fields=('id','user','bookmarked','title','category_name','start_date','end_date','priority','description','location','completed','assigned_to_email')

#     def create(self, validated_data):
#         #extracthte email for assgnment from the validated data
#         assigned_to_email=validated_data.pop('assigned_to_email', None)

#         if assigned_to_email:
#             try:
#                 assgined_to_user = User.objects.get(email = assigned_to_email)
#                 validated_data['assigned_to']=assgined_to_user
#             except User.DoesNotExist:
#                 raise serializers.ValidationError(f"User with email {assigned_to_email} does not exist.")
            
#             # validated_data['assigned_to'] = assgined_to_user

#         task = super().create(**validated_data)
#         return task