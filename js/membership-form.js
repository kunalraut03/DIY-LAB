// Immediately execute this to ensure it runs as soon as possible
(function() {
    console.log('Membership form script loaded');
    
    // Membership form functionality
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Membership script loaded');
        
        // Get modal elements
        const modal = document.getElementById('membershipModal');
        const planButtons = document.querySelectorAll('.plan-button');
        const closeBtn = document.querySelector('.close-btn');
        const membershipForm = document.getElementById('membershipForm');
        
        console.log("Modal element found:", modal !== null);
        console.log("Plan buttons found:", planButtons.length);
        
        // Direct modal open function for more reliable operation
        function openModal(planType) {
            if (modal) {
                // Force display block with !important to override any CSS conflicts
                modal.style.cssText = "display: block !important;";
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                
                // Scroll to top of modal content for mobile
                modal.scrollTo(0, 0);
                
                // Set the membership type in the dropdown if provided
                if (planType) {
                    const select = document.getElementById('membershipType');
                    for (let i = 0; i < select.options.length; i++) {
                        if (select.options[i].value === planType) {
                            select.selectedIndex = i;
                            break;
                        }
                    }
                }
                
                // Check for mobile device and make adjustments if needed
                if (window.innerWidth <= 768) {
                    // Ensure the modal content is positioned well on mobile
                    const modalContent = modal.querySelector('.modal-content');
                    if (modalContent) {
                        modalContent.scrollTop = 0;
                    }
                }
                
                console.log("Modal should be visible now");
            } else {
                console.error("Modal element not found");
            }
        }
        
        // Add click event to all plan buttons
        planButtons.forEach(button => {
            // Remove any existing listeners by cloning and replacing
            const newBtn = button.cloneNode(true);
            button.parentNode.replaceChild(newBtn, button);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Plan button clicked");
                
                // Get plan type from the button's parent card
                const planCard = this.closest('.plan-card');
                const planType = planCard.querySelector('.plan-header h3').textContent.trim();
                
                openModal(planType);
                return false;
            });
        });
        
        // Close modal when clicking X button
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal();
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Function to close modal
        function closeModal() {
            if (modal) {
                modal.style.cssText = "display: none !important;";
                document.body.style.overflow = ''; // Restore scrolling
                console.log('Modal closed');
                
                // Reset form if it exists
                const membershipForm = document.getElementById('membershipForm');
                if (membershipForm && typeof membershipForm.reset === 'function') {
                    membershipForm.reset();
                    
                    // Clear any validation styling
                    const errorFields = membershipForm.querySelectorAll('.error');
                    errorFields.forEach(field => field.classList.remove('error'));
                    
                    // Hide any error messages
                    const formErrors = document.getElementById('formErrors');
                    if (formErrors) {
                        formErrors.textContent = '';
                        formErrors.style.display = 'none';
                    }
                }
            }
        }
        
        // Form submission logic - keep existing code
        if (membershipForm) {
            membershipForm.onsubmit = function(e) {
                e.preventDefault();
                
                if (validateForm()) {
                    submitForm();
                }
                
                return false;
            };
        }
        
        // Form validation function
        function validateForm() {
            const formErrors = document.getElementById('formErrors');
            formErrors.textContent = ''; // Clear previous errors
            formErrors.style.display = 'none'; // Hide error container by default
            let isValid = true;
            
            // Check required fields
            const requiredFields = membershipForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
                formErrors.textContent += 'Please enter a valid email address. ';
            }
            
            // Phone validation
            const phoneField = document.getElementById('phone');
            if (phoneField.value && !/^\d{10}$/.test(phoneField.value)) {
                isValid = false;
                phoneField.classList.add('error');
                formErrors.textContent += 'Please enter a valid 10-digit phone number. ';
            }
            
            if (!isValid) {
                formErrors.textContent = formErrors.textContent || 'Please fill in all required fields.';
                formErrors.style.display = 'block'; // Only show if there are errors
            }
            
            return isValid;
        }
        
        // Add phone input validation to allow only digits
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Remove any non-digit characters
                this.value = this.value.replace(/\D/g, '');
            });
            
            // Block non-digit key presses
            phoneInput.addEventListener('keypress', function(e) {
                if (e.key < '0' || e.key > '9') {
                    e.preventDefault();
                }
            });
        }
        
        // Form submission function
        function submitForm() {
            const formData = new FormData(membershipForm);
            const formErrors = document.getElementById('formErrors');
            
            // Replace with your deployed Google Apps Script URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzjeS_uXQtskNgDpph3CZ9fOvvW65nw5ijxabPisA1AaxjnJ9PjpiDcmZqP1keymkNV/exec';

            
            // Disable submit button
            const submitBtn = membershipForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            })
            .then(() => {
                // Create a simpler success message
                const membershipType = document.getElementById('membershipType').value;
                const studentName = document.getElementById('studentName').value;
                
                // Replace form with success message
                membershipForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Application Submitted Successfully!</h3>
                        <p>Thank you for your interest in our ${membershipType} membership program. We've received your application for ${studentName}.</p>
                        <div class="success-actions">
                            <button type="button" id="closeSuccessBtn" class="close-success-btn">Close</button>
                        </div>
                    </div>
                `;
                
                // Add event listener to the close button
                document.getElementById('closeSuccessBtn').addEventListener('click', function() {
                    closeModal();
                });
                
                // Close modal automatically after 8 seconds
                setTimeout(() => {
                    closeModal();
                }, 8000);
            })
            .catch(error => {
                console.error('Error:', error);
                formErrors.style.display = 'block';
                formErrors.textContent = 'There was an error submitting your application. Please try again.';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            });
        }
    });
    
    // Add an immediate check to see if the script is running correctly
    console.log('Membership script executed');
})();
