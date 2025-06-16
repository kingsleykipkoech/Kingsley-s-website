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
});