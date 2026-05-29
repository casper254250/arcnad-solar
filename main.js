/**
 * ============================================================================
 * ARCNAD SOLAR - MAIN JAVASCRIPT
 * ============================================================================
 * This file handles:
 * - Hamburger mobile menu
 * - Scroll reveal animations
 * - Smooth scrolling navigation
 * - Active navigation highlighting
 * - Hero background slideshow
 * - Auto-count number counters
 * - Product modal popups
 * ============================================================================
 */

// ============================================================================
// 1. HAMBURGER MENU (Mobile Navigation)
// ============================================================================

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');
const overlay = document.getElementById('navOverlay');

/**
 * Toggles the mobile menu open/closed
 * Also locks body scroll when menu is open
 */
function toggleMenu() {
    if (!hamburger || !nav || !overlay) return;
    
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
    overlay.classList.toggle('open');
    
    if (nav.classList.contains('open')) {
        // Menu opened - lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
    } else {
        // Menu closed - restore body scroll
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
}

// Add click event listeners
if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

// Close menu when a navigation link is clicked
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        if (nav && nav.classList.contains('open')) {
            toggleMenu();
        }
    });
});

// Close menu automatically when window is resized beyond mobile breakpoint
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && nav && nav.classList.contains('open')) {
        toggleMenu();
    }
});

// ============================================================================
// 2. SCROLL REVEAL ANIMATIONS
// ============================================================================

const reveals = document.querySelectorAll('.reveal');

/**
 * Checks if elements with .reveal class are visible in viewport
 * Adds 'visible' class to trigger animations
 */
function checkReveal() {
    for (let el of reveals) {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 120;
        
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('visible');
        }
    }
}

/**
 * Immediately shows all reveal elements (prevents hidden content on load)
 */
function showAllRevealImmediately() {
    reveals.forEach(el => {
        el.classList.add('visible');
    });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', showAllRevealImmediately);

// ============================================================================
// 3. SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Skip if href is just '#'
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            if (nav && nav.classList.contains('open')) {
                toggleMenu();
            }
            
            // Smooth scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================================================
// 4. ACTIVE NAVIGATION HIGHLIGHT (Updates based on scroll position)
// ============================================================================

const sections = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('nav ul li a');

/**
 * Highlights the navigation link corresponding to the current scroll position
 */
function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100; // Offset for fixed header
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// ============================================================================
// 5. HERO BACKGROUND SLIDESHOW
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Add your hero background images here
    const heroImages = [
        'url("images/edits2.jpg")',
        'url("images/edits3.jpg")'
    ];
    
    let currentImageIndex = 0;
    const heroSection = document.querySelector('.hero-slideshow');
    
    if (heroSection && heroImages.length > 0) {
        // Set initial image
        heroSection.style.backgroundImage = heroImages[0];
        
        // Change image every 5 seconds
        setInterval(function() {
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;
            heroSection.style.backgroundImage = heroImages[currentImageIndex];
        }, 5000);
    }
});

// ============================================================================
// 6. AUTO-COUNT NUMBER COUNTER (Stats animation)
// ============================================================================

/**
 * Starts counting animation for numbers with .stat-number or .counter-number class
 * Counts smoothly from 0 to target number when element comes into view
 */
function startNumberCounters() {
    const counters = document.querySelectorAll('.stat-number, .counter-number');
    
    counters.forEach(counter => {
        const originalText = counter.innerText;
        const targetNumber = parseFloat(originalText);
        
        // Skip if not a valid number
        if (isNaN(targetNumber)) return;
        
        // Extract suffix (%, +, /5, etc.)
        let suffix = '';
        if (originalText.includes('%')) suffix = '%';
        if (originalText.includes('+')) suffix = '+';
        if (originalText.includes('/')) suffix = '/5';
        
        let current = 0;
        const duration = 2000;      // 2 seconds total
        const stepTime = 20;         // Update every 20ms
        const steps = duration / stepTime;
        const increment = targetNumber / steps;
        let hasStarted = false;
        let animationId = null;
        
        /**
         * Checks if element is visible in viewport
         */
        function isInViewport(el) {
            const rect = el.getBoundingClientRect();
            return rect.top <= window.innerHeight - 50 && rect.bottom >= 0;
        }
        
        /**
         * Starts the counting animation
         */
        function startCounting() {
            if (hasStarted) return;
            hasStarted = true;
            
            function updateCounter() {
                current += increment;
                
                if (current < targetNumber) {
                    if (Number.isInteger(targetNumber)) {
                        counter.innerText = Math.floor(current) + suffix;
                    } else {
                        counter.innerText = current.toFixed(1) + suffix;
                    }
                    animationId = requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = targetNumber + suffix;
                    cancelAnimationFrame(animationId);
                }
            }
            updateCounter();
        }
        
        /**
         * Checks counter visibility and triggers counting
         */
        function checkCounter() {
            if (isInViewport(counter) && !hasStarted) {
                startCounting();
                window.removeEventListener('scroll', checkCounter);
                window.removeEventListener('resize', checkCounter);
            }
        }
        
        window.addEventListener('scroll', checkCounter);
        window.addEventListener('resize', checkCounter);
        checkCounter(); // Check immediately on load
    });
}

