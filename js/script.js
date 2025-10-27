// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu Functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // Toggle menu (open/close)
    menuToggle.addEventListener('click', function() {
        if (menuToggle.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    function openMenu() {
        menuToggle.classList.add('active');
        navOverlay.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Make header black when menu is open
        const header = document.querySelector('.main-header');
        if (header) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            
            // Handle logo - check if it exists and has img
            const logoImg = header.querySelector('.logo img');
            if (logoImg) {
                logoImg.style.opacity = '0.9';
            }
            
            // Handle menu lines
            const menuLines = header.querySelectorAll('.menu-line');
            menuLines.forEach(line => {
                line.style.backgroundColor = '#f8f8f8';
            });
        }
    }

    // Close menu when clicking on overlay
    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) {
            closeMenu();
        }
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    function closeMenu() {
        menuToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
        
        // Restore header state based on current position
        const header = document.querySelector('.main-header');
        if (!header) return;
        
        const currentScrollY = window.scrollY;
        
        // Check if we're in the main home hero section
        const mainHero = document.querySelector('.hero');
        let inMainHero = false;
        
        if (mainHero) {
            const sectionTop = mainHero.offsetTop;
            const sectionBottom = sectionTop + mainHero.offsetHeight;
            if (currentScrollY >= sectionTop && currentScrollY < sectionBottom) {
                inMainHero = true;
            }
        }
        
        const logoImg = header.querySelector('.logo img');
        const menuLines = header.querySelectorAll('.menu-line');
        
        if (inMainHero) {
            // Back to transparent home state
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = 'none';
            if (logoImg) logoImg.style.opacity = '1';
            menuLines.forEach(line => {
                line.style.backgroundColor = '#f8f8f8';
            });
        } else {
            // Back to white state with black text
            header.style.backgroundColor = 'rgba(248, 248, 248, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
            if (logoImg) logoImg.style.opacity = '1';
            menuLines.forEach(line => {
                line.style.backgroundColor = '#2c2c2c';
            });
        }
    }

    // Logo click to return home
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Close menu if it's open
            if (navOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
        // Add cursor pointer style to logo
        logo.style.cursor = 'pointer';
    }

    // Language Toggle Functionality
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('selectedLanguage') || 'en';

    // Set initial language
    setLanguage(currentLang);

    // Add click event listeners to language buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            setLanguage(selectedLang);
            localStorage.setItem('selectedLanguage', selectedLang);
        });
    });

    function setLanguage(lang) {
        currentLang = lang;
        
        // Update button states
        langBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-en][data-hr]');
        translatableElements.forEach(element => {
            const translation = element.getAttribute(`data-${lang}`);
            if (translation) {
                // Check if this is a navigation link with animation structure
                if (element.classList.contains('nav-text-inner') || element.classList.contains('nav-text-clone')) {
                    element.textContent = translation;
                } else if (element.classList.contains('cta-text-inner') || element.classList.contains('cta-text-clone')) {
                    element.textContent = translation;
                } else if (element.classList.contains('nav-link')) {
                    // Update both inner and clone text for nav links
                    const innerText = element.querySelector('.nav-text-inner');
                    const cloneText = element.querySelector('.nav-text-clone');
                    if (innerText) innerText.textContent = translation;
                    if (cloneText) cloneText.textContent = translation;
                } else if (element.classList.contains('cta-button')) {
                    // Update both inner and clone text for CTA buttons
                    const innerText = element.querySelector('.cta-text-inner');
                    const cloneText = element.querySelector('.cta-text-clone');
                    if (innerText) innerText.textContent = translation;
                    if (cloneText) cloneText.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update page language attribute
        document.documentElement.lang = lang === 'hr' ? 'hr' : 'en';
    }

    // Get all navigation links for smooth scrolling
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listeners for smooth scrolling
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Check if target section has a hero (full-screen sections)
                const hasHero = targetSection.querySelector('.section-hero') || targetSection.classList.contains('hero');
                
                let targetPosition;
                if (hasHero) {
                    // For full-screen hero sections, scroll to exact top
                    targetPosition = targetSection.offsetTop;
                } else {
                    // For regular sections, account for header
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    targetPosition = targetSection.offsetTop - headerHeight - 20;
                }
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Local time functionality removed - replaced with static address/hours
    
    // Initialize scroll-based animations
    initScrollAnimations();
    
    // Make sure philosophy section is visible
    ensurePhilosophySectionVisible();
    
    // Initialize inspirations gallery
    initInspirationGallery();
    
    // Initialize shop functionality AFTER DOM is ready
    setTimeout(() => {
        initShopSlider();
        initAboutSlider();
        // Gallery functionality handled by simple-gallery.js
    }, 100);
    
    // Add scroll event listener for header behavior
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (!header) return; // Safety check
        
        const currentScrollY = window.scrollY;
        
        // Check if we're in the main home hero section only
        const mainHero = document.querySelector('.hero');
        let inMainHero = false;
        
        if (mainHero) {
            const sectionTop = mainHero.offsetTop;
            const sectionBottom = sectionTop + mainHero.offsetHeight;
            if (currentScrollY >= sectionTop && currentScrollY < sectionBottom) {
                inMainHero = true;
            }
        }
        
        // Always transparent header when scrolling
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide header
            console.log('Hiding header - scrolling down');
            header.style.transform = 'translateY(-100%)';
        }
        else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
            // Scrolling up or at top - show header with transparent background
            console.log('Showing header - scrolling up or at top');
            header.style.transform = 'translateY(0)';
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = 'none';
            
            // Just handle logo opacity, don't change hamburger colors
            const logoImg = header.querySelector('.logo img');
            
            if (logoImg) logoImg.style.opacity = '1';
            
            // Don't change hamburger menu colors - let them stay the default brand color
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Add active navigation highlighting
    highlightActiveNavigation();
});

