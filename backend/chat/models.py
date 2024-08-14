from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings
# import django
# django.setup()
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

# class ChatRoom(models.Model):
#     created_at = models.DateTimeField(auto_now_add=True, db_index=True)
#     updated_at = models.DateTimeField(auto_now=True, db_index=True)
#     participants = models.ManyToManyField(CustomUser, related_name="chat_rooms")
#     last_message = models.TextField(null=True, blank=True)
#     last_message_by = models.CharField(max_length=255, null=True, blank=True, db_index=True)

#     def __str__(self):
#         participant_usernames = [
#             participant.user.username for participant in self.participants.all()
#         ]
#         return ", ".join(participant_usernames) + f" (Room ID: {self.id})"
#     # name = models.CharField(max_length=100)
#     # participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_rooms')  # unique related_name
#     # created_at = models.DateTimeField(auto_now_add=True)

#     # def __str__(self):
#     #     return self.name
        
# class Message(models.Model):
#     chat_room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE, null=True)
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     content = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f'{self.user.email}: {self.content[:20]}'

class ChatRoom(models.Model):
    room_name = models.CharField(max_length=255, null= True)
    participants = models.ManyToManyField(CustomUser, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message = models.TextField(null=True, blank=True)
    last_message_by = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.room_name

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, related_name='messages', null=True, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.content[:20]}'

class DirectMessage(models.Model):
    chat_room = models.ForeignKey(ChatRoom, related_name='direct_messages', on_delete=models.CASCADE, null=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.sender} to {self.recipient} at {self.timestamp}'




class Chat(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chats')  # unique related_name

    def get_other_participant(self, user):
        return self.participants.exclude(id=user.id).first()


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    # Add other fields as needed

    def __str__(self):
        return self.user.email