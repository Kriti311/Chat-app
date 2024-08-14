# from rest_framework import generics
# from chat.models import CustomUser, ChatRoom, Message, DirectMessage
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.response import Response
# from django.contrib.auth import login, authenticate
# from rest_framework.decorators import api_view, permission_classes
# from .serializers import CustomUserSerializer, CustomUserRegistrationSerializer, ChatRoomSerializer, MessageSerializer, UserSerializer
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import authenticate
# from django.http import JsonResponse
# from django.contrib.auth.decorators import login_required
# from rest_framework import status
# from django.conf import settings
# from chat.models import ChatRoom, Chat 
# from django.shortcuts import get_object_or_404
# from django.db.models import Q
# from django.contrib.auth import get_user_model

# # Get the User model
# User = get_user_model()



# @api_view(['POST'])
# @permission_classes([AllowAny])
# def user_registration_view(request):
#     if request.method == 'POST':
#         serializer = CustomUserRegistrationSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response({"id": user.id}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT'])
# @permission_classes([IsAuthenticated])
# def user_profile_view(request):
#     user = request.user
#     if request.method == 'GET':
#         serializer = CustomUserSerializer(user)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = CustomUserSerializer(user, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def user_login_view(request):
#     email = request.data.get('email')
#     password = request.data.get('password')
#     user = authenticate(request, username=email, password=password)

#     if user is not None:
#         refresh = RefreshToken.for_user(user)
#         response = Response({
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#         }, status=status.HTTP_200_OK)
#         # response.set_cookie('refresh', str(refresh), httponly=True)
#         # response.set_cookie('access', str(refresh.access_token), httponly=True)
#         return response
#     else:
#         return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def user_logout_view(request):
#     try:
#         refresh_token = request.data.get('refresh_token')
#         token = RefreshToken(refresh_token)
#         token.blacklist()
#         return Response(status=status.HTTP_205_RESET_CONTENT)
#     except Exception as e:
#         return Response(status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def post_message_view(request, room_id):
#     chat_room = get_object_or_404(ChatRoom, id=room_id)
#     content = request.data.get('content', '')

#     if not content:
#         return Response({"detail": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

#     message = Message.objects.create(chat_room=chat_room, user=request.user, content=content)

#     # Update last message in the chat room
#     chat_room.last_message = content
#     chat_room.last_message_by = request.user
#     chat_room.save()

#     return Response({"detail": "Message sent successfully.", "message": {
#         "id": message.id,
#         "user": message.user.username,
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
#         chat_room = ChatRoom.objects.create(room_name=f"Chat between {request.user.email} and {recipient.email}")
#         chat_room.participants.add(request.user, recipient)
    
#     message = DirectMessage.objects.create(chat_room=chat_room, sender=request.user, recipient=recipient, content=content)

#     # Update last message in the chat room
#     chat_room.last_message = content
#     chat_room.last_message_by = request.user
#     chat_room.save()

#     return Response({"detail": "Message sent successfully.", "message": {
#         "id": message.id,
#         "sender": message.sender.email,
#         "recipient": message.recipient.email,
#         "content": message.content,
#         "timestamp": message.timestamp.isoformat()
#     }}, status=status.HTTP_201_CREATED)


# def get_direct_message_history(request, user_id):
#     recipient = get_object_or_404(User, id=user_id)
#     chat_room = ChatRoom.objects.filter(participants=request.user).filter(participants=recipient).first()
    
#     if not chat_room:
#         return Response({"detail": "No chat history found."}, status=status.HTTP_404_NOT_FOUND)
    
#     messages = DirectMessage.objects.filter(chat_room=chat_room).order_by('timestamp')

#     message_list = [{
#         "id": message.id,
#         "sender": message.sender.email,
#         "recipient": message.recipient.email,
#         "content": message.content,
#         "timestamp": message.timestamp.isoformat()
#     } for message in messages]

#     return Response(message_list, status=status.HTTP_200_OK)

# @login_required
# def get_user_chats(request):
#     user = request.user
#     chat_rooms = ChatRoom.objects.filter(participants=user).distinct()

#     chat_list = []
#     for chat_room in chat_rooms:
#         messages = DirectMessage.objects.filter(chat_room=chat_room).order_by('timestamp')
#         if messages.exists():
#             last_message = messages.last()
#             receiver = last_message.recipient if last_message.sender == user else last_message.sender
#             chat_list.append({
#                 'chat_id': chat_room.id,
#                 'receiver_id': receiver.id,
#                 'receiver_name': f'{receiver.first_name} {receiver.last_name}',
#                 'last_message': last_message.content,
#                 'timestamp': last_message.timestamp.isoformat()
#             })
    
#     return JsonResponse(chat_list, safe=False)

# from django.views.decorators.csrf import csrf_exempt


# # views.py
# @api_view(['POST'])
# def create_chat_room(request):
#     user1 = request.user
#     user2_id = request.data.get('participants')[0]
#     user2 = User.objects.get(id=user2_id)

