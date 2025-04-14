document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after content loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.querySelector('.loader-wrapper').classList.add('hidden');
        }, 500);
        
        // Initialize all images and videos
        initMediaLoading();
    });

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Section Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = {
        home: document.getElementById('homeGallery'),
        albums: document.getElementById('albumsGallery')
    };
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show the selected section
            const section = button.getAttribute('data-section');
            Object.values(sections).forEach(sec => sec.classList.remove('active-section'));
            sections[section].classList.add('active-section');
        });
    });

    // Initialize media loading for all images and videos
    function initMediaLoading() {
        document.querySelectorAll('img, video').forEach(media => {
            const container = media.closest('.gallery-item, .album-card, .viewer-content, .video-modal-content');
            if (container) {
                const loader = container.querySelector('.media-loader');
                if (loader) {
                    loader.style.display = 'flex';
                }
                
                // If already loaded
                if (media.complete || media.readyState > 3) {
                    if (loader) loader.style.display = 'none';
                    media.style.filter = 'blur(0)';
                } else {
                    media.style.filter = 'blur(10px)';
                    media.addEventListener('load', function() {
                        if (loader) loader.style.display = 'none';
                        this.style.filter = 'blur(0)';
                    });
                    media.addEventListener('loadeddata', function() {
                        if (loader) loader.style.display = 'none';
                        this.style.filter = 'blur(0)';
                    });
                }
            }
        });
    }

    // Media Viewer Functionality
    const imageViewer = document.getElementById('imageViewer');
    const viewedImage = document.getElementById('viewedImage');
    const imageTitle = document.getElementById('imageTitle');
    const imageDesc = document.getElementById('imageDesc');
    const closeBtn = document.getElementById('closeBtn');
    
    // Video Modal Elements
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoTitle = document.getElementById('videoTitle');
    const videoCloseBtn = document.getElementById('videoCloseBtn');
    
    // Add click event to all gallery items
    document.addEventListener('click', function(e) {
        // Handle image clicks
        if (e.target.closest('.gallery-item:not(.video-item)')) {
            const imgElement = e.target.closest('.gallery-item img');
            const loader = imageViewer.querySelector('.media-loader');
            loader.style.display = 'flex';
            viewedImage.style.filter = 'blur(10px)';
            
            viewedImage.onload = function() {
                loader.style.display = 'none';
                this.style.filter = 'blur(0)';
            };
            
            viewedImage.src = imgElement.src;
            viewedImage.alt = imgElement.alt;
            
            imageTitle.textContent = imgElement.alt;
            imageDesc.textContent = "From the Gallery collection";
            
            imageViewer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        // Handle video clicks
        else if (e.target.closest('.video-item') || e.target.closest('.play-button')) {
            const videoItem = e.target.closest('.video-item');
            const videoSource = videoItem.querySelector('source').src;
            const videoPoster = videoItem.querySelector('video').poster;
            const loader = videoModal.querySelector('.media-loader');
            loader.style.display = 'flex';
            
            modalVideo.onloadeddata = function() {
                loader.style.display = 'none';
                this.style.filter = 'blur(0)';
            };
            
            modalVideo.src = videoSource;
            modalVideo.poster = videoPoster;
            videoTitle.textContent = videoItem.querySelector('video').alt || "Video";
            
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Play video when modal opens
            setTimeout(() => {
                modalVideo.play();
            }, 300);
        }
        // Handle album clicks
        else if (e.target.closest('.album-card')) {
            // You can replace this with actual album page navigation
            console.log("Album clicked - would navigate to album page");
        }
    });
    
    // Close image viewer
    closeBtn.addEventListener('click', () => {
        imageViewer.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close video modal
    videoCloseBtn.addEventListener('click', () => {
        videoModal.classList.remove('active');
        modalVideo.pause();
        document.body.style.overflow = 'auto';
    });
    
    // Close viewers when clicking outside
    imageViewer.addEventListener('click', (e) => {
        if (e.target === imageViewer) {
            imageViewer.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.classList.remove('active');
            modalVideo.pause();
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (imageViewer.classList.contains('active')) {
                imageViewer.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (videoModal.classList.contains('active')) {
                videoModal.classList.remove('active');
                modalVideo.pause();
                document.body.style.overflow = 'auto';
            }
        }
    });

    // Infinite Scroll Functionality
    const galleryGrid = document.querySelector('.gallery-grid');
    let isLoading = false;
    const itemsPerPage = 10;
    let currentPage = 1;
    
    function loadMoreItems() {
        if (isLoading) return;
        
        isLoading = true;
        
        // Calculate which items to show
        const allHiddenItems = Array.from(document.querySelectorAll('.gallery-item.hidden'));
        
        if (allHiddenItems.length === 0) {
            isLoading = false;
            return; // No more items to load
        }
        
        const itemsToShow = allHiddenItems.slice(0, itemsPerPage);
        
        // Show the items
        itemsToShow.forEach(item => {
            item.classList.remove('hidden');
            
            // Initialize loading for newly shown items
            const media = item.querySelector('img, video');
            if (media) {
                const loader = item.querySelector('.media-loader');
                if (loader) loader.style.display = 'flex';
                media.style.filter = 'blur(10px)';
                
                if (media.complete || media.readyState > 3) {
                    if (loader) loader.style.display = 'none';
                    media.style.filter = 'blur(0)';
                } else {
                    media.addEventListener('load', function() {
                        if (loader) loader.style.display = 'none';
                        this.style.filter = 'blur(0)';
                    });
                    media.addEventListener('loadeddata', function() {
                        if (loader) loader.style.display = 'none';
                        this.style.filter = 'blur(0)';
                    });
                }
            }
        });
        
        // Trigger animations for new items
        setTimeout(() => {
            animateOnScroll();
        }, 100);
        
        currentPage++;
        isLoading = false;
    }
    
    // Check if user has scrolled to bottom
    function checkScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
            loadMoreItems();
        }
    }
    
    // Scroll Animation
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.gallery-item, .album-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.animationPlayState = 'running';
            }
        });
    };
    
    // Initial load
    loadMoreItems();
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', () => {
        animateOnScroll();
        checkScroll();
    });
});