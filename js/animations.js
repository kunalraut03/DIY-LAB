document.addEventListener('DOMContentLoaded', function() {
    const isInViewport = (element, offset = 150) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - offset) &&
            rect.bottom >= offset
        );
    };

    const handleScrollAnimations = () => {
        const textImageSections = document.querySelectorAll('.text-image');
        
        textImageSections.forEach(section => {
            if (isInViewport(section)) {
                section.classList.add('visible');
            }
        });
    };

    setTimeout(handleScrollAnimations, 300);
    
    window.addEventListener('scroll', handleScrollAnimations);
    window.addEventListener('resize', handleScrollAnimations);

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('oncontextmenu', 'return false');
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
    });
    
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('controlslist', 'nodownload');
        video.setAttribute('oncontextmenu', 'return false');
    });
    
    document.addEventListener('dragstart', function(event) {
        if (event.target.tagName === 'IMG' || event.target.tagName === 'VIDEO') {
            event.preventDefault();
        }
    });
});
