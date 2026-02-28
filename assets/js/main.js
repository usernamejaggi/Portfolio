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

    // ==================== CUSTOM CURSOR — LIGHTNING EDITION ====================
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    const lightningCanvas = document.getElementById('cursorLightningCanvas');

    if (cursorDot && cursorOutline && lightningCanvas && window.innerWidth > 768 && !matchMedia('(pointer: coarse)').matches) {
        const lCtx = lightningCanvas.getContext('2d');
        let dpr = window.devicePixelRatio || 1;

        // Resize lightning canvas to fill viewport (HiDPI aware)
        function resizeLightningCanvas() {
            dpr = window.devicePixelRatio || 1;
            lightningCanvas.width = window.innerWidth * dpr;
            lightningCanvas.height = window.innerHeight * dpr;
            lightningCanvas.style.width = window.innerWidth + 'px';
            lightningCanvas.style.height = window.innerHeight + 'px';
            lCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resizeLightningCanvas();
        window.addEventListener('resize', resizeLightningCanvas);

        // Physics state — ultra smooth interpolation
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let dotX = mx, dotY = my;
        let dotVx = 0, dotVy = 0;
        let folX = mx, folY = my;
        let folVx = 0, folVy = 0;

        // Tuned spring constants for buttery feel
        const DOT_STIFFNESS = 0.18;
        const DOT_DAMPING = 0.75;
        const FOL_STIFFNESS = 0.065;
        const FOL_DAMPING = 0.82;

        // Trail history for lightning bolts (longer trail = more arcs)
        const TRAIL_LENGTH = 18;
        const trail = [];
        let lastTrailTime = 0;

        // Persistent lightning state
        let lightningAlpha = 0;
        let isMoving = false;
        let moveTimer = null;
        let lastMx = mx, lastMy = my;

        // Ambient arc bolts that fire randomly from cursor
        const ambientBolts = [];
        let lastAmbientBolt = 0;

        // Trail particles (glowing orbs that fade out)
        const trailParticles = [];
        let lastParticleTime = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            isMoving = true;
            clearTimeout(moveTimer);
            moveTimer = setTimeout(() => { isMoving = false; }, 100);
        });

        // Click effects — massive lightning burst
        document.addEventListener('mousedown', () => {
            cursorDot.classList.add('click');
            cursorOutline.classList.add('click');
            spawnElectricSparks(dotX, dotY, 14);
            spawnClickLightning(dotX, dotY);
            spawnFlash(dotX, dotY);
        });
        document.addEventListener('mouseup', () => {
            cursorDot.classList.remove('click');
            cursorOutline.classList.remove('click');
        });

        // Spawn electric spark DOM particles at a position
        function spawnElectricSparks(x, y, count) {
            const sizes = ['--large', '--medium', '--small', '--bolt'];
            for (let i = 0; i < count; i++) {
                const spark = document.createElement('div');
                const size = sizes[Math.floor(Math.random() * sizes.length)];
                spark.className = 'cursor-spark cursor-spark' + size;
                const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.9;
                const dist = 35 + Math.random() * 65;
                spark.style.left = x + 'px';
                spark.style.top = y + 'px';
                spark.style.setProperty('--spark-x', Math.cos(angle) * dist + 'px');
                spark.style.setProperty('--spark-y', Math.sin(angle) * dist + 'px');
                spark.style.setProperty('--spark-rot', (Math.random() * 360) + 'deg');
                document.body.appendChild(spark);
                setTimeout(() => spark.remove(), 600);
            }
        }

        // Spawn a radial-gradient flash on click
        function spawnFlash(x, y) {
            const flash = document.createElement('div');
            flash.className = 'cursor-flash';
            flash.style.left = x + 'px';
            flash.style.top = y + 'px';
            flash.style.width = '120px';
            flash.style.height = '120px';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 450);
        }

        // Spawn explosive lightning bolts radiating from click point
        function spawnClickLightning(x, y) {
            const boltCount = 5 + Math.floor(Math.random() * 4);
            for (let i = 0; i < boltCount; i++) {
                const angle = (Math.PI * 2 / boltCount) * i + (Math.random() - 0.5) * 0.6;
                const len = 50 + Math.random() * 80;
                ambientBolts.push({
                    x1: x, y1: y,
                    x2: x + Math.cos(angle) * len,
                    y2: y + Math.sin(angle) * len,
                    alpha: 0.9 + Math.random() * 0.1,
                    decay: 0.04 + Math.random() * 0.02,
                    width: 1.5 + Math.random() * 1.5,
                    depth: 3,
                    hue: Math.random() > 0.5 ? 'purple' : 'blue'
                });
            }
        }

        // Draw a lightning bolt between two points with branching
        function drawLightningBolt(ctx, x1, y1, x2, y2, alpha, width, depth, hue) {
            if (depth <= 0 || alpha < 0.008) return;
            const dx = x2 - x1, dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 2) return;

            const segments = Math.max(3, Math.floor(len / 6));
            const points = [{ x: x1, y: y1 }];

            for (let i = 1; i < segments; i++) {
                const t = i / segments;
                const jitter = (Math.random() - 0.5) * len * 0.18 * (depth / 3);
                points.push({
                    x: x1 + dx * t + (-dy / len) * jitter,
                    y: y1 + dy * t + (dx / len) * jitter
                });
            }
            points.push({ x: x2, y: y2 });

            const isP = hue === 'purple';
            const r1 = isP ? 192 : 129, g1 = isP ? 132 : 140, b1 = isP ? 252 : 248;
            const r2 = isP ? 165 : 34, g2 = isP ? 180 : 211, b2 = isP ? 252 : 238;

            // Outer glow layer
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = `rgba(${r1}, ${g1}, ${b1}, ${alpha * 0.25})`;
            ctx.lineWidth = width + 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = `rgba(${r1}, ${g1}, ${b1}, ${alpha * 0.4})`;
            ctx.shadowBlur = 20;
            ctx.stroke();

            // Mid glow layer
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = `rgba(${r2}, ${g2}, ${b2}, ${alpha * 0.45})`;
            ctx.lineWidth = width + 3;
            ctx.shadowColor = `rgba(${r2}, ${g2}, ${b2}, ${alpha * 0.5})`;
            ctx.shadowBlur = 12;
            ctx.stroke();

            // Core bolt (bright white-ish core)
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = `rgba(200, 210, 255, ${alpha * 0.9})`;
            ctx.lineWidth = width;
            ctx.shadowColor = `rgba(200, 210, 255, ${alpha * 0.7})`;
            ctx.shadowBlur = 6;
            ctx.stroke();

            // Reset shadow
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';

            // Branch bolts (recursion)
            if (depth > 1) {
                const branchChance = depth > 2 ? 0.5 : 0.3;
                for (let b = 0; b < 2; b++) {
                    if (Math.random() < branchChance) {
                        const bi = Math.floor(Math.random() * (points.length - 2)) + 1;
                        const bAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.8;
                        const bLen = len * (0.2 + Math.random() * 0.25);
                        drawLightningBolt(ctx,
                            points[bi].x, points[bi].y,
                            points[bi].x + Math.cos(bAngle) * bLen,
                            points[bi].y + Math.sin(bAngle) * bLen,
                            alpha * 0.5, width * 0.5, depth - 1,
                            Math.random() > 0.5 ? 'purple' : 'blue'
                        );
                    }
                }
            }
        }

        // Main animation loop — runs at display refresh rate
        (function cursorLoop() {
            // --- Spring physics for dot (super smooth) ---
            const ddx = mx - dotX, ddy = my - dotY;
            dotVx += ddx * DOT_STIFFNESS;
            dotVy += ddy * DOT_STIFFNESS;
            dotVx *= DOT_DAMPING;
            dotVy *= DOT_DAMPING;
            dotX += dotVx;
            dotY += dotVy;

            // --- Spring physics for follower (silky lag) ---
            const fdx = mx - folX, fdy = my - folY;
            folVx += fdx * FOL_STIFFNESS;
            folVy += fdy * FOL_STIFFNESS;
            folVx *= FOL_DAMPING;
            folVy *= FOL_DAMPING;
            folX += folVx;
            folY += folVy;

            // Apply positions directly (no CSS transition, pure spring)
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            cursorOutline.style.left = folX + 'px';
            cursorOutline.style.top = folY + 'px';

            // --- Trail history ---
            const now = performance.now();
            if (now - lastTrailTime > 12) {
                trail.push({ x: dotX, y: dotY, t: now });
                if (trail.length > TRAIL_LENGTH) trail.shift();
                lastTrailTime = now;
            }

            // --- Speed calculation ---
            const speed = Math.sqrt(dotVx * dotVx + dotVy * dotVy);

            // --- Lightning alpha fade (smooth ramp) ---
            const targetAlpha = isMoving ? Math.min(speed / 8, 0.8) : 0;
            lightningAlpha += (targetAlpha - lightningAlpha) * 0.08;

            // --- Spawn ambient arc bolts while moving ---
            if (isMoving && speed > 3 && now - lastAmbientBolt > (120 - Math.min(speed * 5, 80))) {
                const angle = Math.atan2(dotVy, dotVx) + (Math.random() - 0.5) * 2.5;
                const len = 20 + Math.random() * 40 + speed * 2;
                ambientBolts.push({
                    x1: dotX, y1: dotY,
                    x2: dotX + Math.cos(angle) * len,
                    y2: dotY + Math.sin(angle) * len,
                    alpha: 0.3 + Math.min(speed / 15, 0.5),
                    decay: 0.025 + Math.random() * 0.015,
                    width: 0.8 + Math.random() * 0.8,
                    depth: 2,
                    hue: Math.random() > 0.4 ? 'blue' : 'purple'
                });
                lastAmbientBolt = now;
            }

            // --- Spawn trail particles while moving ---
            if (isMoving && speed > 1.5 && now - lastParticleTime > 25) {
                const colors = [
                    'rgba(129,140,248,', 'rgba(192,132,252,',
                    'rgba(34,211,238,', 'rgba(200,210,255,'
                ];
                trailParticles.push({
                    x: dotX + (Math.random() - 0.5) * 6,
                    y: dotY + (Math.random() - 0.5) * 6,
                    r: 1 + Math.random() * 2.5,
                    alpha: 0.5 + Math.random() * 0.4,
                    decay: 0.012 + Math.random() * 0.008,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                });
                lastParticleTime = now;
            }

            // --- Draw lightning canvas ---
            lCtx.clearRect(0, 0, lightningCanvas.width / dpr, lightningCanvas.height / dpr);
            lCtx.shadowBlur = 0;
            lCtx.shadowColor = 'transparent';

            // Draw trail lightning segments
            if (trail.length > 2 && lightningAlpha > 0.008) {
                for (let i = 1; i < trail.length; i++) {
                    const age = (now - trail[i].t) / 350;
                    const segAlpha = lightningAlpha * Math.max(0, 1 - age) * (i / trail.length);
                    if (segAlpha < 0.008) continue;

                    drawLightningBolt(
                        lCtx,
                        trail[i - 1].x, trail[i - 1].y,
                        trail[i].x, trail[i].y,
                        segAlpha,
                        0.8 + speed * 0.04,
                        2,
                        i % 2 === 0 ? 'blue' : 'purple'
                    );
                }
            }

            // Draw ambient arc bolts
            for (let i = ambientBolts.length - 1; i >= 0; i--) {
                const b = ambientBolts[i];
                if (b.alpha <= 0.008) { ambientBolts.splice(i, 1); continue; }
                drawLightningBolt(lCtx, b.x1, b.y1, b.x2, b.y2, b.alpha, b.width, b.depth, b.hue);
                b.alpha -= b.decay;
            }

            // Draw trail particles (glowing fading orbs)
            for (let i = trailParticles.length - 1; i >= 0; i--) {
                const p = trailParticles[i];
                if (p.alpha <= 0.008) { trailParticles.splice(i, 1); continue; }

                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;

                // Glow
                const grad = lCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                grad.addColorStop(0, p.color + (p.alpha * 0.6) + ')');
                grad.addColorStop(0.5, p.color + (p.alpha * 0.15) + ')');
                grad.addColorStop(1, 'transparent');
                lCtx.fillStyle = grad;
                lCtx.beginPath();
                lCtx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                lCtx.fill();

                // Core
                lCtx.fillStyle = p.color + p.alpha + ')';
                lCtx.beginPath();
                lCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                lCtx.fill();
            }

            // Ambient electric glow around cursor (always present, intensifies with speed)
            const glowAlpha = Math.max(lightningAlpha * 0.25, 0.03);
            const glowR = 25 + speed * 2.5;
            const grad = lCtx.createRadialGradient(dotX, dotY, 0, dotX, dotY, glowR);
            grad.addColorStop(0, `rgba(200, 210, 255, ${glowAlpha * 0.5})`);
            grad.addColorStop(0.3, `rgba(129, 140, 248, ${glowAlpha * 0.3})`);
            grad.addColorStop(0.6, `rgba(192, 132, 252, ${glowAlpha * 0.1})`);
            grad.addColorStop(1, 'transparent');
            lCtx.fillStyle = grad;
            lCtx.beginPath();
            lCtx.arc(dotX, dotY, glowR, 0, Math.PI * 2);
            lCtx.fill();

            // Secondary glow ring between dot and follower
            const midX = (dotX + folX) / 2, midY = (dotY + folY) / 2;
            const folDist = Math.sqrt((folX - dotX) ** 2 + (folY - dotY) ** 2);
            if (folDist > 5 && lightningAlpha > 0.02) {
                const ringGrad = lCtx.createRadialGradient(midX, midY, 0, midX, midY, folDist * 0.6);
                ringGrad.addColorStop(0, `rgba(129, 140, 248, ${lightningAlpha * 0.06})`);
                ringGrad.addColorStop(1, 'transparent');
                lCtx.fillStyle = ringGrad;
                lCtx.beginPath();
                lCtx.arc(midX, midY, folDist * 0.6, 0, Math.PI * 2);
                lCtx.fill();
            }

            requestAnimationFrame(cursorLoop);
        })();

        // Hover states for interactive elements
        document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, .ach-card, .value-card, .cert-card, .cert-card-enhanced, .contact-row').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });

        // Hide default cursor on the whole page
        document.documentElement.style.cursor = 'none';
        document.querySelectorAll('a, button, [role="button"], input, textarea, select, .btn').forEach(el => {
            el.style.cursor = 'none';
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

    // ==================== MILESTONE COUNTERS ====================
    function initMilestoneCounters() {
        const stats = document.querySelectorAll('.milestone-stat[data-count]');
        if (!stats.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting || e.target.dataset.counted) return;
                e.target.dataset.counted = 'true';
                const target = parseInt(e.target.dataset.count);
                if (isNaN(target)) return;
                const start = performance.now();
                const duration = 1800;
                function tick(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    e.target.textContent = Math.floor(eased * target);
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                obs.unobserve(e.target);
            });
        }, { threshold: 0.5 });
        stats.forEach(s => obs.observe(s));
    }

    // ==================== MILESTONE PROGRESS RINGS ====================
    function initMilestoneRings() {
        const rings = document.querySelectorAll('.milestone-progress[data-progress]');
        if (!rings.length) return;
        const CIRC = 2 * Math.PI * 26; // r=26 => ~163.36
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting || e.target.dataset.animated) return;
                e.target.dataset.animated = 'true';
                const progress = parseFloat(e.target.dataset.progress) / 100;
                const offset = CIRC * (1 - progress);
                setTimeout(() => {
                    e.target.style.strokeDashoffset = offset;
                }, 200);
                obs.unobserve(e.target);
            });
        }, { threshold: 0.3 });
        rings.forEach(r => obs.observe(r));
    }

    // ==================== SOFT SKILLS BAR OBSERVER ====================
    function initSoftSkillsBar() {
        const bar = document.querySelector('.soft-skills-bar');
        if (!bar) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                bar.classList.add('in-view');
                obs.unobserve(bar);
            }
        }, { threshold: 0.2 });
        obs.observe(bar);
    }

    // ==================== SECTION PARTICLE CANVASES ====================
    function initSectionParticles() {
        const canvases = document.querySelectorAll('.section-particles-canvas');
        if (!canvases.length || window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            let w, h, particles = [], visible = false, raf = null;
            const COUNT = 30;

            function resize() {
                const parent = canvas.parentElement;
                if (!parent) return;
                w = canvas.width = parent.offsetWidth;
                h = canvas.height = parent.offsetHeight;
            }

            class Particle {
                constructor() { this.reset(); }
                reset() {
                    this.x = Math.random() * (w || 800);
                    this.y = Math.random() * (h || 600);
                    this.vx = (Math.random() - 0.5) * 0.2;
                    this.vy = (Math.random() - 0.5) * 0.2;
                    this.r = Math.random() * 1.2 + 0.3;
                    this.alpha = Math.random() * 0.15 + 0.03;
                    const colors = ['129,140,248', '192,132,252', '34,211,238', '52,211,153'];
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > w) this.vx *= -1;
                    if (this.y < 0 || this.y > h) this.vy *= -1;
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
                    ctx.fill();
                }
            }

            function init() {
                resize();
                particles = [];
                for (let i = 0; i < COUNT; i++) particles.push(new Particle());
            }

            function animate() {
                if (!visible) { raf = null; return; }
                ctx.clearRect(0, 0, w, h);
                particles.forEach(p => { p.update(); p.draw(); });
                // Draw subtle connecting lines
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(129,140,248,${0.025 * (1 - dist / 120)})`;
                            ctx.lineWidth = 0.4;
                            ctx.stroke();
                        }
                    }
                }
                raf = requestAnimationFrame(animate);
            }

            const obs = new IntersectionObserver(([e]) => {
                visible = e.isIntersecting;
                if (visible && !raf) animate();
            }, { threshold: 0 });

            init();
            obs.observe(canvas);
            window.addEventListener('resize', resize);
        });
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
        initMilestoneCounters();
        initMilestoneRings();
        initSoftSkillsBar();
        initSectionParticles();
        initTilt();
        initCardGlow();
        initContactForm();
        initSmoothScroll();
        initGSAP();
    }

})();