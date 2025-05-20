// Gallery functionality for DIY Lab website
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = document.querySelectorAll('.bar');
            
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Handle dropdowns on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Gallery functionality
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const indicators = document.querySelectorAll('.gallery-indicator');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        let currentPage = 1;
        const totalPages = 7; // We have 7 pages total in the gallery
        
        // Function to show gallery items for a specific page and hide others
        function showPage(pageNum) {
            // Hide all items
            galleryItems.forEach(item => {
                item.style.display = 'none';
                item.classList.remove('in-view');
            });
            
            // Show items for current page
            const itemsToShow = document.querySelectorAll(`.gallery-item[data-page="${pageNum}"]`);
            itemsToShow.forEach(item => {
                item.style.display = 'block';
                // Use setTimeout to stagger the animations
                setTimeout(() => {
                    item.classList.add('in-view');
                }, 100);
            });
            
            // Update indicators
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
                if (parseInt(indicator.getAttribute('data-page')) === pageNum) {
                    indicator.classList.add('active');
                }
            });
            
            currentPage = pageNum;
        }
        
        // Initialize by showing first page
        showPage(1);
        
        // Add click event to next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let nextPage = currentPage + 1;
                if (nextPage > totalPages) {
                    nextPage = 1; // Loop back to first page
                }
                showPage(nextPage);
            });
        }
        
        // Add click event to prev button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prevPage = currentPage - 1;
                if (prevPage < 1) {
                    prevPage = totalPages; // Loop to last page
                }
                showPage(prevPage);
            });
        }
        
        // Add click events to indicators
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const pageNum = parseInt(indicator.getAttribute('data-page'));
                showPage(pageNum);
            });
        });
        
        // Auto-advance gallery every 8 seconds
        let galleryInterval = setInterval(() => {
            let nextPage = currentPage + 1;
            if (nextPage > totalPages) {
                nextPage = 1;
            }
            showPage(nextPage);
        }, 8000);
        
        // Pause auto-advance when mouse enters gallery section
        const gallerySection = document.querySelector('.gallery-section');
        
        if (gallerySection) {
            gallerySection.addEventListener('mouseenter', () => {
                clearInterval(galleryInterval);
            });
            
            gallerySection.addEventListener('mouseleave', () => {
                galleryInterval = setInterval(() => {
                    let nextPage = currentPage + 1;
                    if (nextPage > totalPages) {
                        nextPage = 1;
                    }
                    showPage(nextPage);
                }, 8000);
            });
        }
        
        // Add keyboard navigation for gallery
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                let prevPage = currentPage - 1;
                if (prevPage < 1) {
                    prevPage = totalPages;
                }
                showPage(prevPage);
            } else if (e.key === 'ArrowRight') {
                let nextPage = currentPage + 1;
                if (nextPage > totalPages) {
                    nextPage = 1;
                }
                showPage(nextPage);
            }
        });

        // Add swipe gesture support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (gallerySection) {
            gallerySection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, false);
            
            gallerySection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);
        }
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Swipe left - next page
                let nextPage = currentPage + 1;
                if (nextPage > totalPages) {
                    nextPage = 1;
                }
                showPage(nextPage);
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right - previous page
                let prevPage = currentPage - 1;
                if (prevPage < 1) {
                    prevPage = totalPages;
                }
                showPage(prevPage);
            }
        }
    }
    
    // Initialize gallery if it exists on the page
    if (document.querySelector('.gallery-section')) {
        initGallery();
    }
});
