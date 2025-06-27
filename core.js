function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const delay = Math.random() * 6;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

function updateScrollProgress() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = window.pageYOffset / totalHeight;
    scrollIndicator.style.transform = `scaleX(${progress})`;
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card').forEach(card => {
        observer.observe(card);
    });
}

function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.glass-card');
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.05;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupIntersectionObserver();
    setupParallax();
    window.addEventListener('scroll', updateScrollProgress);
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('contactForm').dispatchEvent(new Event('submit'));
    }
});