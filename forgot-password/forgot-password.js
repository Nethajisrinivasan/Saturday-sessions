document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    const messageBox = document.getElementById('messageBox');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateEmail(email) {
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    }

    function showLoading(loading) {
        submitBtn.disabled = loading;
        btnText.style.opacity = loading ? '0' : '1';
        spinner.classList.toggle('hidden', !loading);
    }

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.classList.remove('hidden', 'success', 'error');
        messageBox.classList.add(type);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Clear previous errors
        emailError.textContent = '';
        messageBox.classList.add('hidden');

        // Validate email
        const email = emailInput.value.trim();
        const emailErrorMessage = validateEmail(email);
        
        if (emailErrorMessage) {
            emailError.textContent = emailErrorMessage;
            emailInput.focus();
            return;
        }

        try {
            showLoading(true);

            // Replace this with your actual API call
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Show success message
            showMessage('Password reset link has been sent to your email', 'success');
            form.reset();

        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            showLoading(false);
        }
    }

    // Real-time email validation
    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        const errorMessage = validateEmail(email);
        emailError.textContent = errorMessage;
    });

    // Form submission
    form.addEventListener('submit', handleSubmit);
}); 