document.addEventListener('DOMContentLoaded', startNumberCounters);

// ============================================================================
// 7. PRODUCT POPUP MODAL SYSTEM
// ============================================================================

const modal = document.getElementById('productModal');
const closeBtn = document.querySelector('.modal-close');

/**
 * Closes the product modal and restores scrolling
 */
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking the X button
if (closeBtn) {
    closeBtn.onclick = closeModal;
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal && modal.style.display === 'block') {
        closeModal();
    }
});

// ============================================================================
// 7a. PRODUCT DATA (All product details for the modal)
// ============================================================================

const productDetails = {
    'Solar Panels': {
        title: 'Solar Panels', 
        icon: '🪟', 
        image: 'images/product-panel.jpg',
        desc: 'High-efficiency solar panels for maximum energy generation',
        variants: [
            { name: '100W', specs: '12V', features: ['Small home backup', 'Easy installation'] },
            { name: '200W', specs: '12V', features: ['Portable', '12V compatible'] },
            { name: '300W', specs: '24V', features: ['Medium home', 'High efficiency'] },
            { name: '400W', specs: '24V', features: ['High power', 'Durable'] },
            { name: '500W', specs: '48V', features: ['Large home', 'Commercial use'] },
            { name: '600W', specs: '48V', features: ['Commercial grade', 'High efficiency'] },
            { name: '750W', specs: '48V', features: ['Industrial use', 'Maximum output'] },
            { name: '800W', specs: '48V', features: ['Premium quality', 'High durability'] },
            { name: '900W', specs: '48V', features: ['Industrial systems', 'Heavy duty'] }
        ],
        applications: ['Homes', 'Businesses', 'Institutions', 'Solar Farms']
    },
    'Solar Batteries': {
        title: 'Solar Batteries', 
        icon: '🔋', 
        image: 'images/product-battery.jpg',
        desc: 'Reliable energy storage for backup power',
        variants: [
            { name: 'Lithium 200Ah (2.56kWh)', specs: '12.8V', features: ['Long life', 'Fast charging', '5-year warranty'] },
            { name: 'Lithium 200Ah (5.12kWh)', specs: '25.6V', features: ['Built-in BMS', 'Fast charging', '5-year warranty'] },
            { name: 'Lithium 100Ah (5.12kWh)', specs: '51.2V', features: ['High voltage', 'Compact', '5-year warranty'] },
            { name: 'Lithium 300Ah (15.36kWh)', specs: '51.2V', features: ['High capacity', 'Commercial grade', '5-year warranty'] },
            { name: 'Gel Battery 100Ah', specs: '12V', features: ['Maintenance-free', 'Leak-proof', '2-year warranty'] },
            { name: 'Gel Battery 200Ah', specs: '12V', features: ['Deep cycle', 'Maintenance-free', '2-year warranty'] },
            { name: 'Gel Battery 300Ah', specs: '12V', features: ['Deep cycle', 'Leak-proof', '2-year warranty'] }
        ],
        applications: ['Home Backup', 'Business UPS', 'Off-grid Systems']
    },
    'Inverters': {
        title: 'Inverters', 
        icon: '⚡', 
        image: 'images/product-inverter.jpg',
        desc: 'Convert DC solar power to AC electricity',
        variants: [
            { name: '1kW Pure Sine Wave', specs: '12V', features: ['Small home', 'Quiet operation'] },
            { name: '3kW Hybrid', specs: '24V', features: ['Solar+Battery+Grid', 'Smart monitoring'] },
            { name: '5kW Hybrid', specs: '48V', features: ['Energy management', 'Touch display'] },
            { name: '10kW Off-Grid', specs: '48V', features: ['Commercial system', 'Heavy duty'] },
            { name: '15kW Three Phase', specs: '48V', features: ['Industrial use', 'Advanced features'] },
            { name: '20kW Three Phase', specs: '48V', features: ['Maximum capacity', 'Full control'] }
        ],
        applications: ['Home Systems', 'Business Backup', 'Remote Locations']
    },
    'Charge Controllers': {
        title: 'Charge Controllers', 
        icon: '🎛️', 
        image: 'images/product-controller.jpg',
        desc: 'Regulate solar charging to protect batteries',
        variants: [
            { name: '20A MPPT', specs: '12V/24V', features: ['High efficiency', 'LCD display'] },
            { name: '40A MPPT', specs: '12V-48V', features: ['Data logging', 'USB port'] },
            { name: '60A MPPT', specs: '12V-48V', features: ['Max power harvest', 'LCD display'] },
            { name: '80A MPPT', specs: '12V-48V', features: ['Commercial grade', 'Remote monitoring'] },
            { name: '100A MPPT', specs: '48V', features: ['Industrial grade', 'Heavy duty'] },
            { name: '30A PWM', specs: '12V/24V', features: ['Cost effective', 'Simple operation'] }
        ],
        applications: ['Small Systems', 'Large Installations', 'Home Systems']
    },
    'Solar Water Heaters': {
        title: 'Solar Water Heaters', 
        icon: '💧', 
        image: 'images/product-waterheater.jpg',
        desc: 'Eco-friendly hot water - saves up to 70% electricity',
        variants: [
            { name: 'Galvanized 200L Non-Pressurized', specs: 'Budget', features: ['Durable tank', 'Easy install'] },
            { name: 'Galvanized 300L Non-Pressurized', specs: 'Family size', features: ['Large capacity', 'Durable'] },
            { name: 'Galvanized 200L Pressurized', specs: 'High Pressure', features: ['Multi-bathroom', 'Shower ready'] },
            { name: 'Galvanized 300L Pressurized', specs: 'High Pressure', features: ['Commercial use', 'Multi-outlet'] },
            { name: 'Stainless Steel 200L Non-Pressurized', specs: 'Premium', features: ['Rust-proof', 'Long lasting'] },
            { name: 'Stainless Steel 300L Non-Pressurized', specs: 'Premium', features: ['Rust-proof', 'Premium finish'] },
            { name: 'Stainless Steel 200L Pressurized', specs: 'Premium HP', features: ['High pressure', 'Multi-bathroom'] },
            { name: 'Stainless Steel 300L Pressurized', specs: 'Commercial', features: ['Commercial grade', 'Max pressure'] },
            { name: 'Flat Plate 200L', specs: 'Pressurized', features: ['Highest efficiency', 'Modern look'] }
        ],
        applications: ['Homes', 'Hotels', 'Apartments', 'Guest Houses']
    },
    'Solar Cables & Wires': {
        title: 'Solar Cables & Wires', 
        icon: '🔌', 
        image: 'images/product-cables.jpg',
        desc: 'UV-resistant weatherproof cables',
        variants: [
            { name: '4mm² Solar Cable', specs: 'Per Meter', features: ['UV resistant', 'Copper core'] },
            { name: '6mm² Solar Cable', specs: 'Per Meter', features: ['Weatherproof', 'Copper core'] },
            { name: '10mm² Solar Cable', specs: 'Per Meter', features: ['Heavy duty', 'UV resistant'] },
            { name: 'MC4 Connectors', specs: 'Pair', features: ['Waterproof', 'Easy connect'] },
            { name: 'Solar Extension Cable', specs: '5m/10m/20m', features: ['Pre-assembled', 'Plug and play'] }
        ],
        applications: ['Panel Connections', 'Battery Wiring', 'System Cabling']
    },
    'LED Bulbs & Lighting': {
        title: 'LED Bulbs & Lighting', 
        icon: '💡', 
        image: 'images/product-led.jpg',
        desc: 'Energy-efficient lighting solutions',
        variants: [
            { name: 'LED Bulbs', specs: '5W-15W', features: ['50,000+ hours', 'Energy saver'] },
            { name: 'Solar Lights', specs: '30W-100W', features: ['Solar powered', 'Auto on/off'] },
            { name: 'Floodlights', specs: '30W-300W', features: ['Weatherproof', 'Security lighting'] },
            { name: 'Moisture Proof Lamps', specs: '20W-40W', features: ['Bathroom safe', 'Water resistant'] },
            { name: 'Solar Street Lights', specs: '60W-150W', features: ['Motion sensor', 'Auto dimming'] }
        ],
        applications: ['Indoor', 'Outdoor', 'Street Lighting', 'Bathroom']
    },
    'Extensions & Power Strips': {
        title: 'Extensions & Power Strips', 
        icon: '🔌', 
        image: 'images/product-extensions.jpg',
        desc: 'Safe power distribution for multiple devices',
        variants: [
            { name: '3-Way Strip', specs: '1m-3m', features: ['Surge protection', 'Overload cut'] },
            { name: '5-Way Strip', specs: '1m-5m', features: ['USB ports', 'Individual switches'] },
            { name: '8-Way Strip', specs: '2m-5m', features: ['USB ports', 'Metal casing'] },
            { name: 'USB Power Strip', specs: '3m-5m', features: ['4 USB ports', 'Smart charging'] }
        ],
        applications: ['Home Office', 'Living Room', 'Workshops', 'Kitchen']
    },
    'Fridge Guards & Surge Protectors': {
        title: 'Fridge Guards & Surge Protectors', 
        icon: '🛡️', 
        image: 'images/product-guards.jpg',
        desc: 'Protect appliances from voltage fluctuations',
        variants: [
            { name: 'Fridge Guard', specs: '10W-20W', features: ['Voltage regulation', 'Auto shut-off'] },
            { name: 'TV Guard', specs: '10W-20W', features: ['Surge protection', 'Signal filtering'] },
            { name: 'Universal Surge Protector', specs: '10A-20A', features: ['Multi-device', 'Quick response'] }
        ],
        applications: ['Refrigerators', 'Televisions', 'Computers', 'AC Units']
    }
};

