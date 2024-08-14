# from channels.generic.websocket import AsyncWebsocketConsumer
# import json
# import jwt
# from django.conf import settings
# from datetime import datetime
# import os
# from jwt import InvalidTokenError
# from channels.db import database_sync_to_async
# from django.contrib.auth import get_user_model
# import redis
# from .models import Message, ChatRoom
# from urllib.parse import parse_qs
# import logging

# logger = logging.getLogger(__name__)

# User = get_user_model()

# # Initialize Redis
# redis_instance = redis.StrictRedis(
#     # host=os.environ.get("REDIS_HOST", "127.0.0.1"),
#     host = settings.REDIS_HOST,
#     port = settings.REDIS_PORT,
#     # port=int(os.environ.get("REDIS_PORT", 6379)),
#     db=0,
# )

# class ChatConsumer(AsyncWebsocketConsumer):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.room_group_name = None
#         self.username = None
#         self.from_user_id = None

#     async def connect(self):
#         # print("")
#         query_string = self.scope['query_string'].decode()
#         # print("string: ", query_string)
#         token = self.scope['query_string'].decode().split('token=')[1]
#         # print("token:", token)
#         # print("str_token:", str(token))
#         # query_params = parse_qs(query_string)
#         # print("query+paarams: ", query_params)
#         # token = query_params.get('token', [None])[0]
#         room_name = self.scope['url_route']['kwargs'].get('room_name', None)
#         # print("room name:", room_name)
#         # room_name = query_params.get('room_name', [None])[0]

#         if not token or not room_name:
#             await self.close(code=4031)
#             return
#         # print("SECRET_KEY type:", type(settings.SECRET_KEY))
#         # print("SECRET_KEY value:", settings.SECRET_KEY)

#         try:
#             payload = jwt.decode(str(token), settings.SECRET_KEY, algorithms=["HS256"])
#             self.from_user_id = payload.get('user_id')
#             if not self.from_user_id:
#                 # await self.close(code=4032)
#                 return
#         except InvalidTokenError:
#             # await self.close(code=4033)
#             return

#         self.username = await self.get_username(self.from_user_id)
#         self.room_group_name = f"{room_name}"

#         # Join the room group
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)

#         # Accept the connection
#         await self.accept()

#     async def disconnect(self, close_code):
#         # Clean up on disconnect
#         if self.room_group_name:
#             await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         command = text_data_json.get("command")

#         if command == "create_room":
#             await self.create_room(text_data_json)
#         elif command == "send_message":
#             await self.send_message(text_data_json)

#     async def create_room(self, data):
#         to_user_id = data.get("to_user_id")
#         self.room_name = "_".join(
#             sorted([str(self.from_user_id), str(to_user_id)])
#         )
#         self.room_group_name = f"{self.room_name}"

#         # Add the user to the room group
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        
#         await self.save_chat_room(self.room_name)

#         # Redirect the user to the chat page
#         await self.send(text_data=json.dumps({
#             'command': 'redirect_to_chat',
#             'room_name': self.room_name
#         }))
#     async def send_message(self, data):
#         message_content = data.get("message")
#         from_user_id = self.from_user_id

#         # Save the message to the database
#         logger.info(f"Saving message: {message_content}")
#         await self.save_message(self.room_group_name, from_user_id, message_content)
#         logger.info(f"Message saved: {message_content}")

#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 "type": "chat_message",
#                 "message": message_content,
#                 "from_user_id": from_user_id,
#                 "sent_by_me": True,
#                  "timestamp": timestamp.isoformat()
#             }
#         )
#     async def chat_message(self, event):
#         print("evenet: ", event)
#         message = event['message']
#         from_user_id = event['from_user_id']
#         sent_by_me = event.get('sent_by_me', False)
#         timestamp = event['timestamp']
#         # username = await self.get_username(from_user_id)
#         # print("username:", username)
#         # Send message to WebSocket
#         # await self.send(text_data=json.dumps({
#         #     'command': 'chat_message',
#         #     'message': message,
#         #     'from_user_id': from_user_id
#         #     # 'username': username
#         # }))
#          # Logging for debugging
#         logger.info(f"Sending chat message: {message} from user: {from_user_id}")
        
#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message,
#             'from_user_id': from_user_id,
#             'sent_by_me': sent_by_me,
#             'timestamp': timestamp
#         }))
#     # async def send_message(self, data):
#     #     message_content = data.get("message")
#     #     from_user_id = self.from_user_id

#     #     # Save the message to the database
#     #     await self.save_message(self.room_name, from_user_id, message_content)

