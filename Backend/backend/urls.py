from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from user.views import CreateUserView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("user.urls"), name="users"),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("user/token/", TokenObtainPairView.as_view(), name="rget_token"),
    path("user/refresh/", TokenRefreshView.as_view(), name="refresh-token"),
    path("user-auth/", include("rest_framework.urls")),
]
