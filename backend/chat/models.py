from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, AbstractUser, PermissionsMixin


# Create your models here.
# from django.db import models

# class Messages(models.Model):
#     user_id = models.IntegerField()
#     message = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.message

# class Message(models.Model):
#     user_id = models.IntegerField()
#     message = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.message


# class UserAManager(BaseUserManager):

# class CustomUser(AbstractUser):
#     # Add any additional fields here
#     bio = models.TextField(blank=True, null=True)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


# class ChatRoom(models.Model):
#     name = models.CharField(max_length=100)
#     participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_rooms')
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name


class ChatRoom(models.Model):
    name = models.CharField(max_length=100)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_rooms')  # unique related_name
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

        
class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username}: {self.content[:20]}'

# from django.db import models
# from django.conf import settings

# class DirectMessage(models.Model):
#     sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
#     recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages', on_delete=models.CASCADE)
#     content = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f'Message from {self.sender} to {self.recipient} at {self.timestamp}'
class DirectMessage(models.Model):
    chat_room = models.ForeignKey(ChatRoom, related_name='direct_messages', on_delete=models.CASCADE, null=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.sender} to {self.recipient} at {self.timestamp}'

# class Chat(models.Model):
#     participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_rooms')

#     def get_other_participant(self, user):
#         return self.participants.exclude(id=user.id).first()




class Chat(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chats')  # unique related_name

    def get_other_participant(self, user):
        return self.participants.exclude(id=user.id).first()