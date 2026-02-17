/* ============================================
   NIKHIL JAGGI — AI/ML ENGINEER PORTFOLIO
   God-Level Animations & Interactive Engine
   ============================================ */

(() => {
    'use strict';

    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');

    // Neural network canvas for preloader
    const preloaderCanvas = document.getElementById('preloaderCanvas');
    if (preloaderCanvas) {
        const ctx = preloaderCanvas.getContext('2d');
        preloaderCanvas.width = 600;
        preloaderCanvas.height = 600;

        const nodes = [];
        for (let i = 0; i < 40; i++) {
            nodes.push({
                x: Math.random() * 600,
                y: Math.random() * 600,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                r: Math.random() * 2.5 + 1
            });
        }

        function drawPreloaderNet() {
            ctx.clearRect(0, 0, 600, 600);
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > 600) n.vx *= -1;
                if (n.y < 0 || n.y > 600) n.vy *= -1;
            });
            // connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            // dots
            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
                ctx.fill();
            });

            if (!preloader.classList.contains('loaded')) {
                requestAnimationFrame(drawPreloaderNet);
            }
        }
        drawPreloaderNet();
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
            document.body.style.overflow = '';
            initAllAnimations();
        }, 2200);
    });

    // ==================== CURSOR ====================
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.12;
            outlineY += (mouseY - outlineY) * 0.12;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        document.querySelectorAll('a, button, .btn, .skill-tag, .nav-link, .project-card-fancy, .ach-card-3d, .value-card, .contact-row, .cert-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    }

    // ==================== PARTICLE CANVAS ====================
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        const pCtx = particleCanvas.getContext('2d');
        let particles = [];
        let pW, pH;

        function resizeParticleCanvas() {
            pW = particleCanvas.width = window.innerWidth;
            pH = particleCanvas.height = window.innerHeight;
        }
        resizeParticleCanvas();
        window.addEventListener('resize', resizeParticleCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * pW;
                this.y = Math.random() * pH;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.color = ['99,102,241', '168,85,247', '6,182,212'][Math.floor(Math.random() * 3)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > pW || this.y < 0 || this.y > pH) this.reset();
            }
            draw() {
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                pCtx.fill();
            }
        }

        const particleCount = Math.min(80, Math.floor(pW * pH / 18000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            pCtx.clearRect(0, 0, pW, pH);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        pCtx.beginPath();
                        pCtx.moveTo(particles[i].x, particles[i].y);
                        pCtx.lineTo(particles[j].x, particles[j].y);
                        pCtx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 150)})`;
                        pCtx.lineWidth = 0.5;
                        pCtx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Mouse interaction
        document.addEventListener('mousemove', (e) => {
            particles.forEach(p => {
                const dx = e.clientX - p.x;
                const dy = e.clientY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    p.x -= dx * 0.01;
                    p.y -= dy * 0.01;
                }
            });
        });
    }

    // ==================== SCATTER PLOT CANVAS ====================
    const scatterCanvas = document.getElementById('scatterCanvas');
    if (scatterCanvas) {
        const sCtx = scatterCanvas.getContext('2d');
        const sParent = scatterCanvas.parentElement;

        function resizeScatter() {
            scatterCanvas.width = sParent.clientWidth;
            scatterCanvas.height = sParent.clientHeight || 100;
        }

        const scatterResizeObs = new ResizeObserver(resizeScatter);
        scatterResizeObs.observe(sParent);
        resizeScatter();

        const scatterPoints = [];
        const clusters = [
            { cx: 0.3, cy: 0.3, color: '99,102,241' },
            { cx: 0.7, cy: 0.6, color: '168,85,247' },
            { cx: 0.5, cy: 0.8, color: '6,182,212' }
        ];

        clusters.forEach(c => {
            for (let i = 0; i < 18; i++) {
                scatterPoints.push({
                    x: c.cx + (Math.random() - 0.5) * 0.22,
                    y: c.cy + (Math.random() - 0.5) * 0.22,
                    color: c.color,
                    r: Math.random() * 2 + 1.5,
                    vx: (Math.random() - 0.5) * 0.001,
                    vy: (Math.random() - 0.5) * 0.001,
                    baseX: 0, baseY: 0
                });
            }
        });
        scatterPoints.forEach(p => { p.baseX = p.x; p.baseY = p.y; });

        function drawScatter() {
            const w = scatterCanvas.width;
            const h = scatterCanvas.height;
            sCtx.clearRect(0, 0, w, h);

            scatterPoints.forEach(p => {
                p.x = p.baseX + Math.sin(Date.now() * 0.001 + p.baseX * 10) * 0.015;
                p.y = p.baseY + Math.cos(Date.now() * 0.001 + p.baseY * 10) * 0.015;

                sCtx.beginPath();
                sCtx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
                sCtx.fillStyle = `rgba(${p.color}, 0.6)`;
                sCtx.fill();

                // glow
                sCtx.beginPath();
                sCtx.arc(p.x * w, p.y * h, p.r + 3, 0, Math.PI * 2);
                sCtx.fillStyle = `rgba(${p.color}, 0.08)`;
                sCtx.fill();
            });

            requestAnimationFrame(drawScatter);
        }
        drawScatter();
    }

    // ==================== NAVIGATION ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const sections = document.querySelectorAll('section[id]');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    // Consolidated scroll handler for performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                // Navbar scroll effect
                if (navbar) {
                    navbar.classList.toggle('scrolled', currentScroll > 60);
                }

                // Active nav link
                const scrollY = currentScroll + 200;
                sections.forEach(section => {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    const id = section.getAttribute('id');
                    const link = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (link) {
                        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
                    }
                });

                // Scroll progress bar
                if (scrollProgress) {
                    const h = document.documentElement.scrollHeight - window.innerHeight;
                    scrollProgress.style.width = (currentScroll / h) * 100 + '%';
                }

                // Back to top
                if (backToTop) {
                    backToTop.classList.toggle('visible', currentScroll > 500);
                }

                // Hero scroll indicator fade out
                const scrollIndicator = document.querySelector('.hero-scroll-indicator');
                if (scrollIndicator && scrollIndicator.style.opacity === '1') {
                    scrollIndicator.style.opacity = currentScroll > 100 ? '0' : '1';
                    scrollIndicator.style.transition = 'opacity 0.5s ease';
                }

                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile toggle with overlay & body scroll lock
    function openMobileNav() {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.classList.add('nav-open');
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            isOpen ? closeMobileNav() : openMobileNav();
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        // Close on overlay click
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMobileNav);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }

    // ==================== BACK TO TOP ====================
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== TYPED TEXT ====================
    const typedTextEl = document.getElementById('typedText');
    if (typedTextEl) {
        const roles = [
            'Machine Learning',
            'Deep Learning & NLP',
            'Data Analysis',
            'Full-Stack Development',
            'AI-Powered Systems',
            'Recommendation Engines',
            'Computer Vision'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeDelay = 80;

        function typeEffect() {
            const current = roles[roleIndex];
            if (isDeleting) {
                typedTextEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                typeDelay = 40;
            } else {
                typedTextEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                typeDelay = 80;
            }

            if (!isDeleting && charIndex === current.length) {
                typeDelay = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeDelay = 400;
            }

            setTimeout(typeEffect, typeDelay);
        }
        setTimeout(typeEffect, 1000);
    }

    // ==================== COUNTER ANIMATION ====================
    function animateCounters() {
        const counters = document.querySelectorAll('.metric-value[data-target]');
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                counter.textContent = Math.floor(target * ease);
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            counter.dataset.animated = 'true';
            requestAnimationFrame(updateCounter);
        });
    }

    // ==================== SKILL BARS ====================
    function animateSkillBars() {
        document.querySelectorAll('.sbar-fill').forEach(bar => {
            if (bar.dataset.animated) return;
            const w = bar.dataset.width;
            if (w) {
                bar.style.width = w + '%';
                bar.dataset.animated = 'true';
            }
        });
    }

    // ==================== INTERSECTION OBSERVER ====================
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

        // Counter observer
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const metricsSection = document.querySelector('.hero-metrics');
        if (metricsSection) counterObserver.observe(metricsSection);

        // Skill bars observer
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));
    }

    // ==================== MAGNETIC BUTTONS ====================
    function initMagneticButtons() {
        if (window.innerWidth <= 768) return;

        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ==================== VANILLA TILT INIT ====================
    function initTilt() {
        if (window.innerWidth <= 768 || typeof VanillaTilt === 'undefined') return;
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'));
    }

    // ==================== GSAP SCROLL TRIGGERS ====================
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Hero text reveal
        gsap.from('.hero-line-reveal > *', {
            y: 80,
            opacity: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: 'power4.out',
            delay: 2.5
        });

        gsap.from('.hero-availability', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 2.3
        });

        gsap.from('.hero-role-bar', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 3
        });

        gsap.from('.hero-description', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 3.2
        });

        gsap.from('.hero-actions .btn', {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 3.4
        });

        gsap.from('.hero-metrics', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 3.6
        });

        gsap.from('.hero-visual', {
            x: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 2.8
        });

        // Floating chips stagger
        gsap.from('.floating-chip', {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'back.out(1.7)',
            delay: 3.5
        });

        // Section labels
        gsap.utils.toArray('.section-label').forEach(label => {
            gsap.from(label, {
                scrollTrigger: {
                    trigger: label,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                x: -30,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out'
            });

            // Animate the rule line expanding
            const rule = label.querySelector('.section-rule');
            if (rule) {
                gsap.from(rule, {
                    scrollTrigger: {
                        trigger: label,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    scaleX: 0,
                    transformOrigin: 'left center',
                    duration: 1,
                    ease: 'power2.out',
                    delay: 0.3
                });
            }
        });

        // Parallax for background orbs
        gsap.to('.mesh-orb-1', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            },
            y: -200,
            ease: 'none'
        });

        gsap.to('.mesh-orb-2', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            },
            y: 200,
            ease: 'none'
        });

        // Value cards stagger
        gsap.from('.value-card', {
            scrollTrigger: {
                trigger: '.value-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out'
        });

        // Skill categories
        gsap.from('.skill-category', {
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Achievement cards
        gsap.from('.ach-card-3d', {
            scrollTrigger: {
                trigger: '.achievements-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Education timeline
        gsap.from('.edu-item', {
            scrollTrigger: {
                trigger: '.edu-timeline',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Certs
        gsap.from('.cert-item', {
            scrollTrigger: {
                trigger: '.certs-list',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            x: -20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Contact rows
        gsap.from('.contact-row', {
            scrollTrigger: {
                trigger: '.contact-links',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            x: -20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Contact hero text scale
        gsap.from('.contact-hero h2', {
            scrollTrigger: {
                trigger: '.contact-hero',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Marquee speed on scroll direction
        let marqueeSpeed = 1;
        ScrollTrigger.create({
            trigger: '.marquee-section',
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const vel = self.getVelocity();
                marqueeSpeed = Math.min(Math.max(1 + Math.abs(vel) / 2000, 1), 3);
                const content = document.querySelector('.marquee-content');
                if (content) {
                    content.style.animationDuration = (35 / marqueeSpeed) + 's';
                }
            }
        });

        // Project cards with perspective
        gsap.from('.project-card-fancy', {
            scrollTrigger: {
                trigger: '.projects-row',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            rotateX: 5,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Project immersive
        gsap.from('.project-immersive-visual', {
            scrollTrigger: {
                trigger: '.project-immersive',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: -40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from('.project-immersive-content > *', {
            scrollTrigger: {
                trigger: '.project-immersive',
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.2
        });

        // Hero orb parallax
        gsap.to('.hero-orb-container', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -60,
            rotate: 10,
            ease: 'none'
        });
    }

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    function validateField(field) {
        const parent = field.closest('.form-field');
        if (!parent) return true;

        let isValid = true;

        if (field.required && !field.value.trim()) {
            isValid = false;
        } else if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value.trim());
        }

        parent.classList.toggle('error', !isValid);
        return isValid;
    }

    if (contactForm) {
        // Real-time validation on blur
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                const parent = field.closest('.form-field');
                if (parent && parent.classList.contains('error')) {
                    validateField(field);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all fields
            const fields = contactForm.querySelectorAll('input, textarea');
            let allValid = true;
            fields.forEach(field => {
                if (!validateField(field)) allValid = false;
            });

            if (!allValid) {
                // Focus first invalid field
                const firstError = contactForm.querySelector('.form-field.error input, .form-field.error textarea');
                if (firstError) firstError.focus();
                return;
            }

            // Success animation feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.querySelector('span').textContent = 'Sending...';
            }

            setTimeout(() => {
                contactForm.style.display = 'none';
                if (formSuccess) formSuccess.classList.add('active');
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.querySelectorAll('.form-field').forEach(f => f.classList.remove('error'));
                    contactForm.style.display = '';
                    if (formSuccess) formSuccess.classList.remove('active');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.querySelector('span').textContent = 'Send Message';
                    }
                }, 4000);
            }, 800);
        });
    }

    // ==================== SMOOTH SCROLL ====================
    const navbarHeight = () => navbar ? navbar.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight() - 16;
                window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
            }
        });
    });

    // ==================== SECTION PARALLAX ====================
    function initSectionParallax() {
        const patterns = document.querySelectorAll('.section-bg-pattern, .section-bg-dots, .section-bg-grid');
        window.addEventListener('scroll', () => {
            patterns.forEach(p => {
                const section = p.parentElement;
                const rect = section.getBoundingClientRect();
                const offset = rect.top * 0.03;
                p.style.transform = `translateY(${offset}px)`;
            });
        });
    }

    // ==================== SKILL ORBIT COUNTER-ROTATION ====================
    function initSkillOrbits() {
        // The planets need to counter-rotate to stay upright
        // This is handled via CSS animation matching orbit speed
        // Additionally, tooltip on hover
        document.querySelectorAll('.skill-planet').forEach(planet => {
            planet.addEventListener('mouseenter', () => {
                planet.style.transform += ' scale(1.3)';
                planet.style.zIndex = '10';
                planet.style.boxShadow = '0 0 20px rgba(99,102,241,0.4)';
            });
            planet.addEventListener('mouseleave', () => {
                planet.style.transform = planet.style.transform.replace(' scale(1.3)', '');
                planet.style.zIndex = '';
                planet.style.boxShadow = '';
            });
        });
    }

    // ==================== HERO ORB MOUSE TRACK ====================
    function initOrbMouseTracking() {
        if (window.innerWidth <= 768) return;
        const orbContainer = document.querySelector('.hero-orb-container');
        if (!orbContainer) return;

        document.addEventListener('mousemove', (e) => {
            const rect = orbContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = (e.clientX - centerX) * 0.02;
            const distY = (e.clientY - centerY) * 0.02;
            orbContainer.style.transform = `translate(${distX}px, ${distY}px)`;
        });
    }

    // ==================== CHART BARS RE-ANIMATION ON SCROLL ====================
    function initChartBarAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.chart-bar').forEach((bar, i) => {
                        bar.style.animation = 'none';
                        bar.offsetHeight; // Reflow
                        bar.style.animation = `chartBarGrow 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.1}s forwards`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const mlViz = document.querySelector('.ml-viz');
        if (mlViz) observer.observe(mlViz);
    }

    // ==================== FOOTER YEAR ====================
    // Already hardcoded in HTML

    // ==================== INIT ALL ====================
    function initAllAnimations() {
        initScrollAnimations();
        initMagneticButtons();
        initTilt();
        initGSAPAnimations();
        initSectionParallax();
        initSkillOrbits();
        initOrbMouseTracking();
        initChartBarAnimation();

        // Stagger reveal for hero scroll indicator
        setTimeout(() => {
            const scrollIndicator = document.querySelector('.hero-scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '1';
            }
        }, 4000);
    }

    // In case load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
            initAllAnimations();
        }, 2200);
    }
})();