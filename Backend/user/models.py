from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    class UserRole(models.TextChoices):
        DEFAULT = "Default"
        ADMIN = "Admin"

    email = models.EmailField(unique=True, blank=True, null=True)
    address = models.CharField(max_length=30)
    role = models.CharField(
        max_length=30, choices=UserRole.choices, default=UserRole.DEFAULT
    )


class Note(models.Model):
    title = models.CharField(max_length=40)
    content = models.TextField()
    author = models.ForeignKey(User, related_name="notes", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - created by {self.author}"

    class Meta:
        verbose_name_plural = "Notes"
        ordering = ["created_at"]
