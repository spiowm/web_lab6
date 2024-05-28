import websockets
import asyncio
import json

all_clients = []


async def send_message(message):
    for client in all_clients:
        try:
            await client.send(message)
        except websockets.exceptions.ConnectionClosedOK:
            all_clients.remove(client)


async def new_client_connected(websocket: websockets.WebSocketServerProtocol, path: str):
    print('New client connected')
    all_clients.append(websocket)
    try:
        async for new_message in websocket:
            data = json.loads(new_message)
            message = data.get('message', '')
            username, message_text = message.split(': ', 1)
            print(f'Client {data["clientId"]} ({username}) send: {message_text}')
            await send_message(new_message)
    except websockets.exceptions.ConnectionClosedOK:
        all_clients.remove(websocket)
        print('Client disconnected')


async def start_server():
    print('Server started')
    async with websockets.serve(new_client_connected, 'localhost', 12345):
        await asyncio.Future()


if __name__ == '__main__':
    event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(event_loop)
    event_loop.run_until_complete(start_server())
    event_loop.run_forever()
