// JavaScript for handling scroll-based animations

document.addEventListener('DOMContentLoaded', function() {
    // Function to check if element is in viewport
    const isInViewport = (element, offset = 150) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - offset) &&
            rect.bottom >= offset
        );
    };

    // Function to handle scroll animations
    const handleScrollAnimations = () => {
        const textImageSections = document.querySelectorAll('.text-image');
        
        textImageSections.forEach(section => {
            if (isInViewport(section)) {
                section.classList.add('visible');
            }
        });
    };

    // Initial check on page load
    setTimeout(handleScrollAnimations, 300);
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Also trigger on window resize
    window.addEventListener('resize', handleScrollAnimations);

    // Protect all images from downloading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('oncontextmenu', 'return false');
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
    });
    
    // Add nodownload attribute to any videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('controlslist', 'nodownload');
        video.setAttribute('oncontextmenu', 'return false');
    });
    
    // Disable drag and drop for all elements
    document.addEventListener('dragstart', function(event) {
        if (event.target.tagName === 'IMG' || event.target.tagName === 'VIDEO') {
            event.preventDefault();
        }
    });
});