// Local time function removed - replaced with static address and working hours

// Scroll-based animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add animation to elements
    const animatedElements = document.querySelectorAll('.card-item, .philosophy-content, .way-content, .category, .dialogue-content, .waiting-content');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Highlight active navigation
function highlightActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .footer-link');
    
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Call once to set initial state
}

// Shop horizontal slider
function initShopSlider() {
    console.log('Initializing shop slider...');
    const slides = document.querySelectorAll('.shop-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    console.log('Found slides:', slides.length, 'Prev btn:', !!prevBtn, 'Next btn:', !!nextBtn);
    
    if (!slides.length) {
        console.warn('No shop slides found!');
        return;
    }
    
    let currentSlide = 0;
    
    function updateSlider() {
        // Clear any inline styles and update slides with proper state management
        slides.forEach((slide, index) => {
            slide.style.transform = '';
            slide.style.opacity = '';
            slide.style.visibility = '';
            slide.classList.remove('active', 'prev', 'next');
            
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                // Handle circular logic for proper slide directions
                const isLoopingForward = currentSlide === 0 && index === slides.length - 1;
                const isLoopingBackward = currentSlide === slides.length - 1 && index === 0;
                
                if (isLoopingForward) {
                    // When CUPS is active, WAVES should be positioned as "prev" (left side for left arrow)
                    slide.classList.add('prev');
                } else if (isLoopingBackward) {
                    // When WAVES is active, CUPS should be positioned as "next" (right side for right arrow)
                    slide.classList.add('next');
                } else if (index < currentSlide) {
                    slide.classList.add('prev');
                } else {
                    slide.classList.add('next');
                }
            }
        });
        
        // Arrows are always active since we have infinite loop
        if (prevBtn) prevBtn.style.opacity = '1';
        if (nextBtn) nextBtn.style.opacity = '1';
    }
    
    let isTransitioning = false;
    
    function nextSlide() {
        if (!isTransitioning) {
            isTransitioning = true;
            const nextIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
            currentSlide = nextIndex;
            updateSlider();
            setTimeout(() => {
                isTransitioning = false;
            }, 800);
        }
    }
    
    function prevSlide() {
        if (!isTransitioning) {
            isTransitioning = true;
            const prevIndex = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
            currentSlide = prevIndex;
            updateSlider();
            setTimeout(() => {
                isTransitioning = false;
            }, 800);
        }
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const shopSection = document.querySelector('.shop');
        if (!shopSection) return;
        
        const rect = shopSection.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
        
        if (!isVisible) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let startY = 0;
    
    const shopSlider = document.querySelector('.shop-slider');
    
    if (shopSlider) {
        shopSlider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        shopSlider.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only respond to horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    // Initialize
    updateSlider();
    console.log('Shop slider initialized successfully');
}

// About slider functionality
function initAboutSlider() {
    console.log('Initializing about slider...');
    const aboutSlides = document.querySelectorAll('.about-slide');
    const aboutPrevBtn = document.querySelector('.about-slider-container .slider-prev');
    const aboutNextBtn = document.querySelector('.about-slider-container .slider-next');
    
    console.log('Found about slides:', aboutSlides.length, 'Prev btn:', !!aboutPrevBtn, 'Next btn:', !!aboutNextBtn);
    
    if (!aboutSlides.length || !aboutPrevBtn || !aboutNextBtn) {
        console.warn('About slider elements not found!');
        return;
    }
    
    let currentAboutSlide = 0;
    
    function updateAboutSlider() {
        aboutSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            
            if (index === currentAboutSlide) {
                slide.classList.add('active');
                
                // Clear any inline styles to let CSS handle display
                slide.style.display = '';
                slide.style.opacity = '';
                slide.style.visibility = '';
                slide.style.background = '';
            }
        });
    }
    
    // Previous slide
    aboutPrevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('About prev clicked');
        currentAboutSlide = currentAboutSlide === 0 ? aboutSlides.length - 1 : currentAboutSlide - 1;
        updateAboutSlider();
    });
    
    // Next slide
    aboutNextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('About next clicked');
        currentAboutSlide = currentAboutSlide === aboutSlides.length - 1 ? 0 : currentAboutSlide + 1;
        updateAboutSlider();
    });
    
    // Initialize
    updateAboutSlider();
    console.log('About slider initialized successfully');
}

