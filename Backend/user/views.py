from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .serializers import UserSerializer, NotesSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from .models import User, Note


# Create your views here.
def home(request):
    return HttpResponse("yeaaaaaaaaaaaaaaaa")


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NotesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        print("CURRENT USER:", user)
        print("USER ID:", user.id)

        notes = Note.objects.filter(author=user)
        print("NOTES:", notes)
        return notes

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NoteUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = NotesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Scoping to the requesting author means a user can only ever
        # fetch/edit their own notes (a foreign id yields 404, not 403).
        user = self.request.user
        return Note.objects.filter(author=user)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NotesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
