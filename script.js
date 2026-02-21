/* ============================================================
   KINGSLEY KIPKOECH — ULTRA PREMIUM SCRIPTS
   ============================================================ */

'use strict';

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

    initParticles();
    initCustomCursor();
    initNavigation();
    initScrollSpy();
    initScrollReveal();
    initStatCounters();
    initTyping();
    initSkillsTabs();
    initScrollTop();
    initMagneticButtons();
});


/* ============================================================
   PARTICLE SYSTEM
   ============================================================ */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], mouse = { x: -9999, y: -9999 };
    const PARTICLE_COUNT = 120;
    const COLORS = ['#6366f1', '#22d3ee', '#a855f7', '#ec4899'];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(true); }

        reset(init = false) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 10;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.life = 0;
            this.maxLife = Math.random() * 300 + 200;
        }

        update() {
            this.life++;
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x += (dx / dist) * force * 1.5;
                this.y += (dy / dist) * force * 1.5;
            }

            // Fade in/out
            const progress = this.life / this.maxLife;
            if (progress < 0.1) this.opacity = progress * 5 * 0.6;
            else if (progress > 0.8) this.opacity = (1 - progress) * 5 * 0.6;

            if (this.life >= this.maxLife || this.y < -10) this.reset();
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    ctx.save();
                    ctx.globalAlpha = (1 - dist / 80) * 0.08;
                    ctx.strokeStyle = '#6366f1';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });
}


/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const trailCanvas = document.getElementById('cursor-trail');
    if (!dot || !ring || !trailCanvas) return;

    // Don't run on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ctx = trailCanvas.getContext('2d');
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    });

    let mouseX = -200, mouseY = -200;
    let ringX = -200, ringY = -200;
    const trail = [];
    const TRAIL_LENGTH = 18;

    // Smooth ring follow
    function animateCursor() {
        // Dot: instant
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';

        // Ring: lagged
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        // Trail
        trail.push({ x: mouseX, y: mouseY, opacity: 1 });
        if (trail.length > TRAIL_LENGTH) trail.shift();

        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        for (let i = 0; i < trail.length; i++) {
            const t = trail[i];
            const progress = i / trail.length;
            const size = progress * 4;
            ctx.save();
            ctx.globalAlpha = progress * 0.3;
            ctx.fillStyle = i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#22d3ee' : '#a855f7';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#6366f1';
            ctx.beginPath();
            ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    // Hover state on interactive elements
    const interactiveSelectors = 'a, button, .skill-card, .tilt-card, .contact-card, .social-icon, input, textarea, .skills-tab';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
}


/* ============================================================
   NAVIGATION
   ============================================================ */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('show');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('show'));
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('show');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', e => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('show');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}


/* ============================================================
   SCROLL SPY
   ============================================================ */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    if (!sections.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(s => obs.observe(s));
}


/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .stagger');
    if (!elements.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    elements.forEach(el => obs.observe(el));
}


/* ============================================================
   STAT COUNTERS
   ============================================================ */
function initStatCounters() {
    const nums = document.querySelectorAll('.stat-num[data-target]');
    if (!nums.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                countUp(el, target, 1600);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    nums.forEach(n => obs.observe(n));
}

function countUp(el, end, duration) {
    const start = performance.now();
    function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(eased * end);
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}


/* ============================================================
   TYPING ANIMATION
   ============================================================ */
function initTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
        'Cybersecurity Enthusiast',
        'DevSecOps Advocate',
        'Software Engineer',
        'Linux Systems Specialist',
        'Network Security Analyst',
        'Security Automation Expert'
    ];

    let pi = 0, ci = 0, deleting = false;
    const SPEED = 75, DEL_SPEED = 38, PAUSE = 2200, PAUSE_START = 400;

    function type() {
        const current = phrases[pi];
        if (deleting) {
            el.textContent = current.substring(0, ci - 1);
            ci--;
        } else {
            el.textContent = current.substring(0, ci + 1);
            ci++;
        }

        let delay = deleting ? DEL_SPEED : SPEED;
        if (!deleting && ci === current.length) { delay = PAUSE; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = PAUSE_START; }

        setTimeout(type, delay);
    }
    type();
}


/* ============================================================
   SKILLS TABS
   ============================================================ */
function initSkillsTabs() {
    const tabs = document.querySelectorAll('.skills-tab');
    const techGrid = document.getElementById('skills-tech');
    const softGrid = document.getElementById('skills-soft');
    if (!tabs.length || !techGrid || !softGrid) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.dataset.tab;
            if (target === 'tech') {
                techGrid.style.display = 'grid';
                softGrid.style.display = 'none';
                // Re-trigger stagger
                techGrid.classList.remove('visible');
                requestAnimationFrame(() => techGrid.classList.add('visible'));
            } else {
                techGrid.style.display = 'none';
                softGrid.style.display = 'grid';
                softGrid.classList.remove('visible');
                requestAnimationFrame(() => softGrid.classList.add('visible'));
            }
        });
    });
}


/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
        const btn = wrap.querySelector('.btn, a, button');
        if (!btn) return;

        wrap.addEventListener('mousemove', e => {
            const rect = wrap.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.35;
            const dy = (e.clientY - cy) * 0.35;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        wrap.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}