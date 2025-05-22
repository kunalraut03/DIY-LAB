document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('workshopModal');
    const openModalBtn = document.getElementById('openWorkshopModal');
    const closeBtn = document.getElementsByClassName('close-modal')[0];
    const form = document.getElementById('workshopForm');
    const otherCheckbox = document.getElementById('other');
    const otherInputContainer = document.getElementById('otherInputContainer');
    const phoneInput = document.getElementById('phone');
    openModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    });
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    phoneInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
    otherCheckbox.addEventListener('change', function() {
        otherInputContainer.style.display = this.checked ? 'block' : 'none';
    });
    otherInputContainer.style.display = 'none';
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });
    function validateForm() {
        let isValid = true;
        clearErrorMessages();
        const name = document.getElementById('name').value.trim();
        if (name === '') {
            displayError('nameError', 'Please enter your name');
            isValid = false;
        }
        const email = document.getElementById('email').value.trim();
        if (email === '') {
            displayError('emailError', 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email)) {
            displayError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        const phone = document.getElementById('phone').value.trim();
        if (phone === '') {
            displayError('phoneError', 'Please enter your phone number');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            displayError('phoneError', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
        const workshopCheckboxes = document.querySelectorAll('input[name="workshop"]:checked');
        if (workshopCheckboxes.length === 0) {
            displayError('workshopError', 'Please select at least one workshop');
            isValid = false;
        }
        if (otherCheckbox.checked) {
            const otherWorkshop = document.getElementById('otherWorkshop').value.trim();
            if (otherWorkshop === '') {
                displayError('otherWorkshopError', 'Please specify the workshop topic');
                isValid = false;
            }
        }
        const startDate = document.getElementById('startDate').value;
        if (startDate === '') {
            displayError('startDateError', 'Please select a preferred start date');
            isValid = false;
        }
        return isValid;
    }
    function clearErrorMessages() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(function(element) {
            element.textContent = '';
        });
        document.getElementById('formErrors').textContent = '';
    }
    function displayError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function isValidPhone(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }
    function submitForm() {
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            institution: document.getElementById('institution').value.trim(),
            workshop: getSelectedWorkshops(),
            otherWorkshop: document.getElementById('otherWorkshop').value.trim(),
            startDate: document.getElementById('startDate').value
        };
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyUCvjiDWGuqE_xkfDe4LRavCK7p8_lPA_QzcN5ppHWT86VK_k0wtOGuYkK9b7E3HJi/exec';
        const formElement = document.createElement('form');
        formElement.method = 'POST';
        formElement.action = scriptURL;
        for (const key in formData) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = formData[key];
            formElement.appendChild(hiddenField);
        }
        document.body.appendChild(formElement);
        fetch(scriptURL, {
            method: 'POST',
            body: new FormData(formElement)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Registration Successful!</h3>
                    <p>Your workshop registration has been submitted successfully.</p>
                    <p>We will contact you soon with further details.</p>
                `;
                const modalContent = document.querySelector('.modal-content');
                const formContent = form.innerHTML;
                form.style.display = 'none';
                modalContent.appendChild(successMessage);
                const closeSuccessBtn = document.createElement('button');
                closeSuccessBtn.className = 'close-success-btn';
                closeSuccessBtn.textContent = 'Close';
                successMessage.appendChild(closeSuccessBtn);
                closeSuccessBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                    setTimeout(() => {
                        form.innerHTML = formContent;
                        form.style.display = 'block';
                        modalContent.removeChild(successMessage);
                        form.reset();
                        const newOtherCheckbox = document.getElementById('other');
                        const newOtherInputContainer = document.getElementById('otherInputContainer');
                        const newPhoneInput = document.getElementById('phone');
                        if (newOtherCheckbox && newOtherInputContainer) {
                            newOtherCheckbox.addEventListener('change', function() {
                                newOtherInputContainer.style.display = this.checked ? 'block' : 'none';
                            });
                            newOtherInputContainer.style.display = 'none';
                        }
                        if (newPhoneInput) {
                            newPhoneInput.addEventListener('input', function(e) {
                                this.value = this.value.replace(/\D/g, '');
                                if (this.value.length > 10) {
                                    this.value = this.value.slice(0, 10);
                                }
                            });
                        }
                    }, 500);
                });
            } else {
                const formErrors = document.getElementById('formErrors');
                formErrors.textContent = 'Error submitting form. Please try again later.';
                formErrors.style.display = 'block';
                console.error('Error:', data.error);
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        })
        .catch(error => {
            const formErrors = document.getElementById('formErrors');
            formErrors.textContent = 'Error submitting form. Please try again later.';
            formErrors.style.display = 'block';
            console.error('Error:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
        document.body.removeChild(formElement);
    }
    function getSelectedWorkshops() {
        const checkboxes = document.querySelectorAll('input[name="workshop"]:checked');
        const selectedWorkshops = Array.from(checkboxes)
            .filter(checkbox => checkbox.id !== 'other')
            .map(checkbox => checkbox.value);
        return selectedWorkshops.join(', ');
    }
});
