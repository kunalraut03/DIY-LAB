document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        setupMobileVideoPlayers();
    }
    
    function setupMobileVideoPlayers() {
        document.querySelectorAll('.workshop-thumbnail').forEach(function(thumbnail) {
            const videoElement = thumbnail.querySelector('video');
            const slideshowElement = thumbnail.querySelector('.slideshow');
            
            const playButton = document.createElement('div');
            playButton.className = 'mobile-video-button';
            
            if (videoElement) {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                
                playButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const staticThumbnail = thumbnail.querySelector('.static-thumbnail');
                    if (staticThumbnail) staticThumbnail.style.display = 'none';
                    
                    videoElement.style.display = 'block';
                    videoElement.style.opacity = '1';
                    videoElement.style.zIndex = '10';
                    videoElement.controls = true;
                    videoElement.muted = false;
                    videoElement.loop = false;
                    
                    this.innerHTML = '<i class="fas fa-times"></i>';
                    this.classList.add('active');
                    
                    videoElement.currentTime = 0;
                    const playPromise = videoElement.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                        }).catch(error => {
                            console.error('Auto-play prevented:', error);
                        });
                    }
                    
                    this.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        videoElement.pause();
                        videoElement.currentTime = 0;
                        videoElement.style.display = '';
                        videoElement.style.opacity = '';
                        videoElement.style.zIndex = '';
                        videoElement.controls = false;
                        
                        if (staticThumbnail) staticThumbnail.style.display = '';
                        
                        this.innerHTML = '<i class="fas fa-play"></i>';
                        this.classList.remove('active');
                        
                        setupOriginalClickHandler();
                    };
                    
                    function setupOriginalClickHandler() {
                        playButton.onclick = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            if (staticThumbnail) staticThumbnail.style.display = 'none';
                            
                            videoElement.style.display = 'block';
                            videoElement.style.opacity = '1';
                            videoElement.style.zIndex = '10';
                            videoElement.controls = true;
                            videoElement.muted = false;
                            videoElement.loop = false;
                            
                            this.innerHTML = '<i class="fas fa-times"></i>';
                            this.classList.add('active');
                            
                            videoElement.currentTime = 0;
                            videoElement.play();
                            
                            this.onclick = function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                videoElement.pause();
                                videoElement.currentTime = 0;
                                videoElement.style.display = '';
                                videoElement.style.opacity = '';
                                videoElement.style.zIndex = '';
                                videoElement.controls = false;
                                
                                if (staticThumbnail) staticThumbnail.style.display = '';
                                
                                this.innerHTML = '<i class="fas fa-play"></i>';
                                this.classList.remove('active');
                                
                                setupOriginalClickHandler();
                            };
                        };
                    }
                });
                
            } else if (slideshowElement) {
                playButton.innerHTML = '<i class="fas fa-images"></i>';
                
                playButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const staticThumbnail = thumbnail.querySelector('.static-thumbnail');
                    if (staticThumbnail) staticThumbnail.style.display = 'none';
                    
                    slideshowElement.style.display = 'flex';
                    slideshowElement.style.opacity = '1';
                    slideshowElement.style.zIndex = '10';
                    
                    if (!slideshowElement.classList.contains('simple-slideshow')) {
                        slideshowElement.classList.add('simple-slideshow');
                        
                        const images = slideshowElement.querySelectorAll('img');
                        let currentImageIndex = 0;
                        
                        images.forEach((img, index) => {
                            img.style.display = index === 0 ? 'block' : 'none';
                            img.style.position = 'absolute';
                            img.style.top = '0';
                            img.style.left = '0';
                            img.style.width = '100%';
                            img.style.height = '100%';
                            img.style.objectFit = 'contain';
                        });
                        
                        const prevButton = document.createElement('button');
                        prevButton.className = 'slide-nav prev';
                        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
                        
                        const nextButton = document.createElement('button');
                        nextButton.className = 'slide-nav next';
                        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
                        
                        slideshowElement.appendChild(prevButton);
                        slideshowElement.appendChild(nextButton);
                        
                        prevButton.addEventListener('click', function(e) {
                            e.stopPropagation();
                            images[currentImageIndex].style.display = 'none';
                            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                            images[currentImageIndex].style.display = 'block';
                        });
                        
                        nextButton.addEventListener('click', function(e) {
                            e.stopPropagation();
                            images[currentImageIndex].style.display = 'none';
                            currentImageIndex = (currentImageIndex + 1) % images.length;
                            images[currentImageIndex].style.display = 'block';
                        });
                    }
                    
                    this.innerHTML = '<i class="fas fa-times"></i>';
                    this.classList.add('active');
                    
                    this.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        slideshowElement.style.display = '';
                        slideshowElement.style.opacity = '';
                        slideshowElement.style.zIndex = '';
                        
                        if (staticThumbnail) staticThumbnail.style.display = '';
                        
                        this.innerHTML = '<i class="fas fa-images"></i>';
                        this.classList.remove('active');
                        
                        this.onclick = originalClickHandler;
                    };
                    
                    const originalClickHandler = this.onclick;
                });
            }
            
            thumbnail.appendChild(playButton);
        });
    }
});
