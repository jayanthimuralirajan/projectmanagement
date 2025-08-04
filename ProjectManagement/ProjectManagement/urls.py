# from django.contrib import admin
# from django.urls import path
# from TaskManagement.views import RegisterUserView, LoginUserView, TaskView, EmployeeView

# urlpatterns = [
#     path('admin/', admin.site.urls),

#     # Authentication endpoints
#     path('api/register/', RegisterUserView.as_view(), name='register-user'),
#     path('api/userlogins/', LoginUserView.as_view(), name='user-login'),

#     # Task and Employee management endpoints
#     path('api/tasks/', TaskView.as_view(), name='task-list'),
#     path('api/tasks/<int:task_id>/', TaskView.as_view(), name='task-detail'),
#     path('api/employees/', EmployeeView.as_view(), name='employee-list-create'),
#     path('api/employees/<int:pk>/', EmployeeView.as_view(), name='employee-detail-update-delete'),
# ]
# ProjectManagement/urls.py
from django.contrib import admin
from django.urls import path
from TaskManagement.views import RegisterUserView, LoginUserView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterUserView.as_view(), name='register-user'),
    path('api/userlogins/', LoginUserView.as_view(), name='user-login'),
]

# We are intentionally removing the Task and Employee management endpoints for this test
# to focus on getting the registration working first. Once this works, you can add them back in.
