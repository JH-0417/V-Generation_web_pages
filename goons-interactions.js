/* ============================================
   GOONS-STYLE INTERACTIONS JS
   goonsdesign.com 스타일 인터랙티브 효과
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    // Detect mouse support (pointer: fine matches mouse and trackpads)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (hasFinePointer) {
        const dot = document.querySelector('.cursor-dot');
        const circle = document.querySelector('.cursor-circle');

        if (dot && circle) {
            // Enable cursor hiding style since custom cursor is successfully initialized
            document.body.classList.add('has-custom-cursor');

            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let dotX = mouseX, dotY = mouseY;
            let circleX = mouseX, circleY = mouseY;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            // Hover detection
            const hoverTargets = 'a, button, input, textarea, select, [role="button"], .magnetic-btn, .tilt-card, .img-reveal';

            document.addEventListener('mouseover', (e) => {
                if (e.target.closest(hoverTargets)) {
                    dot.classList.add('hover');
                    circle.classList.add('hover');
                }
            });

            document.addEventListener('mouseout', (e) => {
                if (e.target.closest(hoverTargets)) {
                    dot.classList.remove('hover');
                    circle.classList.remove('hover');
                }
            });

            // Click effect
            document.addEventListener('mousedown', () => {
                dot.classList.add('clicking');
                circle.classList.add('clicking');
            });

            document.addEventListener('mouseup', () => {
                dot.classList.remove('clicking');
                circle.classList.remove('clicking');
            });

            // Animation loop with lerp
            function lerp(start, end, factor) {
                return start + (end - start) * factor;
            }

            function animateCursor() {
                dotX = lerp(dotX, mouseX, 0.35);
                dotY = lerp(dotY, mouseY, 0.35);
                circleX = lerp(circleX, mouseX, 0.12);
                circleY = lerp(circleY, mouseY, 0.12);

                dot.style.left = dotX + 'px';
                dot.style.top = dotY + 'px';
                circle.style.left = circleX + 'px';
                circle.style.top = circleY + 'px';

                requestAnimationFrame(animateCursor);
            }

            animateCursor();

            // Hide cursor when leaving window
            document.addEventListener('mouseleave', () => {
                dot.style.opacity = '0';
                circle.style.opacity = '0';
            });

            document.addEventListener('mouseenter', () => {
                dot.style.opacity = '1';
                circle.style.opacity = '1';
            });
        }
    }

    // ============================================
    // SCROLL REVEAL (IntersectionObserver)
    // ============================================
    const revealSelectors = '.section-reveal, .reveal-fade, .reveal-scale, .reveal-clip, .reveal-line, .reveal-text, .reveal-chars, .stagger-children';

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // Check if it's a content element that should wait for a title/header
                const isContent = el.matches('.reveal-fade, .reveal-scale, .reveal-clip, .reveal-line, .stagger-children');
                if (isContent) {
                    const section = el.closest('section, .section-container, body');
                    const title = section ? section.querySelector('.reveal-text, .reveal-chars, .section-reveal') : null;

                    if (title && title !== el && !title.classList.contains('revealed')) {
                        // Trigger title animation first
                        title.classList.add('revealed');
                        revealObserver.unobserve(title);

                        // Reveal content after a premium slow delay
                        setTimeout(() => {
                            el.classList.add('revealed');
                        }, 500);

                        revealObserver.unobserve(el);
                        return;
                    } else if (title && title !== el && title.classList.contains('revealed')) {
                        // Title already revealed, delay slightly for sequential timing
                        setTimeout(() => {
                            el.classList.add('revealed');
                        }, 300);

                        revealObserver.unobserve(el);
                        return;
                    }
                }

                // Default reveal for titles or isolated content elements
                el.classList.add('revealed');
                revealObserver.unobserve(el);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    });

    document.querySelectorAll(revealSelectors).forEach((el) => {
        revealObserver.observe(el);
    });

    // ============================================
    // TEXT REVEAL - Split words
    // ============================================
    document.querySelectorAll('.reveal-text').forEach((el) => {
        const text = el.textContent.trim();
        el.innerHTML = '';

        const words = text.split(/\s+/);
        words.forEach((word, i) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';

            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.textContent = word;
            inner.style.transitionDelay = (i * 0.075) + 's';

            wordSpan.appendChild(inner);
            el.appendChild(wordSpan);
        });
        el.classList.add('is-split');
    });

    // ============================================
    // CHARACTER REVEAL - Split characters
    // ============================================
    document.querySelectorAll('.reveal-chars').forEach((el) => {
        const text = el.textContent.trim();
        el.innerHTML = '';

        [...text].forEach((char, i) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char === ' ' ? '\u00A0' : char;
            charSpan.style.transitionDelay = (i * 0.038) + 's';
            el.appendChild(charSpan);
        });
        el.classList.add('is-split');
    });

    // ============================================
    // STAGGER CHILDREN DELAY
    // ============================================
    document.querySelectorAll('.stagger-children').forEach((container) => {
        const children = container.children;
        Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = (i * 0.15) + 's';
        });
    });

    // ============================================
    // PARALLAX ON SCROLL
    // ============================================
    const parallaxElements = document.querySelectorAll('.parallax-img');

    function updateParallax() {
        const scrollY = window.scrollY;

        parallaxElements.forEach((el) => {
            const speed = parseFloat(el.dataset.speed) || 0.15;
            const rect = el.parentElement.getBoundingClientRect();
            const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
            el.style.transform = `translateY(${-offset}px) scale(1.15)`;
        });
    }

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    }

    // ============================================
    // MAGNETIC BUTTON
    // ============================================
    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
        const strength = parseFloat(btn.dataset.strength) || 0.3;
        const textStrength = parseFloat(btn.dataset.textStrength) || 0.5;
        const btnText = btn.querySelector('.btn-text');

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;

            btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
            if (btnText) {
                btnText.style.transform = `translate(${dx * textStrength}px, ${dy * textStrength}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            if (btnText) {
                btnText.style.transform = 'translate(0, 0)';
            }
        });
    });

    // ============================================
    // 3D TILT CARD
    // ============================================
    document.querySelectorAll('.tilt-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (0.5 - y) * 10;
            const tiltY = (x - 0.5) * 10;

            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ============================================
    // GLOW CARD (mouse position tracking)
    // ============================================
    document.querySelectorAll('.glow-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const duration = parseInt(el.dataset.duration, 10) || 2000;
                const suffix = el.dataset.suffix || '';
                const prefix = el.dataset.prefix || '';
                let startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
                    const current = Math.floor(eased * target);
                    el.textContent = prefix + current.toLocaleString() + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = prefix + target.toLocaleString() + suffix;
                    }
                }

                requestAnimationFrame(step);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-value').forEach((el) => {
        counterObserver.observe(el);
    });

    // ============================================
    // SMART HEADER (hide on scroll down, show on scroll up)
    // ============================================
    const header = document.querySelector('header');
    if (header) {
        let lastScrollY = 0;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            if (scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }

            if (scrollY > lastScrollY && scrollY > 200) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // PAGE TRANSITION ON NAV LINKS
    // ============================================
    const pageTransition = document.querySelector('.page-transition');
    if (pageTransition) {
        document.querySelectorAll('a[href]').forEach((link) => {
            const href = link.getAttribute('href');
            // Only for local HTML links
            if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Set transition text
                    const transitionText = pageTransition.querySelector('.transition-text');
                    if (transitionText) {
                        let pageName = link.textContent.trim();
                        if (!pageName || pageName === '') {
                            pageName = href.replace('.html', '').replace(/^\w/, c => c.toUpperCase());
                        }
                        transitionText.textContent = pageName;
                    }

                    pageTransition.classList.add('active');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 900);
                });
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL TO ANCHOR
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // IMAGE LAZY REVEAL (clip animation)
    // ============================================
    const imgRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                imgRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.img-reveal').forEach((el) => {
        imgRevealObserver.observe(el);
    });

})();
