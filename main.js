// Utility: Active Link Updater
function updateActiveLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const path = window.location.pathname;
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (path.includes(href) && href !== 'index.html' && href !== '#') {
            link.classList.add('active');
        } else if (path.endsWith('/') || path.includes('index.html')) {
            if (href === 'index.html') link.classList.add('active');
        }
    });
}

// Reveal Animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, observerOptions);

function initAnimations() {
    document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.remove('active');
        revealObserver.observe(el);
    });
}

// Modal logic (Event Delegation for Swup compatibility)
function initModal() {
    // Only handling one-time setups if needed, but primarily relying on delegation below
}

// Global Event Delegation
document.addEventListener('click', (e) => {
    // Open Payment Modal
    const openBtn = e.target.closest('.open-payment');
    if (openBtn) {
        const modal = document.getElementById('payment-modal');
        if (!modal) return;

        const plan = openBtn.getAttribute('data-plan');
        const price = openBtn.getAttribute('data-price');
        const installments = openBtn.getAttribute('data-installments');

        const planAccents = {
            'Coach Gratuito': { color: '#C0C0C0', text: '#000', shimmer: 'rgba(192, 192, 192, 0.3)' },
            'Aula Avulsa': { color: '#E10600', text: '#fff', shimmer: 'rgba(225, 6, 0, 0.4)' },
            'Plano Semanal': { color: '#FFD700', text: '#000', shimmer: 'rgba(255, 215, 0, 0.4)' },
            'Plano Premium': { color: '#A020F0', text: '#fff', shimmer: 'rgba(160, 32, 240, 0.4)' },
            'Plano Vitalício': { color: '#00F3FF', text: '#000', shimmer: 'rgba(0, 243, 255, 0.4)' }
        };

        const accent = planAccents[plan] || planAccents['Plano Semanal'];
        modal.style.setProperty('--modal-accent-color', accent.color);
        modal.style.setProperty('--modal-accent-shimmer', accent.shimmer);
        modal.style.setProperty('--modal-text-color', accent.text);
        modal.style.setProperty('--modal-accent-gradient', `linear-gradient(to bottom, #fff, ${accent.color})`);

        document.getElementById('modal-plan-name').innerText = plan;
        document.getElementById('modal-plan-price').innerText = price;
        document.getElementById('modal-plan-installments').innerText = installments;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Modal
    if (e.target.closest('.modal-close') || e.target.classList.contains('modal-overlay')) {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Pix Copy
    const copyBtn = e.target.closest('#copy-pix');
    if (copyBtn) {
        const input = document.getElementById('pix-key');
        if (input) {
            input.select();
            navigator.clipboard.writeText(input.value);
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => { copyBtn.innerHTML = '<i class="far fa-copy"></i> Copiar'; }, 2000);
        }
    }
});

// SWUP Setup
if (typeof Swup !== 'undefined') {
    const swup = new Swup({ containers: ['#swup'] });
    swup.on('contentReplaced', () => {
        initAnimations();
        initModal();
        updateActiveLink();
        window.scrollTo(0, 0);
    });
}

// Lifecycle
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-enabled');
    initAnimations();
    initModal();
    updateActiveLink();

});
