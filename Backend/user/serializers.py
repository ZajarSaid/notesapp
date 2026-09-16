from rest_framework import serializers
from .models import Note
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["title", "content", "author"]
        extra_kwargs = {"author": {"write_only": True}}
