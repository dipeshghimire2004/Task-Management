from django.urls import path
from . import views


urlpatterns = [
    path('auth/register/', views.RegisterAPIView.as_view(), name='register'),
    path('auth/login/', views.LoginAPIView.as_view(), name='login'),
    path('auth/logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('users/', views.UserListAPIView.as_view(), name='user-list'),
    path('categories/', views.CategoryListCreateAPIView.as_view(), name='categories-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailAPIView.as_view(), name='categories-detail'),
    path('tasks/', views.TaskListCreateAPIView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', views.TaskDetailAPIView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/toogle_bookmark', views.ToggleBookmarkView.as_view(), name='toggle_bookmark'),
]
