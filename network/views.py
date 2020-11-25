from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
import json
from django.db.models import Count

from .models import User, Post


def index(request):
    try:
        user = User.objects.get(id=request.user.id)
        post_like = Post.objects.filter(likes = request.user.id)
         
    except:
        pass
    liked = False
    post = Post.objects.all().order_by('-timestamp')
    paginator = Paginator(post, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)
    return render(request, "network/index.html", {
        'post' : page,
        'liked' : liked
    })

def profile(request, pk):
    username = User.objects.get(id=pk)
    page = Post.objects.filter(user=username).order_by('-timestamp')
    post_count = page.count()
    
    paginator = Paginator(page, 10)
    page_number = request.GET.get('page')
    post = paginator.get_page(page_number)

    liked = False
    post_like = Post.objects.filter(likes = request.user.id)
    if post_like.exists():
        liked = True
    following = False
    if username.follower.filter(id=request.user.id).exists():
        following = True
    return render(request, 'network/profile.html', {
        'profile' : username,
        'following' : following,
        'post' : post,
        'liked' : liked,
        'posts' : post_count
    })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def new_post(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        body = data.get("body", "")
        post = Post(
            user = request.user,
            text = body,
        )
        post.save()
        
        return JsonResponse({ 'message' : 'Succesfully Posted'}
                            ,status=201)
@csrf_exempt
@login_required
def followView(request):
    if request.method == 'POST':
        username = request.user
        data = json.loads(request.body)
        user = User.objects.get(username=username)
        follow = User.objects.get(id=data["follow"])
        if data['span'] == 'Following':
            user.following.remove(follow.id)
            follow.follower.remove(user.id)
        else:
            user.following.add(follow.id)
            follow.follower.add(user.id)
        response = dict(
                        followings=follow.following.count(),
                        followers=follow.follower.count()    )
        return JsonResponse(response, status=201)


@csrf_exempt
@login_required
def likeView(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(id=request.user.id)
        post = Post.objects.get(id=data['like_id'])
        if data['span'] == 'Like':
            post.likes.add(user)
        else:
            post.likes.remove(user)
        response = dict(like=post.likes.count())
        return JsonResponse(response, status=201)

@csrf_exempt
@login_required
def edit(request):
    data = json.loads(request.body)
    post = Post.objects.get(id=data['post_id'])
    new_post = data['post']
    post.text = new_post
    post.save()
    return JsonResponse({'message' : "Success"}, status=201)

@csrf_exempt
@login_required
def delete_post(request):
    data = json.loads(request.body)
    post = Post.objects.get(id=data['post_id'])
    post.delete()
    return JsonResponse({'message' : "Success"}, status=201)


@login_required(login_url='/login')
def following(request):
    username = User.objects.get(id=request.user.id).following.all()
    page = Post.objects.filter(user__in=username).order_by('-timestamp')

    paginator = Paginator(page, 5)
    page_number = request.GET.get('page')
    post = paginator.get_page(page_number)

    return render(request, 'network/following.html', {
        'post' : post
    })
    

