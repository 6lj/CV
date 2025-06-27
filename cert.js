function setupCertificateCards() {
    const certCards = document.querySelectorAll('.certificate-card');
    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const certType = card.dataset.certType;
            const certName = card.querySelector('.certificate-name').textContent;
            showNotification(`${certName} - ${certType} Certificate`, 'info');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCertificateCards();
});