document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.querySelector("#messages-container");
    const messagesInput = document.querySelector('#message-input');
    const sendMessageButton = document.querySelector('#send-button');
    const usernameInput = document.querySelector('#username-input');

    const clientId = Math.random().toString(36).substring(2, 15);
    let username = '';

    let webSocketClient = new WebSocket('ws://localhost:12345');

    webSocketClient.onopen = () => {
        console.log('Client connected');
    };

webSocketClient.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.clientId !== clientId) {
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        const [username, messageText] = data.message.split(': ');
        const headerElement = document.createElement('span');
        headerElement.classList.add('message-header');
        headerElement.textContent = `${username}: `;
        const messageElement = document.createElement('span');
        messageElement.textContent = messageText;
        newMessage.appendChild(headerElement);
        newMessage.appendChild(messageElement);
        messagesContainer.appendChild(newMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

    const sendMessage = (message) => {
        const newMessage = document.createElement('div');
        newMessage.classList.add('message', 'outgoing');
        const messageText = `${username}: ${message}`;
        newMessage.textContent = messageText;
        messagesContainer.appendChild(newMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        webSocketClient.send(JSON.stringify({ clientId, message: messageText }));
    };

    sendMessageButton.addEventListener('click', () => {
        if (messagesInput.value.trim()) {
            sendMessage(messagesInput.value);
            messagesInput.value = "";
        }
    });

    messagesInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && messagesInput.value.trim()) {
            sendMessage(messagesInput.value);
            messagesInput.value = "";
        }
    });

    usernameInput.addEventListener('input', () => {
        username = usernameInput.value.trim() || 'Anonymous';
    });

});
