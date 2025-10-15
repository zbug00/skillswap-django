// Skill Create Form Script
class SkillCreateForm {
    constructor() {
        this.form = document.getElementById('skillCreateForm');
        this.nameInput = document.getElementById('name');
        this.descriptionInput = document.getElementById('description');
        this.levelInput = document.getElementById('level');
        this.categoryInput = document.getElementById('category');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.setupFloatingLabels();
        
        // Add event listeners for validation
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Field validation on blur
        [this.nameInput, this.descriptionInput, this.levelInput, this.categoryInput].forEach(input => {
            if (input) {
                input.addEventListener('blur', () => this.validateField(input.id));
                input.addEventListener('input', () => this.handleInput(input));
                input.addEventListener('change', () => this.handleInput(input)); // Для select
            }
        });
        
        // Real-time validation while typing
        [this.nameInput, this.descriptionInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (input.value.trim()) {
                        this.clearError(input.id);
                    }
                });
            }
        });
        
        // Для select элементов - проверка при изменении
        [this.levelInput, this.categoryInput].forEach(select => {
            if (select) {
                select.addEventListener('change', () => {
                    this.handleInput(select);
                    if (select.value.trim()) {
                        this.clearError(select.id);
                    }
                });
            }
        });
    }
    
    setupFloatingLabels() {
        const inputs = [this.nameInput, this.descriptionInput, this.levelInput, this.categoryInput];
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
                
                // Handle change events for select
                if (input.tagName === 'SELECT') {
                    input.addEventListener('change', () => {
                        this.handleInput(input);
                    });
                }
                
                // Handle focus events
                input.addEventListener('focus', () => {
                    input.classList.add('has-value');
                });
                
                // Handle blur events - remove has-value if empty
                input.addEventListener('blur', () => {
                    if (input.value.trim() === '') {
                        input.classList.remove('has-value');
                    }
                });
                
                // Для select - сразу проверяем начальное значение
                if (input.tagName === 'SELECT' && input.value !== '') {
                    input.classList.add('has-value');
                }
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
        } else if (fieldName === 'name' && value.length < 2) {
            isValid = false;
            message = 'Название навыка должно содержать минимум 2 символа';
        } else if (fieldName === 'description' && value.length < 10) {
            isValid = false;
            message = 'Описание должно содержать минимум 10 символов';
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
    
    handleSubmit(e) {
        // Validate all fields
        const nameValid = this.validateField('name');
        const descriptionValid = this.validateField('description');
        const levelValid = this.validateField('level');
        const categoryValid = this.validateField('category');
        
        if (!nameValid || !descriptionValid || !levelValid || !categoryValid) {
            e.preventDefault(); // Prevent form submission only if validation fails
            
            // Focus on first invalid field
            if (!nameValid) {
                this.nameInput.focus();
            } else if (!descriptionValid) {
                this.descriptionInput.focus();
            } else if (!levelValid) {
                this.levelInput.focus();
            } else if (!categoryValid) {
                this.categoryInput.focus();
            }
        } else {
            // If validation passes, add loading state but allow form submission
            const submitBtn = this.form.querySelector('.skill-create-btn');
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
    new SkillCreateForm();
});