document.addEventListener('DOMContentLoaded', function() {
    const videoCarousel = document.querySelector('.video-carousel');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const videoTitle = document.querySelector('.video-title');
    const videoDescription = document.querySelector('.video-description');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const muteBtn = document.querySelector('.mute-btn');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const seekbar = document.querySelector('.custom-seekbar');
    const seekbarFill = document.querySelector('.seekbar-fill');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-fill');
    const dotsContainer = document.querySelector('.carousel-dots-container');
    const videos = [
        {
            src: 'projects/Videos/1.mp4',
            title: 'IR Remote Control Robot',
            description: 'Command a sleek, responsive robot using infrared signals, perfect for exploring automation and wireless control in hands-on STEM learning.'
        },
        {
            src: 'projects/Videos/2.mp4',
            title: 'Obstacle Avoidance Robot',
            description: 'Navigate autonomously with ultrasonic sensors, showcasing smart collision detection and pathfinding for real-world robotics applications.'
        },
        {
            src: 'projects/Videos/3.mp4',
            title: 'Gesture Controlled Robot',
            description: 'Direct movement with intuitive hand gestures, blending motion-sensing tech and creative coding for interactive robotics fun.'
        },
        {
            src: 'projects/Videos/4.mp4',
            title: 'Zoetrope',
            description: 'Spin to life! A motorized display of images creating mesmerizing animation through rapid motion and persistence of vision.'
        },
        {
            src: 'projects/Videos/5.mp4',
            title: '3D Printed Solar Desk Lamp',
            description: 'Merge sustainability and design—crafted with 3D-printed parts and solar energy for eco-friendly, customizable lighting.'
        },
        {
            src: 'projects/Videos/6.mp4',
            title: 'OTTO Bot',
            description: 'Dance to ultrasonic beats! This lively robot grooves to proximity cues, combining ultrasonic sensors and servo motors for rhythmic entertainment.'
        },
        {
            src: 'projects/Videos/7.mp4',
            title: 'Electronic Guitar',
            description: 'Strum melodies on a DIY guitar programmed with PictoBlocks, turning code into music through touch-sensitive copper strips.'
        },
        {
            src: 'projects/Videos/8.mp4',
            title: 'Agriculture Automation',
            description: 'Monitor plant health with soil sensors; LEDs flash happy/sad faces, merging agri-tech with emotional feedback for smart gardening.'
        },
        {
            src: 'projects/Videos/9.mp4',
            title: 'Ganpati Decoration',
            description: 'Tech meets tradition—automate aarti rituals with robots and smart samais (lamps) for a modern twist on festive celebrations.'
        },
        {
            src: 'projects/Videos/10.mp4',
            title: 'Smart Bot',
            description: 'Light-guided or app-controlled, this bot navigates via LDR sensors or Bluetooth, ideal for learning app-based automation.'
        },
        {
            src: 'projects/Videos/11.mp4',
            title: 'Piano Keyboard',
            description: 'Play tunes on a paper-based piano with copper tape circuits—music, electronics, and creativity in one minimalist design.'
        },
        {
            src: 'projects/Videos/12.mp4',
            title: 'Ride Safety Innovation',
            description: 'Arduino-powered pressure plates slow vehicles if hands leave handlebars, promoting safer biking through smart automation.'
        },
        {
            src: 'projects/Videos/13.mp4',
            title: 'Maze Game',
            description: 'Train AI models to solve mazes! A machine learning-powered game where bots learn from errors, perfect for coding enthusiasts.'
        }
    ];
    let currentVideoIndex = 0;
    let isPlaying = false;
    let videosLoaded = 0;
    function initVideoCarousel() {
        while (videoCarousel.children.length > 1) {
            videoCarousel.removeChild(videoCarousel.firstChild);
        }
        videos.forEach((video, index) => {
            const videoElement = document.createElement('video');
            videoElement.src = video.src;
            videoElement.classList.add('carousel-video');
            videoElement.setAttribute('controlslist', 'nodownload');
            if (index === 0) videoElement.classList.add('active');
            videoElement.poster = 'projects/video-thumbnail.jpg';
            videoElement.addEventListener('timeupdate', updateProgress);
            videoElement.addEventListener('ended', () => {
                nextVideo();
            });
            videoElement.addEventListener('loadedmetadata', () => {
                videosLoaded++;
                if (index === 0) {
                    updateTotalTime(videoElement);
                    if (videoElement.readyState >= 3) {
                        autoplayVideo(videoElement);
                    } else {
                        videoElement.addEventListener('canplay', function onCanPlay() {
                            autoplayVideo(videoElement);
                            videoElement.removeEventListener('canplay', onCanPlay);
                        });
                    }
                }
                if (videosLoaded === videos.length) {
                    hideLoadingOverlay();
                }
            });
            videoElement.addEventListener('error', handleVideoError);
            videoCarousel.insertBefore(videoElement, loadingOverlay);
        });
        videos.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToVideo(index);
            });
            dotsContainer.appendChild(dot);
        });
        updateVideoInfo();
        setTimeout(hideLoadingOverlay, 10000);
    }
    function autoplayVideo(videoElement) {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                isPlaying = true;
            })
            .catch(error => {
                console.log('Autoplay prevented by browser:', error);
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                isPlaying = false;
            });
        }
    }
    function hideLoadingOverlay() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }
    function handleVideoError(e) {
        console.error('Video loading error:', e);
        const videoIndex = Array.from(videoCarousel.querySelectorAll('.carousel-video')).indexOf(e.target);
        console.log(`Error loading video ${videoIndex + 1}`);
        if (videoIndex === currentVideoIndex) {
            videoDescription.textContent = 'Error loading video. Please try again later.';
        }
        hideLoadingOverlay();
    }
    function updateVideoInfo() {
        videoTitle.textContent = videos[currentVideoIndex].title;
        videoDescription.textContent = videos[currentVideoIndex].description;
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            if (index === currentVideoIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    function goToVideo(index) {
        const videoElements = document.querySelectorAll('.carousel-video');
        videoElements[currentVideoIndex].pause();
        videoElements[currentVideoIndex].currentTime = 0;
        videoElements[currentVideoIndex].classList.remove('active');
        currentVideoIndex = index;
        videoElements[currentVideoIndex].classList.add('active');
        updateVideoInfo();
        updateTotalTime(videoElements[currentVideoIndex]);
        seekbarFill.style.width = '0%';
        currentTimeEl.textContent = formatTime(0);
        autoplayVideo(videoElements[currentVideoIndex]);
    }
    function nextVideo() {
        const newIndex = (currentVideoIndex + 1) % videos.length;
        goToVideo(newIndex);
    }
    function prevVideo() {
        const newIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
        goToVideo(newIndex);
    }
    function togglePlayPause() {
        const currentVideo = document.querySelectorAll('.carousel-video')[currentVideoIndex];
        if (isPlaying) {
            currentVideo.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        } else {
            if (currentVideo.readyState < 3) {
                loadingOverlay.classList.remove('hidden');
                const onPlaying = function() {
                    hideLoadingOverlay();
                    currentVideo.removeEventListener('playing', onPlaying);
                };
                currentVideo.addEventListener('playing', onPlaying);
                setTimeout(hideLoadingOverlay, 5000);
            }
            const playPromise = currentVideo.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Error playing video:', error);
                    playIcon.classList.remove('hidden');
                    pauseIcon.classList.add('hidden');
                    isPlaying = false;
                });
            }
        }
        isPlaying = !isPlaying;
    }
    function updateProgress() {
        const currentVideo = document.querySelectorAll('.carousel-video')[currentVideoIndex];
        if (currentVideo.duration) {
            const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
            seekbarFill.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(currentVideo.currentTime);
        }
    }
    function updateTotalTime(video) {
        if (video.duration && !isNaN(video.duration)) {
            totalTimeEl.textContent = formatTime(video.duration);
        } else {
            totalTimeEl.textContent = "0:00";
        }
    }
    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    function seek(e) {
        const currentVideo = document.querySelectorAll('.carousel-video')[currentVideoIndex];
        const seekPos = (e.offsetX / seekbar.offsetWidth);
        currentVideo.currentTime = seekPos * currentVideo.duration;
    }
    function toggleMute() {
        const videos = document.querySelectorAll('.carousel-video');
        const isMuted = videos[0].muted;
        videos.forEach(video => {
            video.muted = !isMuted;
        });
        if (isMuted) {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volumeFill.style.width = '100%';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeFill.style.width = '0%';
        }
    }
    function addEventListeners() {
        prevBtn.addEventListener('click', prevVideo);
        nextBtn.addEventListener('click', nextVideo);
        playPauseBtn.addEventListener('click', togglePlayPause);
        seekbar.addEventListener('click', seek);
        muteBtn.addEventListener('click', toggleMute);
        volumeSlider.addEventListener('click', adjustVolume);
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevVideo();
            } else if (e.key === 'ArrowRight') {
                nextVideo();
            } else if (e.key === ' ') {
                e.preventDefault();
                togglePlayPause();
            } else if (e.key === 'm') {
                toggleMute();
            } else if (e.key === 'f') {
                toggleFullscreen();
            }
        });
    }
    function adjustVolume(e) {
        const videos = document.querySelectorAll('.carousel-video');
        const volume = e.offsetX / volumeSlider.offsetWidth;
        videos.forEach(video => {
            video.volume = volume;
        });
        volumeFill.style.width = `${volume * 100}%`;
        if (volume === 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    function toggleFullscreen() {
        const videoContainer = document.querySelector('.video-carousel-container');
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
    initVideoCarousel();
    addEventListeners();
    console.log('Video carousel initialized. Please ensure videos are in the correct location: projects/Videos/');
});