#     #     # Broadcast the message to the room group
#     #     await self.channel_layer.group_send(
#     #         self.room_group_name,
#     #         {
#     #             "type": "chat_message",
#     #             "message": message_content,
#     #             "from_user_id": from_user_id
#     #         }
#     #     )
#     @database_sync_to_async
#     def get_username(self, user_id):
#         user = User.objects.get(id=user_id)
#         return user.first_name + user.last_name

#     @database_sync_to_async
#     def save_chat_room(self, room_name):
#         chat_room, created = ChatRoom.objects.get_or_create(room_name=room_name)
#         if created:
#             logger.info(f"Chat room '{room_name}' created.")
#         else:
#             logger.info(f"Chat room '{room_name}' already exists.")
    
#     @database_sync_to_async
#     def save_message(self, room_name, from_user_id, message_content):
#         chat_room = ChatRoom.objects.get(room_name=room_name)
#         from_user = User.objects.get(id=from_user_id)
#         Message.objects.create(chat_room=chat_room, user=from_user, content=message_content)
#         logger.info(f"Message '{message_content}' saved to chat room '{room_name}' by user '{from_user_id}'")


from channels.generic.websocket import AsyncWebsocketConsumer
import json
import jwt
from django.conf import settings
from datetime import datetime
import os
from jwt import InvalidTokenError
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
import redis
from .models import Message, ChatRoom
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

# Initialize Redis
redis_instance = redis.StrictRedis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=0,
)

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None
        self.username = None
        self.from_user_id = None

    async def connect(self):
        query_string = self.scope['query_string'].decode()
        token = query_string.split('token=')[1]
        room_name = self.scope['url_route']['kwargs'].get('room_name', None)

        if not token or not room_name:
            await self.close(code=4031)
            return

        try:
            payload = jwt.decode(str(token), settings.SECRET_KEY, algorithms=["HS256"])
            self.from_user_id = payload.get('user_id')
            if not self.from_user_id:
                return
        except InvalidTokenError:
            return

        self.username = await self.get_username(self.from_user_id)
        self.room_group_name = f"{room_name}"

        # Join the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_group_name:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        command = text_data_json.get("command")

        if command == "create_room":
            await self.create_room(text_data_json)
        elif command == "send_message":
            await self.send_message(text_data_json)

    async def create_room(self, data):
        to_user_id = data.get("to_user_id")
        self.room_name = "_".join(
            sorted([str(self.from_user_id), str(to_user_id)])
        )
        self.room_group_name = f"{self.room_name}"

        # Add the user to the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        
        await self.save_chat_room(self.room_name)

        # Redirect the user to the chat page
        await self.send(text_data=json.dumps({
            'command': 'redirect_to_chat',
            'room_name': self.room_name
        }))

    async def send_message(self, data):
        message_content = data.get("message")
        from_user_id = self.from_user_id
        timestamp = datetime.now()

        # Save the message to the database
        logger.info(f"Saving message: {message_content}")
        await self.save_message(self.room_group_name, from_user_id, message_content, timestamp)
        logger.info(f"Message saved: {message_content}")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message_content,
                "from_user_id": from_user_id,
                "sent_by_me": True,
                "timestamp": timestamp.isoformat()
            }
        )

    async def chat_message(self, event):
        message = event['message']
        from_user_id = event['from_user_id']
        sent_by_me = event.get('sent_by_me', False)
        timestamp = event['timestamp']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'from_user_id': from_user_id,
            'sent_by_me': sent_by_me,
            'timestamp': timestamp
        }))

    @database_sync_to_async
    def get_username(self, user_id):
        user = User.objects.get(id=user_id)
        return user.first_name + user.last_name

    @database_sync_to_async
    def save_chat_room(self, room_name):
        chat_room, created = ChatRoom.objects.get_or_create(room_name=room_name)
        if created:
            logger.info(f"Chat room '{room_name}' created.")
        else:
            logger.info(f"Chat room '{room_name}' already exists.")
        
        chat_room.participants.add(from_user_id)
        chat_room.participants.add(to_user_id)
        chat_room.save()
    
    @database_sync_to_async
    def save_message(self, room_name, from_user_id, message_content, timestamp):
        chat_room, created = ChatRoom.objects.get_or_create(room_name=room_name)
        # chat_room = ChatRoom.objects.get(room_name=room_name)
        from_user = User.objects.get(id=from_user_id)
        Message.objects.create(chat_room=chat_room, user=from_user, content=message_content)

        # Update the chat room with the last message and sender
        chat_room.last_message = message_content
        chat_room.last_message_by = from_user
        chat_room.save()
        
        logger.info(f"Message '{message_content}' saved to chat room '{room_name}' by user '{from_user_id}'")


