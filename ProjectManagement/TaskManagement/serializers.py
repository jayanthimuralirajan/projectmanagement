from rest_framework import serializers
from .models import UserLogin, Profile, Task

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLogin
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=UserLogin.objects.all())  
    class Meta:
        model = Profile
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    assignedTo = serializers.PrimaryKeyRelatedField(queryset=UserLogin.objects.all()) 
    class Meta:
        model = Task
        fields = '__all__'
