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
        // Handle product image clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-image')) {
                e.preventDefault();
                const slide = e.target.closest('.shop-slide');
                const category = slide.getAttribute('data-category');
                this.openGallery(category);
            }
        });

        // Handle gallery close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-close') || 
                e.target.classList.contains('gallery-overlay')) {
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
        
        const modal = document.getElementById('email-modal');
        console.log('Modal element found:', modal);
        
        if (!modal) {
            console.error('Email modal not found');
            alert(this.isHr ? 'Pošaljite e-mail na: stardiceramic@gmail.com' : 'Send email to: stardiceramic@gmail.com');
            return;
        }
        
        // Update modal content
        const title = modal.querySelector('.email-modal-title');
        const emailLabel = modal.querySelector('.email-label');
        const messageLabel = modal.querySelector('.message-label');
        const sendBtn = modal.querySelector('.send-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        console.log('Modal elements found:', { title, emailLabel, messageLabel, sendBtn, cancelBtn });
        
        if (this.isHr) {
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
        const defaultMessage = this.isHr 
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
            alert(this.isHr ? 'Molimo unesite sve potrebne podatke.' : 'Please fill in all required fields.');
            return;
        }
        
        const productName = this.selectedProduct ? this.selectedProduct.name : '';
        
        // Show loading state
        const sendBtn = form.querySelector('.send-btn');
        const originalText = sendBtn.textContent;
        sendBtn.textContent = this.isHr ? 'Šalje...' : 'Sending...';
        sendBtn.disabled = true;
        
        try {
            // Send email using EmailJS
            const templateParams = {
                name: email,  // This will show in {{name}} field
                email: email, // Backup email field
                message: `Customer Email: ${email}\n\nProduct: ${productName}\n\nMessage:\n${message}`,
                title: this.isHr ? `Upit za proizvod: ${productName}` : `Product Inquiry: ${productName}`
            };
            
            console.log('Sending email with params:', templateParams);
            
            const response = await emailjs.send(
                'service_ukyimdc',     // Your service ID
                'template_00oh9rj',    // Your template ID
                templateParams,
                'MxXGVxOPREHvMstth'    // Your public key
            );
            
            console.log('Email sent successfully:', response);
            
            // Close modal
            document.getElementById('email-modal').style.display = 'none';
            
            // Show success message
            alert(this.isHr ? 
                'E-mail je uspješno poslan! Odgovorit ćemo vam uskoro.' : 
                'Email sent successfully! We will respond to you soon.');
                
        } catch (error) {
            console.error('Error sending email:', error);
            
            // Show error message
            alert(this.isHr ? 
                'Greška pri slanju e-maila. Molimo pokušajte ponovo ili nas kontaktirajte direktno na stardiceramic@gmail.com' : 
                'Error sending email. Please try again or contact us directly at stardiceramic@gmail.com');
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
            'cups': 'cups',
            'plates': 'plates', 
            'bowls': 'bowls',
            'waves': 'waves',
            'candles': 'candle holders'
        };
        
        const csvCategory = categoryMap[category] || category;
        const categoryProducts = this.products.filter(product => 
            product.category.toLowerCase() === csvCategory.toLowerCase() && 
            product.in_stock === 'yes'
        );

        console.log('Found products:', categoryProducts.length);
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
        // Update title
        const titleElement = document.querySelector('.gallery-title');
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

        // Update grid
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating SimpleGallery');
    new SimpleGallery();
});