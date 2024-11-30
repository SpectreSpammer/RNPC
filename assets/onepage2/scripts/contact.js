document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    let lastSubmissionTime = 0;
    const minTimeBetweenSubmissions = 30000; // 30 seconds
    let submissionCount = 0;
    const maxSubmissionsPerHour = 5;
    let lastHourSubmissions = [];

    // Create honeypot field
    const honeypotField = document.createElement('input');
    honeypotField.type = 'text';
    honeypotField.name = 'website';
    honeypotField.style.display = 'none';
    form.appendChild(honeypotField);

    // Input validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]{10,15}$/,
        location: /^[a-zA-Z0-9\s\,\.\-]{5,100}$/
    };

    // Check for suspicious patterns
    function containsSuspiciousPatterns(text) {
        const suspiciousPatterns = [
            /<[^>]*>/,  // HTML tags
            /http[s]?:\/\//i,  // URLs
            /\[url\]/i,  // BBCode
            /viagra|casino|lottery/i  // Common spam words
        ];
        return suspiciousPatterns.some(pattern => pattern.test(text));
    }

    // Rate limiting check
    function checkRateLimit() {
        const now = Date.now();
        
        // Clear old submissions
        lastHourSubmissions = lastHourSubmissions.filter(time => 
            now - time < 3600000 // 1 hour in milliseconds
        );

        if (now - lastSubmissionTime < minTimeBetweenSubmissions) {
            throw new Error('Please wait 30 seconds before submitting again.');
        }

        if (lastHourSubmissions.length >= maxSubmissionsPerHour) {
            throw new Error('Maximum submission limit reached. Please try again later.');
        }
    }

    // Form validation
    function validateForm(formData) {
        // Check honeypot
        if (formData.get('website')) {
            throw new Error('Invalid submission detected.');
        }

        // Validate required fields
        for (const [field, pattern] of Object.entries(patterns)) {
            const value = formData.get(field);
            if (!value || !pattern.test(value)) {
                throw new Error(`Invalid ${field} format. Please check your input.`);
            }
        }

        // Check for suspicious content
        const details = formData.get('details');
        if (containsSuspiciousPatterns(details)) {
            throw new Error('Suspicious content detected. Please remove any URLs or special formatting.');
        }

        // Validate message length
        if (details.length < 10 || details.length > 1000) {
            throw new Error('Message must be between 10 and 1000 characters.');
        }

        // Check reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            throw new Error('Please complete the CAPTCHA before submitting.');
        }
        formData.append('g-recaptcha-response', recaptchaResponse);
    }

    // Form submission handler
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        try {
            const formData = new FormData(this);
            
            // Perform spam checks
            checkRateLimit();
            validateForm(formData);

            // Update rate limiting data
            lastSubmissionTime = Date.now();
            lastHourSubmissions.push(lastSubmissionTime);

            // Send the form data using fetch
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success modal
                $('#successModal').modal('show');
                form.reset();
            } else {
                throw new Error('Form submission failed. Please try again.');
            }

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });

    // Add event listener to the close button of the modal
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        window.location.reload();
    });
});
