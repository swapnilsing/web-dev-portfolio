/* ============================================== */
/* JAVASCRIPT FOR SMOOTH SCROLLING                */
/* ============================================== */
/* This file makes the navigation links scroll smoothly instead of jumping */

// Select all navigation links (the <a> tags inside the <nav>)
document.querySelectorAll('nav a').forEach(link => {
    
    // Add a click event listener to each link
    link.addEventListener('click', function(e) {
        
        // Prevent the default jump behavior
        e.preventDefault();
        
        // Find the section to scroll to (gets the href like "#about")
        const target = document.querySelector(this.getAttribute('href'));
        
        // Scroll smoothly to that section
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

/* ============================================== */
/* SCROLL REVEAL - IntersectionObserver to reveal  */
/* elements as they come into view for responsiveness */
/* ============================================== */
(function() {
    // Respect users who prefer reduced motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Section-level grouping (hero, main sections, footer)
    const sectionSelectors = ['.hero', '#about', '#skills', '#projects', '#contact', 'footer'];
    const sections = Array.from(document.querySelectorAll(sectionSelectors.join(',')));

    if (reduced) {
        // Reveal everything immediately
        sections.forEach(sec => sec.classList.add('is-visible'));
        document.querySelectorAll('.project-card, .skill').forEach(el => el.classList.add('is-visible'));
        return;
    }

    // Assign staggered delays per section and per-item inside sections
    sections.forEach((sec, sIdx) => {
        const base = sIdx * 160; // base delay per section
        sec.classList.add('reveal');
        sec.style.setProperty('--reveal-delay', `${base}ms`);

        // Stagger project cards inside the projects section
        if (sec.matches('#projects')) {
            const cards = sec.querySelectorAll('.project-card');
            cards.forEach((c, i) => {
                c.classList.add('reveal');
                c.style.setProperty('--reveal-delay', `${base + 140 + i * 90}ms`);
            });
        }

        // Stagger skills inside the skills section
        if (sec.matches('#skills')) {
            const skills = sec.querySelectorAll('.skill');
            skills.forEach((sk, i) => {
                sk.classList.add('reveal');
                sk.style.setProperty('--reveal-delay', `${base + 120 + i * 60}ms`);
            });
        }
    });

    // Also reveal any direct project cards or skills outside the sections
    document.querySelectorAll('.project-card:not(.reveal), .skill:not(.reveal)').forEach((el, idx) => {
        el.classList.add('reveal');
        el.style.setProperty('--reveal-delay', `${800 + idx * 80}ms`);
    });

    // Observe all elements that have the reveal class
    const toObserve = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // add visible class which will honor --reveal-delay in CSS
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    toObserve.forEach(el => io.observe(el));
})();

/* ============================================== */
/* DYNAMIC INTERACTIVITY: parallax, active-nav,   */
/* and card tilt (disabled for reduced motion)     */
/* ============================================== */
(function() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- HERO PARALLAX ---
    const hero = document.querySelector('.hero');
    if (!reduced && hero) {
        let ticking = false;
        function updateParallax() {
            const y = window.scrollY || window.pageYOffset;
            // subtle vertical shift of background
            hero.style.backgroundPosition = `center ${Math.round(y * 0.25)}px`;
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // --- ACTIVE NAV HIGHLIGHT ---
    const navLinks = Array.from(document.querySelectorAll('nav a'));
    const sectionEls = Array.from(document.querySelectorAll('.hero, section'));

    if (sectionEls.length && navLinks.length && !reduced) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id || 'home';
                    navLinks.forEach(a => {
                        const href = a.getAttribute('href').replace('#','');
                        if (href === id) {
                            a.classList.add('active');
                        } else {
                            a.classList.remove('active');
                        }
                    });
                }
            });
        }, { threshold: 0.45 });

        sectionEls.forEach(s => navObserver.observe(s));
    }

    // --- PROJECT CARD TILT (mouse move) ---
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!reduced && cards.length) {
        cards.forEach(card => {
            const strength = 12; // degrees of tilt
            card.style.transformStyle = 'preserve-3d';
            card.style.willChange = 'transform';

            function onMove(e) {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                const rotY = dx * strength;
                const rotX = -dy * strength;
                card.style.transform = `translateZ(0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
            }

            function onLeave() {
                card.style.transform = '';
            }

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
            card.addEventListener('blur', onLeave);
        });
    }

})();


