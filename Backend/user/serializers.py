from rest_framework import serializers
from .models import Note
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "author", "created_at", "modified_at"]
        # author is set from the request user; the timestamps are managed
        # by the model (auto_now / auto_now_add), so all three are
        # read-only to the client.
        read_only_fields = ["author", "created_at", "modified_at"]
