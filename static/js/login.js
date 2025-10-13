// Basic Login Form Script
class BasicLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.successMessage = document.getElementById('successMessage');
        
        this.init();
    }
    
    init() {
        // Initialize utilities
        this.setupFloatingLabels();
        this.setupPasswordToggle();
        
        // Add event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.emailInput.addEventListener('blur', () => this.validateField('email'));
        this.passwordInput.addEventListener('blur', () => this.validateField('password'));
    }
    
    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            // Check initial value
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            }
            
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }
    
    setupPasswordToggle() {
        if (this.passwordToggle) {
            this.passwordToggle.addEventListener('click', () => {
                const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                this.passwordInput.setAttribute('type', type);
                this.passwordToggle.querySelector('.eye-icon').classList.toggle('show-password');
            });
        }
    }
    
    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const value = input.value.trim();
        const formGroup = input.closest('.form-group');
        const errorElement = document.getElementById(fieldName + 'Error');
        
        // Clear previous errors
        this.clearError(fieldName);
        
        let isValid = true;
        let message = '';
        
        // Validate required fields
        if (!value) {
            isValid = false;
            message = 'Это поле обязательно для заполнения';
        } else if (fieldName === 'email' && !this.validateEmail(value)) {
            isValid = false;
            message = 'Введите корректный email адрес';
        } else if (fieldName === 'password' && value.length < 1) {
            isValid = false;
            message = 'Пароль обязателен для заполнения';
        }
        
        if (!isValid) {
            this.showError(fieldName, message);
            return false;
        }
        
        return true;
    }
    
    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = input.closest('.form-group');
        
        if (formGroup) formGroup.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    showError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = input.closest('.form-group');
        
        if (formGroup) formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const emailValid = this.validateField('email');
        const passwordValid = this.validateField('password');
        
        if (!emailValid || !passwordValid) {
            // Focus on first invalid field
            if (!emailValid) {
                this.emailInput.focus();
            } else if (!passwordValid) {
                this.passwordInput.focus();
            }
            return;
        }
        
        // Show loading state
        const submitBtn = this.form.querySelector('.login-btn');
        if (submitBtn) submitBtn.classList.add('loading');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo purposes - always succeed
            // In real app, you would make actual API call here
            this.showSuccess();
            
        } catch (error) {
            console.error('Login error:', error);
            this.showError('email', 'Ошибка входа. Проверьте данные.');
        } finally {
            // Remove loading state
            if (submitBtn) submitBtn.classList.remove('loading');
        }
    }
    
    showSuccess() {
        // Hide the form
        if (this.form) this.form.style.display = 'none';
        
        // Show success message
        if (this.successMessage) {
            this.successMessage.classList.add('show');
        }
        
        // Simulate redirect after 2 seconds
        setTimeout(() => {
            // In real app, you would redirect here
            // window.location.href = '/dashboard';
            console.log('Redirecting to dashboard...');
        }, 2000);
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BasicLoginForm();
});