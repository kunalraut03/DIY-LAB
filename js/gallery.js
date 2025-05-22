document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
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
    
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const indicators = document.querySelectorAll('.gallery-indicator');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentPage = 1;
        const totalPages = 7;
        function showPage(pageNum) {
            galleryItems.forEach(item => {
                item.style.display = 'none';
                item.classList.remove('in-view');
            });
            const itemsToShow = document.querySelectorAll(`.gallery-item[data-page="${pageNum}"]`);
            itemsToShow.forEach(item => {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('in-view');
                }, 100);
            });
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
                if (parseInt(indicator.getAttribute('data-page')) === pageNum) {
                    indicator.classList.add('active');
                }
            });
            currentPage = pageNum;
        }
        showPage(1);
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let nextPage = currentPage + 1;
                if (nextPage > totalPages) {
                    nextPage = 1;
                }
                showPage(nextPage);
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prevPage = currentPage - 1;
                if (prevPage < 1) {
                    prevPage = totalPages;
                }
                showPage(prevPage);
            });
        }
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const pageNum = parseInt(indicator.getAttribute('data-page'));
                showPage(pageNum);
            });
        });
        let galleryInterval = setInterval(() => {
            let nextPage = currentPage + 1;
            if (nextPage > totalPages) {
                nextPage = 1;
            }
            showPage(nextPage);
        }, 8000);
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
                let nextPage = currentPage + 1;
                if (nextPage > totalPages) {
                    nextPage = 1;
                }
                showPage(nextPage);
            } else if (touchEndX > touchStartX + 50) {
                let prevPage = currentPage - 1;
                if (prevPage < 1) {
                    prevPage = totalPages;
                }
                showPage(prevPage);
            }
        }
    }
    if (document.querySelector('.gallery-section')) {
        initGallery();
    }
});