# from channels.generic.websocket import AsyncWebsocketConsumer
# import json
# import jwt
# from django.conf import settings
# from datetime import datetime
# from jwt import InvalidTokenError
# from channels.db import database_sync_to_async
# from django.contrib.auth import get_user_model
# import redis
# from .models import Message, ChatRoom
# import logging

# logger = logging.getLogger(__name__)

# User = get_user_model()

# # Initialize Redis connection
# redis_instance = redis.StrictRedis(
#     host=settings.REDIS_HOST,
#     port=settings.REDIS_PORT,
#     db=0,
# )

# class ChatConsumer(AsyncWebsocketConsumer):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.room_group_name = None
#         self.username = None
#         self.from_user_id = None

#     async def connect(self):
#         query_string = self.scope['query_string'].decode()
#         token = query_string.split('token=')[1]
#         room_name = self.scope['url_route']['kwargs'].get('room_name', None)

#         if not token or not room_name:
#             await self.close(code=4031)
#             return

#         try:
#             payload = jwt.decode(str(token), settings.SECRET_KEY, algorithms=["HS256"])
#             self.from_user_id = payload.get('user_id')
#             if not self.from_user_id:
#                 await self.close(code=4001)
#                 return
#         except InvalidTokenError as e:
#             logger.error(f"Token error: {str(e)}")
#             await self.close(code=4001)
#             return

#         self.username = await self.get_username(self.from_user_id)
#         self.room_group_name = f"{room_name}"

#         # Join the room group
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         if self.room_group_name:
#             await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         command = text_data_json.get("command")

#         if command == "create_room":
#             await self.create_room(text_data_json)
#         elif command == "send_message":
#             await self.send_message(text_data_json)

#     async def create_room(self, data):
#         to_user_id = data.get("to_user_id")
#         self.room_name = "_".join(sorted([str(self.from_user_id), str(to_user_id)]))
#         self.room_group_name = f"{self.room_name}"

#         # Add the user to the room group
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        
#         await self.save_chat_room(self.room_name)

#         # Notify user about the room creation
#         await self.send(text_data=json.dumps({
#             'command': 'redirect_to_chat',
#             'room_name': self.room_name
#         }))

#     async def send_message(self, data):
#         message_content = data.get("message")
#         from_user_id = self.from_user_id
#         timestamp = datetime.now()

#         # Save the message to the database
#         logger.info(f"Saving message: {message_content}")
#         await self.save_message(self.room_group_name, from_user_id, message_content, timestamp)
#         logger.info(f"Message saved: {message_content}")

#         # Send the message to the group
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 "type": "chat_message",
#                 "message": message_content,
#                 "from_user_id": from_user_id,
#                 "sent_by_me": True,
#                 "timestamp": timestamp.isoformat()
#             }
#         )

#     async def chat_message(self, event):
#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': event['message'],
#             'from_user_id': event['from_user_id'],
#             'sent_by_me': event.get('sent_by_me', False),
#             'timestamp': event['timestamp']
#         }))

#     @database_sync_to_async
#     def get_username(self, user_id):
#         user = User.objects.get(id=user_id)
#         return f"{user.first_name} {user.last_name}"

#     @database_sync_to_async
#     def save_chat_room(self, room_name):
#         chat_room, created = ChatRoom.objects.get_or_create(room_name=room_name)
#         if created:
#             logger.info(f"Chat room '{room_name}' created.")
#         else:
#             logger.info(f"Chat room '{room_name}' already exists.")
    
#     @database_sync_to_async
#     def save_message(self, room_name, from_user_id, message_content, timestamp):
#         chat_room = ChatRoom.objects.get(room_name=room_name)
#         from_user = User.objects.get(id=from_user_id)
#         Message.objects.create(chat_room=chat_room, user=from_user, content=message_content)

#         # Update the chat room with the last message and sender
#         chat_room.last_message = message_content
#         chat_room.last_message_by = from_user
#         chat_room.save()
        
#         logger.info(f"Message '{message_content}' saved to chat room '{room_name}' by user '{from_user_id}'")
#         # chat_room = ChatRoom.objects.get(room_name=room_name)
#         # from_user = User.objects.get(id=from_user_id)
#         # Message.objects.create(chat_room=chat_room, user=from_user, content=message_content)

#         # # Update the chat room with the last message and sender
#         # chat_room.last_message = message_content
#         # chat_room.last_message_by = from_user
#         # chat_room.save()
        
#         # logger.info(f"Message '{message_content}' saved to chat room '{room_name}' by user '{from_user_id}'")
