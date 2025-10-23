// Curtain Gallery System for Product Categories
class CurtainGallery {
    constructor() {
        this.products = [];
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.currentCategory = null;
        this.isGalleryOpen = false;
        this.init();
    }

    async init() {
        console.log('Initializing CurtainGallery...');
        await this.loadProducts();
        console.log('Products loaded:', this.products.length);
        this.createCurtainHTML();
        console.log('Curtain HTML created');
        this.bindEvents();
        console.log('Events bound');
        this.initEmailJS();
        console.log('EmailJS initialized');
    }

    initEmailJS() {
        // Initialize EmailJS
        emailjs.init("MxXGVxOPREHvMstth"); // Your public key
    }

    async loadProducts() {
        try {
            const response = await fetch('sheets/cijene - sheet1.csv');
            const text = await response.text();
            this.products = this.parseCSV(text);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    parseCSV(text) {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');
        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const product = {};
            
            headers.forEach((header, index) => {
                product[header.trim()] = values[index]?.trim() || '';
            });
            
            products.push(product);
        }
        
        return products;
    }

    createCurtainHTML() {
        const curtainHTML = `
            <div id="curtain-gallery" class="curtain-gallery">
                <div class="curtain-overlay"></div>
                <div class="curtain-container">
                    <div class="curtain-header">
                        <h1 class="curtain-title"></h1>
                        <button class="curtain-close">&times;</button>
                    </div>
                    <div class="curtain-content">
                        <div class="products-scroll-container">
                            <div class="products-grid" id="products-grid">
                                <!-- Products will be inserted here -->
                            </div>
                        </div>
                        <div class="scroll-indicator" id="scroll-indicator">
                            <div class="scroll-dots" id="scroll-dots"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', curtainHTML);
    }

    bindEvents() {
        // Bind clicks to product images (not Learn More buttons)
        document.addEventListener('click', (e) => {
            console.log('Click detected on:', e.target);
            const productImage = e.target.closest('.product-image');
            if (productImage) {
                console.log('Product image clicked');
                e.preventDefault();
                const slide = productImage.closest('.shop-slide');
                const category = slide.getAttribute('data-category');
                console.log('Category found:', category);
                this.openCurtain(category);
            }
        });

        // Close curtain events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('curtain-close') || 
                e.target.classList.contains('curtain-overlay')) {
                this.closeCurtain();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isGalleryOpen) {
                this.closeCurtain();
            }
        });

        // Listen for language changes
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                setTimeout(() => {
                    this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
                    if (this.isGalleryOpen) {
                        this.updateCurtainContent();
                    }
                }, 100);
            }
        });
    }

    openCurtain(category) {
        console.log('Opening curtain for category:', category);
        this.currentCategory = category;
        this.isGalleryOpen = true;
        
        // Map category names
        const categoryMap = {
            'cups': 'cups',
            'plates': 'plates', 
            'bowls': 'bowls',
            'waves': 'waves',
            'candles': 'candle holders'
        };
        
        const csvCategory = categoryMap[category] || category;
        console.log('Mapped CSV category:', csvCategory);
        
        const categoryProducts = this.products.filter(product => 
            product.category.toLowerCase() === csvCategory.toLowerCase() && 
            product.in_stock === 'yes'
        );
        
        console.log('Found products:', categoryProducts.length, categoryProducts);

        this.updateCurtainContent(categoryProducts);
        
        const curtain = document.getElementById('curtain-gallery');
        if (curtain) {
            curtain.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Curtain opened successfully');
        } else {
            console.error('Curtain gallery element not found!');
        }
    }

    closeCurtain() {
        this.isGalleryOpen = false;
        const curtain = document.getElementById('curtain-gallery');
        curtain.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateCurtainContent(products = null) {
        if (!products && this.currentCategory) {
            const categoryMap = {
                'cups': 'cups',
                'plates': 'plates', 
                'bowls': 'bowls',
                'waves': 'waves',
                'candles': 'candle holders'
            };
            
            const csvCategory = categoryMap[this.currentCategory] || this.currentCategory;
            products = this.products.filter(product => 
                product.category.toLowerCase() === csvCategory.toLowerCase() && 
                product.in_stock === 'yes'
            );
        }

        if (!products) return;

        // Update curtain title
        const titleElement = document.querySelector('.curtain-title');
        const categoryNames = {
            'cups': { en: 'CUPS COLLECTION', hr: 'KOLEKCIJA ŠALICA' },
            'plates': { en: 'PLATES COLLECTION', hr: 'KOLEKCIJA TANJURIĆA' },
            'bowls': { en: 'BOWLS COLLECTION', hr: 'KOLEKCIJA ZDJELICA' },
            'waves': { en: 'WAVES COLLECTION', hr: 'KOLEKCIJA VALOVA' },
            'candles': { en: 'CANDLES COLLECTION', hr: 'KOLEKCIJA SVIJEĆNJAKA' }
        };

        const categoryName = categoryNames[this.currentCategory];
        if (categoryName) {
            titleElement.textContent = this.currentLanguage === 'en' ? categoryName.en : categoryName.hr;
        }

        // Update products grid
        const grid = document.getElementById('products-grid');
        grid.innerHTML = products.map(product => this.createProductItem(product)).join('');

        // Setup scroll indicators
        this.setupScrollIndicators(products.length);
        this.setupScrollListener();
        this.setupInquiryHandlers();
    }

    setupInquiryHandlers() {
        // Handle inquiry button clicks - flip the card
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('inquiry-btn')) {
                const productItem = e.target.closest('.product-item');
                productItem.classList.add('flipped');
            }
            
            // Handle back button - flip card back
            if (e.target.classList.contains('back-btn')) {
                const productItem = e.target.closest('.product-item');
                productItem.classList.remove('flipped');
            }
        });

        // Handle form submission
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('product-inquiry-form')) {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            }
        });
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const productName = form.getAttribute('data-product-name');
        const productId = form.getAttribute('data-product-id');
        const email = formData.get('email');
        const message = formData.get('message');

        const submitBtn = form.querySelector('.send-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = this.currentLanguage === 'en' ? 'SENDING...' : 'ŠALJE...';
        submitBtn.disabled = true;

        try {
            await this.sendEmail({
                to_email: 'stardi.ceramics@gmail.com',
                from_email: email,
                product_name: productName,
                product_id: productId,
                message: message
            });

            // Success feedback
            submitBtn.textContent = this.currentLanguage === 'en' ? 'SENT!' : 'POSLANO!';
            submitBtn.style.backgroundColor = '#4CAF50';
            
            // Reset form and flip back after delay
            setTimeout(() => {
                form.reset();
                const productItem = form.closest('.product-item');
                productItem.classList.remove('flipped');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 2000);

        } catch (error) {
            console.error('Email send failed:', error);
            submitBtn.textContent = this.currentLanguage === 'en' ? 'ERROR' : 'GREŠKA';
            submitBtn.style.backgroundColor = '#f44336';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }
    }

    async sendEmail(data) {
        try {
            // Using EmailJS with your configuration
            const templateParams = {
                to_email: 'stardi.ceramics@gmail.com',
                from_email: data.from_email,
                product_name: data.product_name,
                product_id: data.product_id,
                message: data.message,
                subject: `Product Inquiry: ${data.product_name}`
            };

            const response = await emailjs.send(
                'service_ukyimdc',
                'template_00oh9rj',
                templateParams
            );

            console.log('Email sent successfully:', response);
            return response;
            
        } catch (error) {
            console.error('EmailJS failed:', error);
            
            // Fallback to mailto
            const subject = `Product Inquiry: ${data.product_name}`;
            const body = `Product: ${data.product_name} (ID: ${data.product_id})\nFrom: ${data.from_email}\n\nMessage:\n${data.message}`;
            
            window.open(`mailto:stardi.ceramics@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
            
            throw error;
        }
    }

