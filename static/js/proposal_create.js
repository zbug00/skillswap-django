// Proposal Create Form Script
class ProposalCreateForm {
    constructor() {
        this.form = document.getElementById('proposalCreateForm');
        this.skillOfferedInput = document.getElementById('skill_offered');
        this.skillWantedInput = document.getElementById('skill_wanted');
        this.formatInput = document.getElementById('format');
        this.deadlinesInput = document.getElementById('deadlines');
        this.descriptionInput = document.getElementById('description');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.setupFloatingLabels();
        
        // Add event listeners for validation
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Field validation on blur
        [this.skillOfferedInput, this.skillWantedInput, this.formatInput, this.deadlinesInput, this.descriptionInput].forEach(input => {
            if (input) {
                input.addEventListener('blur', () => this.validateField(input.id));
                input.addEventListener('input', () => this.handleInput(input));
                input.addEventListener('change', () => this.handleInput(input)); // Для select
            }
        });
        
        // Real-time validation while typing
        [this.descriptionInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (input.value.trim()) {
                        this.clearError(input.id);
                    }
                });
            }
        });
        
        // Для select элементов - проверка при изменении
        [this.skillOfferedInput, this.skillWantedInput, this.formatInput, this.deadlinesInput].forEach(select => {
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
        const inputs = [this.skillOfferedInput, this.skillWantedInput, this.formatInput, this.deadlinesInput, this.descriptionInput];
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
        } else if (fieldName === 'description' && value.length < 10) {
            isValid = false;
            message = 'Описание должно содержать минимум 10 символов';
        } else if (fieldName === 'skill_offered' && fieldName === 'skill_wanted' && this.skillOfferedInput.value === this.skillWantedInput.value) {
            isValid = false;
            message = 'Нельзя предлагать обмен одинакового навыка';
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
        const skillOfferedValid = this.validateField('skill_offered');
        const skillWantedValid = this.validateField('skill_wanted');
        const formatValid = this.validateField('format');
        const deadlinesValid = this.validateField('deadlines');
        const descriptionValid = this.validateField('description');
        
        if (!skillOfferedValid || !skillWantedValid || !formatValid || !deadlinesValid || !descriptionValid) {
            e.preventDefault(); // Prevent form submission only if validation fails
            
            // Focus on first invalid field
            if (!skillOfferedValid) {
                this.skillOfferedInput.focus();
            } else if (!skillWantedValid) {
                this.skillWantedInput.focus();
            } else if (!formatValid) {
                this.formatInput.focus();
            } else if (!deadlinesValid) {
                this.deadlinesInput.focus();
            } else if (!descriptionValid) {
                this.descriptionInput.focus();
            }
        } else {
            // If validation passes, add loading state but allow form submission
            const submitBtn = this.form.querySelector('.proposal-create-btn');
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
    new ProposalCreateForm();
});