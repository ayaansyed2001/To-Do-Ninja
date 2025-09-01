
from django.urls import  path
from . import views
urlpatterns = [
  path('',views.home,name='home'),
  path('add/',views.add_task,name='add_task'),
  path('clear-completed/',views.clear_completed,name='clear_completed'),
  path('toggle/<int:task_id>/',views.toggle_complete,name='toggle_complete'),
  path('edit/<int:task_id>/',views.edit_task,name='edit_task'),
  path('delete/<int:task_id>/',views.delete_task,name='delete_task'),
  path('login/',views.loginu,name='login'),
  path('signup/',views.signup,name='signup'),
  path('logout/',views.logoutu,name='logout')

]
