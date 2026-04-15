import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/dist/Draggable";
import '@splidejs/splide/dist/css/splide.min.css';
import Splide from "@splidejs/splide";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

// Nav
const hamburger = document.getElementById("hamburger-menu");
if (hamburger) {
    const [line1, line2] = hamburger.children;
    const mainNav = document.getElementById("main-nav");

    hamburger.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = hamburger.classList.toggle("is-open");

        if (isOpen) {
            hamburger.classList.remove("group");
            line1.classList.remove("-translate-y-1", "rotate-90");
            line1.classList.add("rotate-45");
            line2.classList.remove("translate-y-1", "rotate-90");
            line2.classList.add("-rotate-45");
            mainNav.classList.remove("-translate-y-full", "pointer-events-none");
        } else {
            hamburger.classList.add("group");
            line1.classList.remove("rotate-45");
            line2.classList.remove("-rotate-45");
            line2.classList.add("rotate-90");
            mainNav.classList.add("-translate-y-full", "pointer-events-none");
        }
    });
}

// Hero animation
if (document.querySelector("[data-animate-hero]")) {
    gsap.from("[data-animate-hero]", {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
    });

    ScrollTrigger.create({
        trigger: "[data-animate-hero]",
        start: "top 90%",
        onEnterBack: () => {
            gsap.fromTo(
                "[data-animate-hero]",
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            );
        },
    });
}

// Scroll animations
function animateElements(selector, yValue) {
    document.querySelectorAll(selector).forEach((element) => {
        gsap.from(element, {
            y: yValue,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.1,
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
                toggleActions: "play none none none",
            },
        });
    });
}

animateElements("[data-animate-up]", 100);
animateElements("[data-animate-down]", -100);

// Split text
if (document.querySelector(".gsap_split_line")) {
    const split = new SplitText(".gsap_split_line", { type: "lines" });

    gsap.from(split.lines, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
            trigger: ".gsap_split_line",
            start: "top 85%",
            toggleActions: "play none none none",
        },
    });
}

// Marquee
const marquee = document.querySelector(".marquee-track");
if (marquee) {
    gsap.to(marquee, {
        xPercent: -50,
        ease: "linear",
        duration: 50,
        repeat: -1,
    });
}

const logos = document.querySelector(".logos-marquee-track");
if (logos) {
    gsap.fromTo(
        logos,
        { xPercent: -50 },
        { xPercent: 0, ease: "linear", duration: 50, repeat: -1 }
    );
}

// FAQs
const faqTriggers = document.querySelectorAll(".faq-trigger");
if (faqTriggers.length) {
    gsap.set(".answer-body", { height: 0, overflow: "hidden" });

    faqTriggers.forEach((trigger) => {
        const answer = trigger.nextElementSibling;
        const arrow = trigger.querySelector(".faq-arrow");
        let isOpen = false;

        trigger.addEventListener("click", () => {
            gsap.to(answer, {
                height: isOpen ? 0 : "auto",
                duration: 0.4,
                ease: "power2.inOut",
            });
            gsap.to(arrow, {
                rotation: isOpen ? 0 : 180,
                duration: 0.4,
                ease: "power2.inOut",
            });
            isOpen = !isOpen;
        });
    });
}

//  Slider
const sliderEl = document.getElementById("service-slider");
if (sliderEl) {
    const splide = new Splide("#service-slider", {
        type: "loop",
        fixedWidth: 450,
        gap: "0.75rem",
        arrows: false,
        pagination: false,
        drag: true,
        snap: true,
        breakpoints: {
            768: { fixedWidth: "100%" },
        },
    });

    document.querySelector(".arrow-prev")?.addEventListener("click", () => splide.go("<"));
    document.querySelector(".arrow-next")?.addEventListener("click", () => splide.go(">"));

    const dots = document.querySelectorAll(".slider-dots .dot");

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => splide.go(i));
    });

    splide.on("moved", () => {
        const realIndex = splide.index % dots.length;
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === realIndex ? "#fff" : "rgba(255,255,255,0.4)";
        });
    });

    splide.mount();
}

