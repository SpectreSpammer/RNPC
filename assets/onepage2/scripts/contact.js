document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(event) {
        // Prevent form from submitting immediately
        event.preventDefault();

        // Get the reCAPTCHA response
        const recaptchaResponse = grecaptcha.getResponse();

        if (recaptchaResponse.length === 0) {
            // If CAPTCHA is not completed, show an alert to the user
            alert('Please complete the CAPTCHA before submitting.');
        } else {
            // Set the reCAPTCHA response in the hidden field
            document.getElementById('captchaResponse').value = recaptchaResponse;

            // Submit the form
            form.submit();
        }
    });
});