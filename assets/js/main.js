/* ============================================
   NIKHIL JAGGI — AI/ML ENGINEER PORTFOLIO
   Main JavaScript — Animations & Interactivity
   ============================================ */

(function () {
    'use strict';

    // ==================== PRELOADER ====================
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('loaded');
                setTimeout(() => preloader.remove(), 600);
            }
            // Trigger hero animations after preloader
            animateHeroStats();
        }, 2000);
    });

    // ==================== CUSTOM CURSOR ====================
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    if (cursorDot && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
        });

        function animateCursor() {
            outlineX += (cursorX - outlineX) * 0.12;
            outlineY += (cursorY - outlineY) * 0.12;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .skill-tag, .contact-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    }

    // ==================== PARTICLE CANVAS ====================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseParticle = { x: -1000, y: -1000 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', (e) => {
            mouseParticle.x = e.clientX;
            mouseParticle.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse repulsion
                const dx = this.x - mouseParticle.x;
                const dy = this.y - mouseParticle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x += dx * force * 0.02;
                    this.y += dy * force * 0.02;
                }

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles (fewer on mobile)
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==================== NAVIGATION ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active nav link
        const sections = document.querySelectorAll('.section, .hero');
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });

        lastScroll = scrollY;
    });

    // Mobile toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==================== TYPING EFFECT ====================
    const typedElement = document.getElementById('typedText');
    if (typedElement) {
        const phrases = [
            'AI/ML Engineer',
            'Machine Learning Developer',
            'Deep Learning Enthusiast',
            'NLP Practitioner',
            'Full-Stack Developer',
            'Problem Solver'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400; // Pause before next word
            }

            setTimeout(typeWriter, typeSpeed);
        }
        setTimeout(typeWriter, 1500);
    }

    // ==================== STAT COUNTER ANIMATION ====================
    function animateHeroStats() {
        const counters = document.querySelectorAll('.metric-value[data-target]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // ==================== SCROLL ANIMATIONS ====================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        scrollObserver.observe(el);
    });

    // ==================== SKILL BAR ANIMATION ====================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.sbar-fill');
                fills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    setTimeout(() => {
                        fill.style.width = width + '%';
                    }, 300);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category').forEach(cat => {
        skillObserver.observe(cat);
    });

    // ==================== BACK TO TOP ====================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate send
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.classList.add('active');
            }, 1500);
        });
    }

    // ==================== SMOOTH SCROLL FOR NAV ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==================== TILT EFFECT ON PROJECT CARDS ====================
    if (window.innerWidth > 768) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ==================== PARALLAX ON FLOATING BADGES ====================
    if (window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const badges = document.querySelectorAll('.floating-chip');
            badges.forEach(badge => {
                const speed = badge.getAttribute('data-speed') || 2;
                const x = (window.innerWidth / 2 - e.clientX) / (80 / speed);
                const y = (window.innerHeight / 2 - e.clientY) / (80 / speed);
                badge.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ==================== KEYBOARD NAVIGATION ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

})();