# # myapp/views.py
# from django.shortcuts import render, redirect
# from django.contrib.auth import login, authenticate, logout
# from .forms import CustomUserCreationForm
# from django.contrib.auth.decorators import login_required

# def signup(request):
#     if request.method == 'POST':
#         form = CustomUserCreationForm(request.POST)
#         if form.is_valid():
#             user = form.save()
#             login(request, user)
#             return redirect('home')
#     else:
#         form = CustomUserCreationForm()
#     return render(request, 'registration/signup.html', {'form': form})

# def login_view(request):
#     if request.method == 'POST':
#         email = request.POST['email']
#         password = request.POST['password']
#         user = authenticate(request, email=email, password=password)
#         if user is not None:
#             login(request, user)
#             return redirect('home')
#     return render(request, 'registration/login.html')

# def logout_view(request):
#     logout(request)
#     return redirect('login')  # Adjust as necessary


# # myapp/views.py
# @login_required
# def profile_update(request):
#     if request.method == 'POST':
#         form = CustomUserUpdateForm(request.POST, instance=request.user)
#         if form.is_valid():
#             form.save()
#             return redirect('profile_update')  # Redirect to a success page
#     else:
#         form = CustomUserUpdateForm(instance=request.user)
#     return render(request, 'registration/profile_update.html', {'form': form})


# myapp/views.py
from rest_framework import generics
from chat.models import CustomUser, ChatRoom, Message, DirectMessage
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, authenticate
from rest_framework.decorators import api_view, permission_classes
from .serializers import CustomUserSerializer, CustomUserRegistrationSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from rest_framework import status
from django.conf import settings
# from chat.models import CustomUser, Message
# from .models import DirectMessage
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import get_user_model

# Get the User model
User = get_user_model()

# class UserRegistrationView(generics.CreateAPIView):
#     queryset = CustomUser.objects.all()
#     serializer_class = CustomUserRegistrationSerializer
#     permission_classes = [AllowAny]

# @p
# class UserProfileView(generics.RetrieveUpdateAPIView):
#     serializer_class = CustomUserSerializer
#     permission_classes = [IsAuthenticated]

#     def get_object(self):
#         return self.request.user

@api_view(['POST'])
@permission_classes([AllowAny])
def user_registration_view(request):
    if request.method == 'POST':
        serializer = CustomUserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    user = request.user
    if request.method == 'GET':
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CustomUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        response = Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
        # response.set_cookie('refresh', str(refresh), httponly=True)
        # response.set_cookie('access', str(refresh.access_token), httponly=True)
        return response
    else:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def user_logout_view(request):
