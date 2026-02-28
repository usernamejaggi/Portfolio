/* ============================================
   NIKHIL JAGGI — PORTFOLIO ENGINE
   Clean Depth Animations · Photo Lighting · Fully Responsive
   ============================================ */

(() => {
    'use strict';

    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');
    const preloaderPercent = document.getElementById('preloaderPercent');

    function animatePreloader() {
        const duration = 2000;
        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            if (preloaderPercent) preloaderPercent.textContent = Math.floor(eased * 100) + '%';
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    animatePreloader();

    window.addEventListener('load', () => {
        if (preloaderPercent) preloaderPercent.textContent = '100%';
        setTimeout(() => {
            preloader?.classList.add('loaded');
            document.body.style.overflow = '';
            initAllAnimations();
        }, 2200);
    });

    // ==================== CUSTOM CURSOR ====================
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let mx = 0, my = 0, fx = 0, fy = 0;

    if (cursorDot && cursorOutline && window.innerWidth > 768 && !matchMedia('(pointer: coarse)').matches) {
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursorDot.style.left = mx + 'px';
            cursorDot.style.top = my + 'px';
        });
        (function followLoop() {
            fx += (mx - fx) * 0.12;
            fy += (my - fy) * 0.12;
            cursorOutline.style.left = fx + 'px';
            cursorOutline.style.top = fy + 'px';
            requestAnimationFrame(followLoop);
        })();
        document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, .ach-card, .value-card, .cert-card, .cert-card-enhanced, .contact-row').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    }

    // ==================== NAVBAR ====================
    const nav = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const y = window.pageYOffset;
        nav?.classList.toggle('scrolled', y > 60);
        if (y > 400) {
            nav.style.transform = y > lastScrollY + 5 ? 'translateY(-100%)' : 'translateY(0)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollY = y;
    }, { passive: true });

    function toggleMenu(open) {
        const isOpen = open ?? !navMenu?.classList.contains('active');
        navToggle?.classList.toggle('active', isOpen);
        navMenu?.classList.toggle('active', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
    }
    navToggle?.addEventListener('click', () => toggleMenu());
    navMenu?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    function updateActiveNav() {
        const y = window.pageYOffset + 200;
        sections.forEach(sec => {
            const top = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
            if (y >= top && y < top + h) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ==================== BACK TO TOP ====================
    const backToTop = document.getElementById('backToTop');
    const progressCircle = document.querySelector('.progress-ring-circle');
    const CIRCUMFERENCE = 2 * Math.PI * 22;

    if (progressCircle) {
        progressCircle.style.strokeDasharray = CIRCUMFERENCE;
        progressCircle.style.strokeDashoffset = CIRCUMFERENCE;
    }
    window.addEventListener('scroll', () => {
        backToTop?.classList.toggle('visible', window.pageYOffset > 600);
        if (progressCircle) {
            const ratio = Math.min(window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight), 1);
            progressCircle.style.strokeDashoffset = CIRCUMFERENCE * (1 - ratio);
        }
    }, { passive: true });
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ==================== THEME TOGGLE ====================
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle?.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // ==================== HERO PARTICLE CANVAS ====================
    function initHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, particles = [], visible = true, raf = null;
        const COUNT = 70;

        const hero = document.getElementById('hero');
        if ('IntersectionObserver' in window && hero) {
            new IntersectionObserver(([e]) => {
                visible = e.isIntersecting;
                if (visible && !raf) animate();
            }, { threshold: 0 }).observe(hero);
        }

        function resize() { w = canvas.width = canvas.parentElement.offsetWidth; h = canvas.height = canvas.parentElement.offsetHeight; }

        class P {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w; this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
                this.r = Math.random() * 1.5 + 0.5; this.alpha = Math.random() * 0.25 + 0.05;
                const c = ['129,140,248', '192,132,252', '34,211,238', '52,211,153'];
                this.color = c[Math.floor(Math.random() * c.length)];
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.alpha})`; ctx.fill();
            }
        }

        function init() { resize(); particles = []; for (let i = 0; i < COUNT; i++) particles.push(new P()); }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(129,140,248,${0.04 * (1 - dist / 140)})`; ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            if (!visible) { raf = null; return; }
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            raf = requestAnimationFrame(animate);
        }

        init(); animate();
        window.addEventListener('resize', resize);
    }

    // ==================== SKILL SPHERE CANVAS ====================
    function initSkillSphere() {
        const canvas = document.getElementById('skillSphere');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 300;
        canvas.width = size * 2; canvas.height = size * 2;
        canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
        ctx.scale(2, 2);

        const skills = ['Python', 'Java', 'C++', 'ML', 'NLP', 'React', 'Redux', 'Firebase', 'Git', 'Pandas', 'Scikit', 'KNN', 'DL', 'HTML5', 'CSS3', 'JS', 'Tailwind', 'AI'];
        const points = [];
        const phi = (1 + Math.sqrt(5)) / 2;
        skills.forEach((s, i) => {
            const theta = Math.acos(1 - 2 * (i + 0.5) / skills.length);
            const p = 2 * Math.PI * i / phi;
            points.push({ x: Math.sin(theta) * Math.cos(p), y: Math.sin(theta) * Math.sin(p), z: Math.cos(theta), label: s });
        });

        let ax = 0, ay = 0;
        const R = 100;
        const colors = ['#818cf8', '#c084fc', '#22d3ee', '#34d399', '#fbbf24', '#fb7185'];

        function project(x, y, z) {
            const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
            let y1 = y * cx - z * sx, z1 = y * sx + z * cx;
            let x1 = x * cy - z1 * sy; z1 = x * sy + z1 * cy;
            const sc = 200 / (200 + z1);
            return { px: x1 * R * sc + size / 2, py: y1 * R * sc + size / 2, scale: sc, z: z1 };
        }

        let isVisible = false;
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([e]) => { isVisible = e.isIntersecting; }, { threshold: 0.1 }).observe(canvas);
        }

        function draw() {
            if (!isVisible) { requestAnimationFrame(draw); return; }
            ctx.clearRect(0, 0, size, size);
            ay += 0.004; ax += 0.002;
            const proj = points.map((p, i) => ({ ...project(p.x, p.y, p.z), label: p.label, index: i })).sort((a, b) => a.z - b.z);
            proj.forEach(p => {
                const alpha = Math.max(0.15, Math.min(1, (p.z + R) / (2 * R)));
                const fs = 7 + p.scale * 3;
                ctx.font = `600 ${fs}px 'Space Grotesk', sans-serif`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillStyle = colors[p.index % colors.length];
                ctx.globalAlpha = alpha;
                ctx.fillText(p.label, p.px, p.py);
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ==================== TAGLINE WORD ROTATION ====================
    function initTaglineRotation() {
        const words = document.querySelectorAll('.tagline-word');
        if (!words.length) return;
        let idx = 0;
        setInterval(() => {
            words[idx].classList.remove('active');
            words[idx].classList.add('exit-up');
            setTimeout(() => words[idx === 0 ? words.length - 1 : idx - 1].classList.remove('exit-up'), 600);
            idx = (idx + 1) % words.length;
            words[idx].classList.add('active');
        }, 3000);
    }

    // ==================== TERMINAL TYPING ====================
    function initTerminalTyping() {
        const el = document.getElementById('terminalCmd');
        if (!el) return;
        const cmds = ['cat skills.json', 'python train_model.py', 'npm run build', 'git push origin main', 'java -jar portfolio.jar'];
        let ci = 0, chi = 0, del = false;
        function type() {
            const c = cmds[ci];
            if (del) {
                el.textContent = c.substring(0, chi--);
                if (chi < 0) { del = false; ci = (ci + 1) % cmds.length; setTimeout(type, 400); return; }
                setTimeout(type, 25);
            } else {
                el.textContent = c.substring(0, chi++);
                if (chi > c.length) { del = true; setTimeout(type, 2500); return; }
                setTimeout(type, 65);
            }
        }
        setTimeout(type, 3000);
    }

    // ==================== SCROLL REVEAL ====================
    function initScrollReveal() {
        // All elements that need .in-view class for CSS animations
        const selectors = [
            '.section-header',
            '.about-left',
            '.about-right',
            '.value-card',
            '.skill-card',
            '.exp-card',
            '.project-featured',
            '.project-card',
            '.ach-card',
            '.edu-item',
            '.contact-hero',
            '.contact-links',
            '.contact-form-wrap',
            '.contact-form',
            '.contact-row',
            '.cert-card',
            '.cert-card-enhanced',
            '.marquee-strip',
            '.footer',
            '.section-title',
            '.skill-bar-fill',
            '[data-reveal]',
            '[data-animate]'
        ];

        const allEls = document.querySelectorAll(selectors.join(','));
        if (!allEls.length) return;

        // Use a lower threshold for earlier triggering and smoother feel
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const delay = parseInt(e.target.dataset.delay) || 0;
                    
                    // Use requestAnimationFrame for buttery smooth timing
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            e.target.classList.add('in-view');
                            e.target.classList.add('animated');

                            // Trigger skill bar width
                            if (e.target.classList.contains('skill-bar-fill')) {
                                const w = e.target.dataset.width;
                                if (w) e.target.style.width = w + '%';
                            }
                        }, delay);
                    });
                    obs.unobserve(e.target);
                }
            });
        }, { 
            threshold: 0.05, 
            rootMargin: '0px 0px -60px 0px' 
        });

        allEls.forEach(el => obs.observe(el));
    }

    // ==================== SKILL BARS ====================
    function initSkillBars() {
        const bars = document.querySelectorAll('.skill-bar-fill');
        if (!bars.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const w = e.target.dataset.width;
                    if (w) setTimeout(() => {
                        e.target.style.width = w + '%';
                        e.target.classList.add('animated');
                    }, 200);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        bars.forEach(b => obs.observe(b));
    }

    // ==================== COUNTER ANIMATION ====================
    function initCounters() {
        const counters = document.querySelectorAll('.hero-stat-num[data-target]');
        if (!counters.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting || e.target.dataset.counted) return;
                e.target.dataset.counted = 'true';
                const target = parseInt(e.target.dataset.target);
                if (isNaN(target)) return;
                const start = performance.now();
                function tick(now) {
                    const p = Math.min((now - start) / 2000, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    e.target.textContent = Math.floor(eased * target);
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                obs.unobserve(e.target);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => obs.observe(c));
    }

    // ==================== 3D TILT EFFECT ====================
    function initTilt() {
        if (window.innerWidth <= 768 || matchMedia('(pointer: coarse)').matches) return;
        document.querySelectorAll('[data-tilt]').forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                el.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
                el.style.transition = 'transform 0.1s ease-out';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    // ==================== CARD MOUSE GLOW ====================
    function initCardGlow() {
        if (window.innerWidth <= 768) return;
        document.querySelectorAll('.value-card, .skill-card, .project-card, .ach-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
            });
        });
    }

    // ==================== CONTACT FORM ====================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const success = document.getElementById('formSuccess');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            form.style.display = 'none';
            success?.classList.add('visible');
            setTimeout(() => {
                form.style.display = '';
                success?.classList.remove('visible');
                form.reset();
            }, 4000);
        });
    }

    // ==================== SMOOTH SCROLL FOR NAV LINKS ====================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ==================== GSAP DEPTH ANIMATIONS ====================
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth <= 768;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.defaults({ ease: 'power3.out', duration: 1 });

        // NOTE: CSS handles all opacity/transform reveals via .in-view
        // GSAP only handles parallax depth effects & scrub animations (no opacity/transform conflicts)

        // ===== PARALLAX DEPTH on hero blobs & content =====
        if (!isMobile) {
            gsap.to('.hero-blob-1', {
                y: -80, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
            });
            gsap.to('.hero-blob-2', {
                y: -50, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
            });

            // Photo ring speed-up on scroll
            gsap.to('.hero-photo-ring', {
                rotation: 360, ease: 'none',
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
            });
        }

        // ===== About photo spotlight following scroll =====
        if (!isMobile) {
            gsap.to('.about-photo-spotlight', {
                x: 30, y: 20,
                scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 3 }
            });
        }

        // ===== MARQUEE PARALLAX =====
        if (!isMobile) {
            gsap.to('.marquee-track', {
                x: -100, scrollTrigger: { trigger: '.marquee-strip', start: 'top bottom', end: 'bottom top', scrub: 2 }
            });
        }

        // ===== SECTION GLOWS MOVEMENT =====
        gsap.utils.toArray('.section-glow').forEach(glow => {
            gsap.to(glow, {
                x: 50, y: -30, scrollTrigger: { trigger: glow.parentElement, start: 'top bottom', end: 'bottom top', scrub: 3 }
            });
        });

        // ===== DEPTH SCALE — cards scale slightly as they scroll through viewport =====
        if (!isMobile) {
            gsap.utils.toArray('.value-card, .skill-card, .project-card, .ach-card, .edu-card-apple').forEach(card => {
                gsap.fromTo(card,
                    { filter: 'brightness(0.92)' },
                    {
                        filter: 'brightness(1)',
                        scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 50%', scrub: 1 }
                    }
                );
            });
        }

        // Education score ring animation
        const scorePathEl = document.querySelector('.edu-score-path');
        if (scorePathEl) {
            gsap.to(scorePathEl, {
                attr: { 'stroke-dasharray': '105, 138.23' },
                duration: 1.5, ease: 'power2.out',
                scrollTrigger: { trigger: scorePathEl, start: 'top 80%', once: true }
            });
        }
    }

    // ==================== INIT ALL ====================
    function initAllAnimations() {
        initHeroCanvas();
        initSkillSphere();
        initTaglineRotation();
        initTerminalTyping();
        initScrollReveal();
        initSkillBars();
        initCounters();
        initTilt();
        initCardGlow();
        initContactForm();
        initSmoothScroll();
        initGSAP();
    }

})();