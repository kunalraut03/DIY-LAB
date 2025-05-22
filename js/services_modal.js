document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('serviceEnquiryModal');
    const btn = document.getElementById('openServiceModal');
    const span = document.querySelector('.close-modal');
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    });
    span.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    const mobileInput = document.getElementById('mobile');
    mobileInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    const form = document.getElementById('serviceEnquiryForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });
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
    document.querySelector('.close-notification').addEventListener('click', function() {
        successNotification.classList.remove('show');
    });
    function validateForm() {
        let isValid = true;
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        const name = document.getElementById('name').value.trim();
        if (!name) {
            document.getElementById('nameError').textContent = 'Please enter your name.';
            isValid = false;
        }
        const email = document.getElementById('email').value.trim();
        if (!email) {
            document.getElementById('emailError').textContent = 'Please enter your email.';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email.';
            isValid = false;
        }
        const mobile = document.getElementById('mobile').value.trim();
        if (!mobile) {
            document.getElementById('mobileError').textContent = 'Please enter your mobile number.';
            isValid = false;
        } else if (!isValidMobile(mobile)) {
            document.getElementById('mobileError').textContent = 'Please enter a valid 10-digit mobile number.';
            isValid = false;
        }
        const services = document.querySelectorAll('input[name="service"]:checked');
        if (services.length === 0) {
            document.getElementById('serviceError').textContent = 'Please select at least one service.';
            isValid = false;
        }
        const description = document.getElementById('description').value.trim();
        if (!description) {
            document.getElementById('descriptionError').textContent = 'Please provide a description.';
            isValid = false;
        }
        const timeline = document.getElementById('timeline').value.trim();
        if (!timeline || timeline < 1) {
            document.getElementById('timelineError').textContent = 'Please enter a valid timeline.';
            isValid = false;
        }
        const hours = document.getElementById('hours').value.trim();
        if (!hours || hours < 1 || hours > 24) {
            document.getElementById('hoursError').textContent = 'Please enter valid hours (1-24).';
            isValid = false;
        }
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
        const formData = new FormData(form);
        const formObject = {};
        const services = [];
        document.querySelectorAll('input[name="service"]:checked').forEach(checkbox => {
            services.push(checkbox.value);
        });
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        formObject.service = services;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
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
            form.reset();
            modal.style.display = 'none';
            successNotification.classList.add('show');
            setTimeout(() => {
                successNotification.classList.remove('show');
            }, 5000);
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Sorry, there was an error submitting your form. Please try again later.');
        })
        .finally(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    }
});
