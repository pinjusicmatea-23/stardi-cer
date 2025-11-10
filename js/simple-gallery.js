// Working Gallery System
class SimpleGallery {
    constructor() {
        this.products = [];
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.currentCategory = null;
        this.isGalleryOpen = false;
        this.init();
    }

    async init() {
        console.log('Initializing SimpleGallery...');
        await this.loadProducts();
        this.createGalleryHTML();
        this.bindEvents();
        this.styleClickableTitles();
    }

    async loadProducts() {
        try {
            const response = await fetch('sheets/cijene - sheet1.csv');
            const text = await response.text();
            this.products = this.parseCSV(text);
            console.log('Products loaded:', this.products.length);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    parseCSV(text) {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue; // Skip empty lines
            
            // More robust CSV parsing to handle commas in values
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim()); // Add the last value
            
            const product = {};
            headers.forEach((header, index) => {
                product[header] = values[index] || '';
            });
            
            products.push(product);
        }
        
        console.log('Parsed products:', products);
        return products;
    }

    createGalleryHTML() {
        const galleryHTML = `
            <div id="simple-gallery" class="simple-gallery">
                <div class="gallery-overlay"></div>
                <div class="gallery-container">
                    <div class="gallery-header">
                        <h1 class="gallery-title"></h1>
                        <button class="gallery-close">&times;</button>
                    </div>
                    <div class="gallery-content">
                        <div class="gallery-scroll">
                            <div class="gallery-grid" id="gallery-grid">
                                <!-- Products will be inserted here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Email Modal -->
            <div id="email-modal" class="email-modal">
                <div class="email-modal-overlay"></div>
                <div class="email-modal-content">
                    <div class="email-modal-header">
                        <h3 class="email-modal-title"></h3>
                        <button class="email-modal-close">&times;</button>
                    </div>
                    <form id="email-form" class="email-form">
                        <div class="form-group">
                            <label class="email-label">Your email:</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label class="message-label">Message:</label>
                            <textarea name="message" required rows="4" placeholder="Enter your message here..."></textarea>
                        </div>
                        <div class="form-buttons">
                            <button type="button" class="send-btn">Send</button>
                            <button type="button" class="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', galleryHTML);
    }

    bindEvents() {
        // Handle product image clicks - ONLY in shop section
        document.addEventListener('click', (e) => {
            const productImage = e.target.closest('.product-image');
            if (productImage) {
                const shopSection = productImage.closest('.shop-section');
                if (shopSection) { // Only handle if in shop section
                    e.preventDefault();
                    const slide = productImage.closest('.shop-slide');
                    const category = slide.getAttribute('data-category');
                    this.openGallery(category);
                }
            }
        });

        // Handle category text clicks - ONLY in shop section
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('clickable-title')) {
                const shopSection = e.target.closest('.shop-section');
                if (shopSection) { // Only handle if in shop section
                    e.preventDefault();
                    e.stopPropagation();
                    const category = e.target.getAttribute('data-category');
                    if (category) {
                        this.openGallery(category);
                    }
                }
            }
        });

        // Handle gallery close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-close') || 
                e.target.classList.contains('gallery-overlay') ||
                e.target.classList.contains('category-close-btn') ||
                e.target.id === 'categoryCloseBtn') {
                this.closeGallery();
            }
        });
        
        // Close email modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('email-modal-close') || 
                e.target.classList.contains('email-modal-overlay') ||
                e.target.classList.contains('cancel-btn')) {
                document.getElementById('email-modal').style.display = 'none';
            }
        });
        
        // Inquiry buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('inquire-btn')) {
                console.log('Inquiry button clicked!');
                e.preventDefault();
                e.stopPropagation();
                const productData = e.target.getAttribute('data-product');
                if (productData) {
                    try {
                        const product = JSON.parse(productData);
                        console.log('Product data parsed:', product);
                        this.openInquiryModal(product);
                    } catch (error) {
                        console.error('Error parsing product data:', error);
                        alert('Error opening inquiry form');
                    }
                } else {
                    console.error('No product data found on button');
                }
            }
        });
        
        // Email form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'email-form') {
                e.preventDefault();
                console.log('Form submitted, calling sendEmail');
                this.sendEmail(e.target);
            }
        });
        
        // Also handle send button click directly
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('send-btn')) {
                e.preventDefault();
                const form = e.target.closest('form');
                if (form) {
                    console.log('Send button clicked, calling sendEmail');
                    this.sendEmail(form);
                }
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeGallery();
                document.getElementById('email-modal').style.display = 'none';
            }
        });
    }
    
    openInquiryModal(product) {
        console.log('Opening inquiry modal for:', product);
        this.selectedProduct = product;
        
        // Get current language
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        
        const modal = document.getElementById('email-modal');
        console.log('Modal element found:', modal);
        
        if (!modal) {
            console.error('Email modal not found');
            alert(this.currentLanguage === 'hr' ? 'Pošaljite e-mail na: stardiceramic@gmail.com' : 'Send email to: stardiceramic@gmail.com');
            return;
        }
        
        // Update modal content
        const title = modal.querySelector('.email-modal-title');
        const emailLabel = modal.querySelector('.email-label');
        const messageLabel = modal.querySelector('.message-label');
        const sendBtn = modal.querySelector('.send-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        console.log('Modal elements found:', { title, emailLabel, messageLabel, sendBtn, cancelBtn });
        
        if (this.currentLanguage === 'hr') {
            title.textContent = `Upit za: ${product.name}`;
            emailLabel.textContent = 'Vaš e-mail:';
            messageLabel.textContent = 'Poruka:';
            sendBtn.textContent = 'Pošaljite';
            cancelBtn.textContent = 'Odustani';
        } else {
            title.textContent = `Inquiry for: ${product.name}`;
            emailLabel.textContent = 'Your email:';
            messageLabel.textContent = 'Message:';
            sendBtn.textContent = 'Send';
            cancelBtn.textContent = 'Cancel';
        }
        
        // Pre-fill message
        const messageTextarea = modal.querySelector('textarea[name="message"]');
        const productName = product.name;
        const defaultMessage = this.currentLanguage === 'hr' 
            ? `Pozdrav,\n\nZanimaju me informacije o proizvodu "${productName}". Molim vas pošaljite mi više detalja o dostupnosti i cijeni.\n\nHvala!`
            : `Hello,\n\nI am interested in the product "${productName}". Please send me more details about availability and pricing.\n\nThank you!`;
        
        if (messageTextarea) {
            messageTextarea.value = defaultMessage;
        }
        
        console.log('About to show modal...');
        modal.style.display = 'flex';
        console.log('Modal display set to flex');
    }
    
    async sendEmail(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!email || !message) {
            alert(this.currentLanguage === 'hr' ? 'Molimo unesite sve potrebne podatke.' : 'Please fill in all required fields.');
            return;
        }
        
        const productName = this.selectedProduct ? this.selectedProduct.name : '';
        
        // Show loading state
        const sendBtn = form.querySelector('.send-btn');
        const originalText = sendBtn.textContent;
        sendBtn.textContent = this.currentLanguage === 'hr' ? 'Šalje...' : 'Sending...';
        sendBtn.disabled = true;
        
        try {
            // For now, use mailto as fallback
            const subject = encodeURIComponent(`Product Inquiry: ${productName}`);
            const body = encodeURIComponent(`Customer Email: ${email}\n\nProduct: ${productName}\n\nMessage:\n${message}`);
            window.open(`mailto:stardi.ceramics@gmail.com?subject=${subject}&body=${body}`, '_blank');
            
            // Close modal
            document.getElementById('email-modal').style.display = 'none';
            
            // Show success message
            alert(this.currentLanguage === 'hr' ? 
                'E-mail program se otvorio. Molimo pošaljite e-mail.' : 
                'Email program opened. Please send the email.');
                
        } catch (error) {
            console.error('Error opening email:', error);
            
            // Show error message
            alert(this.currentLanguage === 'hr' ? 
                'Greška pri otvaranju e-maila. Molimo kontaktirajte nas direktno na stardi.ceramics@gmail.com' : 
                'Error opening email. Please contact us directly at stardi.ceramics@gmail.com');
        } finally {
            // Reset button
            sendBtn.textContent = originalText;
            sendBtn.disabled = false;
        }
    }

    openGallery(category) {
        console.log('Opening gallery for:', category);
        this.currentCategory = category;
        this.isGalleryOpen = true;
        
        // Map category names
        const categoryMap = {
            'candles': 'candelsticks'
        };
        
        const csvCategory = categoryMap[category] || category;
        console.log('Looking for CSV category:', csvCategory);
        console.log('All products:', this.products);
        
        const categoryProducts = this.products.filter(product => 
            product.category.toLowerCase() === csvCategory.toLowerCase()
        );

        console.log('Found products:', categoryProducts.length);
        console.log('Category products:', categoryProducts);
        this.updateGalleryContent(categoryProducts);
        
        const gallery = document.getElementById('simple-gallery');
        gallery.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeGallery() {
        this.isGalleryOpen = false;
        const gallery = document.getElementById('simple-gallery');
        gallery.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateGalleryContent(products) {
        // Get current language each time gallery opens
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        
        // Update title
        const titleElement = document.querySelector('.gallery-title');
        const categoryNames = {
            'cups': { en: 'CUPS COLLECTION', hr: 'KOLEKCIJA ŠALICA' },
            'plates': { en: 'PLATES COLLECTION', hr: 'KOLEKCIJA TANJURIĆA' },
            'bowls': { en: 'BOWLS COLLECTION', hr: 'KOLEKCIJA ZDJELICA' },
            'waves': { en: 'WAVES COLLECTION', hr: 'KOLEKCIJA VALOVA' },
            'candles': { en: 'CANDLES COLLECTION', hr: 'KOLEKCIJA SVIJEĆNJAKA' },
            'trays': { en: 'TRAYS COLLECTION', hr: 'KOLEKCIJA PLADNJIĆA' },
            'vases': { en: 'VASES COLLECTION', hr: 'KOLEKCIJA VAZA' }
        };

        const categoryName = categoryNames[this.currentCategory];
        if (categoryName && titleElement) {
            titleElement.textContent = this.currentLanguage === 'en' ? categoryName.en : categoryName.hr;
        }

        // Update grid
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
        // Ensure current language is up to date
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        
        const folderMap = {
            'cups': 'cups',
            'plates': 'plates',
            'bowls': 'bowls', 
            'waves': 'waves',
            'candelsticks': 'candles',
            'trays': 'trays',
            'vases': 'vases'
        };
        
        const folder = folderMap[product.category.toLowerCase()] || 'misc';
        const imagePath = `images/shop/${folder}/${product.image_file}`;

        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${imagePath}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-details">
                        <p><strong>${this.currentLanguage === 'en' ? 'Material:' : 'Materijal:'}</strong> ${this.currentLanguage === 'en' ? product.material : product.materijal}</p>
                        <p><strong>${this.currentLanguage === 'en' ? 'Size:' : 'Veličina:'}</strong> ${product.size}</p>
                        <p class="price"><strong>${this.currentLanguage === 'en' ? 'Price:' : 'Cijena:'}</strong> ${product.price}</p>
                    </div>
                    <button class="inquire-btn" data-product='${JSON.stringify(product)}'>
                        ${this.currentLanguage === 'en' ? 'INQUIRE' : 'UPIT'}
                    </button>
                </div>
            </div>
        `;
    }

    styleClickableTitles() {
        // Make category titles clickable and add hover effects
        const clickableTitles = document.querySelectorAll('.clickable-title');
        
        clickableTitles.forEach(title => {
            // Make it look clickable
            title.style.cursor = 'pointer';
            title.style.transition = 'color 0.3s ease';
            
            // Add hover effects
            title.addEventListener('mouseenter', function() {
                title.style.color = '#9D8663';
            });
            
            title.addEventListener('mouseleave', function() {
                title.style.color = '';
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating SimpleGallery');
    new SimpleGallery();
});