// Shop category functionality removed - handled by simple-gallery.js

// Ensure Philosophy Section is Visible
function ensurePhilosophySectionVisible() {
    const philosophySection = document.querySelector('.philosophy-cards');
    if (philosophySection) {
        console.log('Philosophy section found:', philosophySection);
        
        // Make sure it's visible
        philosophySection.style.display = 'flex';
        philosophySection.style.visibility = 'visible';
        philosophySection.style.opacity = '1';
        
        // Check if content exists
        const cardContent = philosophySection.querySelector('.card-content');
        if (cardContent) {
            console.log('Card content found:', cardContent);
            cardContent.style.display = 'flex';
            cardContent.style.visibility = 'visible';
        } else {
            console.error('Card content not found!');
        }
        
        // Check if text exists
        const textElements = philosophySection.querySelectorAll('p');
        console.log('Text elements found:', textElements.length);
        textElements.forEach((p, i) => {
            console.log(`Text ${i}:`, p.textContent.substring(0, 50) + '...');
        });
    } else {
        console.error('Philosophy section not found!');
    }
}

// Inspirations Gallery Functionality
// Global flag to prevent multiple initializations
let inspirationGalleryInitialized = false;

function initInspirationGallery() {
    if (inspirationGalleryInitialized) return;
    inspirationGalleryInitialized = true;
    
    // Get gallery items from inspirations section
    const inspirationsSection = document.querySelector('#inspirations, .inspirations-section');
    if (!inspirationsSection) return;

    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    const modalCurrent = document.getElementById('modal-current');
    const modalTotal = document.getElementById('modal-total');
    
    if (!modal || !modalImage || !modalClose) return;

    // All inspiration images - starting with the HTML order, then adding the rest
    const allImages = [
        // First 12 match the HTML layout order (indices 0-11)
        'IMG_7874.JPG',   // index 0 - main featured image
        'IMG_7780.JPG',   // index 1
        'IMG_7794e.jpg',  // index 2  
        'IMG_7799e.jpg',  // index 3
        'IMG_7804.JPG',   // index 4
        'IMG_7845.JPG',   // index 5
        'IMG_7850.JPG',   // index 6
        'IMG_7818.JPG',   // index 7
        'IMG_7820.JPG',   // index 8
        'IMG_7822.JPG',   // index 9
        'IMG_7825.JPG',   // index 10
        'IMG_7828.JPG',   // index 11
        // Additional images (indices 12+)
        'IMG_7833.JPG', 'IMG_7835.JPG', 'IMG_7855.JPG', 'IMG_7859.JPG', 'IMG_7860e.jpg',
        'IMG_7866.JPG', 'IMG_7870.JPG', 'IMG_7876e.jpg', 'IMG_7887.JPG', 'IMG_7889.JPG',
        'IMG_7902.JPG', 'IMG_7909.JPG', 'IMG_7911.JPG', 'IMG_7912.JPG', 'IMG_7929.JPG',
        'IMG_7931.JPG', 'IMG_7933.JPG', 'IMG_7945e.jpg', 'IMG_7946.JPG', 'IMG_7953e.jpg',
        'IMG_7958e.jpg', 'IMG_7959e.jpg', 'IMG_7963e.jpg', 'IMG_7966.JPG', 'IMG_7970e.jpg',
        'IMG_7975.JPG', 'IMG_7979.JPG', 'IMG_7980.JPG', 'IMG_7993.JPG'
    ];
    
    // Now get the existing gallery items (12 hardcoded ones)
    const galleryItems = inspirationsSection.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;
    
    let currentIndex = 0;
    
    // Build media array from ALL images, not just the hardcoded ones
    const media = allImages.map(imageName => ({
        type: 'image',
        src: `images/inspirations/${imageName}`,
        alt: 'Ceramic inspiration'
    }));
    
    // Set total count
    modalTotal.textContent = media.length;
    
    // Add click handlers to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                currentIndex = index;
                showModal();
            } catch (error) {
                console.error('Error opening gallery:', error);
            }
        });
        
        // Add hover effect
        item.style.cursor = 'pointer';
        item.style.transition = 'transform 0.3s ease';
        
        item.addEventListener('mouseenter', function() {
            item.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            item.style.transform = 'scale(1)';
        });
    });
    
    function showModal() {
        try {
            const currentMedia = media[currentIndex];
            if (!currentMedia) return;
            
            // Update counter
            if (modalCurrent) modalCurrent.textContent = currentIndex + 1;
            
            // Show image
            if (modalImage) {
                modalImage.src = currentMedia.src;
                modalImage.alt = currentMedia.alt;
                modalImage.style.display = 'block';
            }
            if (modalVideo) {
                modalVideo.style.display = 'none';
            }
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('Error in showModal:', error);
        }
    }
    
    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function navigateImage(direction) {
        currentIndex += direction;
        
        if (currentIndex >= media.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = media.length - 1;
        }
        
        showModal();
    }
    
    // Event listeners
    modalClose.addEventListener('click', hideModal);
    modalPrev.addEventListener('click', () => navigateImage(-1));
    modalNext.addEventListener('click', () => navigateImage(1));
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display !== 'flex') return;
        
        if (e.key === 'Escape') {
            hideModal();
        } else if (e.key === 'ArrowLeft') {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight') {
            navigateImage(1);
        }
    });
}

// Initialize additional functionality
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in-up');
    }
});

// Add CSS for active navigation state and animations
const style = document.createElement('style');
style.textContent = `
    .nav-link.active,
    .footer-link.active {
        color: #666;
    }
    
    .nav-link.active::after,
    .footer-link.active::after {
        width: 100%;
    }
    
    /* Hover effects for images */
    .category-image img {
        transition: transform 0.3s ease, filter 0.3s ease;
    }
    
    .category-image:hover img {
        transform: scale(1.02);
        filter: brightness(1.1);
    }
    
    /* Loading animation */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    /* Scroll indicator animation */
    .scroll-indicator {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.6;
        }
    }
`;
document.head.appendChild(style);