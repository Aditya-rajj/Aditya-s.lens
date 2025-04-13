document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('hidden');
    }, 800);

    // Theme Toggle
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

    // Sample Data
    const galleryImages = [
        { url: '1.jpg', alt: 'Nature Photography' },
        { url: '2.jpg', alt: 'Portrait Photography' },
        { url: '3.jpg', alt: 'Macro Photography' },
        { url: 'https://source.unsplash.com/random/600x600/?cinematic,1', alt: 'Cinematic Photography' },
        { url: 'https://source.unsplash.com/random/600x600/?landscape,1', alt: 'Landscape Photography' },
        { url: 'https://source.unsplash.com/random/600x600/?wildlife,1', alt: 'Wildlife Photography' },
        { url: 'https://source.unsplash.com/random/600x600/?city,1', alt: 'Urban Photography' },
        { url: 'https://source.unsplash.com/random/600x600/?abstract,1', alt: 'Abstract Photography' },
        { url: 'https://source.unsplash.com/random/600x600/?blackandwhite,1', alt: 'Black & White Photography' },
        { url: 'https://source.unsplash.com/random/600x600/?night,1', alt: 'Night Photography' }
    ];

    const albums = [
        { 
            title: 'Nature', 
            count: 24, 
            cover: 'https://source.unsplash.com/random/800x600/?nature,2' 
        },
        { 
            title: 'Portrait', 
            count: 18, 
            cover: 'https://source.unsplash.com/random/800x600/?portrait,2' 
        },
        { 
            title: 'Macro', 
            count: 15, 
            cover: 'https://source.unsplash.com/random/800x600/?macro,2' 
        },
        { 
            title: 'Cinematic', 
            count: 12, 
            cover: 'https://source.unsplash.com/random/800x600/?cinematic,2' 
        }
    ];

    // Render Gallery
    const galleryGrid = document.querySelector('.gallery-grid');
    galleryImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item fade-in';
        item.style.animationDelay = `${index * 0.1}s`;
        item.innerHTML = `
            <img src="${image.url}" alt="${image.alt}" loading="lazy">
        `;
        galleryGrid.appendChild(item);
    });

    // Render Albums
    const albumsGrid = document.querySelector('.albums-grid');
    albums.forEach((album, index) => {
        const card = document.createElement('div');
        card.className = 'album-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${album.cover}" alt="${album.title}" loading="lazy">
            <div class="album-info">
                <h3 class="album-title">${album.title}</h3>
                <span class="album-count">${album.count} photos</span>
            </div>
        `;
        albumsGrid.appendChild(card);
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

    // Image Viewer Functionality
    const imageViewer = document.getElementById('imageViewer');
    const viewedImage = document.getElementById('viewedImage');
    const closeBtn = document.getElementById('closeBtn');
    
    // Add click event to all gallery images and albums
    document.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-item img') || e.target.closest('.album-card')) {
            const img = e.target.closest('img');
            viewedImage.src = img.src;
            viewedImage.alt = img.alt;
            imageViewer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close viewer
    closeBtn.addEventListener('click', () => {
        imageViewer.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close viewer when clicking outside the image
    imageViewer.addEventListener('click', (e) => {
        if (e.target === imageViewer) {
            imageViewer.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close viewer with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageViewer.classList.contains('active')) {
            imageViewer.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Scroll Animation
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.animationPlayState = 'running';
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});