#     # Create unique room name in the format: chat_senderid_receiveridj
#     room_name = f"chat_{user1.id}_{user2.id}"

#     # Check if the chat room already exists
#     chat_room, created = ChatRoom.objects.get_or_create(name=room_name)

#     return Response({"room_name": chat_room.name}, status=status.HTTP_201_CREATED)




# @api_view(['GET'])
# @login_required
# def message_history(request, room_id):
#     try:
#         chat_room = ChatRoom.objects.get(room_name=room_id)
     
#     except ChatRoom.DoesNotExist:
#         return JsonResponse({'error': 'Chat room not found'}, status=404)
    
#     messages = Message.objects.filter(chat_room=chat_room).order_by('timestamp')
#     messages_data = [
#             {
#                 'content': msg.content,
#                 'timestamp': msg.timestamp,
#                 'sent_by_me': msg.user.id == request.user.id  # Compare user IDs to set metadata
#             }
            
#             for msg in messages
#             # print("msg.user.id: ", msg.user.id)

#         ]

#     return JsonResponse({'messages': messages_data})

# @api_view(['GET'])
# @login_required
# def user_info(request):
#     user = request.user
#     return JsonResponse({
#         'id': user.id,
#         'email': user.email,
#         'first_name': user.first_name,
#         'last_name': user.last_name
#     })
#     # return JsonResponse({'email': user.email})


# # @api_view(['GET'])
# # @login_required
# # def chat_room_detail_api(request, room_name):
# #     chat_room = get_object_or_404(ChatRoom, name=room_name)
# #     messages = Message.objects.filter(chat_room=chat_room).order_by('timestamp')
# #     chat_room_serializer = ChatRoomSerializer(chat_room)
# #     message_serializer = MessageSerializer(messages, many=True)
# #     return Response({
# #         'chat_room': chat_room_serializer.data,
# #         'messages': message_serializer.data
# #     })



# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_list(request):
#     User = get_user_model()
#     users = User.objects.all()
#     serializer = UserSerializer(users, many=True)
#     return Response(serializer.data)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_chat_rooms(request):
#     user = request.user
#     chat_rooms = ChatRoom.objects.filter(participants=user)
#     user_ids = set()
#     last_messages = {}

#     for chat_room in chat_rooms:
#         participants = chat_room.participants.all()
#         for participant in participants:
#             # if participant != user:
#                 user_ids.add(participant.id)
#                 print(participant)
#                 last_messages[participant.id] = {
#                     'last_message': chat_room.last_message,
#                     'last_message_by': chat_room.last_message_by_id if chat_room.last_message_by_id else None,
#                     'last_message_timestamp': chat_room.updated_at.isoformat()
#                 }
#     print(last_messages)
#     users = User.objects.filter(id__in=user_ids)
#     serializer = UserSerializer(users, many=True)

