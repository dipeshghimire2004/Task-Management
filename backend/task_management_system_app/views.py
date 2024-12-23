from django.shortcuts import get_object_or_404
from rest_framework import status,generics # type: ignore
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer, RegisterSerializer, LoginSerializer, UserSerializer, GoogleRegisterSerializer
from rest_framework.decorators import action
from django.db.models import Q
from .permissions import IsAdminUserOrReadOnly 
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from google.auth.transport import requests
from google.oauth2 import id_token

User=get_user_model()



# Authentication Views
class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created successfully', 'user': serializer.data}, 
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleRegisterview(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        serializer = GoogleRegisterSerializer(data=request.data)
        if serializer.is_valid:
            user=serializer.save()
            return Response({'message':'Google user registered successfully'}, status= status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        user = CustomUser.objects.filter(email=email).first()
        if user and user.is_google_user:
            return Response({"error":'Google users must login with Google'}, status=status.HTTP_400_BAD_REQUEST)
        return super.post(request, *args, **kwargs)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
     
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            if user.is_google_user:
                return Response({'error':'Google users must login with Google'}, status=status.HTTP_400_BAD_REQUEST)
            
            #Generate JWT tokens for normal user
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        token =  request.data.get('token')

        try:
            #verify the google login
            id_info = id_token.verify_oauth2_token(token, requests.Request())

            #Extract user information
            email= id_info['email']
            username=id_info.get('name')
            profilepicture = id_info.get('picture')

            #check if the user exists on database
            user, created
        except ValueError as e:
            return Response({'error': 'Invalid Google token'}, status=400)

        email = request.data.get('email')
        user =  CustomUser.objects.filter(email=email, isgoogle=True).first()
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh':str(refresh),
                'access':str(refresh.access_token),
            },status=status.HTTP_200_OK)
        return Response({'error':'USer not found or not a google user'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token =  RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)


class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    #needs to be completed


# Category Views
class CategoryListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # if not request.user_staff:
        #     return Response({'message':'only admin has access to create category'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Category created successfully', 'category': serializer.data}, 
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def get(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        if not request.user.is_staff:
            return Response({'message':'only admin has access to update category'}, status=status.HTTP_403_FORBIDDEN)
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(instance=category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response({'message':'Only admin can delete the the category'}, status=status.HTTP_403_FORBIDDEN)
         
        category = get_object_or_404(Category, pk=pk)
        category.delete()
        return Response({'message': 'Category deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# Task Views
class TaskListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def get(self, request):
        query = request.query_params.get('searchTerm','')
        if query:
            tasks = Task.objects.filter( Q(title__icontains=query) | Q(category__name__icontains=query))
        else:
            tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_staff:
            return Response({'message': "Only admin user is allowed to create task"}, status=status.HTTP_403_FORBIDDEN)
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'message': 'Task created successfully', 'task': serializer.data}, 
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def get(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        task =get_object_or_404(Task, pk=pk)
        if not request.user.is_staff:
            if 'completed' in request.data:
                task.completed=request.data['completed']
                task.save()
                return Response({'message':'task marked as completed'}, status=status.HTTP_200_OK)
            return Response({'error':'non-admin user can restriction to check mark only'}, status=status.HTTP_403_FORBIDDEN)

        serializer = TaskSerializer(instance=task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response({'message':'Only admin can delete the task'}, status=status.HTTP_403_FORBIDDEN)

        task = get_object_or_404(Task, pk=pk)
        task.delete()
        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    
    

class ToggleBookmarkView(APIView):
    permission_classes=[IsAuthenticated]
    
    def post(self, request, title):
        task=get_object_or_404(Task, title = title)
        task.bookmarked=not task.bookmarked
        # user=request.user
        # task.save(user)
        task.save()
        return Response({'bookmark':task.bookmarked}, status=status.HTTP_200_OK)
