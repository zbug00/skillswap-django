// Basic Login Form Script
class BasicLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.setupFloatingLabels();
        this.setupPasswordToggle();
        
        // Add event listeners for validation
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.emailInput.addEventListener('blur', () => this.validateField('email'));
        this.passwordInput.addEventListener('blur', () => this.validateField('password'));
        
        // Real-time validation and floating labels while typing
        this.emailInput.addEventListener('input', () => {
            this.handleInput(this.emailInput);
            if (this.emailInput.value.trim()) {
                this.clearError('email');
            }
        });
        
        this.passwordInput.addEventListener('input', () => {
            this.handleInput(this.passwordInput);
            if (this.passwordInput.value.trim()) {
                this.clearError('password');
            }
        });
        
        // Handle focus events for floating labels
        this.emailInput.addEventListener('focus', () => {
            this.emailInput.classList.add('has-value');
        });
        
        this.passwordInput.addEventListener('focus', () => {
            this.passwordInput.classList.add('has-value');
        });
        
        // Handle blur events - remove has-value if empty
        this.emailInput.addEventListener('blur', () => {
            if (this.emailInput.value.trim() === '') {
                this.emailInput.classList.remove('has-value');
            }
        });
        
        this.passwordInput.addEventListener('blur', () => {
            if (this.passwordInput.value.trim() === '') {
                this.passwordInput.classList.remove('has-value');
            }
        });
    }
    
    setupFloatingLabels() {
        const inputs = [this.emailInput, this.passwordInput];
        inputs.forEach(input => {
            if (input) {
                // Check initial value and set has-value class if needed
                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                }
                
                // Handle input events
                input.addEventListener('input', () => {
                    this.handleInput(input);
                });
            }
        });
    }
    
    handleInput(input) {
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    }
    
    setupPasswordToggle() {
        if (this.passwordToggle && this.passwordInput) {
            this.passwordToggle.addEventListener('click', () => {
                const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                this.passwordInput.setAttribute('type', type);
                const eyeIcon = this.passwordToggle.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.classList.toggle('show-password');
                }
            });
        }
    }
    
    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        if (!input) return true;
        
        const value = input.value.trim();
        
        this.clearError(fieldName);
        
        let isValid = true;
        let message = '';
        
        if (!value) {
            isValid = false;
            message = 'Это поле обязательно для заполнения';
        } else if (fieldName === 'email' && !this.validateEmail(value)) {
            isValid = false;
            message = 'Введите корректный email адрес';
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
        const formGroup = input ? input.closest('.form-group') : null;
        
        if (formGroup) formGroup.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    showError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = input ? input.closest('.form-group') : null;
        
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
    
    handleSubmit(e) {
        // Validate all fields
        const emailValid = this.validateField('email');
        const passwordValid = this.validateField('password');
        
        if (!emailValid || !passwordValid) {
            e.preventDefault(); // Prevent form submission only if validation fails
            
            // Focus on first invalid field
            if (!emailValid) {
                this.emailInput.focus();
            } else if (!passwordValid) {
                this.passwordInput.focus();
            }
        } else {
            // If validation passes, add loading state but allow form submission
            const submitBtn = this.form.querySelector('.login-btn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                
                // Remove loading state after form submission (in case of error)
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                }, 3000);
            }
        }
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BasicLoginForm();
});