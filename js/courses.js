document.addEventListener('DOMContentLoaded', function() {
    const courseVideos = document.querySelectorAll('.course-video');
    
    courseVideos.forEach(videoContainer => {
        const video = videoContainer.querySelector('video');
        const thumbnail = videoContainer.querySelector('.course-thumbnail');
        
        if (video && thumbnail) {
            videoContainer.addEventListener('mouseenter', function() {
                thumbnail.style.opacity = '0';
                video.muted = false;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Error playing video:', error);
                        video.load();
                        setTimeout(() => {
                            video.play().catch(e => console.error('Second attempt failed:', e));
                        }, 100);
                    });
                }
            });
            videoContainer.addEventListener('mouseleave', function() {
                thumbnail.style.opacity = '1';
                video.muted = true;
                video.pause();
                video.currentTime = 0;
            });
            video.addEventListener('loadedmetadata', function() {
                if (thumbnail.src) {
                    video.poster = thumbnail.src;
                }
            });
        }
    });
    
    courseVideos.forEach(videoContainer => {
        const video = videoContainer.querySelector('video');
        const thumbnail = videoContainer.querySelector('.course-thumbnail');
        
        if (video && thumbnail) {
            let touchStarted = false;
            let playTimeout;
            
            videoContainer.addEventListener('touchstart', function() {
                touchStarted = true;
                playTimeout = setTimeout(() => {
                    if (touchStarted) {
                        if (video.paused) {
                            thumbnail.style.opacity = '0';
                            video.muted = false;
                            video.play().catch(e => console.error('Touch play failed:', e));
                        } else {
                            thumbnail.style.opacity = '1';
                            video.muted = true;
                            video.pause();
                        }
                    }
                }, 200);
            });
            
            videoContainer.addEventListener('touchend', function() {
                touchStarted = false;
                clearTimeout(playTimeout);
            });
            
            videoContainer.addEventListener('touchmove', function() {
                touchStarted = false;
                clearTimeout(playTimeout);
            });
        }
    });
});
