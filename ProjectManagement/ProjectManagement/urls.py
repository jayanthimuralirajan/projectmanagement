
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Main project URL patterns
    path('admin/', admin.site.urls),
    # Include all URL patterns from the TaskManagement app
    path('', include('TaskManagement.urls')),
]