// ============================================================================
// 7b. OPEN PRODUCT MODAL (Displays product details in popup)
// ============================================================================

/**
 * Opens the modal with detailed information for the selected product
 * @param {string} productName - Name of the product to display
 */
function openProductModal(productName) {
    const product = productDetails[productName];
    
    // Exit if product not found
    if (!product) return;
    
    const contentDiv = document.getElementById('modalDynamicContent');
    if (!contentDiv) return;
    
    // Build the modal content dynamically
    contentDiv.innerHTML = `
        <div class="modal-product-layout">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="modal-product-info">
                <div class="modal-product-icon">${product.icon}</div>
                <h2>${product.title}</h2>
                <p>${product.desc}</p>
            </div>
        </div>
        
        <h3>📦 Available Options</h3>
        <div class="modal-variants-grid">
            ${product.variants.map(v => `
                <div class="modal-variant-card">
                    <h4>${v.name}</h4>
                    <p><strong>${v.specs}</strong></p>
                    <div class="variant-features">
                        ${v.features.map(f => `<span>✅ ${f}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <h3>🏠 Applications</h3>
        <div class="applications-tags">
            ${product.applications.map(app => `<span class="app-tag">${app}</span>`).join('')}
        </div>
        
        <div class="modal-cta">
            <p>📞 Need help choosing? Talk to our experts!</p>
            <a href="#contact" class="modal-product-btn" onclick="closeModal()">Request Quote →</a>
        </div>
    `;
    
    // Show the modal and lock body scroll
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// ============================================================================
// 7c. MAKE PRODUCT CARDS CLICKABLE
// ============================================================================

/**
 * Adds click event listeners to all product cards
 * When clicked, opens the modal with the corresponding product details
 */
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const titleElement = card.querySelector('h3');
        
        if (titleElement && productDetails[titleElement.innerText.trim()]) {
            card.style.cursor = 'pointer';
            
            card.addEventListener('click', function(e) {
                // Don't open modal if clicking on buttons or links inside the card
                if (e.target.tagName !== 'A' && !e.target.closest('.product-view-btn')) {
                    const productName = titleElement.innerText.trim();
                    openProductModal(productName);
                }
            });
        }
    });
});