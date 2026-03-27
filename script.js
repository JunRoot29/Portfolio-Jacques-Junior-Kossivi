/* ── THEME TOGGLE ── */
(function () {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Restore saved preference or default to light
    const saved = localStorage.getItem('jjka-theme');
    
    // Si pas de préférence sauvegardée, on reste en light (thème principal)
    if (saved === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else {
        // Par défaut en light, pas besoin d'attribut car c'est le thème principal
        html.removeAttribute('data-theme');
        localStorage.setItem('jjka-theme', 'light');
    }

    function updateToggleLabel(theme) {
        if (!themeToggle) return;
        themeToggle.setAttribute(
            'aria-label',
            theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'
        );
    }

    const currentTheme = html.hasAttribute('data-theme') ? 'dark' : 'light';
    updateToggleLabel(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.hasAttribute('data-theme') ? 'dark' : 'light';
            const next = current === 'light' ? 'dark' : 'light';

            if (next === 'dark') {
                html.setAttribute('data-theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
            }

            localStorage.setItem('jjka-theme', next);
            updateToggleLabel(next);
        });
    }
})();

// Éléments DOM
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');
const toast = document.querySelector('.toast');
const scrollProgress = document.querySelector('.scroll-progress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let toastTimer;

// Fonction toast
const showToast = (message) => {
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 2600);
};

// Menu mobile
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

// Animation des barres de compétences
const animateSkills = () => {
    document.querySelectorAll('.skill-level').forEach((skill) => {
        const level = skill.getAttribute('data-level');
        if (level) {
            skill.style.width = `${level}%`;
        }
    });
};

// Observer pour les compétences
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

// Compteurs de statistiques
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

// Observer pour les statistiques
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

// Filtrage des projets
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
                requestAnimationFrame(() => {
                    project.classList.remove('is-fading');
                });
            } else {
                project.classList.add('is-fading');
                setTimeout(() => {
                    project.classList.add('is-hidden');
                }, 200);
            }
        });

        showToast(`${visibleCount} projet(s) affiché(s)`);
    });
});

// Formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!name || !email || !message) {
            showToast('Merci de remplir tous les champs.');
            return;
        }

        const subject = encodeURIComponent(`Contact portfolio - ${name}`);
        const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:junioragbenonzan31@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;
        contactForm.reset();
        showToast('Votre application email va s\'ouvrir.');
    });
}

// Révélation au scroll
const revealGroups = [
    '.hero-text > *',
    '.hero-image',
    '.stat-item',
    '.about-text > *',
    '.info-item',
    '.tag',
    '.skill-category',
    '.project-card',
    '.category',
    '.timeline-item',
    '.contact-item',
    '.contact-form'
];

const revealElements = document.querySelectorAll(revealGroups.join(', '));

if (prefersReducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add('is-visible');
    });
} else {
    revealElements.forEach((element, index) => {
        element.classList.add('reveal');
        const delay = (index % 8) * 70;
        element.style.transitionDelay = `${delay}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach((element) => revealObserver.observe(element));
}

// Animation des éléments flottants
const floatingElements = document.querySelectorAll('.floating-element');
floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 2}s`;
});

// Barre de progression du scroll
const updateScrollProgress = () => {
    if (!scrollProgress) return;

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

// État de la navbar au scroll
const toggleHeaderState = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 80);
};

// Visibilité du bouton retour en haut
const toggleBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
};

// Initialisation
updateScrollProgress();
toggleHeaderState();
toggleBackToTop();

// Écouteurs d'événements scroll
window.addEventListener('scroll', () => {
    toggleHeaderState();
    updateScrollProgress();
    toggleBackToTop();
});

// Retour en haut
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
}

// Navigation active au scroll
const sections = Array.from(navAnchors)
    .map((anchor) => document.querySelector(anchor.getAttribute('href')))
    .filter(Boolean);

if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const activeId = `#${entry.target.id}`;
            navAnchors.forEach((link) => {
                const isActive = link.getAttribute('href') === activeId;
                link.classList.toggle('is-active', isActive);
            });
        });
    }, { rootMargin: '-42% 0px -45% 0px', threshold: 0.01 });

    sections.forEach((section) => sectionObserver.observe(section));
}

// Effet parallax sur la section hero (si animations non réduites)
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
            parallaxTargets.forEach((node) => {
                node.style.transform = '';
            });
        });
    }
}