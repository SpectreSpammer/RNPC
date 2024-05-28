document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Create a new FormData object from the form
    var formData = new FormData(this);

    // Send the form data using fetch
    fetch(this.action, {
        method: this.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // If the submission is successful, refresh the page
            window.location.reload();
        } else {
            alert('Something went wrong. Please try again.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    });
});