    setupScrollIndicators(productCount) {
        const dotsContainer = document.getElementById('scroll-dots');
        const itemsPerView = Math.floor(window.innerWidth / 350); // Approximate items visible
        const dotCount = Math.max(1, Math.ceil(productCount / itemsPerView));
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot';
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
    }

    setupScrollListener() {
        const grid = document.getElementById('products-grid');
        const dots = document.querySelectorAll('.scroll-dot');
        
        grid.addEventListener('scroll', () => {
            const scrollLeft = grid.scrollLeft;
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            const scrollProgress = scrollLeft / maxScroll;
            
            // Update active dot
            const activeDotIndex = Math.floor(scrollProgress * (dots.length - 1));
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
        });
    }

    createProductItem(product) {
        const folderMap = {
            'cups': 'cups',
            'plates': 'plates',
            'bowls': 'bowls', 
            'waves': 'waves',
            'candle holders': 'candles'
        };
        
        const folder = folderMap[product.category.toLowerCase()] || 'misc';
        const imagePath = `images/shop/${folder}/${product.image_file}`;

        return `
            <div class="product-item" data-product-id="${product.id}">
                <div class="product-card-inner">
                    <div class="product-card-front">
                        <div class="product-item-image">
                            <img src="${imagePath}" alt="${product.name}" loading="lazy">
                        </div>
                        <div class="product-item-info">
                            <h3 class="product-item-name">${product.name}</h3>
                            <div class="product-item-details">
                                <div class="detail-row">
                                    <span class="detail-label">
                                        ${this.currentLanguage === 'en' ? 'Material' : 'Materijal'}
                                    </span>
                                    <span class="detail-value">
                                        ${this.currentLanguage === 'en' ? product.material : product.materijal}
                                    </span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">
                                        ${this.currentLanguage === 'en' ? 'Size' : 'Veličina'}
                                    </span>
                                    <span class="detail-value">${product.size}</span>
                                </div>
                                <div class="detail-row price-row">
                                    <span class="detail-label">
                                        ${this.currentLanguage === 'en' ? 'Price' : 'Cijena'}
                                    </span>
                                    <span class="detail-value price">${product.price}</span>
                                </div>
                            </div>
                            <button class="inquiry-btn" data-en="INQUIRE" data-hr="UPIT">
                                ${this.currentLanguage === 'en' ? 'INQUIRE' : 'UPIT'}
                            </button>
                        </div>
                    </div>
                    <div class="product-card-back">
                        <div class="inquiry-form">
                            <h4 class="inquiry-title">
                                ${this.currentLanguage === 'en' ? `Inquire about ${product.name}` : `Upit za ${product.name}`}
                            </h4>
                            <form class="product-inquiry-form" data-product-name="${product.name}" data-product-id="${product.id}">
                                <div class="form-group">
                                    <label>
                                        ${this.currentLanguage === 'en' ? 'Your Email' : 'Vaš Email'}
                                    </label>
                                    <input type="email" name="email" required placeholder="${this.currentLanguage === 'en' ? 'your.email@example.com' : 'vas.email@primjer.com'}">
                                </div>
                                <div class="form-group">
                                    <label>
                                        ${this.currentLanguage === 'en' ? 'Message' : 'Poruka'}
                                    </label>
                                    <textarea name="message" required placeholder="${this.currentLanguage === 'en' ? 'I am interested in this product...' : 'Zanima me ovaj proizvod...'}" rows="3"></textarea>
                                </div>
                                <div class="form-buttons">
                                    <button type="submit" class="send-btn">
                                        ${this.currentLanguage === 'en' ? 'SEND' : 'POŠALJI'}
                                    </button>
                                    <button type="button" class="back-btn">
                                        ${this.currentLanguage === 'en' ? 'BACK' : 'NATRAG'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize curtain gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CurtainGallery();
});