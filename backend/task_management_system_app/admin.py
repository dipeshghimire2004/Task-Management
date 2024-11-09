from django.contrib import admin
from .models import Category, Task, CustomUser

# Register your models here.

class CustomUserAdmin(admin.ModelAdmin):
    list_display=('email','password', 'username')
    
admin.site.register(CustomUser, CustomUserAdmin)

class CategoryAdmin(admin.ModelAdmin):
    list_display=('name',)

admin.site.register(Category, CategoryAdmin )


class TaskAdmin(admin.ModelAdmin):
    list_display=('title','assigned_to', 'category', 'start_date','end_date','completed','location')
    list_filter = ('completed',)
    search_fields=('title','category_name')
admin.site.register(Task, TaskAdmin)

