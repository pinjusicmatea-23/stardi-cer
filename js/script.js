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
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
        header.style.backdropFilter = 'blur(20px)';
        header.querySelector('.logo h1').style.color = '#f8f8f8';
        header.querySelectorAll('.menu-line').forEach(line => {
            line.style.backgroundColor = '#f8f8f8';
        });
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
        
        if (inMainHero) {
            // Back to transparent home state
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = 'none';
            header.querySelector('.logo h1').style.color = '#f8f8f8';
            header.querySelectorAll('.menu-line').forEach(line => {
                line.style.backgroundColor = '#f8f8f8';
            });
        } else {
            // Back to white state with black text
            header.style.backgroundColor = 'rgba(248, 248, 248, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
            header.querySelector('.logo h1').style.color = '#2c2c2c';
            header.querySelectorAll('.menu-line').forEach(line => {
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
    
    // Update local time
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
    
    // Initialize scroll-based animations
    initScrollAnimations();
    
    // Add scroll event listener for header behavior
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
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
        
        // If in main hero section - transparent header with white text
        if (inMainHero) {
            header.style.transform = 'translateY(0)';
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = 'none';
            header.querySelector('.logo h1').style.color = '#f8f8f8';
            header.querySelectorAll('.menu-line').forEach(line => {
                line.style.backgroundColor = '#f8f8f8';
            });
        }
        // Everywhere else - always black text with white background
        else {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            }
            else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
                // Scrolling up or at top - show header with white background and black text
                header.style.transform = 'translateY(0)';
                header.style.backgroundColor = 'rgba(248, 248, 248, 0.98)';
                header.style.backdropFilter = 'blur(15px)';
                header.querySelector('.logo h1').style.color = '#2c2c2c';
                header.querySelectorAll('.menu-line').forEach(line => {
                    line.style.backgroundColor = '#2c2c2c';
                });
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Add active navigation highlighting
    highlightActiveNavigation();
});

// Update local time function
function updateLocalTime() {
    const timeElement = document.getElementById('local-time');
    if (timeElement) {
        const now = new Date();
        const formattedTime = now.getFullYear() + '-' + 
            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
            String(now.getDate()).padStart(2, '0') + ' ' + 
            String(now.getHours()).padStart(2, '0') + ':' + 
            String(now.getMinutes()).padStart(2, '0') + ':' + 
            String(now.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = formattedTime;
    }
}

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
    const animatedElements = document.querySelectorAll('.philosophy-content, .way-content, .category, .dialogue-content, .waiting-content');
    
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

// Add CSS for active navigation state
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

// Add loading states
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in-up');
    }
});

// Mobile menu functionality (if needed in future)
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('mobile-open');
}

// Contact form handling (if form is added later)
function handleContactForm(formData) {
    // This would handle form submission
    console.log('Contact form submitted:', formData);
}

// Image lazy loading for better performance
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if there are lazy images
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background-color: #2c2c2c;
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
addScrollProgress();

// Shop horizontal slider
function initShopSlider() {
    const slides = document.querySelectorAll('.shop-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!slides.length) return;
    
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
        prevBtn.style.opacity = '1';
        nextBtn.style.opacity = '1';
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
    
    function goToSlide(index) {
        if (index >= 0 && index < slides.length && !isTransitioning) {
            isTransitioning = true;
            currentSlide = index;
            updateSlider();
            setTimeout(() => {
                isTransitioning = false;
            }, 800);
        }
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const shopSection = document.querySelector('.shop');
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
    
    // Learn More button handlers
    const learnMoreBtns = document.querySelectorAll('.learn-more-btn');
    learnMoreBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const categories = ['CUPS&SAUCERS', 'HAND BUILDING', 'BOWLS', 'TEAPOTS'];
            alert(`Opening ${categories[currentSlide]} gallery - coming soon!`);
        });
    });
    
    // Initialize
    updateSlider();
}

// Initialize shop slider
initShopSlider();

// About section slider
function initAboutSlider() {
    const slides = document.querySelectorAll('.about-slide');
    const prevBtn = document.querySelector('.about-slider-container .slider-prev');
    const nextBtn = document.querySelector('.about-slider-container .slider-next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
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
            }, 500);
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
            }, 500);
        }
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation for about section
    document.addEventListener('keydown', function(e) {
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;
        
        const rect = aboutSection.getBoundingClientRect();
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
    
    // Touch support for about slider
    const aboutSlider = document.querySelector('.about-slider');
    if (aboutSlider) {
        aboutSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        });
        
        aboutSlider.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchDiff = touchStartX - touchEndX;
            
            if (Math.abs(touchDiff) > 50) {
                if (touchDiff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });
    }
    
    // Initialize
    updateSlider();
}

// Initialize about slider
initAboutSlider();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(function() {
    highlightActiveNavigation();
}, 10);

window.removeEventListener('scroll', highlightActiveNavigation);
window.addEventListener('scroll', debouncedScrollHandler);

