/* =================================================================
   Cowboy Quick Shot — Cinematic Landing Microinteractions
   Vanilla, no dependencies. Respects prefers-reduced-motion.
   ================================================================= */

(function () {
    'use strict';

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = matchMedia('(hover: none)').matches;
    const isDesktop = !isCoarse && matchMedia('(min-width: 901px)').matches;

    document.documentElement.classList.toggle('reduce-motion', reduceMotion);

    document.addEventListener('DOMContentLoaded', () => {
        initYear();
        initScrollProgress();
        initStickyHeader();
        initDrawer();
        initSmoothScroll();
        initMagnetic();
        initTilt();
        initReveal();
        initCounters();
        initReactionLoop();
        if (isDesktop) initCustomCursor();
        if (!reduceMotion) initSparks();
        initFilmstripDrag();
    });

    // -----------------------------------------------------------
    // Year in footer
    // -----------------------------------------------------------
    function initYear() {
        const y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();
    }

    // -----------------------------------------------------------
    // Scroll progress bar
    // -----------------------------------------------------------
    function initScrollProgress() {
        const bar = document.querySelector('.scroll-progress');
        if (!bar) return;
        const set = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const v = max > 0 ? Math.min(1, window.scrollY / max) : 0;
            bar.style.transform = `scaleX(${v})`;
        };
        addEventListener('scroll', set, { passive: true });
        addEventListener('resize', set);
        set();
    }

    // -----------------------------------------------------------
    // Sticky header scroll shrink
    // -----------------------------------------------------------
    function initStickyHeader() {
        const header = document.getElementById('siteHeader');
        const sentinel = document.querySelector('.header-sentinel');
        if (!header || !sentinel) return;
        const io = new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', !entry.isIntersecting);
        });
        io.observe(sentinel);
    }

    // -----------------------------------------------------------
    // Mobile drawer
    // -----------------------------------------------------------
    function initDrawer() {
        const toggle = document.querySelector('.nav-toggle');
        const drawer = document.getElementById('drawer');
        const scrim = document.querySelector('.drawer-scrim');
        if (!toggle || !drawer || !scrim) return;

        const setOpen = (open) => {
            toggle.setAttribute('aria-expanded', String(open));
            drawer.classList.toggle('is-open', open);
            scrim.classList.toggle('is-visible', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        toggle.addEventListener('click', () => setOpen(!drawer.classList.contains('is-open')));
        scrim.addEventListener('click', () => setOpen(false));
        drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
        addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    }

    // -----------------------------------------------------------
    // Smooth scroll for in-page links (offset for sticky header)
    // -----------------------------------------------------------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                const href = a.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const headerH = document.getElementById('siteHeader')?.offsetHeight || 0;
                const y = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
                window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        });
    }

    // -----------------------------------------------------------
    // Magnetic buttons
    // -----------------------------------------------------------
    function initMagnetic() {
        if (!isDesktop || reduceMotion) return;
        const strength = 0.28;
        document.querySelectorAll('[data-magnetic]').forEach(el => {
            const label = el.querySelector('.btn-label');
            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
                if (label) label.style.transform = `translate(${x * strength * 0.55}px, ${y * strength * 0.55}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                if (label) label.style.transform = '';
            });
        });
    }

    // -----------------------------------------------------------
    // 3D tilt cards
    // -----------------------------------------------------------
    function initTilt() {
        if (!isDesktop || reduceMotion) return;
        document.querySelectorAll('[data-tilt]').forEach(card => {
            const inner = card.querySelector('.tilt-inner');
            if (!inner) return;
            let raf = 0;
            let targetX = 0, targetY = 0, curX = 0, curY = 0;
            const max = 9;

            const onMove = (e) => {
                const r = card.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width - 0.5);
                const y = ((e.clientY - r.top) / r.height - 0.5);
                targetX = x * max;
                targetY = y * -max;
                if (!raf) raf = requestAnimationFrame(tick);
            };
            const onLeave = () => {
                targetX = 0; targetY = 0;
                if (!raf) raf = requestAnimationFrame(tick);
            };
            const tick = () => {
                curX += (targetX - curX) * 0.12;
                curY += (targetY - curY) * 0.12;
                inner.style.transform = `rotateY(${curX}deg) rotateX(${curY}deg)`;
                if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
                    raf = requestAnimationFrame(tick);
                } else {
                    raf = 0;
                    if (targetX === 0 && targetY === 0) inner.style.transform = '';
                }
            };

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
        });
    }

    // -----------------------------------------------------------
    // Reveal on scroll
    // -----------------------------------------------------------
    function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const siblings = el.parentNode ? [...el.parentNode.children].filter(n => n.classList.contains('reveal')) : [];
                const i = siblings.indexOf(el);
                el.style.transitionDelay = `${Math.max(0, Math.min(i, 5)) * 90}ms`;
                el.classList.add('is-visible');
                io.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        items.forEach(i => io.observe(i));
    }

    // -----------------------------------------------------------
    // Animated counters
    // -----------------------------------------------------------
    function initCounters() {
        const els = document.querySelectorAll('.counter');
        if (!els.length) return;

        const animate = (el) => {
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const duration = 1700;
            const start = performance.now();
            const easeOut = (t) => 1 - Math.pow(1 - t, 3);
            const isInt = Number.isInteger(target);
            const tick = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const v = easeOut(t) * target;
                el.textContent = (isInt ? Math.floor(v) : v.toFixed(2)) + suffix;
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = (isInt ? Math.floor(target) : target.toFixed(2)) + suffix;
            };
            requestAnimationFrame(tick);
        };

        if (reduceMotion) {
            els.forEach(el => {
                const t = parseFloat(el.dataset.target);
                el.textContent = (Number.isInteger(t) ? Math.floor(t) : t.toFixed(2)) + (el.dataset.suffix || '');
            });
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animate(e.target);
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        els.forEach(el => io.observe(el));
    }

    // -----------------------------------------------------------
    // READY → AIM → FIRE reaction-time hero loop
    // -----------------------------------------------------------
    function initReactionLoop() {
        const stateEl = document.getElementById('reactionState');
        const timeEl = document.getElementById('reactionTime');
        if (!stateEl || !timeEl) return;

        const digits = timeEl.querySelector('.rt-digits');
        if (!digits) return;

        if (reduceMotion) {
            digits.textContent = '00.187';
            return;
        }

        const sequence = [
            { state: 'READY', cls: '', text: '00.000', hold: 1100 },
            { state: 'AIM',   cls: 'state-aim', text: 'AIM...', hold: 900, isText: true },
            { state: 'FIRE',  cls: 'state-fire', text: null, hold: 1400, isCount: true },
            { state: 'RESULT', cls: '', text: null, hold: 2400, isResult: true }
        ];

        let i = 0;
        const tickCount = (until, finalMs) => {
            const start = performance.now();
            const draw = () => {
                const now = performance.now();
                const t = now - start;
                if (t >= until) {
                    const ms = (finalMs / 1000).toFixed(3);
                    digits.textContent = ms.padStart(5, '0');
                    return;
                }
                const v = (t / 1000).toFixed(3);
                digits.textContent = v.padStart(5, '0');
                requestAnimationFrame(draw);
            };
            draw();
        };

        const step = () => {
            const s = sequence[i];
            stateEl.textContent = s.state;
            stateEl.className = 'reaction-state ' + (s.cls || '');

            if (s.isText) {
                digits.textContent = s.text;
            } else if (s.isCount) {
                const ms = 160 + Math.floor(Math.random() * 90);
                tickCount(s.hold - 80, ms);
                timeEl.dataset.lastMs = ms;
            } else if (s.isResult) {
                stateEl.textContent = (timeEl.dataset.lastMs <= 200) ? 'ELITE' : 'NICE DRAW';
                stateEl.className = 'reaction-state ' + ((timeEl.dataset.lastMs <= 200) ? 'state-fire' : '');
            } else if (s.text) {
                digits.textContent = s.text;
            }
            i = (i + 1) % sequence.length;
            setTimeout(step, s.hold);
        };
        setTimeout(step, 600);
    }

    // -----------------------------------------------------------
    // Custom cursor (desktop only, motion safe)
    // -----------------------------------------------------------
    function initCustomCursor() {
        if (reduceMotion) return;
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        if (!dot || !ring) return;

        let mx = -100, my = -100;
        let rx = -100, ry = -100;

        addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
        });

        const tick = () => {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        document.querySelectorAll('a, button, [data-magnetic], [data-tilt], details summary').forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.classList.add('is-hover');
                ring.classList.add('is-hover');
            });
            el.addEventListener('mouseleave', () => {
                dot.classList.remove('is-hover');
                ring.classList.remove('is-hover');
            });
        });
    }

    // -----------------------------------------------------------
    // Cursor sparks in hero (Canvas)
    // -----------------------------------------------------------
    function initSparks() {
        const canvas = document.querySelector('.sparks');
        if (!canvas) return;
        const hero = canvas.parentElement;
        if (!hero) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(devicePixelRatio || 1, 2);

        const resize = () => {
            canvas.width = hero.offsetWidth * dpr;
            canvas.height = hero.offsetHeight * dpr;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };
        resize();
        addEventListener('resize', resize);

        const sparks = [];
        const colors = ['#c89b4a', '#d4a574', '#f1e8d6', '#f0c674'];
        let lastX = 0, lastY = 0, lastT = 0;

        const spawn = (x, y, count) => {
            for (let i = 0; i < count; i++) {
                sparks.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 1.4,
                    vy: (Math.random() - 0.2) * 0.7,
                    life: 1,
                    r: Math.random() * 1.4 + 0.4,
                    color: colors[(Math.random() * colors.length) | 0]
                });
            }
            // cap to prevent memory growth
            while (sparks.length > 280) sparks.shift();
        };

        hero.addEventListener('mousemove', (e) => {
            const r = hero.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const now = performance.now();
            const dt = now - lastT;
            const dx = x - lastX, dy = y - lastY;
            const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(dt, 1);
            const count = Math.min(4, Math.max(1, Math.round(speed * 8)));
            spawn(x, y, count);
            lastX = x; lastY = y; lastT = now;
        });

        // Ambient drift
        let ambientTimer = 0;
        const ambient = () => {
            ambientTimer++;
            if (ambientTimer % 10 === 0) {
                const x = Math.random() * hero.offsetWidth;
                const y = hero.offsetHeight * (0.7 + Math.random() * 0.3);
                spawn(x, y, 1);
            }
        };

        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ambient();
            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i];
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.03;
                s.life -= 0.012;
                if (s.life <= 0) { sparks.splice(i, 1); continue; }
                ctx.globalAlpha = Math.max(0, s.life);
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    // -----------------------------------------------------------
    // Filmstrip drag-to-scroll
    // -----------------------------------------------------------
    function initFilmstripDrag() {
        const strip = document.querySelector('.filmstrip');
        if (!strip) return;
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        strip.addEventListener('mousedown', (e) => {
            isDown = true;
            strip.style.cursor = 'grabbing';
            startX = e.pageX - strip.offsetLeft;
            scrollLeft = strip.scrollLeft;
        });
        strip.addEventListener('mouseleave', () => { isDown = false; strip.style.cursor = ''; });
        strip.addEventListener('mouseup', () => { isDown = false; strip.style.cursor = ''; });
        strip.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - strip.offsetLeft;
            const walk = (x - startX) * 1.5;
            strip.scrollLeft = scrollLeft - walk;
        });
    }
})();
