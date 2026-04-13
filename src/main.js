import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "gsap/SplitText";
import {Draggable} from "gsap/dist/Draggable";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

const hamburger = document.getElementById("hamburger-menu");
const [line1, line2] = hamburger.children;
const mainNav = document.getElementById("main-nav");

function handleHamburgerClick(event) {
    event.stopPropagation();
    const isOpen = hamburger.classList.toggle("is-open");

    if (isOpen) {
        hamburger.classList.remove('group');
        line1.classList.remove('-translate-y-1', 'rotate-90');
        line1.classList.add('rotate-45');
        line2.classList.remove('translate-y-1', 'rotate-90');
        line2.classList.add('-rotate-45');
        mainNav.classList.remove('-translate-y-full', 'pointer-events-none');
    } else {
        hamburger.classList.add('group');
        line1.classList.remove('rotate-45');
        line2.classList.remove('-rotate-45');
        line2.classList.add('rotate-90');
        mainNav.classList.add('-translate-y-full', 'pointer-events-none');
    }
}

hamburger.addEventListener("click", handleHamburgerClick);

// 1. Page load animation
gsap.from("[data-animate-hero]", {
    y: -100,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
});

// 2. When scrolled back into hero — plays once each time you enter
ScrollTrigger.create({
    trigger: "[data-animate-hero]",
    start: "top 90%",
    onEnterBack: () => {
        gsap.fromTo("[data-animate-hero]",
            {y: -100, opacity: 0},
            {y: 0, opacity: 1, duration: 0.8, ease: "power2.out"}
        );
    }
});

// Grab all elements with the attribute
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
                toggleActions: "play none none none"
            }
        });
    });
}

animateElements("[data-animate-up]", 100);
animateElements("[data-animate-down]", -100);

const split = new SplitText(".gsap_split_line", {
    type: "lines"
});

gsap.from(split.lines, {
    y: 100,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.15,
    scrollTrigger: {
        trigger: ".gsap_split_line",
        start: "top 85%",
        toggleActions: "play none none none"
    }
});

const marquee = document.querySelector(".marquee-track");

gsap.to(marquee, {
    xPercent: -50,
    ease: "linear",
    duration: 50, // speed (lower = faster)
    repeat: -1
});

const logos = document.querySelector(".logos-marquee-track");

gsap.fromTo(".logos-marquee-track",
    {xPercent: -50},
    {
        xPercent: 0,
        ease: "linear",
        duration: 50,
        repeat: -1
    }
);

// Faqs
gsap.set(".answer-body", {height: 0, overflow: "hidden"});
document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    const answer = trigger.nextElementSibling;
    const arrow = trigger.querySelector(".faq-arrow");
    let isOpen = false;

    trigger.addEventListener("click", () => {
        if (isOpen) {
            // Close
            gsap.to(answer, {
                height: 0,
                duration: 0.4,
                ease: "power2.inOut"
            });
            gsap.to(arrow, {
                rotation: 0,
                duration: 0.4,
                ease: "power2.inOut"
            });
        } else {
            // Open
            gsap.to(answer, {
                height: "auto",
                duration: 0.4,
                ease: "power2.inOut"
            });
            gsap.to(arrow, {
                rotation: 180,
                duration: 0.4,
                ease: "power2.inOut"
            });
        }
        isOpen = !isOpen;
    });
});

// Slider
(function () {
    // ─── Init ────────────────────────────────────────────────────────────────
    const splide = new Splide('#service-slider', {
        type        : 'loop',
        // 450px matches tab:max-w-112.5 (112.5 × 4 = 450)
        fixedWidth  : 450,
        fixedHeight : '100%',
        gap         : '0.75rem',   // mr-3
        arrows      : false,       // we drive our own
        pagination  : false,       // we drive our own dots
        drag        : true,
        snap        : true,
        breakpoints : {
            // below your "tab" breakpoint — show one full-width slide
            768: {
                fixedWidth : '100%',
            },
        },
    });

    // ─── Custom arrows ───────────────────────────────────────────────────────
    document.querySelector('.arrow-prev')
        .addEventListener('click', () => splide.go('<'));
    document.querySelector('.arrow-next')
        .addEventListener('click', () => splide.go('>'));

    // ─── Custom dots ─────────────────────────────────────────────────────────
    const dots = document.querySelectorAll('.slider-dots .dot');

    function syncDots(index) {
        // Splide reports real index; with loop, clamp to slide count
        const realIndex = splide.index % dots.length;
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === realIndex ? '#fff' : 'rgba(255,255,255,0.4)';
        });
    }

    // Click a dot → go to that slide
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => splide.go(i));
    });

    // Keep dots in sync on every move
    splide.on('moved', syncDots);

    // ─── Mount ───────────────────────────────────────────────────────────────
    splide.mount();
})();

//Modal
(function () {
    const VIDEO_SRC = 'https://www.youtube.com/embed/qR6Z_nC_upA?start=34&autoplay=1&rel=0';

    const trigger   = document.getElementById('videoTrigger');
    const overlay   = document.getElementById('videoModal');
    const backdrop  = document.getElementById('modalBackdrop');
    const box       = document.getElementById('modalBox');
    const closeBtn  = document.getElementById('modalClose');

    let isAnimating = false;

    function openModal() {
        if (isAnimating) return;

        // Inject iframe with autoplay
        const iframe = document.createElement('iframe');
        iframe.src              = VIDEO_SRC;
        iframe.title            = 'omrr - This City Lies (eilean rec. 06)';
        iframe.allow            = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy   = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen  = true;
        iframe.loading          = 'lazy';
        box.appendChild(iframe);

        // Lock scroll
        document.body.style.overflow = 'hidden';

        // Trigger animation
        overlay.style.opacity = '1';
        requestAnimationFrame(() => {
            overlay.classList.add('is-open');
        });
    }

    function closeModal() {
        if (isAnimating) return;
        isAnimating = true;

        overlay.classList.remove('is-open');
        overlay.classList.add('is-closing');

        // Wait for closing animation to finish
        setTimeout(() => {
            overlay.classList.remove('is-closing');
            overlay.style.opacity = '0';

            // Remove iframe — stops audio/video immediately
            const iframe = box.querySelector('iframe');
            if (iframe) iframe.remove();

            document.body.style.overflow = '';
            isAnimating = false;
        }, 320);
    }

    // Open
    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
    });

    // Close via button
    closeBtn.addEventListener('click', closeModal);

    // Close via backdrop click
    backdrop.addEventListener('click', closeModal);

    // Close via ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
})();