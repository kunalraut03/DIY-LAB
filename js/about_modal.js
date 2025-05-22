document.addEventListener('DOMContentLoaded', function() {
    const visitModal = document.getElementById('visitModal');
    const openVisitModalButton = document.getElementById('openVisitModal');
    const closeModal = document.querySelector('.close-modal');
    const visitForm = document.getElementById('visitForm');
    const purposeSelect = document.getElementById('purpose');
    const otherPurposeContainer = document.getElementById('otherPurposeContainer');

    openVisitModalButton.addEventListener('click', function() {
        visitModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        visitModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === visitModal) {
            visitModal.style.display = 'none';
        }
    });

    purposeSelect.addEventListener('change', function() {
        if (this.value === 'Others') {
            otherPurposeContainer.style.display = 'block';
        } else {
            otherPurposeContainer.style.display = 'none';
        }
    });

    visitForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = new FormData(visitForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            submitToGoogleSheet(formObject);
        }
    });

    function validateForm() {
        let isValid = true;
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        const requiredFields = ['fullName', 'email', 'mobile', 'organization'];
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                document.getElementById(`${field}Error`).textContent = 'This field is required';
                isValid = false;
            }
        });
        const email = document.getElementById('email').value;
        if (email && !isValidEmail(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        const mobile = document.getElementById('mobile').value;
        if (mobile && !isValidMobile(mobile)) {
            document.getElementById('mobileError').textContent = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        }
        if (purposeSelect.value === 'Others' && !document.getElementById('otherPurpose').value.trim()) {
            document.getElementById('otherPurposeError').textContent = 'Please specify your purpose';
            isValid = false;
        }
        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidMobile(mobile) {
        const mobileRegex = /^[0-9]{10}$/;
        return mobileRegex.test(mobile);
    }

    function submitToGoogleSheet(formData) {
        const submitButton = visitForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz8MrJJvEthmq6O2yQ0RPnWCn_b98ejyGLL8343Qa8mv6Pa6_7qNjDDUnOsIHhLp8aG/exec';
        const requestData = new URLSearchParams(formData).toString();
        fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                const notification = document.createElement('div');
                notification.className = 'submission-notification success';
                notification.innerHTML = `
                    <div class="notification-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="notification-content">
                        <h3>Thank you!</h3>
                        <p>Your visit request has been submitted successfully.</p>
                    </div>
                    <button class="notification-close">&times;</button>
                `;
                document.body.appendChild(notification);
                if (!document.getElementById('notification-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'notification-styles';
                    styles.textContent = `
                        .submission-notification {
                            position: fixed;
                            bottom: 30px;
                            right: 30px;
                            display: flex;
                            align-items: center;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                            z-index: 1000;
                            max-width: 400px;
                            animation: slide-in 0.5s ease-out forwards;
                        }
                        .submission-notification.success {
                            background-color: #e7f7e8;
                            border-left: 4px solid #28a745;
                        }
                        .submission-notification.error {
                            background-color: #ffecec;
                            border-left: 4px solid #dc3545;
                        }
                        .notification-icon {
                            margin-right: 15px;
                            font-size: 24px;
                        }
                        .submission-notification.success .notification-icon {
                            color: #28a745;
                        }
                        .submission-notification.error .notification-icon {
                            color: #dc3545;
                        }
                        .notification-content {
                            flex-grow: 1;
                        }
                        .notification-content h3 {
                            margin: 0 0 5px;
                            font-size: 18px;
                        }
                        .notification-content p {
                            margin: 0;
                            color: #666;
                        }
                        .notification-close {
                            background: none;
                            border: none;
                            color: #999;
                            font-size: 20px;
                            cursor: pointer;
                            padding: 0;
                            margin-left: 10px;
                        }
                        @keyframes slide-in {
                            from {
                                transform: translateX(100%);
                                opacity: 0;
                            }
                            to {
                                transform: translateX(0);
                                opacity: 1;
                            }
                        }
                        @keyframes fade-out {
                            from {
                                transform: translateX(0);
                                opacity: 1;
                            }
                            to {
                                transform: translateX(100%);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(styles);
                }
                notification.querySelector('.notification-close').addEventListener('click', () => {
                    notification.style.animation = 'fade-out 0.5s ease-in forwards';
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                });
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.animation = 'fade-out 0.5s ease-in forwards';
                        setTimeout(() => {
                            notification.remove();
                        }, 500);
                    }
                }, 5000);
                visitForm.reset();
                visitModal.style.display = 'none';
            } else {
                const notification = document.createElement('div');
                notification.className = 'submission-notification error';
                notification.innerHTML = `
                    <div class="notification-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="notification-content">
                        <h3>Submission Error</h3>
                        <p>Something went wrong. Please try again.</p>
                    </div>
                    <button class="notification-close">&times;</button>
                `;
                document.body.appendChild(notification);
                notification.querySelector('.notification-close').addEventListener('click', () => {
                    notification.style.animation = 'fade-out 0.5s ease-in forwards';
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                });
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.animation = 'fade-out 0.5s ease-in forwards';
                        setTimeout(() => {
                            notification.remove();
                        }, 500);
                    }
                }, 5000);
            }
        })
        .catch(error => {
            const notification = document.createElement('div');
            notification.className = 'submission-notification error';
            notification.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="notification-content">
                    <h3>Connection Error</h3>
                    <p>An error occurred. Please try again later.</p>
                </div>
                <button class="notification-close">&times;</button>
            `;
            document.body.appendChild(notification);
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.style.animation = 'fade-out 0.5s ease-in forwards';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            });
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'fade-out 0.5s ease-in forwards';
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                }
            }, 5000);
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    }
});
