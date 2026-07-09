/* =====================================================================
   PREMIUM ENHANCEMENTS — VANILLA JS
   Author: Mohamed — Portfolio feature layer
   Loaded AFTER main.js so it composes atop existing behavior
   ===================================================================== */

(function () {
    "use strict";

    /* ------------------------------------------------------------
       0. Skip everything if user prefers reduced motion
       ------------------------------------------------------------ */
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ------------------------------------------------------------
       1. CUSTOM CURSOR
       Two elements: a ring + a dot. Both lerp toward mouse position.
       ------------------------------------------------------------ */
    if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
        const ring = document.createElement("div");
        ring.className = "lpg-cursor";
        document.body.appendChild(ring);

        const dot = document.createElement("div");
        dot.className = "lpg-cursor-dot";
        document.body.appendChild(dot);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let dotX = mouseX;
        let dotY = mouseY;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Ring lags slightly behind dot for a polished feel
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            dotX += (mouseX - dotX) * 0.6;
            dotY += (mouseY - dotY) * 0.6;

            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover target detection — anything clickable or marked .lpg-cursor-hover
        const hoverTargets = document.querySelectorAll(
            "a, button, .lpg-cursor-hover, input[type='submit'], .service-card, .team-card, .why-card"
        );

        hoverTargets.forEach((el) => {
            el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
            el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
        });

        // Hide cursor when leaving window
        document.addEventListener("mouseleave", () => {
            ring.style.opacity = "0";
            dot.style.opacity = "0";
        });
        document.addEventListener("mouseenter", () => {
            ring.style.opacity = "1";
            dot.style.opacity = "1";
        });
    }

    /* ------------------------------------------------------------
       2. SCROLL PROGRESS BAR
       Visible at the very top of the page, fills with gold.
       ------------------------------------------------------------ */
    const scrollBar = document.createElement("div");
    scrollBar.className = "lpg-scroll-progress";
    document.body.appendChild(scrollBar);

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollBar.style.width = `${pct}%`;
    }
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    /* ------------------------------------------------------------
       3. EXTENDED SCROLL REVEAL
       Supports the new variants: .reveal-left, .reveal-right,
       .reveal-scale, .lpg-split-text
       ------------------------------------------------------------ */
    const allReveals = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale, .lpg-split-text"
    );

    if (allReveals.length > 0 && "IntersectionObserver" in window) {
        const revealObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-active");
                        revealObs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
        );
        allReveals.forEach((el) => revealObs.observe(el));
    } else {
        allReveals.forEach((el) => el.classList.add("reveal-active"));
    }

    /* ------------------------------------------------------------
       4. STAGGER CHILDREN INSIDE A REVEALED PARENT
       Any element with .lpg-stagger-children gets its direct
       children auto-staggered with .lpg-stagger-N classes.
       ------------------------------------------------------------ */
    document.querySelectorAll(".lpg-stagger-children").forEach((parent) => {
        Array.from(parent.children).forEach((child, i) => {
            const stage = Math.min(i + 1, 8);
            child.classList.add(`lpg-stagger-${stage}`);
            if (!child.classList.contains("reveal") &&
                !child.classList.contains("reveal-left") &&
                !child.classList.contains("reveal-right") &&
                !child.classList.contains("reveal-scale")) {
                child.classList.add("reveal");
            }
        });
    });

    /* ------------------------------------------------------------
       5. TEXT SPLIT (split words into animated spans)
       Wraps each word in .lpg-split-text > span
       ------------------------------------------------------------ */
    document.querySelectorAll(".lpg-split").forEach((el) => {
        // Skip if already split (re-init safe)
        if (el.dataset.lpgSplit === "true") return;
        el.dataset.lpgSplit = "true";

        const text = el.textContent.trim();
        el.textContent = "";

        const wrapper = document.createElement("span");
        wrapper.className = "lpg-split-text reveal";

        const words = text.split(/\s+/);
        words.forEach((word, i) => {
            const span = document.createElement("span");
            span.textContent = word + (i < words.length - 1 ? " " : "");
            span.style.transitionDelay = `${i * 0.04}s`;
            wrapper.appendChild(span);
        });

        el.appendChild(wrapper);

        // Register the new wrapper with the observer chain
        if ("IntersectionObserver" in window) {
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            wrapper.classList.add("reveal-active");
                            obs.unobserve(wrapper);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            obs.observe(wrapper);
        } else {
            wrapper.classList.add("reveal-active");
        }
    });

    /* ------------------------------------------------------------
       6. CARD TILT (3D hover)
       Add class .lpg-tilt to a parent; its first child becomes the
       tilt surface.
       ------------------------------------------------------------ */
    if (!prefersReducedMotion) {
        document.querySelectorAll(".lpg-tilt").forEach((card) => {
            const inner = card.querySelector(".lpg-tilt-inner") || card;

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 7;   // -3.5deg to 3.5deg
                const rotateX = (0.5 - y) * 7;
                inner.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
            });

            card.addEventListener("mouseleave", () => {
                inner.style.transform =
                    "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
            });
        });
    }

    /* ------------------------------------------------------------
       7. MAGNETIC BUTTONS
       Add class .lpg-magnetic to a button; it gently pulls toward
       the cursor (~25% of distance).
       ------------------------------------------------------------ */
    if (!prefersReducedMotion) {
        document.querySelectorAll(".lpg-magnetic").forEach((btn) => {
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "translate(0, 0)";
            });
        });
    }

    /* ------------------------------------------------------------
       8. PARALLAX (data-parallax="0.3")
       Moves element at N% of scroll speed.
       ------------------------------------------------------------ */
    if (!prefersReducedMotion) {
        const parallaxEls = document.querySelectorAll("[data-parallax]");
        if (parallaxEls.length > 0) {
            function updateParallax() {
                const scrollY = window.scrollY;
                parallaxEls.forEach((el) => {
                    const speed = parseFloat(el.dataset.parallax) || 0.3;
                    const rect = el.getBoundingClientRect();
                    const offsetTop = rect.top + scrollY;
                    const distance = (scrollY - offsetTop) * speed;
                    el.style.transform = `translate3d(0, ${distance}px, 0)`;
                });
            }
            window.addEventListener("scroll", updateParallax, { passive: true });
            window.addEventListener("resize", updateParallax);
            updateParallax();
        }
    }

    /* ------------------------------------------------------------
       9. ENHANCED COUNTER (re-uses main.js data-target)
       Pulses at the end of each counter increment.
       ------------------------------------------------------------ */
    document.querySelectorAll(".counter-number").forEach((el) => {
        el.classList.add("lpg-counter");
    });

    // Listen for text changes on counters (main.js animates them);
    // fire a pulse when the displayed value changes.
    if (!prefersReducedMotion) {
        const counters = document.querySelectorAll(".lpg-counter");
        counters.forEach((el) => {
            const obs = new MutationObserver(() => {
                el.classList.add("lpg-counter-pulse");
                clearTimeout(el._pulseTimer);
                el._pulseTimer = setTimeout(() => {
                    el.classList.remove("lpg-counter-pulse");
                }, 120);
            });
            obs.observe(el, { childList: true, characterData: true, subtree: true });
        });
    }

    /* ------------------------------------------------------------
       10. SMOOTH SCROLL FOR ANCHOR LINKS
       ------------------------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            if (id && id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });

    /* ------------------------------------------------------------
       11. HERO AMBIENT GLOW (breathing radial)
       Inject one .lpg-ambient behind the hero text if a marker exists.
       ------------------------------------------------------------ */
    const heroMarker = document.querySelector(".hero");
    if (heroMarker && !prefersReducedMotion) {
        const glow = document.createElement("div");
        glow.className = "lpg-ambient";
        glow.style.right = "-120px";
        glow.style.top = "20%";
        heroMarker.appendChild(glow);
    }

    /* ------------------------------------------------------------
       12. RTL SAFETY
       When main.js swaps to AR, the lpg-marquee direction already
       flips via CSS. We also clear inline transforms that may have
       been applied by parallax during the previous orientation.
       ------------------------------------------------------------ */
    const langSwitcher = document.getElementById("lang-switcher");
    if (langSwitcher) {
        langSwitcher.addEventListener("click", () => {
            // Wait a tick for main.js to update dir
            setTimeout(() => {
                document.querySelectorAll(".lpg-tilt-inner, .lpg-magnetic").forEach((el) => {
                    el.style.transform = "";
                });
            }, 50);
        });
    }

    /* ------------------------------------------------------------
       13. CONSOLE BRANDING (subtle, deletable)
       ------------------------------------------------------------ */
    if (window.console && console.log) {
        console.log(
            "%cLegal Protection Group%c · premium animations enabled",
            "color:#D4AF37;font-weight:bold;font-size:13px",
            "color:#999;font-size:11px"
        );
    }

})();
