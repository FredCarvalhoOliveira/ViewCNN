from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('filters/<int:layer_id>', views.layer, name='layer'),
    path('classify', views.classify, name='classify'),
    path('classify/getClass', views.endPt_classify, name='endPt_classify'),

]

