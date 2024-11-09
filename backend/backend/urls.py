"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# from task_management_system_app.views import  RegisterAPIView, LoginAPIView, LogoutAPIView, CategoryListCreateAPIView, CategoryDetailAPIView, TaskListCreateAPIView,TaskDetailAPIView 
# from django.http import HttpResponse
# from rest_framework import routers
# from task_management_system_app import views
# router = routers.DefaultRouter()
# router.register(r'auth', AuthViewSet, basename='auth')
# router.register(r'categories', CategoryViewSet, basename='categories')  # Changed basename to 'categories'
# router.register(r'tasks', TaskViewSet, basename='tasks')

# def home_view(request):
#     return HttpResponse("Welcome to the home page of taskmanagement")


from django.contrib import admin
from django.urls import path,include
from django.shortcuts import redirect

def root_redirect(request):
    return redirect('/api/categories')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('task_management_system_app.urls')),
    path('', root_redirect, name='root_redirect'),
   
]

    # path('', home_view, name='home')
 #  path('', TemplateView.as_view(template_name='index.html')),
    # path('api/auth/register/', RegisterAPIView.as_view(), name='register'),
    # path('api/auth/login/', LoginAPIView.as_view(), name='login'),
    # path('api/auth/logout/', LogoutAPIView.as_view(), name='logout'),

    # path('api/categories/', CategoryListCreateAPIView.as_view(), name='categories-list-create'),
    # path('api/categories/<int:pk>/', CategoryDetailAPIView.as_view(), name='categories-detail'),

    # path('api/tasks/', TaskListCreateAPIView.as_view(), name='task-list-create'),
    # path('api/tasks/<int:pk>/', TaskDetailAPIView.as_view(), name='task-detail'),