document.addEventListener('DOMContentLoaded', function() {
    // Set the current year in the footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navAnchors = navLinks ? Array.from(navLinks.querySelectorAll('a')) : [];
    const sectionsSelector = '.section-box, .hero-section';
    const sections = Array.from(document.querySelectorAll(sectionsSelector));

    // Helper: map visible-hash (nav href) to actual section id in the DOM
    function mapHashToSectionId(hash) {
        if (!hash || hash === 'top') return 'home-section';
        // common direct mapping (about -> about, skills -> skills, etc.)
        return hash;
    }

    function hideAllSections() {
        sections.forEach(s => s.classList.add('hidden-section'));
    }

    function showSectionBySectionId(sectionId) {
        hideAllSections();
        const el = document.getElementById(sectionId);
        if (el) el.classList.remove('hidden-section');
    }

    function setActiveNavForHash(hash) {
        navAnchors.forEach(a => {
            const hrefHash = (a.getAttribute('href') || '').replace('#', '') || 'top';
            if (hrefHash === hash) a.classList.add('active');
            else a.classList.remove('active');
        });
    }

    // Initialize nav click behavior: show/hide sections (no scrolling)
    if (navLinks) {
        navAnchors.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Determine the visible hash the nav uses (e.g., "top", "about")
                const visibleHash = (this.getAttribute('href') || '').replace('#', '') || 'top';
                const targetSectionId = mapHashToSectionId(visibleHash);

                // Show target and update URL without causing a jump
                showSectionBySectionId(targetSectionId);
                try {
                    history.pushState(null, '', '#' + visibleHash);
                } catch (err) {
                    // fall back silently
                    location.hash = '#' + visibleHash;
                }

                // set active state on nav
                setActiveNavForHash(visibleHash);

                // close mobile nav if open
                navLinks.classList.remove('show');
                if (hamburger) {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Hamburger toggle (keyboard accessible)
    if (hamburger && navLinks) {
        const toggleMenu = () => {
            const isOpen = navLinks.classList.toggle('show');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        };
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                toggleMenu();
            }
        });
    }

    // Animated button / modal logic (preserve existing behavior)
    const animatedBtn = document.querySelector('.animated-btn');
    const customModal = document.getElementById('customModal');
    const closeModal = document.getElementById('closeModal');

    if (animatedBtn && customModal && closeModal) {
        animatedBtn.addEventListener('click', () => customModal.classList.remove('hidden-section'));
        closeModal.addEventListener('click', () => customModal.classList.add('hidden-section'));
        customModal.addEventListener('click', (e) => {
            if (e.target === customModal) customModal.classList.add('hidden-section');
        });
    }

    // Find Me Online dropdown toggle
    const findMeBtn = document.getElementById('findMeBtn');
    const socialLinks = document.getElementById('social-links');
    if (findMeBtn && socialLinks) {
        findMeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            socialLinks.classList.toggle('show');
        });
        socialLinks.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('click', () => socialLinks.classList.remove('show'));
    }

    // On load: show section based on URL hash (or default home)
    const initialHash = (location.hash || '').replace('#', '') || 'top';
    const initialSectionId = mapHashToSectionId(initialHash);
    // hide all then show the initial
    hideAllSections();
    showSectionBySectionId(initialSectionId);
    setActiveNavForHash(initialHash);

    // Smooth scroll handler (use scroll-margin-top on sections, so native smooth works)
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = mapHashToSectionId((this.getAttribute('href') || '').replace('#', ''));
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

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
            navAnchors.forEach(a => {
                const hrefHash = (a.getAttribute('href') || '').replace('#', '') || 'top';
                if (hrefHash === currentId) a.classList.add('active');
                else a.classList.remove('active');
            });
            ticking = false;
        });
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    // run once on load
    onScroll();
});