from django.urls import path
from .views import RegisterUserView, LoginUserView, TaskView, EmployeeView

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterUserView.as_view(), name='register-user'),
    path('userlogins/', LoginUserView.as_view(), name='user-login'),

    # Task and Employee management endpoints
    path('tasks/', TaskView.as_view(), name='task-list'),
    path('tasks/<int:task_id>/', TaskView.as_view(), name='task-detail'),
    path('employees/', EmployeeView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeView.as_view(), name='employee-detail-update-delete'),
]
