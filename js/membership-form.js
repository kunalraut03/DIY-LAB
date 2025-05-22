(function() {
    console.log('Membership form script loaded');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Membership script loaded');
        const modal = document.getElementById('membershipModal');
        const planButtons = document.querySelectorAll('.plan-button');
        const closeBtn = document.querySelector('.close-btn');
        const membershipForm = document.getElementById('membershipForm');
        console.log("Modal element found:", modal !== null);
        console.log("Plan buttons found:", planButtons.length);
        function openModal(planType) {
            if (modal) {
                modal.style.cssText = "display: block !important;";
                document.body.style.overflow = 'hidden';
                modal.scrollTo(0, 0);
                if (planType) {
                    const select = document.getElementById('membershipType');
                    for (let i = 0; i < select.options.length; i++) {
                        if (select.options[i].value === planType) {
                            select.selectedIndex = i;
                            break;
                        }
                    }
                }
                if (window.innerWidth <= 768) {
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
        planButtons.forEach(button => {
            const newBtn = button.cloneNode(true);
            button.parentNode.replaceChild(newBtn, button);
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Plan button clicked");
                const planCard = this.closest('.plan-card');
                const planType = planCard.querySelector('.plan-header h3').textContent.trim();
                openModal(planType);
                return false;
            });
        });
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal();
            });
        }
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        function closeModal() {
            if (modal) {
                modal.style.cssText = "display: none !important;";
                document.body.style.overflow = '';
                console.log('Modal closed');
                const membershipForm = document.getElementById('membershipForm');
                if (membershipForm && typeof membershipForm.reset === 'function') {
                    membershipForm.reset();
                    const errorFields = membershipForm.querySelectorAll('.error');
                    errorFields.forEach(field => field.classList.remove('error'));
                    const formErrors = document.getElementById('formErrors');
                    if (formErrors) {
                        formErrors.textContent = '';
                        formErrors.style.display = 'none';
                    }
                }
            }
        }
        if (membershipForm) {
            membershipForm.onsubmit = function(e) {
                e.preventDefault();
                if (validateForm()) {
                    submitForm();
                }
                return false;
            };
        }
        function validateForm() {
            const formErrors = document.getElementById('formErrors');
            formErrors.textContent = '';
            formErrors.style.display = 'none';
            let isValid = true;
            const requiredFields = membershipForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            const emailField = document.getElementById('email');
            if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
                formErrors.textContent += 'Please enter a valid email address. ';
            }
            const phoneField = document.getElementById('phone');
            if (phoneField.value && !/^\d{10}$/.test(phoneField.value)) {
                isValid = false;
                phoneField.classList.add('error');
                formErrors.textContent += 'Please enter a valid 10-digit phone number. ';
            }
            if (!isValid) {
                formErrors.textContent = formErrors.textContent || 'Please fill in all required fields.';
                formErrors.style.display = 'block';
            }
            return isValid;
        }
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/\D/g, '');
            });
            phoneInput.addEventListener('keypress', function(e) {
                if (e.key < '0' || e.key > '9') {
                    e.preventDefault();
                }
            });
        }
        function submitForm() {
            const formData = new FormData(membershipForm);
            const formErrors = document.getElementById('formErrors');
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzjeS_uXQtskNgDpph3CZ9fOvvW65nw5ijxabPisA1AaxjnJ9PjpiDcmZqP1keymkNV/exec';
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
                const membershipType = document.getElementById('membershipType').value;
                const studentName = document.getElementById('studentName').value;
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
                document.getElementById('closeSuccessBtn').addEventListener('click', function() {
                    closeModal();
                });
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
    console.log('Membership script executed');
})();
