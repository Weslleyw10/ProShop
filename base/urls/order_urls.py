from django.urls import path
from base.views import order_views as views

urlpatterns = [
    path('', views.getOrders, name='orders'),
    path('create', views.addOrderItems, name='orders-add'),
    path('myorders', views.getMyOrders, name='myorders'),
    path('<str:pk>', views.getOrderById, name='user-order'),
    path('<str:pk>/pay', views.orderToPaid, name='order-pay'),
    path('<str:pk>/delivered', views.orderToDelivered, name='order-delivered')
]