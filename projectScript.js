function showImage(src, element) {
                // Show image container
                document.querySelector('.main-image-container').classList.add('active-media');
                document.querySelector('.video-container').classList.remove('active-media');
                
                // Update main image
                document.getElementById('main-image').src = src;
                
                // Pause and reset any playing video
                const video = document.getElementById('main-video');
                video.pause();
                video.currentTime = 0;
                video.removeAttribute('src');
                video.load();
                
                // Update active thumbnail
                updateActiveThumbnail(element);
            }

            function showVideo(src, element) {
                // Show video container
                document.querySelector('.main-image-container').classList.remove('active-media');
                document.querySelector('.video-container').classList.add('active-media');
                
                // Load and play video
                const video = document.getElementById('main-video');
                video.src = src;
                video.load();
                video.play().catch(e => console.log("Autoplay prevented:", e));
                
                // Update active thumbnail
                updateActiveThumbnail(element);
            }

            function updateActiveThumbnail(element) {
                // Remove active class from all thumbnails
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                    thumb.setAttribute('aria-selected', 'false');
                });
                
                // Add active class to clicked thumbnail
                element.classList.add('active');
                element.setAttribute('aria-selected', 'true');
            }

// Mobile menu functionality
    document.addEventListener('DOMContentLoaded', () => {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const primaryNav = document.querySelector('#primary-navigation');
        
        // Initialize
        primaryNav.setAttribute('data-visible', 'false');
        
        mobileMenuToggle.addEventListener('click', () => {
            const visibility = primaryNav.getAttribute('data-visible');
            
            if (visibility === "false") {
                primaryNav.setAttribute('data-visible', "true");
                mobileMenuToggle.setAttribute('aria-expanded', "true");
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                primaryNav.setAttribute('data-visible', "false");
                mobileMenuToggle.setAttribute('aria-expanded', "false");
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
        
        // Close menu when clicking on a link (for single page applications)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                primaryNav.setAttribute('data-visible', "false");
                mobileMenuToggle.setAttribute('aria-expanded', "false");
                document.body.style.overflow = '';
            });
        });
    });

    // JavaScript for handling the media gallery
            function showImage(imageSrc, button) {
                // Update main image
                const mainImage = document.getElementById('main-image');
                mainImage.src = imageSrc;
                
                // Show image container, hide video container
                document.querySelector('.main-image-container').classList.add('active-media');
                document.querySelector('.video-container').classList.remove('active-media');
                
                // Update active thumbnail
                updateActiveThumbnail(button);
            }
            
            function showYouTubeVideo(videoId, button) {
                // Update YouTube iframe source
                const iframe = document.querySelector('#youtube-video');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
                
                // Show video container, hide image container
                document.querySelector('.video-container').classList.add('active-media');
                document.querySelector('.main-image-container').classList.remove('active-media');
                
                // Update active thumbnail
                updateActiveThumbnail(button);
            }
            
            function updateActiveThumbnail(activeButton) {
                // Remove active class from all thumbnails
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                    thumb.setAttribute('aria-selected', 'false');
                });
                
                // Add active class to clicked thumbnail
                activeButton.classList.add('active');
                activeButton.setAttribute('aria-selected', 'true');
            }