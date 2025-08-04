from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Main project URL patterns
    path('admin/', admin.site.urls),
    # Include all API URLs under the /api/ path
    path('api/', include('TaskManagement.urls')),
]
