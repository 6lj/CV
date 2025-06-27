class ChatAI {
    constructor() {
        this.form = document.getElementById('chatai-form');
        this.input = document.getElementById('chatai-input');
        this.messages = document.getElementById('chatai-messages');
        this.loading = document.getElementById('chatai-loading');
        this.sendBtn = document.getElementById('send-btn');
        this.clearBtn = document.getElementById('clear-chat');
        this.settingsBtn = document.getElementById('settings-btn');
        
        this.isLoading = false;
        this.messageHistory = [];
        this.currentTheme = 'dark';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadChatHistory();
        this.setupQuickActions();
        this.addWelcomeMessage();
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Clear chat
        this.clearBtn.addEventListener('click', () => this.clearChat());
        
        // Settings
        this.settingsBtn.addEventListener('click', () => this.toggleSettings());
        
        // Input events
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.addEventListener('input', () => this.handleInputChange());
        
        // Auto-resize textarea behavior
        this.input.addEventListener('input', () => this.autoResize());
    }

    setupQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const message = action.getAttribute('data-message');
                this.sendMessage(message);
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;
        
        this.sendMessage(message);
    }

    handleKeyDown(e) {
        // Send message with Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    handleInputChange() {
        const hasText = this.input.value.length > 0;
        this.sendBtn.style.opacity = hasText ? '1' : '0.6';
    }

    autoResize() {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
    }

    async sendMessage(message) {
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';
        this.handleInputChange();
        this.autoResize();
        
        // Show loading
        this.setLoading(true);

        try {
            const response = await this.callAPI(message);
            this.addMessage(response, 'assistant');
        } catch (error) {
            console.error('Chat API Error:', error);
            this.addMessage('Error , talk to dev X: m4ua', 'assistant', true);
        } finally {
            this.setLoading(false);
        }
    }

    async callAPI(message) {
        // Simulate API call - replace with your actual API endpoint
        const response = await fetch('/chatai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message,
                history: this.messageHistory.slice(-10) // Send last 10 messages for context
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        return data.response || 'Sorry, I did not understand that.';
    }

    addMessage(text, role, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatai-message ${role}`;
        
        // Create message bubble
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (isError) {
            bubble.style.borderColor = '#ff6b35';
            bubble.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
        }
        
        // Add message text with typing animation
        if (role === 'assistant' && !isError) {
            this.typeText(bubble, text);
        } else {
            bubble.textContent = text;
        }
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = this.getCurrentTime();
        
        bubble.appendChild(timestamp);
        messageDiv.appendChild(bubble);
        
        // Add to messages container
        this.messages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Save to history
        this.messageHistory.push({ role, text, timestamp: Date.now() });
        this.saveChatHistory();
    }

    typeText(element, text, speed = 30) {
        let index = 0;
        const textContainer = document.createElement('div');
        element.appendChild(textContainer);
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                textContainer.textContent += text.charAt(index);
                index++;
                this.scrollToBottom();
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.loading.style.display = loading ? 'flex' : 'none';
        this.sendBtn.disabled = loading;
        this.input.disabled = loading;
        
        if (loading) {
            this.scrollToBottom();
        }
    }

    clearChat() {
   
        
        this.messages.insertBefore(welcomeDiv, this.messages.firstChild);
    }

       

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }
            
            .modal-content {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .modal-header h3 {
                color: var(--text-primary);
                margin: 0;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 24px;
                cursor: pointer;
            }
            
            .setting-item {
                margin-bottom: 16px;
            }
            
            .setting-item label {
                display: block;
                color: var(--text-primary);
                margin-bottom: 8px;
            }
            
            .setting-item select,
            .setting-item input {
                width: 100%;
                padding: 8px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                color: var(--text-primary);
            }
        `;
        
        document.head.appendChild(style);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-green)' : 
                        type === 'error' ? 'var(--primary-orange)' : 'var(--primary-blue)'};
            color: var(--bg-primary);
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out, slideOut 0.3s ease-in 2.7s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
 getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    });
}

    scrollToBottom(smooth = true) {
        if (smooth) {
            this.messages.scrollTo({
                top: this.messages.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            this.messages.scrollTop = this.messages.scrollHeight;
        }
    }

    saveChatHistory() {
        try {
            // For demo purposes, we'll store in memory only
            // In a real app, you would save to a database
            this.savedHistory = [...this.messageHistory];
        } catch (error) {
            console.warn('Could not save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            // For demo purposes, we'll load from memory only
            // In a real app, you would load from a database
            if (this.savedHistory) {
                this.messageHistory = [...this.savedHistory];
                this.renderHistory();
            }
        } catch (error) {
            console.warn('Could not load chat history:', error);
        }
    }

    renderHistory() {
        // Clear current messages except welcome
        const messages = this.messages.querySelectorAll('.chatai-message');
        messages.forEach(msg => msg.remove());
        
        // Render saved messages
        this.messageHistory.forEach(msg => {
            this.addMessage(msg.text, msg.role, false, false);
        });
    }

    // Utility methods
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    formatMessage(text) {
        // Simple markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    // Voice feature (optional)
    speakMessage(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }

    // Copy message to clipboard
    copyMessage(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('success', 'success');
            });
        }
    }

    // Add reaction to message
    addReaction(messageElement, reaction) {
        let reactionsDiv = messageElement.querySelector('.message-reactions');
        if (!reactionsDiv) {
            reactionsDiv = document.createElement('div');
            reactionsDiv.className = 'message-reactions';
            messageElement.appendChild(reactionsDiv);
        }
        
        const reactionBtn = document.createElement('button');
        reactionBtn.className = 'reaction-btn';
        reactionBtn.textContent = reaction;
        reactionBtn.onclick = () => {
            reactionBtn.classList.toggle('active');
        };
        
        reactionsDiv.appendChild(reactionBtn);
    }

    // Search in chat history
    searchMessages(query) {
        const results = this.messageHistory.filter(msg => 
            msg.text.toLowerCase().includes(query.toLowerCase())
        );
        return results;
    }

    // Export chat history
    exportChat() {
        const chatData = {
            timestamp: new Date().toISOString(),
            messages: this.messageHistory
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('success  ', 'success');
    }

    // Handle connection status
    updateConnectionStatus(isOnline) {
        const indicator = document.querySelector('.status-indicator');
        const header = document.querySelector('.chat-header h2');
        
        if (isOnline) {
            indicator.className = 'status-indicator online';
            header.textContent = 'AI Assistant';
        } else {
            indicator.className = 'status-indicator offline';
            header.textContent = 'AI Assistant not conncted';
        }
    }

    // Initialize connection monitoring
    initConnectionMonitor() {
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
            this.showNotification('success  ', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.updateConnectionStatus(false);
            this.showNotification('error  ', 'error');
        });
    }

    // Handle errors gracefully
    handleError(error, context = '') {
        console.error(`Chat Error ${context}:`, error);
        
        let userMessage = 'error.';
        
        if (error.name === 'NetworkError' || !navigator.onLine) {
            userMessage = 'error';
        } else if (error.status === 429) {
            userMessage = 'error';
        } else if (error.status >= 500) {
            userMessage = 'error';
        }
        
        this.addMessage(userMessage, 'assistant', true);
    }
}

// Add CSS animations
const animationsCSS = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .message-reactions {
        display: flex;
        gap: 4px;
        margin-top: 8px;
    }
    
    .reaction-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .reaction-btn:hover,
    .reaction-btn.active {
        background: var(--primary-green);
        color: var(--bg-primary);
    }
    
    .status-indicator.offline {
        background: var(--primary-orange);
        box-shadow: 0 0 10px var(--primary-orange);
    }
`;

// Add animations to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationsCSS;
document.head.appendChild(styleSheet);

// Initialize the chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatAI = new ChatAI();
    
    // Initialize connection monitoring
    window.chatAI.initConnectionMonitor();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            window.chatAI.input.focus();
        }
        
        // Ctrl/Cmd + L to clear chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            window.chatAI.clearChat();
        }
        
        // Escape to clear input
        if (e.key === 'Escape') {
            window.chatAI.input.value = '';
            window.chatAI.input.blur();
        }
    });
    
    console.log('🤖 Chat AI initialized successfully!');
});