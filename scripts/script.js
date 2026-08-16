document.addEventListener('DOMContentLoaded', function() {
    // Highlight active nav link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath === '/' && href === '/') ||
            (currentPath.includes('/posts') && href.includes('/posts')) ||
            (currentPath.includes('/terminal') && href.includes('/terminal'))) {
            link.classList.add('active');
        }
    });
});
