# task_management_system_app/scripts/remove_duplicates.py

from task_management_system_app.models import Category

def run():
    categories = Category.objects.all()
    seen = set()
    for category in categories:
        if category.name in seen:
            category.delete()
        else:
            seen.add(category.name)
