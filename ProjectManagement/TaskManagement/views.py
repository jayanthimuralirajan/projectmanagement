from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import UserLogin,Task
from .serializers import UserLoginSerializer,TaskSerializer

class TaskView(APIView):
    def get(self, request):
        assigned_to = request.GET.get('assignedTo') 
        tasks = Task.objects.filter(assignedTo=assigned_to) if assigned_to else Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        print("Received Task Data:", request.data) 
        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Task created successfully'}, status=status.HTTP_201_CREATED)

        print("Validation Errors:", serializer.errors)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            serializer = TaskSerializer(task, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Task updated successfully'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)


    def delete(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            task.delete()
            return Response({'message': 'Task deleted successfully'}, status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

class RegisterUserView(APIView):
    def post(self, request):
        data = request.data
        print("data:",data['password'])
        if 'userName' not in data or 'emailId' not in data or 'password' not in data:
            print(data)
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        # print(data)
        hashed_password = make_password(data['password'])
        print(hashed_password)
        data['password'] = hashed_password
        serializer = UserLoginSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUserView(APIView):
    def post(self, request):
        data = request.data
        print("received data:",data)
        if 'emailId' not in data or 'password' not in data:
            print("emailid and password required",data)
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserLogin.objects.get(emailId=data['emailId'])
            print("user:",user)
            if check_password(data['password'], user.password):
                user_data=UserLoginSerializer(user).data
                return Response({'message': 'Login successful', 'user': user_data}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
        except UserLogin.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class EmployeeView(APIView):
    def get(self, request):
        employees = UserLogin.objects.all()
        serializer = UserLoginSerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
      # POST method for adding a new employee (UserLogin)
    def post(self, request):
        data = request.data
        # Basic validation for required fields
        if 'userName' not in data or 'emailId' not in data or 'password' not in data:
            return Response({'error': 'Username, emailId, and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Hash the password before saving
        hashed_password = make_password(data['password'])
        data['password'] = hashed_password

        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) # Return created employee data
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT method for updating an existing employee (UserLogin)
    # The URL pattern for this will need to be 'employees/<int:pk>/'
    def put(self, request, pk): # pk (primary key) will come from the URL
        try:
            employee = UserLogin.objects.get(pk=pk)
        except UserLogin.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        # If password is provided in update, hash it
        if 'password' in data and data['password']:
            data['password'] = make_password(data['password'])
        else:
            # If password is not provided, ensure it's not accidentally cleared
            # It's generally better to handle password changes through a separate, secure endpoint
            # For simplicity here, we'll just remove it from data if empty
            data.pop('password', None) # Remove password if empty to prevent hashing empty string

        serializer = UserLoginSerializer(employee, data=data, partial=True) # partial=True allows partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE method for deleting an employee (UserLogin)
    # The URL pattern for this will also be 'employees/<int:pk>/'
    def delete(self, request, pk): # pk (primary key) will come from the URL
        try:
            employee = UserLogin.objects.get(pk=pk)
        except UserLogin.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) # 204 No Content for successful deletion