// Gallery Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    const modalCurrent = document.getElementById('modal-current');
    const modalTotal = document.getElementById('modal-total');
    
    let currentIndex = 0;
    
    // Gallery data
    const galleryData = [
        { type: 'image', src: 'images/inspirations/IMG_7791.JPG', alt: 'Ceramic inspiration' },
        { type: 'image', src: 'images/inspirations/IMG_7911.JPG', alt: 'Ceramic inspiration' },
        { type: 'image', src: 'images/inspirations/IMG_7945.JPG', alt: 'Ceramic inspiration' },
        { type: 'image', src: 'images/inspirations/IMG_7963.JPG', alt: 'Ceramic inspiration' },
        { type: 'image', src: 'images/inspirations/IMG_7966.JPG', alt: 'Ceramic inspiration' },
        { type: 'image', src: 'images/inspirations/IMG_7970.JPG', alt: 'Ceramic inspiration' }
    ];
    
    // Check if modal elements exist
    if (!modal) return;
    
    // Update modal total
    modalTotal.textContent = galleryData.length;
    
    // Open modal
    function openModal(index) {
        currentIndex = index;
        showMedia(currentIndex);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Pause video if playing
        if (modalVideo && !modalVideo.paused) {
            modalVideo.pause();
        }
    }
    
    // Show media at current index
    function showMedia(index) {
        const item = galleryData[index];
        modalCurrent.textContent = index + 1;
        
        if (item.type === 'image') {
            modalImage.src = item.src;
            modalImage.alt = item.alt;
            modalImage.style.display = 'block';
            modalVideo.style.display = 'none';
            if (modalVideo) modalVideo.pause();
        } else if (item.type === 'video') {
            const videoSource = modalVideo.querySelector('source');
            videoSource.src = item.src;
            modalVideo.load();
            modalVideo.style.display = 'block';
            modalImage.style.display = 'none';
        }
    }
    
    // Navigate to previous item
    function showPrevious() {
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        showMedia(currentIndex);
    }
    
    // Navigate to next item
    function showNext() {
        currentIndex = (currentIndex + 1) % galleryData.length;
        showMedia(currentIndex);
    }
    
    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalPrev) modalPrev.addEventListener('click', showPrevious);
    if (modalNext) modalNext.addEventListener('click', showNext);
    
    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showPrevious();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });
});

// Video Reverse Looping for Hero Sections
document.addEventListener('DOMContentLoaded', function() {
    const heroVideos = document.querySelectorAll('.video-background video');
    
    heroVideos.forEach(video => {
        let isPlayingForward = true;
        let reverseInterval;
        
        video.addEventListener('loadedmetadata', function() {
            // Start playing forward
            video.currentTime = 0;
            isPlayingForward = true;
        });
        
        video.addEventListener('timeupdate', function() {
            // When video reaches the end, start manual reverse playback
            if (isPlayingForward && video.currentTime >= video.duration - 0.1) {
                startReversePlayback();
            }
        });
        
        function startReversePlayback() {
            isPlayingForward = false;
            video.pause();
            
            // Clear any existing interval
            if (reverseInterval) {
                clearInterval(reverseInterval);
            }
            
            // Manually step backward through frames
            reverseInterval = setInterval(() => {
                if (video.currentTime <= 0.1) {
                    // Reached the beginning, start forward playback again
                    clearInterval(reverseInterval);
                    isPlayingForward = true;
                    video.currentTime = 0;
                    video.play();
                } else {
                    // Step backward (adjust step size for smoother/faster reverse)
                    video.currentTime -= 0.05; // 50ms steps backward
                }
            }, 33); // ~30fps for smooth reverse playback
        }
        
        // Handle the ended event as a fallback
        video.addEventListener('ended', function() {
            if (isPlayingForward) {
                startReversePlayback();
            }
        });
        
        // Clean up interval when video is paused or removed
        video.addEventListener('pause', function() {
            if (reverseInterval) {
                clearInterval(reverseInterval);
            }
            // Don't auto-restart during reverse playback
            if (isPlayingForward) {
                setTimeout(() => {
                    if (video.paused && isPlayingForward) {
                        video.play();
                    }
                }, 100);
            }
        });
    });
});

// Text Animation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.animate-text');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.classList.add('in-view');
                entry.target.style.animation = 'fadeInUp 1s ease forwards';
                
                // Optional: Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: '0px 0px -100px 0px' // Start animation 100px before element enters viewport
    });
    
    // Start observing all animate elements
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Fallback scroll listener for better compatibility
    function checkScroll() {
        animateElements.forEach(element => {
            if (!element.classList.contains('in-view')) {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('in-view');
                    element.style.animation = 'fadeInUp 1s ease forwards';
                }
            }
        });
    }
    
    // Add scroll event listener as backup
    window.addEventListener('scroll', checkScroll);
    
    // Check on load in case elements are already in view
    checkScroll();
});