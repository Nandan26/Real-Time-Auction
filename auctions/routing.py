from django.urls import re_path, path
from . import consumers

websocket_urlpatterns = [
    path('ws/live/<int:auction_id>/', consumers.AuctionConsumer.as_asgi())
]