// Header Component Script
class HeaderComponent {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navMenu = document.getElementById('navMenu');
        
        this.init();
    }
    
    init() {
        if (this.mobileMenuBtn && this.navMenu) {
            this.setupMobileMenu();
        }
    }
    
    setupMobileMenu() {
        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.header-container') && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu when clicking on nav links (for single page apps)
        const navLinks = this.navMenu.querySelectorAll('.nav-link, .auth-link, .logout-btn');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.mobileMenuBtn.textContent = this.navMenu.classList.contains('active') ? '✕' : '☰';
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.mobileMenuBtn.textContent = '☰';
        document.body.style.overflow = '';
    }
}

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeaderComponent();
});