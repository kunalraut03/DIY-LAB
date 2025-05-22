document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.workshop-item').forEach(function(item) {
            const thumbnail = item.querySelector('.workshop-thumbnail');
            const staticImage = thumbnail.querySelector('.static-thumbnail');
            const video = thumbnail.querySelector('video');
            const slideshow = thumbnail.querySelector('.slideshow');
            
            const playBtn = document.createElement('button');
            playBtn.className = 'play-button';
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            thumbnail.appendChild(playBtn);
            
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                if (video) {
                    staticImage.style.display = 'none';
                    video.style.display = 'block';
                    video.style.opacity = '1';
                    video.style.zIndex = '5';
                    video.style.position = 'absolute';
                    video.style.top = '0';
                    video.style.left = '0';
                    video.style.width = '100%';
                    video.style.height = '100%';
                    video.style.objectFit = 'cover';
                    
                    video.controls = true;
                    video.muted = false;
                    video.currentTime = 0;
                    
                    video.play();
                    
                    playBtn.style.display = 'none';
                    
                    video.addEventListener('ended', function() {
                        playBtn.style.display = 'block';
                        playBtn.innerHTML = '<i class="fas fa-times"></i>';
                        playBtn.classList.add('active');
                    });
                    
                    video.addEventListener('click', function(e) {
                        if (video.controls) {
                            setTimeout(() => { video.controls = true; }, 10);
                        }
                    });
                    
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'video-close-btn';
                    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    thumbnail.appendChild(closeBtn);
                    
                    closeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        video.pause();
                        video.style.display = '';
                        video.style.opacity = '';
                        video.style.zIndex = '';
                        video.style.position = '';
                        video.style.width = '';
                        video.style.height = '';
                        video.style.objectFit = '';
                        video.controls = false;
                        video.currentTime = 0;
                        
                        staticImage.style.display = '';
                        
                        playBtn.style.display = 'block';
                        playBtn.innerHTML = '<i class="fas fa-play"></i>';
                        playBtn.classList.remove('active');
                        
                        try {
                            thumbnail.removeChild(closeBtn);
                        } catch (e) {
                            console.log("Button already removed");
                        }
                    });
                    
                } else if (slideshow) {
                    staticImage.style.display = 'none';
                    
                    slideshow.style.display = 'none';
                    
                    playBtn.style.display = 'none';
                    
                    const slideshowOverlay = document.createElement('div');
                    slideshowOverlay.className = 'slideshow-overlay';
                    slideshowOverlay.style.position = 'absolute';
                    slideshowOverlay.style.top = '0';
                    slideshowOverlay.style.left = '0';
                    slideshowOverlay.style.width = '100%';
                    slideshowOverlay.style.height = '100%';
                    slideshowOverlay.style.backgroundColor = 'rgba(0,0,0,0.95)';
                    slideshowOverlay.style.zIndex = '50';
                    slideshowOverlay.style.display = 'flex';
                    slideshowOverlay.style.justifyContent = 'center';
                    slideshowOverlay.style.alignItems = 'center';
                    
                    thumbnail.appendChild(slideshowOverlay);
                    
                    const slideshowContainer = document.createElement('div');
                    slideshowContainer.className = 'slideshow-container';
                    slideshowContainer.style.position = 'relative';
                    slideshowContainer.style.width = '100%';
                    slideshowContainer.style.height = '100%';
                    slideshowContainer.style.display = 'flex';
                    slideshowContainer.style.justifyContent = 'center';
                    slideshowContainer.style.alignItems = 'center';
                    
                    slideshowOverlay.appendChild(slideshowContainer);
                    
                    const originalImages = slideshow.querySelectorAll('img');
                    
                    let currentSlide = 0;
                    
                    function showSlide(index) {
                        const currentWrapper = slideshowContainer.querySelector('div');
                        if (currentWrapper) {
                            slideshowContainer.removeChild(currentWrapper);
                        }
                        
                        currentSlide = (index + originalImages.length) % originalImages.length;
                        
                        const imageWrapper = document.createElement('div');
                        imageWrapper.style.position = 'relative';
                        imageWrapper.style.display = 'flex';
                        imageWrapper.style.justifyContent = 'center';
                        imageWrapper.style.alignItems = 'center';
                        imageWrapper.style.width = '100%';
                        imageWrapper.style.height = '100%';
                        
                        const newImg = originalImages[currentSlide].cloneNode(true);
                        newImg.style.maxWidth = '90%';
                        newImg.style.maxHeight = '90%';
                        newImg.style.objectFit = 'contain';
                        
                        const counter = document.createElement('div');
                        counter.className = 'slide-counter-inline';
                        counter.textContent = `${currentSlide + 1} / ${originalImages.length}`;
                        counter.style.position = 'absolute';
                        counter.style.bottom = '10px';
                        counter.style.left = '50%';
                        counter.style.transform = 'translateX(-50%)';
                        counter.style.backgroundColor = 'rgba(0,0,0,0.7)';
                        counter.style.color = 'white';
                        counter.style.padding = '5px 10px';
                        counter.style.borderRadius = '12px';
                        counter.style.fontSize = '12px';
                        counter.style.fontFamily = 'Arial, sans-serif';
                        counter.style.zIndex = '52';
                        
                        imageWrapper.appendChild(newImg);
                        imageWrapper.appendChild(counter);
                        
                        slideshowContainer.appendChild(imageWrapper);
                    }
                    
                    const prevBtn = document.createElement('button');
                    prevBtn.className = 'slide-nav prev';
                    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
                    prevBtn.style.position = 'absolute';
                    prevBtn.style.left = '10px';
                    prevBtn.style.top = '50%';
                    prevBtn.style.transform = 'translateY(-50%)';
                    prevBtn.style.zIndex = '51';
                    prevBtn.style.width = '36px';
                    prevBtn.style.height = '36px';
                    prevBtn.style.borderRadius = '50%';
                    prevBtn.style.backgroundColor = 'rgba(0,0,0,0.6)';
                    prevBtn.style.color = 'white';
                    prevBtn.style.border = 'none';
                    prevBtn.style.cursor = 'pointer';
                    prevBtn.style.display = 'flex';
                    prevBtn.style.justifyContent = 'center';
                    prevBtn.style.alignItems = 'center';
                    prevBtn.style.pointerEvents = 'auto';
                    
                    const nextBtn = document.createElement('button');
                    nextBtn.className = 'slide-nav next';
                    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
                    nextBtn.style.position = 'absolute';
                    nextBtn.style.right = '10px';
                    nextBtn.style.top = '50%';
                    nextBtn.style.transform = 'translateY(-50%)';
                    nextBtn.style.zIndex = '51';
                    nextBtn.style.width = '36px';
                    nextBtn.style.height = '36px';
                    nextBtn.style.borderRadius = '50%';
                    nextBtn.style.backgroundColor = 'rgba(0,0,0,0.6)';
                    nextBtn.style.color = 'white';
                    nextBtn.style.border = 'none';
                    nextBtn.style.cursor = 'pointer';
                    nextBtn.style.display = 'flex';
                    nextBtn.style.justifyContent = 'center';
                    nextBtn.style.alignItems = 'center';
                    nextBtn.style.pointerEvents = 'auto';
                    
                    slideshowOverlay.appendChild(prevBtn);
                    slideshowOverlay.appendChild(nextBtn);
                    
                    showSlide(0);
                    
                    let slideInterval;
                    
                    prevBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        clearInterval(slideInterval);
                        showSlide(currentSlide - 1);
                    });
                    
                    nextBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        clearInterval(slideInterval);
                        showSlide(currentSlide + 1);
                    });
                    
                    slideInterval = setInterval(() => {
                        showSlide(currentSlide + 1);
                    }, 3000);
                    
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'video-close-btn';
                    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    closeBtn.style.position = 'absolute';
                    closeBtn.style.top = '10px';
                    closeBtn.style.right = '10px';
                    closeBtn.style.zIndex = '51';
                    closeBtn.style.width = '30px';
                    closeBtn.style.height = '30px';
                    closeBtn.style.borderRadius = '50%';
                    closeBtn.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    closeBtn.style.color = 'white';
                    closeBtn.style.border = 'none';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.style.display = 'flex';
                    closeBtn.style.justifyContent = 'center';
                    closeBtn.style.alignItems = 'center';
                    closeBtn.style.fontSize = '14px';
                    
                    slideshowOverlay.appendChild(closeBtn);
                    
                    closeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        clearInterval(slideInterval);
                        
                        thumbnail.removeChild(slideshowOverlay);
                        
                        staticImage.style.display = '';
                        
                        playBtn.style.display = 'block';
                    });
                }
            });
        });
    }
});
