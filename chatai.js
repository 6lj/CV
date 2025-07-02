function setupLiveChat() {
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const chatMessageInput = document.getElementById('chatMessage');
    const chatRecipient = document.getElementById('chatRecipient');
    const submitBtn = chatForm.querySelector('.submit-btn');
    const btnText = chatForm.querySelector('.btn-text');
    const loading = chatForm.querySelector('.loading');
    const successMessage = chatForm.querySelector('.success-message');

    // Detect OS
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isMacOS = /macintosh|mac os x/.test(userAgent) && !isIOS; // Exclude iOS to avoid overlap
    const isWindows = /windows|win32|win64/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isBottomToTop = isIOS || isMacOS; // Use new settings for iOS and macOS

    // Apply CSS dynamically based on OS
    if (isBottomToTop) {
        chatMessages.style.display = 'flex';
        chatMessages.style.flexDirection = 'column';
        chatMessages.style.justifyContent = 'flex-end';
        chatMessages.style.webkitOverflowScrolling = 'touch'; // For iOS
        chatMessages.style.minHeight = '100px';
    } else {
        chatMessages.style.display = 'flex';
        chatMessages.style.flexDirection = 'column';
        chatMessages.style.justifyContent = 'flex-start'; // Default for Windows/Android
        chatMessages.style.minHeight = '100px';
    }

    function updateRecipientList() {
        chatRecipient.innerHTML = '<option value="all" selected>All</option>';
        chatRecipient.disabled = true; 
    }

    function forceScrollToBottom() {
        setTimeout(() => {
            if (isBottomToTop) {
                // For iOS/macOS: Scroll to bottom for bottom-to-top display
                chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
                chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
            } else {
                // For Windows/Android: Scroll to top for top-to-bottom display
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

                // Sort messages in ascending order (oldest first)
                data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                
                // Reverse for iOS/macOS (newest at bottom), keep as-is for Windows/Android
                const messages = isBottomToTop ? data.messages.reverse() : data.messages;
                
                messages.forEach(msg => {
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

                forceScrollToBottom(); 
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
            chatForm.reset();
            updateChatMessages(); 

            loading.style.display = 'none';
            successMessage.style.display = 'block';
            
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
