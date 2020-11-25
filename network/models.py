from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    follower = models.ManyToManyField("User", related_name="follower_id")
    following = models.ManyToManyField("User", related_name="following_id")


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    likes = models.ManyToManyField(User, related_name="post_like", default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.CharField(max_length=500)