/* ── THEME TOGGLE ── */
(function () {
    const html = document.documentElement;
    const saved = localStorage.getItem('jjka-theme');

    if (saved === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.removeAttribute('data-theme');
        localStorage.setItem('jjka-theme', 'light');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        function applyTheme(theme) {
            if (theme === 'dark') {
                html.setAttribute('data-theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
            }
            localStorage.setItem('jjka-theme', theme);
            themeToggle.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'
            );
        }

        const currentTheme = html.hasAttribute('data-theme') ? 'dark' : 'light';
        applyTheme(currentTheme);

        themeToggle.addEventListener('click', () => {
            const current = html.hasAttribute('data-theme') ? 'dark' : 'light';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    });
})();

/* ── TYPING ANIMATION ── */
document.addEventListener('DOMContentLoaded', () => {
    const typingEl = document.getElementById('typing-text');
    if (!typingEl) return;

    const roles = [
        'Étudiant Cybersécurité & Réseaux',
        'CTF Player · CyLab Academy',
        'Cyberanalyste Junior (Cisco)',
        'Python Lover',
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const SPEED_TYPE = 60;
    const SPEED_DELETE = 35;
    const PAUSE_END = 1800;
    const PAUSE_START = 400;

    function type() {
        const current = roles[roleIndex];
        if (isDeleting) {
            typingEl.textContent = current.slice(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.slice(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? SPEED_DELETE : SPEED_TYPE;

        if (!isDeleting && charIndex === current.length) {
            delay = PAUSE_END;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = PAUSE_START;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 700);
});

/* ── DOM ELEMENTS ── */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');
const toast = document.querySelector('.toast');
const scrollProgress = document.querySelector('.scroll-progress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let toastTimer;

/* ── TOAST ── */
const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 2600);
};

/* ── MENU MOBILE ── */
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isOpen = navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ── SKILL BARS ── */
const animateSkills = () => {
    document.querySelectorAll('.skill-level').forEach((skill) => {
        const level = skill.getAttribute('data-level');
        if (level) skill.style.width = `${level}%`;
    });
};

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.disconnect();
            }
        });
    }, { threshold: 0.35 });
    skillObserver.observe(skillsSection);
}

/* ── STAT COUNTERS ── */
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-count'), 10);
    if (Number.isNaN(target)) return;
    const duration = 1600;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

const statsSection = document.querySelector('.stats');
if (statsSection) {
    const observerStats = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                statNumbers.forEach(animateCounter);
                observer.disconnect();
            }
        });
    }, { threshold: 0.4 });
    observerStats.observe(statsSection);
}

/* ── PROJECT FILTER ── */
const filterButtons = document.querySelectorAll('.filter-btn');
const allProjects = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        let visibleCount = 0;

        allProjects.forEach((project) => {
            const category = project.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                visibleCount += 1;
                project.classList.remove('is-hidden');
                requestAnimationFrame(() => project.classList.remove('is-fading'));
            } else {
                project.classList.add('is-fading');
                setTimeout(() => project.classList.add('is-hidden'), 200);
            }
        });

        showToast(`${visibleCount} projet(s) affiché(s)`);
    });
});

/* ── CONTACT FORM (EmailJS) ──
   1. Crée un compte sur https://emailjs.com (gratuit)
   2. Crée un service Email (Gmail, Outlook…)  → note le SERVICE_ID
   3. Crée un template avec les variables : {{from_name}}, {{reply_to}}, {{message}}
      → note le TEMPLATE_ID
   4. Remplace VOTRE_SERVICE_ID et VOTRE_TEMPLATE_ID ci-dessous
   5. Dans le <head> de index.html, remplace VOTRE_PUBLIC_KEY par ta clé publique EmailJS
*/
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name    = contactForm.from_name.value.trim();
        const email   = contactForm.reply_to.value.trim();
        const message = contactForm.message.value.trim();

        if (!name || !email || !message) {
            showToast('Merci de remplir tous les champs.');
            return;
        }

        // UI loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtnText.textContent = 'Envoi en cours…';
        }

        try {
            await emailjs.send(
                'VOTRE_SERVICE_ID',   // ← remplace par ton Service ID EmailJS
                'VOTRE_TEMPLATE_ID',  // ← remplace par ton Template ID EmailJS
                { from_name: name, reply_to: email, message }
            );
            showToast('✅ Message envoyé avec succès !');
            contactForm.reset();
        } catch (err) {
            console.error('EmailJS error:', err);
            // Fallback : ouvrir le client mail
            const subject = encodeURIComponent(`Contact portfolio – ${name}`);
            const body    = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:junioragbenonzan31@gmail.com?subject=${subject}&body=${body}`;
            showToast('Ouverture de votre application email…');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtnText.textContent = 'Envoyer le Message';
            }
        }
    });
}

/* ── SCROLL REVEAL ── */
const revealGroups = [
    '.hero-text > *', '.hero-image', '.stat-item',
    '.about-text > *', '.info-item', '.tag', '.skill-category',
    '.project-card', '.category', '.timeline-item', '.contact-item',
    '.contact-form', '.cert-card', '.ctf-cat-card', '.ctf-platform-card',
    '.cisco-module'
];

const revealElements = document.querySelectorAll(revealGroups.join(', '));

if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
} else {
    revealElements.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 8) * 70}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => revealObserver.observe(el));
}

/* ── FLOATING ELEMENTS ── */
document.querySelectorAll('.floating-element').forEach((el, i) => {
    el.style.animationDelay = `${i * 2}s`;
});

/* ── SCROLL PROGRESS ── */
const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

/* ── NAVBAR STATE ── */
const toggleHeaderState = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 80);
};

/* ── BACK TO TOP VISIBILITY ── */
const toggleBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
};

// Init
updateScrollProgress();
toggleHeaderState();
toggleBackToTop();

window.addEventListener('scroll', () => {
    toggleHeaderState();
    updateScrollProgress();
    toggleBackToTop();
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

/* ── ACTIVE NAV ON SCROLL ── */
const sections = Array.from(navAnchors)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const activeId = `#${entry.target.id}`;
            navAnchors.forEach((link) => {
                link.classList.toggle('is-active', link.getAttribute('href') === activeId);
            });
        });
    }, { rootMargin: '-42% 0px -45% 0px', threshold: 0.01 });

    sections.forEach((s) => sectionObserver.observe(s));
}

/* ── PARALLAX HERO ── */
if (!prefersReducedMotion) {
    const hero = document.querySelector('.hero');
    const parallaxTargets = document.querySelectorAll('.orb, .floating-element');

    if (hero && parallaxTargets.length) {
        hero.addEventListener('mousemove', (event) => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            parallaxTargets.forEach((node, index) => {
                const depth = (index % 3 + 1) * 4;
                node.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            parallaxTargets.forEach((node) => { node.style.transform = ''; });
        });
    }
}
