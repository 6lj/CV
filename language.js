function setupLanguageCards() {
    const cards = document.querySelectorAll('.language-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const skill = card.dataset.skill;
            const language = card.querySelector('.language-name').textContent;
            showNotification(`${language} - Skill level: ${skill}`, 'info');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageCards();
});