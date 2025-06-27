function manageViewers() {
    const viewerList = document.getElementById('viewerList');
    const viewerCount = document.getElementById('viewerCount');
    const viewerModal = document.getElementById('viewerModal');
    const viewerForm = document.getElementById('viewerForm');
    const mainContent = document.getElementById('mainContent');

    // Fetch initial viewers
    fetch('/api/viewers')
        .then(response => response.json())
        .then(data => {
            updateViewerList(data.viewers);
            viewerCount.textContent = data.viewers.length;
            animateCounter();
        });

    viewerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const viewerNameInput = document.getElementById('viewerName');
        let viewerName = viewerNameInput.value.trim() || 'Anonymous';
        addViewer(viewerName);
    });

    document.querySelector('.modal-btn[data-anonymous="true"]').addEventListener('click', () => {
        addViewer('Anonymous');
    });

    function addViewer(name) {
        fetch('/api/viewers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('currentViewer', name); // Keep currentViewer in localStorage for client-side
                updateViewerList(data.viewers);
                viewerCount.textContent = data.count;
                viewerModal.style.display = 'none';
                mainContent.style.display = 'block';
                mainContent.style.opacity = '0';
                mainContent.style.animation = 'fadeInUp 1s ease-out forwards';
                animateCounter();
                document.dispatchEvent(new Event('viewerListUpdated')); // Dispatch event for chat
            })
            .catch(err => {
                console.error(err);
                showNotification('Failed to add viewer', 'error');
            });
    }

    setInterval(() => {
        const currentCount = parseInt(viewerCount.textContent);
        const change = Math.floor(Math.random() * 10) - 5;
        const newCount = Math.max(1, currentCount + change);
        viewerCount.textContent = newCount;
    }, 10000);
}

function updateViewerList(viewers) {
    const viewerList = document.getElementById('viewerList');
    viewerList.innerHTML = '';
    viewers.forEach((name, index) => {
        const viewerItem = document.createElement('div');
        viewerItem.className = 'viewer-item';
        viewerItem.textContent = `${index + 1}. ${name}`;
        viewerList.appendChild(viewerItem);
    });
}

function animateCounter() {
    const counter = document.getElementById('viewerCount');
    const target = parseInt(counter.textContent) || 1;
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
    manageViewers();
});