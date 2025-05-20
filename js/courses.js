document.addEventListener('DOMContentLoaded', function() {
    // Video hover functionality with unmute
    const courseVideos = document.querySelectorAll('.course-video');
    
    courseVideos.forEach(videoContainer => {
        const video = videoContainer.querySelector('video');
        const thumbnail = videoContainer.querySelector('.course-thumbnail');
        
        if (video && thumbnail) {
            // Play and unmute video on hover
            videoContainer.addEventListener('mouseenter', function() {
                thumbnail.style.opacity = '0';
                video.muted = false;
                
                // Ensure video plays even if it failed to load initially
                const playPromise = video.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Error playing video:', error);
                        // Try to reload and play the video if it failed
                        video.load();
                        setTimeout(() => {
                            video.play().catch(e => console.error('Second attempt failed:', e));
                        }, 100);
                    });
                }
            });
            
            // Mute and pause video when mouse leaves
            videoContainer.addEventListener('mouseleave', function() {
                thumbnail.style.opacity = '1';
                video.muted = true;
                video.pause();
                // Reset video to beginning for next hover
                video.currentTime = 0;
            });
            
            // Preload video data when page loads
            video.addEventListener('loadedmetadata', function() {
                // Set poster image from thumbnail for better performance
                if (thumbnail.src) {
                    video.poster = thumbnail.src;
                }
            });
        }
    });
    
    // Add touch support for mobile devices
    courseVideos.forEach(videoContainer => {
        const video = videoContainer.querySelector('video');
        const thumbnail = videoContainer.querySelector('.course-thumbnail');
        
        if (video && thumbnail) {
            let touchStarted = false;
            let playTimeout;
            
            videoContainer.addEventListener('touchstart', function() {
                touchStarted = true;
                // Give a small delay to distinguish between tap and scroll
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
