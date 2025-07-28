

from django.contrib import admin
from django.urls import path
from TaskManagement.views import RegisterUserView,LoginUserView,TaskView,EmployeeView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('userlogins/', LoginUserView.as_view(), name='user-login'),
    path('tasks/', TaskView.as_view(), name='task-list'),
    path('tasks/<int:task_id>/', TaskView.as_view(), name='task-detail'),
    path('employees/', EmployeeView.as_view(), name='employee_view'),
    path('admin/', admin.site.urls),
    path('employees/', EmployeeView.as_view(), name='employee-list-create'), # Handles GET (list) and POST (create)
    path('employees/<int:pk>/', EmployeeView.as_view(), name='employee-detail-update-delete'), # Handles GET (detail), PUT (update), DELETE (delete)

]

