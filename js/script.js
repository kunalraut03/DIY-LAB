document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Mobile dropdown toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.dropdown-toggle');
        
        if (window.innerWidth <= 768) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Gallery items scroll animation
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Set initial state
    galleryItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(100px)";
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll animation
    function handleScrollAnimation() {
        galleryItems.forEach(item => {
            if (isInViewport(item) && item.style.opacity === "0") {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
            }
        });
    }
    
    // Initial check on page load
    handleScrollAnimation();
    
    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Workshop video hover functionality
    const videoContainers = document.querySelectorAll('.workshop-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        
        if (video) {
            container.addEventListener('mouseenter', function() {
                video.play();
            });
            
            container.addEventListener('mouseleave', function() {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
    
    // Handle video play/pause on hover
    const serviceVideos = document.querySelectorAll('.service-video');
    
    serviceVideos.forEach(video => {
        // Play video on hover
        video.parentElement.addEventListener('mouseenter', function() {
            video.play();
        });
        
        // Pause video when not hovering
        video.parentElement.addEventListener('mouseleave', function() {
            video.pause();
            // Optionally reset to beginning
            // video.currentTime = 0;
        });
        
        // For touch devices
        video.parentElement.addEventListener('touchstart', function() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });

    // Modal functionality for Visit Us form
    
    // Disable right-click on all images
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.setAttribute('oncontextmenu', 'return false');
        img.style.userSelect = 'none';
    });
});
