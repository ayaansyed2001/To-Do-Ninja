from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from myapp.models import Task
from django.contrib.auth import logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required


def home(request):
    if request.user.is_authenticated:
        tasks = Task.objects.filter(user=request.user)
        active_tasks = tasks.filter(completed=False)
        completed_tasks = tasks.filter(completed=True)
        filter_value = request.GET.get('filter', 'all')

    # Optionally filter tasks displayed based on query param
        if filter_value == 'active':
            tasks = active_tasks
        elif filter_value == 'completed':
            tasks = completed_tasks
            
        context = {
        'tasks': tasks,
        'active_tasks': active_tasks,
        'completed_tasks': completed_tasks,
        'filter': filter_value
    }
    else:
        # For anonymous users, show empty lists or redirect to login
        context = {
            'tasks': [],
            'active_tasks': [],
            'completed_tasks': [],
            'filter': 'all'
        }
    return render(request, 'home.html', context)

@login_required
def add_task(request):
    errors = {}  # Initialize errors for both GET and POST

    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")
        if title and description:
            Task.objects.create(title=title, description=description , user=request.user)
            return redirect('home')
        else:
            errors['error'] = "Both fields are required."

    return render(request, 'add.html', errors)

@login_required
def clear_completed(request):
    Task.objects.filter(completed=True, user=request.user).delete()
    return redirect('home')

@login_required
def toggle_complete(request, task_id):
    task = Task.objects.get(id=task_id, user=request.user)
    task.completed = not task.completed
    task.save()
    return redirect('home')

@login_required
def edit_task(request, task_id):
    tasks=Task.objects.get(id=task_id, user=request.user)
    if request.method =="POST":
        title =request.POST.get("title")
        description =request.POST.get("description")
        if title and description:
            tasks.title=title
            tasks.description=description
            tasks.save()
            return redirect('home')
    context={
        'tasks': tasks
    }
    return render(request, 'edit.html', context)


@login_required
def delete_task(request, task_id):
    tasks = Task.objects.get(id=task_id, user=request.user)
    if request.method == "POST":
        tasks.delete()
        return redirect('home')
    context = {
        'tasks': tasks
    }
    return render(request, 'delete.html', context)


def loginu(request):
    if request.method == "POST":
        uname = request.POST.get("username")
        password = request.POST.get("password")

        try:
            user = User.objects.get(username=uname)
        except User.DoesNotExist:
            return render(request, "login.html", {"error": "User not found. Please try again."})

        user = authenticate(request, username=uname, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, "login.html", {"error": "Invalid password. Please try again."})
    
    return render(request, 'login.html')


def signup(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        # Password check
        if password1 != password2:
            messages.error(request, "Passwords do not match.")
            return render(request, "signup.html")

        # Username check
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return render(request, "signup.html")

        # Email check
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return render(request, "signup.html")

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password1)
        user.save()
        messages.success(request, "Account created successfully. You can now log in.")
        return redirect("login")

    return render(request, "signup.html")

def logoutu(request):
    logout(request)
    return redirect("login")
 