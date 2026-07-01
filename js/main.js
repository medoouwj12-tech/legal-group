document.addEventListener("DOMContentLoaded", () => {
    // 1. DUAL LANGUAGE TRANSLATION SYSTEM
    let currentLang = "en";
    try {
        currentLang = localStorage.getItem("lpg_lang") || "en";
    } catch (e) {
        console.warn("localStorage is blocked:", e);
    }
    
    // Check URL parameters for language override
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    if (langParam && (langParam === "en" || langParam === "ar")) {
        currentLang = langParam;
    }
    
    // Initialize localization
    applyLanguage(currentLang);
    
    // Lang switch button listener
    const langSwitcher = document.getElementById("lang-switcher");
    if (langSwitcher) {
        langSwitcher.addEventListener("click", () => {
            const nextLang = currentLang === "en" ? "ar" : "en";
            applyLanguage(nextLang);
            
            // Reload counters if we are on index.html and switched language
            const counters = document.querySelectorAll(".counter-number");
            if (counters.length > 0) {
                initCounters();
            }
        });
    }
    
    function applyLanguage(lang) {
        currentLang = lang;
        try {
            localStorage.setItem("lpg_lang", lang);
        } catch (e) {
            console.warn("localStorage is blocked:", e);
        }
        
        // Update document dir and language attribute
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", lang);
        
        // Switch body CSS font adjustment triggers
        const switcherBtn = document.getElementById("lang-switcher");
        if (lang === "ar") {
            document.body.classList.add("rtl");
            document.body.classList.remove("ltr");
            if (switcherBtn) switcherBtn.textContent = "English";
        } else {
            document.body.classList.add("ltr");
            document.body.classList.remove("rtl");
            if (switcherBtn) switcherBtn.textContent = "العربية";
        }
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                    element.setAttribute("placeholder", translations[lang][key]);
                } else if (element.tagName === "OPTION") {
                    element.textContent = translations[lang][key];
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
        
        // Update links to keep language selection in query parameters (optional, for safety)
        updateNavigationLinks(lang);
    }
    
    function updateNavigationLinks(lang) {
        document.querySelectorAll("a").forEach(link => {
            const href = link.getAttribute("href");
            // If it is a relative link to another page, preserve the lang param
            if (href && href.endsWith(".html")) {
                const cleanHref = href.split("?")[0];
                link.setAttribute("href", `${cleanHref}?lang=${lang}`);
            }
        });
    }

    // 2. STICKY NAVBAR & ACTIVE PAGE STATES
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
    
    // Set active class on nav link matching current page
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.startsWith(currentPage.split("?")[0])) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // 3. MOBILE BURGER DRAWER MENU
    const burgerMenu = document.getElementById("burger-menu");
    const mainNav = document.getElementById("main-nav");
    
    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener("click", () => {
            burgerMenu.classList.toggle("open");
            mainNav.classList.toggle("open");
            // Prevent scrolling behind menu when open
            document.body.style.overflow = mainNav.classList.contains("open") ? "hidden" : "";
        });
        
        // Close menu when clicking nav link
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                burgerMenu.classList.remove("open");
                mainNav.classList.remove("open");
                document.body.style.overflow = "";
            });
        });
    }

    // 4. ANIMATED COUNTERS (Hero Section)
    function initCounters() {
        const counters = document.querySelectorAll(".counter-number");
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-target"), 10);
            const suffix = counter.getAttribute("data-suffix") || "";
            const duration = 2000; // 2 seconds
            let startTimestamp = null;
            
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeProgress * target);
                
                // Format display text (different order for RTL vs LTR depending on text)
                if (currentLang === "ar") {
                    counter.textContent = `${currentVal}${suffix}`;
                } else {
                    counter.textContent = `${currentVal}${suffix}`;
                }
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.textContent = `${target}${suffix}`;
                }
            };
            
            window.requestAnimationFrame(step);
        });
    }
    
    // Trigger counters when hero section is visible, or run immediately if no observer
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        initCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(heroSection);
        } else {
            initCounters();
        }
    }

    // 5. ENTRANCE SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
        if ("IntersectionObserver" in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-active");
                        // Optional: unobserve after reveal
                        // revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
            
            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            // Fallback for older browsers
            revealElements.forEach(el => el.classList.add("reveal-active"));
        }
    }

    // 6. FORM VALIDATION
    // Contact Consultation Form
    const consultationForm = document.getElementById("consultation-form");
    const formMessage = document.getElementById("form-message");
    
    if (consultationForm) {
        consultationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("client-name").value.trim();
            const company = document.getElementById("client-company").value.trim();
            const email = document.getElementById("client-email").value.trim();
            const phone = document.getElementById("client-phone").value.trim();
            const service = document.getElementById("client-service").value;
            const message = document.getElementById("client-message").value.trim();
            
            // Simple validation
            if (!name || !email || !phone || !service || !message) {
                showFormFeedback(translations[currentLang].contact_error, "error");
                return;
            }
            
            // Regex validation for corporate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormFeedback(translations[currentLang].contact_error, "error");
                return;
            }
            
            // Mock submit transition
            const submitBtn = consultationForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = currentLang === "ar" ? "جاري الإرسال بأمان..." : "Securing Connection...";
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                showFormFeedback(translations[currentLang].contact_success, "success");
                consultationForm.reset();
            }, 1500);
        });
    }
    
    function showFormFeedback(msg, type) {
        if (formMessage) {
            formMessage.textContent = msg;
            formMessage.className = `form-message ${type}`;
            
            // Scroll to the message smoothly
            formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
            
            // Hide after 5 seconds if success
            if (type === "success") {
                setTimeout(() => {
                    formMessage.style.display = "none";
                }, 5000);
            }
        }
    }
    
    // Footer Newsletter Form
    const footerNewsletter = document.getElementById("footer-newsletter");
    if (footerNewsletter) {
        footerNewsletter.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = footerNewsletter.querySelector(".newsletter-input");
            const email = emailInput.value.trim();
            
            if (email) {
                const btn = footerNewsletter.querySelector("button");
                const originalBtnText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = "...";
                
                setTimeout(() => {
                    alert(currentLang === "ar" ? "تم الاشتراك بنجاح في النشرة السرية." : "Subscribed successfully to the confidential newsletter.");
                    emailInput.value = "";
                    btn.disabled = false;
                    btn.innerHTML = originalBtnText;
                }, 1000);
            }
        });
    }
});
