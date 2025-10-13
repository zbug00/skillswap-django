// Registration Form Script
class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.emailInput = document.getElementById('email');
        this.fullNameInput = document.getElementById('full_name');
        this.password1Input = document.getElementById('password1');
        this.password2Input = document.getElementById('password2');
        this.passwordToggle1 = document.getElementById('passwordToggle1');
        this.passwordToggle2 = document.getElementById('passwordToggle2');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.setupFloatingLabels();
        this.setupPasswordToggles();
        
        // Add event listeners for validation
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Field validation on blur
        [this.emailInput, this.fullNameInput, this.password1Input, this.password2Input].forEach(input => {
            if (input) {
                input.addEventListener('blur', () => this.validateField(input.id));
            }
        });
        
        // Real-time validation while typing
        [this.emailInput, this.fullNameInput, this.password1Input, this.password2Input].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (input.value.trim()) {
                        this.clearError(input.id);
                    }
                });
            }
        });
        
        // Confirm password validation when password1 changes
        if (this.password1Input && this.password2Input) {
            this.password1Input.addEventListener('input', () => {
                if (this.password2Input.value.trim()) {
                    this.validateField('password2');
                }
            });
        }
    }
    
    setupFloatingLabels() {
        const inputs = [this.emailInput, this.fullNameInput, this.password1Input, this.password2Input];
        inputs.forEach(input => {
            if (input && input.value.trim() !== '') {
                input.classList.add('has-value');
            }
            
            if (input) {
                input.addEventListener('input', () => {
                    if (input.value.trim() !== '') {
                        input.classList.add('has-value');
                    } else {
                        input.classList.remove('has-value');
                    }
                });
            }
        });
    }
    
    setupPasswordToggles() {
        // Password1 toggle
        if (this.passwordToggle1 && this.password1Input) {
            this.passwordToggle1.addEventListener('click', () => {
                const type = this.password1Input.getAttribute('type') === 'password' ? 'text' : 'password';
                this.password1Input.setAttribute('type', type);
                const eyeIcon = this.passwordToggle1.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.classList.toggle('show-password');
                }
            });
        }
        
        // Password2 toggle
        if (this.passwordToggle2 && this.password2Input) {
            this.passwordToggle2.addEventListener('click', () => {
                const type = this.password2Input.getAttribute('type') === 'password' ? 'text' : 'password';
                this.password2Input.setAttribute('type', type);
                const eyeIcon = this.passwordToggle2.querySelector('.eye-icon');
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
        } else if (fieldName === 'password1' && value.length < 8) {
            isValid = false;
            message = 'Пароль должен содержать минимум 8 символов';
        } else if (fieldName === 'password2' && value !== this.password1Input.value) {
            isValid = false;
            message = 'Пароли не совпадают';
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
        const fullNameValid = this.validateField('full_name');
        const password1Valid = this.validateField('password1');
        const password2Valid = this.validateField('password2');
        
        if (!emailValid || !fullNameValid || !password1Valid || !password2Valid) {
            e.preventDefault(); // Prevent form submission only if validation fails
            
            // Focus on first invalid field
            if (!emailValid) {
                this.emailInput.focus();
            } else if (!fullNameValid) {
                this.fullNameInput.focus();
            } else if (!password1Valid) {
                this.password1Input.focus();
            } else if (!password2Valid) {
                this.password2Input.focus();
            }
        } else {
            // If validation passes, add loading state but allow form submission
            const submitBtn = this.form.querySelector('.registration-btn');
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
    new RegistrationForm();
});