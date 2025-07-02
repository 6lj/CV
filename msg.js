const NOTIFICATION_TIMEOUT = 3000;

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--primary-red)' : 'var(--primary-green)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        min-width: 200px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, NOTIFICATION_TIMEOUT);
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function validateInput(input) {
    return input.trim().length > 0 && input.length <= 500;
}

function handleFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loading = document.querySelector('.loading');
    const successMessage = document.querySelector('.success-message');

    if (!form || !submitBtn || !btnText || !loading || !successMessage) {
        console.error('Form elements not found');
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        const username = sanitizeInput(document.getElementById('username').value);
        const message = sanitizeInput(document.getElementById('message').value);
        const currentViewer = localStorage.getItem('currentViewer') || 'Anonymous';

        if (!validateInput(username) || !validateInput(message)) {
            showNotification('Enter Any plz(max 500 characters)', 'error');
            return;
        }

        try {
            btnText.style.opacity = '0';
            loading.style.display = 'block';
            submitBtn.disabled = true;

            const response = await fetch('/api/contact-messages', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    sender: currentViewer, 
                    username: username, 
                    message: message 
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            loading.style.display = 'none';
            successMessage.style.display = 'block';
            form.reset();

            // Add success notification here
            showNotification('Message sent', 'info');

            setTimeout(() => {
                btnText.style.opacity = '1';
                submitBtn.disabled = false;
                successMessage.style.display = 'none';
            }, NOTIFICATION_TIMEOUT);
        } catch (err) {
            console.error('Form submission error:', err);
            showNotification('Failed to send message. Please try again.', 'error');
            btnText.style.opacity = '1';
            submitBtn.disabled = false;
            loading.style.display = 'none';
        }
    };

    form.addEventListener('submit', submitHandler);

    // Return cleanup function
    return () => {
        form.removeEventListener('submit', submitHandler);
    };
}

// Initialize when DOM is loaded
let cleanup;
document.addEventListener('DOMContentLoaded', () => {
    cleanup = handleFormSubmission();
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (cleanup) cleanup();
});
