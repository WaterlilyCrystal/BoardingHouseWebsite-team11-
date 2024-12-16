class RegisterController {
    constructor() {
        this.initialize();
    }

    // Method to handle form submission
    async handleFormSubmit(e) {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // Client-side validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            this.displayError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            this.displayError("Passwords do not match.");
            return;
        }

        try {
            // Submit registration data to the server
            const response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const message = await response.text();

            if (response.ok) {
                alert(message);
                window.location.href = "/login"; // Redirect to login page
            } else {
                this.displayError(message);
            }
        } catch (err) {
            console.error("Error:", err);
            this.displayError("An unexpected error occurred. Please try again.");
        }
    }

    // Display error messages on the form
    displayError(message) {
        const errorElement = document.getElementById("formError");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        } else {
            alert(message); // Fallback if no error container exists
        }
    }

    // Initialize event listeners
    initialize() {
        const form = document.querySelector("form");
        if (form) {
            form.addEventListener("submit", (e) => this.handleFormSubmit(e));
        }
    }
}

// Initialize the RegisterController class after the page has loaded
document.addEventListener("DOMContentLoaded", () => {
    new RegisterController();
});