#     response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
#     response.delete_cookie('refresh')
#     response.delete_cookie('access')
#     logout(request)
#     return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_message_view(request, room_id):
    chat_room = get_object_or_404(ChatRoom, id=room_id)
    content = request.data.get('content', '')

    if not content:
        return Response({"detail": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

    message = Message.objects.create(chat_room=chat_room, user=request.user, content=content)

    return Response({"detail": "Message sent successfully.", "message": {
        "id": message.id,
        "user": message.user.username,
        "content": message.content,
        "timestamp": message.timestamp.isoformat()
    }}, status=status.HTTP_201_CREATED)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def send_direct_message(request):
#     recipient_id = request.data.get('recipient_id')
#     content = request.data.get('content', '')

#     if not content:
#         return Response({"detail": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

#     recipient = get_object_or_404(ChatRoom, id=recipient_id)
#     message = DirectMessage.objects.create(sender=request.user, recipient=recipient, content=content)

#     return Response({"detail": "Message sent successfully.", "message": {
#         "id": message.id,
#         "sender": message.sender.username,
#         "recipient": message.recipient.username,
#         "content": message.content,
#         "timestamp": message.timestamp.isoformat()
#     }}, status=status.HTTP_201_CREATED)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def send_direct_message(request):
#     recipient_id = request.data.get('recipient_id')
#     content = request.data.get('content', '')

#     if not content:
#         return Response({"detail": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

#     recipient = get_object_or_404(ChatRoom, id=recipient_id)
    
#     # Find an existing chat room or create a new one
#     chat_room, created = ChatRoom.objects.get_or_create(
#         participants__in=[request.user, recipient], defaults={}
#     )
#     if not created:
#         chat_room = ChatRoom.objects.filter(participants=request.user).filter(participants=recipient).first()
    
#     message = DirectMessage.objects.create(chat_room=chat_room, sender=request.user, recipient=recipient, content=content)

#     return Response({"detail": "Message sent successfully.", "message": {
#         "id": message.id,
#         "sender": message.sender.email,
#         "recipient": message.recipient.email,
#         "content": message.content,
#         "timestamp": message.timestamp.isoformat()
#     }}, status=status.HTTP_201_CREATED)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def send_direct_message(request):
#     recipient_id = request.data.get('recipient_id')
#     content = request.data.get('content', '')

#     if not content:
#         return Response({"detail": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

#     recipient = get_object_or_404(User, id=recipient_id)
    
#     # Find an existing chat room or create a new one
#     chat_room = ChatRoom.objects.filter(participants=request.user).filter(participants=recipient).first()
#     if not chat_room:
#         chat_room = ChatRoom.objects.create()
#         chat_room.participants.add(request.user, recipient)
    
#     message = DirectMessage.objects.create(chat_room=chat_room, sender=request.user, recipient=recipient, content=content)

#     return Response({"detail": "Message sent successfully.", "message": {
#         "id": message.id,
#         "sender": message.sender.email,
#         "recipient": message.recipient.email,
#         "content": message.content,
#         "timestamp": message.timestamp.isoformat()
#     }}, status=status.HTTP_201_CREATED)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_direct_message_history(request, user_id):
#     recipient = get_object_or_404(ChatRoom, id=user_id)
#     messages = DirectMessage.objects.filter(
#         Q(sender=request.user, recipient=recipient) |
#         Q(sender=recipient, recipient=request.user)
#     ).order_by('timestamp')

#     message_list = [{
#         "id": message.id,
#         "sender": message.sender.username,
#         "recipient": message.recipient.username,
#         "content": message.content,
#         "timestamp": message.timestamp.isoformat()
#     } for message in messages]

#     return Response(message_list, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_direct_message(request):
    recipient_id = request.data.get('recipient_id')
    content = request.data.get('content', '')

    if not content:
        return Response({"detail": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

    recipient = get_object_or_404(User, id=recipient_id)
    
    # Find an existing chat room or create a new one
    chat_room = ChatRoom.objects.filter(participants=request.user).filter(participants=recipient).first()
    if not chat_room:
        chat_room = ChatRoom.objects.create(name=f"Chat between {request.user.email} and {recipient.email}")
        chat_room.participants.add(request.user, recipient)
    
    message = DirectMessage.objects.create(chat_room=chat_room, sender=request.user, recipient=recipient, content=content)

    return Response({"detail": "Message sent successfully.", "message": {
        "id": message.id,
        "sender": message.sender.email,
        "recipient": message.recipient.email,
        "content": message.content,
        "timestamp": message.timestamp.isoformat()
    }}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_direct_message_history(request, user_id):
    recipient = get_object_or_404(User, id=user_id)
    chat_room = ChatRoom.objects.filter(participants=request.user).filter(participants=recipient).first()
    
    if not chat_room:
        return Response({"detail": "No chat history found."}, status=status.HTTP_404_NOT_FOUND)
    
    messages = DirectMessage.objects.filter(chat_room=chat_room).order_by('timestamp')

    message_list = [{
        "id": message.id,
        "sender": message.sender.email,
        "recipient": message.recipient.email,
        "content": message.content,
        "timestamp": message.timestamp.isoformat()
    } for message in messages]

    return Response(message_list, status=status.HTTP_200_OK)


# @login_required
# def get_user_chats(request):
#     user = request.user
#     chats = Chat.objects.filter(participants=user)
#     chat_list = [{
#         'chat_id': chat.id,
#         'receiver_id': chat.get_other_participant(user).id,
#         'receiver_name': chat.get_other_participant(user).username
#     } for chat in chats]
#     return JsonResponse(chat_list, safe=False)

@login_required
def get_user_chats(request):
    user = request.user
    chat_rooms = ChatRoom.objects.filter(participants=user).distinct()

    chat_list = []
    for chat_room in chat_rooms:
        messages = DirectMessage.objects.filter(chat_room=chat_room).order_by('timestamp')
        if messages.exists():
            last_message = messages.last()
            receiver = last_message.recipient if last_message.sender == user else last_message.sender
            chat_list.append({
                'chat_id': chat_room.id,
                'receiver_id': receiver.id,
                'receiver_name': f'{receiver.first_name} {receiver.last_name}',
                'last_message': last_message.content,
                'timestamp': last_message.timestamp
            })
    
    return JsonResponse(chat_list, safe=False)

from django.views.decorators.csrf import csrf_exempt



# @csrf_exempt
# @login_required
# def create_chat_room(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         room_name = data.get('name')
#         participants = data.get('participants', [])

#         chat_room = ChatRoom.objects.create(name=room_name)
#         chat_room.participants.add(request.user)  # Add the creator as a participant

#         for participant_id in participants:
#             participant = settings.AUTH_USER_MODEL.objects.get(id=participant_id)
#             chat_room.participants.add(participant)

#         return JsonResponse({'id': chat_room.id, 'name': chat_room.name}, status=201)

#     return JsonResponse({'error': 'Invalid request method'}, status=400)csrf_exempt
# @login_required
# def create_chat_room(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         room_name = data.get('name')
#         participants = data.get('participants', [])

#         chat_room = ChatRoom.objects.create(name=room_name)
#         chat_room.participants.add(request.user)  # Add the creator as a participant

#         for participant_id in participants:
#             participant = settings.AUTH_USER_MODEL.objects.get(id=participant_id)
#             chat_room.participants.add(participant)

#         return JsonResponse({'id': chat_room.id, 'name': chat_room.name}, status=201)

#     return JsonResponse({'error': 'Invalid request method'}, status=400)


# views.py
@api_view(['POST'])
def create_chat_room(request):
    user1 = request.user
    user2_id = request.data.get('user2_id')
    user2 = User.objects.get(id=user2_id)

    # Create unique room name in the format: chat_senderid_receiveridj
    room_name = f"chat_{user1.id}_{user2.id}"

    # Check if the chat room already exists
    chat_room, created = ChatRoom.objects.get_or_create(room_name=room_name)

    return Response({"room_name": chat_room.room_name}, status=status.HTTP_201_CREATED)
