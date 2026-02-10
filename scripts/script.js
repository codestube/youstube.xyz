document.addEventListener('DOMContentLoaded', function() {
    // Highlight active nav link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath.includes('/writeups') && link.getAttribute('href').includes('/writeups'))) {
            link.classList.add('active');
        }
    });
    
    // Animate skill bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const skillsSection = document.querySelector('.skills-grid');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
});