// Contact form
const form = document.querySelector('form[action*="web3forms"]');
if (form) {
    const btn = document.getElementById("submit-btn");
    const successMsg = document.querySelector('[aria-label="Contact Form success"]');
    const errorMsg   = document.querySelector('[aria-label="Contact Form failure"]');

    // ── [NEW] Honeypot: bots fill hidden fields, humans don't
    const honeypot = document.createElement('input');
    honeypot.type  = 'text';
    honeypot.name  = 'website';        // convincing field name for bots
    honeypot.autocomplete = 'off';
    honeypot.tabIndex = -1;
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
    form.appendChild(honeypot);

    // Track when the form first became visible
    const formOpenedAt = Date.now();
    const MIN_FILL_MS  = 3000;         // must take ≥ 3 s to fill (bots are instant)

    // Session-scoped submission counter
    let sessionCount = 0;
    const SESSION_MAX = 3;

    // Rate limiting: max 3 per 10 min
    function isRateLimited() {
        const key    = 'cf_submissions';
        const now    = Date.now();
        const window = 10 * 60 * 1000;
        const max    = 3;

        let history;
        try {
            history = JSON.parse(localStorage.getItem(key) || '[]');
        } catch {
            history = [];
        }

        const recent = history.filter(t => now - t < window);
        if (recent.length >= max) return true;

        recent.push(now);
        try { localStorage.setItem(key, JSON.stringify(recent)); } catch { /* quota exceeded — non-fatal */ }
        return false;
    }

    // Sanitize: strip tags, trim, enforce length
    function sanitize(value = '', maxLength = 500) {
        return String(value)
            .trim()
            .replace(/[<>'"]/g, c => ({'<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))
            .replace(/[\u0000-\u001F\u007F]/g, '')   // strip control characters
            .slice(0, maxLength);
    }

    // ── [NEW] Stricter email validator (no consecutive dots, valid TLD length) ─
    function isValidEmail(email) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(email)
            && !email.includes('..')
            && email.length <= 254;
    }

    // [NEW] Repeated-character check (aaaaaaaaaa, 1111111111)
    function hasExcessiveRepetition(str) {
        return /(.)\1{9,}/.test(str);
    }

    function validateForm(data) {
        const name    = data.get('name')    || '';
        const email   = data.get('email')   || '';
        const message = data.get('message') || '';

        if (name.length < 2  || name.length > 100)       return 'Name must be 2–100 characters.';
        if (!isValidEmail(email))                         return 'Invalid email address.';
        if (message.length < 10 || message.length > 2000) return 'Message must be 10–2000 characters.';

        if (hasExcessiveRepetition(name) || hasExcessiveRepetition(message))
            return 'Message rejected.';

        // [NEW] Reject URLs and common injection patterns in name/message
        const spamPatterns = /\b(viagra|casino|crypto|click here|free money|winner|SEO|backlink)\b|https?:\/\/|<script|javascript:|data:/i;
        if (spamPatterns.test(message) || spamPatterns.test(name)) return 'Message rejected.';

        return null;
    }

    // Single-flight guard — prevents double-submits
    let submitting = false;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (submitting) return;

        // Bot signal 1: honeypot filled
        if (honeypot.value.trim() !== '') return;

        // Bot signal 2: submitted too fast
        if (Date.now() - formOpenedAt < MIN_FILL_MS) {
            errorMsg.textContent = 'Please take a moment to fill in the form.';
            errorMsg?.classList.remove("hidden");
            return;
        }

        // Session cap
        if (sessionCount >= SESSION_MAX) {
            errorMsg.textContent = 'Too many submissions this session.';
            errorMsg?.classList.remove("hidden");
            return;
        }

        // localStorage rate limit
        if (isRateLimited()) {
            errorMsg.textContent = 'Too many submissions. Try again in 10 minutes.';
            errorMsg?.classList.remove("hidden");
            return;
        }

        const rawData = new FormData(form);

        const validationError = validateForm(rawData);
        if (validationError) {
            errorMsg.textContent = validationError;
            errorMsg?.classList.remove("hidden");
            return;
        }

        // Sanitize before sending
        const cleanData = new FormData();
        cleanData.append('access_key', rawData.get('access_key'));
        cleanData.append('name',       sanitize(rawData.get('name'),    100));
        cleanData.append('email',      sanitize(rawData.get('email'),   254));
        cleanData.append('message',    sanitize(rawData.get('message'), 2000));

        submitting = true;
        sessionCount++;
        btn.textContent = "SENDING...";
        btn.disabled    = true;
        errorMsg?.classList.add("hidden");

        try {
            const response = await fetch(form.action, {
                method:  "POST",
                body:    cleanData,
                headers: { Accept: "application/json" },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();

            if (result.success) {
                form.reset();
                successMsg?.classList.remove("hidden");
                btn.textContent = "SENT ✓";
            } else {
                throw new Error("Submission failed");
            }
        } catch {
            errorMsg.textContent = 'Something went wrong. Please try again.';
            errorMsg?.classList.remove("hidden");
            btn.textContent = "SEND";
            btn.disabled    = false;
            submitting      = false;
        }
    });
}