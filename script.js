document.addEventListener('DOMContentLoaded', function() {
    // Set the current year in the footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Hamburger menu functionality
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            hamburger.classList.toggle('active');
        });

        // Hide/show sections on nav click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // Hide all sections
                document.querySelectorAll('.section-box').forEach(section => {
                    section.classList.add('hidden-section');
                });
                // Show the clicked section
                const targetId = this.getAttribute('href').replace('#', '');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.remove('hidden-section');
                }
                // Close nav on mobile
                navLinks.classList.remove('show');
                hamburger.classList.remove('active');
            });
        });
    }

    // Animated button with custom modal popup
    const animatedBtn = document.querySelector('.animated-btn');
    const customModal = document.getElementById('customModal');
    const closeModal = document.getElementById('closeModal');

    if (animatedBtn && customModal && closeModal) {
        animatedBtn.addEventListener('click', function() {
            customModal.classList.remove('hidden-section');
        });
        closeModal.addEventListener('click', function() {
            customModal.classList.add('hidden-section');
        });
        // Close modal when clicking outside modal content
        customModal.addEventListener('click', function(e) {
            if (e.target === customModal) {
                customModal.classList.add('hidden-section');
            }
        });
    }

    // Find Me Online dropdown toggle at the bottom with smooth effect and outside click close
    const findMeBtn = document.getElementById('findMeBtn');
    const socialLinks = document.getElementById('social-links');
    if (findMeBtn && socialLinks) {
        // Toggle dropdown on button click
        findMeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent document click from firing
            socialLinks.classList.toggle('show');
        });

        // Prevent dropdown from closing when clicking inside it
        socialLinks.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            socialLinks.classList.remove('show');
        });
    }

    // Ensure this file is loaded (index.html already includes it).
    (() => {
        const navContainer = document.getElementById('navLinks');
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = Array.from(navButtons).map(btn => document.getElementById(btn.dataset.target));
        const hamburger = document.getElementById('hamburger');

        // Smooth scroll handler (use scroll-margin-top on sections, so native smooth works)
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // close mobile menu if open
                if (navContainer.classList.contains('show')) {
                    navContainer.classList.remove('show');
                    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
                }
                // allow default anchor behavior (native smooth scroll) but prevent instant jump on some browsers
                const targetId = btn.getAttribute('data-target');
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Hamburger toggle (keeps existing behavior but ensures aria-expanded updated)
        if (hamburger && navContainer) {
            hamburger.addEventListener('click', () => {
                navContainer.classList.toggle('show');
                const isExpanded = navContainer.classList.contains('show');
                hamburger.setAttribute('aria-expanded', String(isExpanded));
            });
        }

        // Scrollspy: mark active nav button based on viewport
        let ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                const fromTop = window.scrollY + 120; // small offset
                let currentId = 'top';
                sections.forEach(sec => {
                    if (!sec) return;
                    const offsetTop = sec.offsetTop;
                    if (fromTop >= offsetTop) {
                        currentId = sec.id;
                    }
                });
                navButtons.forEach(btn => {
                    if (btn.dataset.target === currentId) btn.classList.add('active');
                    else btn.classList.remove('active');
                });
                ticking = false;
            });
        }
        document.addEventListener('scroll', onScroll, { passive: true });
        // run once on load
        onScroll();
    })();
});