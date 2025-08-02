// script.js - VERSION CORRIGÉE

// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenuBtn = document.querySelector('.close-menu');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('page-title');
const currentPage = document.getElementById('current-page');
const titleText = document.getElementById('title-text');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const whatsappOrderBtn = document.getElementById('whatsapp-order');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const emptyCartMsg = document.createElement('p');

// Initialize cart
let cart = [];
emptyCartMsg.className = 'empty-cart';
emptyCartMsg.textContent = 'Votre panier est vide';

// Page titles mapping
const pageTitles = {
    'home': 'Accueil',
    'femme': 'Bijoux Femme',
    'homme': 'Bijoux Homme',
    'enfant': 'Bijoux Enfant',
    'couple': 'Collection Couple',
    'personnalise': 'Bijoux Personnalisés',
    'idees': 'Idées Cadeaux',
    'bagues': 'Catalogue des Bagues & Alliances',
    'colliers': 'Catalogue des Colliers & Pendentifs',
    'bracelets': 'Catalogue des Bracelets',
    'boucles': 'Catalogue des Boucles d\'Oreilles',
    'personnalises': 'Catalogue des Bijoux Personnalisés',
    'videos': 'Vidéos',
    'about': 'À Propos',
    'contact': 'Contact'
};

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Enhanced Navigation - FIXED VERSION
document.addEventListener('click', (e) => {
    // Check if clicked element is a nav link or has a nav link ancestor
    const navLink = e.target.closest('.nav-link');
    if (!navLink) return;
    
    e.preventDefault();
    
    const targetPage = navLink.getAttribute('data-page');
    const targetHref = navLink.getAttribute('href');
    
    // Extract page ID from href (remove #)
    const pageId = targetHref ? targetHref.replace('#', '') : targetPage;
    
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetElement = document.getElementById(pageId);
    if (targetElement) {
        targetElement.classList.add('active');
        
        // Update page title
        const title = pageTitles[pageId] || navLink.textContent;
        updatePageTitle(title, pageId);
    }
    
    // Close mobile menu if open
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    navLink.classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
});

// Update page title
function updatePageTitle(title, page) {
    currentPage.textContent = title;
    titleText.textContent = title;
    
    // Show/hide page title based on page
    if (page === 'home') {
        pageTitle.style.display = 'none';
    } else {
        pageTitle.style.display = 'block';
    }
}

// Shopping Cart - FIXED
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart') || 
        e.target.closest('.add-to-cart')) {
        const addBtn = e.target.classList.contains('add-to-cart') ? 
            e.target : e.target.closest('.add-to-cart');
        
        e.preventDefault();
        openCartSidebar();
        
        const product = addBtn.getAttribute('data-product');
        const price = parseInt(addBtn.getAttribute('data-price'));
        const imgElement = addBtn.closest('.product-card')?.querySelector('img');
        const image = imgElement ? imgElement.src : '';
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.product === product);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                product: product,
                price: price,
                quantity: 1,
                image: image
            });
        }
        
        updateCartDisplay();
        showNotification(`${product} ajouté au panier`);
    }
});

// Close cart sidebar
closeCartBtn.addEventListener('click', () => {
    closeCartSidebar();
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (cartSidebar.classList.contains('open') && 
        !cartSidebar.contains(e.target) && 
        !e.target.classList.contains('add-to-cart') && 
        !e.target.closest('.add-to-cart')) {
        closeCartSidebar();
    }
});

// Open cart sidebar
function openCartSidebar() {
    cartSidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateCartDisplay();
}

// Close cart sidebar
function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    document.body.style.overflow = '';
}

// Update cart display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.appendChild(emptyCartMsg);
        cartTotal.textContent = '0,00 €';
        whatsappOrderBtn.style.display = 'none';
        return;
    }
    
    whatsappOrderBtn.style.display = 'block';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.product}">
            <div class="cart-item-details">
                <h4>${item.product}</h4>
                <p>Quantité: ${item.quantity}</p>
                <p class="cart-item-price">${itemTotal.toLocaleString()} €</p>
            </div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `${total.toLocaleString()} €`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-item').getAttribute('data-index'));
            cart.splice(index, 1);
            updateCartDisplay();
            
            if (cart.length === 0) {
                closeCartSidebar();
            }
        });
    });
}

// WhatsApp Order - FIXED
whatsappOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    let message = 'Bonjour, je souhaite commander les articles suivants :\n\n';
    
    cart.forEach(item => {
        message += `• ${item.product} - ${item.quantity} x ${item.price.toLocaleString()} €\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ${total.toLocaleString()} €\n\n`;
    message += 'Veuillez me confirmer la disponibilité et les modalités de livraison. Merci !';
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/22997000000?text=${encodedMessage}`, '_blank');
});

// Video Play Button
document.querySelectorAll('.play-button').forEach(btn => {
    btn.addEventListener('click', () => {
        showNotification('Lecture de la vidéo');
    });
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#D4AF37',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId);
        
        if (target) {
            // For navigation links, use the page system
            if (this.classList.contains('nav-link')) {
                const navLink = this;
                const targetPage = navLink.getAttribute('data-page') || targetId;
                
                // Hide all pages
                pages.forEach(page => {
                    page.classList.remove('active');
                });
                
                // Show target page
                target.classList.add('active');
                
                // Update page title
                const title = pageTitles[targetPage] || navLink.textContent;
                updatePageTitle(title, targetPage);
                
                // Update active state
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
            
            // Scroll to element
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Close mobile menu
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set home as active page
    document.getElementById('home').classList.add('active');
    pageTitle.style.display = 'none';
    
    // Initialize cart display
    updateCartDisplay();
    
    // Set initial active link
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
});

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'home') {
        const targetLink = document.querySelector(`a[href="#${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
});

// Initial check for hash
if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'home') {
        const targetLink = document.querySelector(`a[href="#${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}