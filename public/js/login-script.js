class LoginController {
    constructor() {
        // Call initialize to set up event listeners and other initialization logic
        this.initialize();
    }

    // Initialization method
    initialize() {
        // Add submit event listener to the form
        document.querySelector("form").addEventListener("submit", this.handleSubmit);
    }

    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();

        // Get the email and password values from the form
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            // Send login request to the server
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            // Handle server response
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                // Redirect based on user role
                if (data.role === "Owner") {
                    window.location.href = "/owner_dashboard";
                } else if (data.role === "Renter") {
                    window.location.href = "/user_dashboard";
                } else if (data.role === "Admin") {
                    window.location.href = "/admin_dashboard";
                }
            } else {
                const message = await response.text();
                alert(`Error: ${message}`);
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An unexpected error occurred.");
        }
    }
}

// Initialize the LoginController class after the page has loaded
document.addEventListener("DOMContentLoaded", () => {
    new LoginController();
});

// document.querySelector("form").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     try {
//         const response = await fetch("/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password }),
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log(data)
//             // Redirect based on role
//             if (data.role === "Owner") {
//                 window.location.href = "/owner_dashboard";
//             } else if (data.role === "Renter") {
//                 window.location.href = "/user_dashboard";
//             } else if (data.role === "Admin") {
//                 window.location.href = "/admin_dashboard";
//             }
//         } else {
//             const message = await response.text();
//             alert(`Error: ${message}`);
//         }
//     } catch (err) {
//         console.error("Error:", err);
//         alert("An unexpected error occurred.");
//     }
// });