document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
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
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(100px)";
    });
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    function handleScrollAnimation() {
        galleryItems.forEach(item => {
            if (isInViewport(item) && item.style.opacity === "0") {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
            }
        });
    }
    
    handleScrollAnimation();
    
    window.addEventListener('scroll', handleScrollAnimation);
    
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
    
    const serviceVideos = document.querySelectorAll('.service-video');
    
    serviceVideos.forEach(video => {
        video.parentElement.addEventListener('mouseenter', function() {
            video.play();
        });
        
        video.parentElement.addEventListener('mouseleave', function() {
            video.pause();
        });
        
        video.parentElement.addEventListener('touchstart', function() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });

    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.setAttribute('oncontextmenu', 'return false');
        img.style.userSelect = 'none';
    });
});
