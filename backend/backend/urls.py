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
from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]

# myapp/urls.py
# from django.urls import path
# from chat import views

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('signup/', views.signup, name='signup'),
#     path('login/', views.login_view, name='login'),
#     path('logout/', views.logout_view, name='logout'),
#     path('profile/update/', views.profile_update, name='profile_update'),
#     # path('', views.home, name='home'),  # Home view
# ]

# myapp/urls.py
from django.urls import path
from chat.views import user_registration_view, user_profile_view, user_login_view, user_logout_view, post_message_view, send_direct_message, get_direct_message_history, get_user_chats, create_chat_room
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', user_registration_view, name='register'),
    path('profile/', user_profile_view, name='profile'),
    path('login/', user_login_view, name='login'),
    path('logout/', user_logout_view, name='logout'),
    path('rooms/<int:room_id>/messages/', post_message_view, name='post_message'),
    path('direct-messages/send/', send_direct_message, name='send_direct_message'),
    path('get_user_chats/', get_user_chats, name='get_user_chats'),
    path('create_chat_room/', create_chat_room, name='create_chat_room'),
    path('direct-messages/<int:user_id>/', get_direct_message_history, name='get_direct_message_history'),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

