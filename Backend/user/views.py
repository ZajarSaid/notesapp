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
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NotesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