#     users_data = serializer.data
#     for user_data in users_data:
#         user_data.update(last_messages.get(user_data['id'], {
#             'last_message': 'No messages yet',
#             'last_message_by': None,
#             'last_message_timestamp': None
#         }))
#     print(users_data)
#     return Response(users_data, status=status.HTTP_200_OK)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def search_users(request):
#     query = request.query_params.get('q', '')
#     if query:
#         query_parts = query.split()
#         if len(query_parts) == 1:
#             # Search for users with either first name or last name matching the query
#             users = User.objects.filter(Q(first_name__icontains=query) | Q(last_name__icontains=query))
#         elif len(query_parts) > 1:
#             # Search for users with both first name and last name matching the query parts
#             users = User.objects.filter(
#                 Q(first_name__icontains=query_parts[0]) & Q(last_name__icontains=query_parts[1])
#             )
#         serializer = UserSerializer(users, many=True)
#         return Response(serializer.data)
#     return Response({"message": "No query provided."}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import login, authenticate
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .serializers import (
    CustomUserSerializer, 
    CustomUserRegistrationSerializer, 
    MessageSerializer, 
    UserSerializer
)
from .models import ChatRoom, Message, DirectMessage

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def user_registration_view(request):
    """Handles user registration."""
    serializer = CustomUserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        return Response({"id": user.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """Handles retrieval and update of user profile."""
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
    """Handles user login."""
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout_view(request):
    """Handles user logout."""
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_message_view(request, room_id):
    """Posts a message to a chat room."""
    chat_room = get_object_or_404(ChatRoom, id=room_id)
    content = request.data.get('content', '')

    if not content:
        return Response({"detail": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

    message = Message.objects.create(chat_room=chat_room, user=request.user, content=content)

    # Update last message in the chat room
    chat_room.last_message = content
    chat_room.last_message_by = request.user
    chat_room.save()

    return Response({"detail": "Message sent successfully.", "message": {
        "id": message.id,
        "user": message.user.username,
        "content": message.content,
        "timestamp": message.timestamp.isoformat()
    }}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@login_required
def user_info(request):
    user = request.user
    return JsonResponse({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name
    })
    # return JsonResponse({'email': user.email})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_direct_message(request):
    """Sends a direct message to a user."""
    recipient_id = request.data.get('recipient_id')
    content = request.data.get('content', '')

    if not content:
        return Response({"detail": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

    recipient = get_object_or_404(User, id=recipient_id)

    direct_message = DirectMessage.objects.create(
        sender=request.user,
        recipient=recipient,
        content=content
    )

    return Response({"detail": "Direct message sent successfully.", "message": {
        "id": direct_message.id,
        "sender": direct_message.sender.username,
        "recipient": direct_message.recipient.username,
        "content": direct_message.content,
        "timestamp": direct_message.timestamp.isoformat()
    }}, status=status.HTTP_201_CREATED)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def message_history_view(request, room_id):
#     """Retrieves the message history for a chat room."""
#     chat_room = get_object_or_404(ChatRoom, id=room_id)
#     messages = Message.objects.filter(chat_room=chat_room).order_by('timestamp')
#     serializer = MessageSerializer(messages, many=True)
#     return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def message_history_view(request, room_id):
    """Retrieves the message history for a chat room."""
    chat_room = get_object_or_404(ChatRoom, room_name=room_id)
    messages = Message.objects.filter(chat_room=chat_room).order_by('timestamp')

    # Check if the message history is empty
    if not messages.exists():
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list_view(request):
    """Lists all users."""
    users = User.objects.all().exclude(id=request.user.id)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def chat_room_list_view(request):
#     """Lists all chat rooms for the current user."""
#     chat_rooms = ChatRoom.objects.filter(
#         Q(last_message_by=request.user) | 
#         Q(messages__user=request.user)
#     ).distinct().order_by('-message__timestamp')

#     # Serialize the chat rooms
#     chat_room_data = []
#     for chat_room in chat_rooms:
#         other_users = chat_room.users.exclude(id=request.user.id)
#         chat_room_data.append({
#             "id": chat_room.id,
#             "room_name": chat_room.room_name,
#             "last_message": chat_room.last_message,
#             "last_message_by": chat_room.last_message_by.username,
#             "other_users": [{"id": user.id, "username": user.username} for user in other_users]
#         })

#     return Response(chat_room_data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def chat_room_list_view(request):
#     """Lists all chat rooms for the current user."""
#     chat_rooms = ChatRoom.objects.filter(
#         Q(last_message_by=request.user) | 
#         Q(messages__user=request.user)
#     ).distinct().order_by('-messages__timestamp')

#     # Serialize the chat rooms
#     chat_room_data = []
#     for chat_room in chat_rooms:
#         other_users = chat_room.participants.exclude(id=request.user.id)
#         chat_room_data.append({
#             "id": chat_room.id,
#             "room_name": chat_room.room_name,
#             "last_message": chat_room.last_message,
#             "last_message_by": chat_room.last_message_by.username if chat_room.last_message_by else None,
#             "other_users": [{"id": user.id, "username": user.username} for user in other_users]
#         })

#     return Response(chat_room_data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_room_list_view(request):
    """Lists all chat rooms for the current user."""
    # chat_rooms = ChatRoom.objects.filter(
    #     Q(last_message_by=request.user) | 
    #     Q(messages__user=request.user)
    # ).distinct().order_by('-messages__timestamp')
    chat_rooms = ChatRoom.objects.filter(
        Q(messages__user=request.user)
    ).distinct('id')
    print("chat_rooms: ", chat_rooms)
    # Serialize the chat rooms
    chat_room_data = []
    for chat_room in chat_rooms:
        # print("chat_room: ", chat_room)
        other_users = chat_room.participants.exclude(id=request.user.id)
        last_message_by = None
        if chat_room.last_message_by:
            last_message_by_user = User.objects.get(id=chat_room.last_message_by.id)
            last_message_by = f"{last_message_by_user.first_name} {last_message_by_user.last_name}"

        chat_room_data.append({
            "id": chat_room.id,
            "room_name": chat_room.room_name,
            "last_message": chat_room.last_message,
            "last_message_by": last_message_by,
            "other_users": [{"id": user.id, "email": user.email} for user in other_users]
        })

    return Response(chat_room_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.query_params.get('q', '')
    if query:
        query_parts = query.split()
        if len(query_parts) == 1:
            # Search for users with either first name or last name matching the query
            users = User.objects.filter(Q(first_name__icontains=query) | Q(last_name__icontains=query))
        elif len(query_parts) > 1:
            # Search for users with both first name and last name matching the query parts
            users = User.objects.filter(
                Q(first_name__icontains=query_parts[0]) & Q(last_name__icontains=query_parts[1])
            )
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    return Response({"message": "No query provided."}, status=status.HTTP_400_BAD_REQUEST)
