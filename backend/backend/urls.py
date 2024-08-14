"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path
# from chat.views import user_registration_view, user_profile_view, user_login_view, user_logout_view, post_message_view, send_direct_message
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('register/', user_registration_view, name='register'),
#     path('profile/', user_profile_view, name='profile'),
#     path('login/', user_login_view, name='login'),
#     path('logout/', user_logout_view, name='logout'),
#     path('user-rooms/', user_chat_rooms, name='user_chat_rooms'),
#     path('search-users/', search_users, name='sreach_users'),
#     path('users/', user_list, name='user_list'),
#     # path('rooms/<str:room_name>/', chat_room_detail_api, name='chat_room_detail_api'),
#     path('get_user_chats/', get_user_chats, name='get_user_chats'),
#     path('create_chat_room/', create_chat_room, name='create_chat_room'),
#     # path('direct-messages/<int:user_id>/', get_direct_message_history, name='get_direct_message_history'),
#     path('message-history/<str:room_id>/', message_history, name='message_history'),
#     path('user_info/', user_info, name='user_info'),

# ]


from django.contrib import admin
from django.urls import path
from chat.views import (
    user_registration_view,
    user_profile_view,
    user_login_view,
    user_logout_view,
    post_message_view,
    send_direct_message,
    user_list_view,
    chat_room_list_view,
    message_history_view,
    user_info,
    # user_info_view,
    search_users
    # get_user_chats_view,
    # create_chat_room_view
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', user_registration_view, name='register'),
    path('profile/', user_profile_view, name='profile'),
    path('login/', user_login_view, name='login'),
    path('logout/', user_logout_view, name='logout'),
    path('user-rooms/', chat_room_list_view, name='user_chat_rooms'),
    path('search-users/', search_users, name='search_users'),
    # path('search-users/', search_users_view, name='search_users'),
    path('users/', user_list_view, name='user_list'),
    # path('get_user_chats/', get_user_chats_view, name='get_user_chats'),
    # path('create_chat_room/', create_chat_room_view, name='create_chat_room'),
    path('message-history/<str:room_id>/', message_history_view, name='message_history'),
    path('user_info/', user_info, name='user_info'),
]
