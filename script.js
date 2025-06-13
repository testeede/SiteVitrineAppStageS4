//navigation entre les sections
function showSection(sectionId) {
    // cache toutes les sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // montre la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

//thème sombre/clair
function initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
                // petite anim du bouton
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

//barre de progression en haut de la page
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateProgress);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe tous les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.version-card, .feature, .context, .hero');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateParallax);
    });
}

// titre qui s'affiche lettre par lettre
function initTypingEffect() {
    const titleElement = document.querySelector('.hero h1');
    if (!titleElement) return;

    const originalText = titleElement.textContent;
    titleElement.textContent = '';
    titleElement.style.borderRight = '2px solid var(--accent-primary)';
    titleElement.style.animation = 'blink 1s infinite';

    // Ajoute le CSS pour le curseur qui clignote
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { border-color: var(--accent-primary); }
            51%, 100% { border-color: transparent; }
        }
    `;
    document.head.appendChild(style);

    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            titleElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Vire le curseur à la fin
            setTimeout(() => {
                titleElement.style.borderRight = 'none';
                titleElement.style.animation = 'none';
            }, 1000);
        }
    }

    // Démarre l'effet après un petit délai
    setTimeout(typeWriter, 500);
}

//animation des cartes 
function enhanceCardAnimations() {
    const cards = document.querySelectorAll('.version-card');
    
    cards.forEach(card => {
        // Effet tilt au survol
        card.addEventListener('mouseenter', (e) => {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', (e) => {
            card.style.transform = 'translateY(0) scale(1)';
        });

        // Effet ripple au clic
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            // Ajoute l'anim CSS si elle existe pas
            if (!document.querySelector('#ripple-animation')) {
                const rippleStyle = document.createElement('style');
                rippleStyle.id = 'ripple-animation';
                rippleStyle.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(rippleStyle);
            }

            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function initSmoothScrolling() {
    // scroll smooth pour les liens internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

function enhanceKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Ajoute les styles pour la nav clavier
    const keyboardStyle = document.createElement('style');
    keyboardStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--accent-primary) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(keyboardStyle);
}


function initMicroInteractions() {
    // Anim au survol des liens
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Effet de pulsation sur les boutons au clic
    document.querySelectorAll('button, .version-card').forEach(element => {
        element.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// initialisation
document.addEventListener('DOMContentLoaded', function() {
    // on lance toutes les fonctionnalités
    initThemeSystem();
    createReadingProgress();
    initScrollAnimations();
    initParallaxEffect();
    initTypingEffect();
    enhanceCardAnimations();
    initSmoothScrolling();
    initLazyLoading();
    enhanceKeyboardNavigation();
    initMicroInteractions();

    // Anim d'entrée pour les cartes 
    const cards = document.querySelectorAll('.version-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.9)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 150 + 300);
    });

}); 