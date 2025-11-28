// --- 1. Mobile Menu Toggle ---
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('close-menu-btn');
const links = document.querySelectorAll('.mobile-link');

function toggleMenu() {
    menu.classList.toggle('translate-x-full');
    document.body.classList.toggle('overflow-hidden');
}

btn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);
links.forEach(link => link.addEventListener('click', toggleMenu));

// --- 2. Scroll Reveal Animation (Intersection Observer) ---
const revealElements = document.querySelectorAll('.reveal-section');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// --- 3. 3D Tilt Effect for Project Cards ---
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
});

// --- 4. Navbar Glass Effect on Scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
        navbar.classList.replace('py-4', 'py-2');
    } else {
        navbar.classList.remove('shadow-lg');
        navbar.classList.replace('py-2', 'py-4');
    }
});