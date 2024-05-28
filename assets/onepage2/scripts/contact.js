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
            // If the submission is successful, show the success modal
            $('#successModal').modal('show');
        } else {
            alert('Something went wrong. Please try again.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    });
});

// Add event listener to the close button of the modal
document.getElementById('closeModalBtn').addEventListener('click', function() {
    // Reload the page after closing the modal
    window.location.reload();
});