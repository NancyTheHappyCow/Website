// Smooth Scroll Animation
document.addEventListener('scroll', () => {
    document.querySelectorAll('.hero').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            section.classList.add('visible');
        }
    });
});

