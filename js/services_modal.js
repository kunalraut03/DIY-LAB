document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    const modal = document.getElementById('serviceEnquiryModal');
    
    // Get the button that opens the modal
    const btn = document.getElementById('openServiceModal');
    
    // Get the <span> element that closes the modal
    const span = document.querySelector('.close-modal');
    
    // When the user clicks the button, open the modal
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    });
    
    // When the user clicks on <span> (x), close the modal
    span.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Restrict mobile input to only digits
    const mobileInput = document.getElementById('mobile');
    mobileInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Form validation and submission
    const form = document.getElementById('serviceEnquiryForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Create success notification element
    const successNotification = document.createElement('div');
    successNotification.className = 'success-notification';
    successNotification.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Thank you for your enquiry!</h3>
            <p>We will get back to you soon.</p>
            <button class="close-notification">OK</button>
        </div>
    `;
    document.body.appendChild(successNotification);
    
    // Add event listener to close notification
    document.querySelector('.close-notification').addEventListener('click', function() {
        successNotification.classList.remove('show');
    });
    
    function validateForm() {
        let isValid = true;
        
        // Clear previous error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        // Name validation
        const name = document.getElementById('name').value.trim();
        if (!name) {
            document.getElementById('nameError').textContent = 'Please enter your name.';
            isValid = false;
        }
        
        // Email validation
        const email = document.getElementById('email').value.trim();
        if (!email) {
            document.getElementById('emailError').textContent = 'Please enter your email.';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email.';
            isValid = false;
        }
        
        // Mobile validation
        const mobile = document.getElementById('mobile').value.trim();
        if (!mobile) {
            document.getElementById('mobileError').textContent = 'Please enter your mobile number.';
            isValid = false;
        } else if (!isValidMobile(mobile)) {
            document.getElementById('mobileError').textContent = 'Please enter a valid 10-digit mobile number.';
            isValid = false;
        }
        
        // Check if at least one service is selected
        const services = document.querySelectorAll('input[name="service"]:checked');
        if (services.length === 0) {
            document.getElementById('serviceError').textContent = 'Please select at least one service.';
            isValid = false;
        }
        
        // Description validation
        const description = document.getElementById('description').value.trim();
        if (!description) {
            document.getElementById('descriptionError').textContent = 'Please provide a description.';
            isValid = false;
        }
        
        // Timeline validation
        const timeline = document.getElementById('timeline').value.trim();
        if (!timeline || timeline < 1) {
            document.getElementById('timelineError').textContent = 'Please enter a valid timeline.';
            isValid = false;
        }
        
        // Hours validation
        const hours = document.getElementById('hours').value.trim();
        if (!hours || hours < 1 || hours > 24) {
            document.getElementById('hoursError').textContent = 'Please enter valid hours (1-24).';
            isValid = false;
        }
        
        // Material validation
        const material = document.querySelector('input[name="material"]:checked');
        if (!material) {
            document.getElementById('materialError').textContent = 'Please select an option.';
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidMobile(mobile) {
        const re = /^\d{10}$/;
        return re.test(mobile);
    }
    
    function submitForm() {
        // Get form data
        const formData = new FormData(form);
        const formObject = {};
        
        // Convert services checkboxes to array
        const services = [];
        document.querySelectorAll('input[name="service"]:checked').forEach(checkbox => {
            services.push(checkbox.value);
        });
        
        // Build form data object
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Special handling for services array
        formObject.service = services;
        
        // Display loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Replace this URL with your deployed Google Apps Script web app URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyVSpqvY-wZeD-Btnj4Kv9pdXszF2cQ7SYj__SO0YIYd1x43EXknFsu_Jicu4pJyHXGpw/exec';
        
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formObject),
        })
        .then(response => {
            // Show styled success message
            form.reset();
            modal.style.display = 'none';
            successNotification.classList.add('show');
            
            // Hide notification after 5 seconds
            setTimeout(() => {
                successNotification.classList.remove('show');
            }, 5000);
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Sorry, there was an error submitting your form. Please try again later.');
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    }
});
