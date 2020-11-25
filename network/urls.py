
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.new_post, name="post"),
    path("profile/<str:pk>/", views.profile, name="profile"),
    path("follow", views.followView, name="follow"),
    path("like", views.likeView, name="like"),
    path("edit", views.edit, name="edit"),
    path("delete", views.delete_post, name="delete"),
    path("following", views.following, name="following")
]
