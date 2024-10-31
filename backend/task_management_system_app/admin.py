from django.contrib import admin
from .models import Category, Task

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display=('name',)

admin.site.register(Category, CategoryAdmin )


class TaskAdmin(admin.ModelAdmin):
    list_display=('title','assigned_to', 'category', 'start_date','end_date','completed','location')
admin.site.register(Task, TaskAdmin)

