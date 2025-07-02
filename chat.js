function setupLiveChat() {
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const chatMessageInput = document.getElementById('chatMessage');
    const chatRecipient = document.getElementById('chatRecipient');
    const submitBtn = chatForm.querySelector('.submit-btn');
    const btnText = chatForm.querySelector('.btn-text');
    const loading = chatForm.querySelector('.loading');
    const successMessage = chatForm.querySelector('.success-message');

    function isAppleDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        return /macintosh|iphone|ipad|ipod/.test(userAgent);
    }

    function updateRecipientList() {
        chatRecipient.innerHTML = '<option value="all" selected>All</option>';
        chatRecipient.disabled = true;
    }

    function forceScroll() {
        setTimeout(() => {
            if (isAppleDevice()) {

                chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
                chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
            } else {

                chatMessages.scrollTop = 0;
                chatMessages.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    }

    function updateChatMessages() {
        const currentViewer = localStorage.getItem('currentViewer') || 'Anonymous';
        fetch('/api/chat-messages')
            .then(response => response.json())
            .then(data => {
                chatMessages.innerHTML = '';

                if (isAppleDevice()) {

                    data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                } else {

                    data.messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                }

                data.messages.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.className = `chat-message ${msg.sender === currentViewer ? 'sent' : 'received'}`;
                    const recipientText = msg.recipient !== 'all' ? `(to ${msg.recipient})` : '';
                    messageElement.innerHTML = `
                        <span class="chat-sender">${msg.sender} ${recipientText}</span>
                        <span class="chat-text">${msg.text}</span>
                        <span class="chat-timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                    `;
                    chatMessages.appendChild(messageElement);
                });

                forceScroll();
            })
            .catch(err => {
                console.error(err);
            });
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatMessageInput.value.trim();
        const currentViewer = localStorage.getItem('currentViewer') || 'Anonymous';

        if (!text) {
            return;
        }

        btnText.style.opacity = '0';
        loading.style.display = 'block';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/chat-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender: currentViewer, text, recipient: 'all' })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            loading.style.display = 'none';
            successMessage.style.display = 'block';
            chatForm.reset();

            updateChatMessages();

            setTimeout(() => {
                btnText.style.opacity = '1';
                submitBtn.disabled = false;
                successMessage.style.display = 'none';
            }, 2000);

        } catch (err) {
            console.error(err);
            btnText.style.opacity = '1';
            submitBtn.disabled = false;
            loading.style.display = 'none';
        }
    });

    updateRecipientList();
    updateChatMessages();

    setInterval(updateChatMessages, 1000);
}

const originalAddViewer = window.addViewer || function() {};
window.addViewer = function(name) {
    originalAddViewer(name);
    localStorage.setItem('currentViewer', name);
};

document.addEventListener('DOMContentLoaded', () => {
    setupLiveChat();
});
