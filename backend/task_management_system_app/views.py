from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    @action(detail=False, methods=['post'])
    def create_category(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    @action(detail=False, methods=['post'])
    def create_task(self, request):
        serializer = TaskSerializer(data=request.data)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# from rest_framework import viewsets
# from .models import Category, Task
# from .serializers import CategorySerializer, TaskSerializer

# @action(detail=False, methods=['post'])
# class CategoryViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet for performing CRUD operations on Category
#     """
#     serializer_class = CategorySerializer
#     queryset = Category.objects.all()
# @action(detail=False, methods=['post'])
# class TaskViewSet(viewsets.ModelViewSet):
#     """
#     ViewSet for performing CRUD operations on Task
#     """
#     serializer_class = TaskSerializer
#     queryset = Task.objects.all()
