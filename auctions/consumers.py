import json
from .models import Bid, Auction, User
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class AuctionConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.auction_name = self.scope['url_route']['kwargs']['auction_id']

        self.auction_group_name = f"auction_{self.auction_name}"

        # print("Connecting...")

        await self.channel_layer.group_add(self.auction_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, code):
        self.channel_layer.group_discard(
            self.auction_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):

        data = json.loads(text_data)

        curr_bid = data['curr_bid']

        user = data['user']

        #save this bid to show the history later
        await self.update_bid(user, self.auction_name, curr_bid)

        await self.channel_layer.group_send(
            self.auction_group_name,
            {
                'type': 'send_message',
                'curr_bid': curr_bid,
                'user': user,
            }
        )

    async def send_message(self, event):

        curr_bid = event['curr_bid']
        username = event['user']

        await self.send(text_data=json.dumps({
            'curr_bid': curr_bid,
            'username': username
        }))

    @database_sync_to_async
    def update_bid(self, username, auction_id, curr_bid):
        auction = Auction.objects.get(id = auction_id)

        auction.current_bid = curr_bid
        auction.save()
        user = User.objects.get(username = username)
        bid = Bid.objects.create(
            auction=auction, 
            user=user, 
            amount=curr_bid
        )
