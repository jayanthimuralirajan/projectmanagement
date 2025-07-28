from django.db import models

class UserLogin(models.Model):
    emailId = models.CharField(max_length=255, unique=True)
    userName = models.CharField(max_length=255)
    password = models.CharField(max_length=255)  
    def __str__(self):
        return self.userName

class Profile(models.Model):
    user = models.OneToOneField(UserLogin, on_delete=models.CASCADE)
    fullName = models.CharField(max_length=255)
    phoneNum = models.BigIntegerField()
    companyName = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    joiningDate = models.DateField()
    linkedIn = models.CharField(max_length=255)
    def __str__(self):
        return self.fullName

class Task(models.Model):
    PRIORITY_CHOICES = [('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High')]
    TASK_STATUS = [('PENDING', 'Pending'), ('COMPLETED', 'Completed')]
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    dueDate = models.DateField()
    taskCompleted = models.CharField(max_length=10, choices=TASK_STATUS)
    assignedTo = models.ForeignKey(UserLogin, on_delete=models.CASCADE)
    def __str__(self):
        return self.title
