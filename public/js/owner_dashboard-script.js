class OwnerDashboard {
    constructor() {
        this.selectedListings = [];
        this.allListings = [];
        this.loadListings('listings-container');
    }

    // Fetch listing details
    static async viewDetails(listingId) {
        try {
            const response = await fetch(`/api/listings/${listingId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch listing details');
            }
            const listingDetails = await response.json();
            GeneralDashboard.displayListingDetails(listingDetails);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load listing details. Please try again.');
        }
    }

    // Create a listing card
    static createListingCard(listing) {
        if (!listing.verified) {
            return '';
        }
        if (!listing.image) {
            listing.image = "/images/pexels-markusspiske-102155.jpg";
        }
        return `
            <div class="col-md-4 mb-4">
                <div class="card listing-card">
                    <img src="${listing.image}" class="card-img-top" style="height: 500px; width: 100%; object-fit: cover">
                    <div class="card-body">
                        <h5 class="card-title">${listing.title}</h5>
                        <p class="card-text">$${listing.price}/month</p>
                        <div class="form-check">
                            <input class="form-check-input compare-checkbox" type="checkbox" value="${listing.id}" id="compare-${listing.id}" onchange="GeneralDashboard.handleSelection('${listing.id}')">
                            <label class="form-check-label" for="compare-${listing.id}">
                                Select for Comparison
                            </label>
                        </div>
                        <a onclick="GeneralDashboard.viewDetails('${listing.id}')" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Handle checkbox selection for comparison
    static handleSelection(listingId) {
        const checkbox = document.getElementById(`compare-${listingId}`);

        if (checkbox.checked) {
            if (this.selectedListings.length < 4) {
                this.selectedListings.push(listingId);
            } else {
                checkbox.checked = false;
                alert("You can only compare up to 4 listings.");
            }
        } else {
            this.selectedListings = this.selectedListings.filter(id => id !== listingId);
        }

        // Enable/disable the "Compare Selected" button
        const compareButton = document.getElementById("compare-selected");
        compareButton.disabled = this.selectedListings.length === 0;
    }

    // Filter listings based on the price range
    static filterListings() {
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;

        // Convert input values to numbers
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;

        // Filter listings based on price range
        const filteredListings = this.allListings.filter(listing => {
            return listing.price >= min && listing.price <= max;
        });

        // Redisplay the filtered listings
        this.displayListings(filteredListings, 'owner-listings-container');
    }

    // Display listings dynamically
    static displayListings(listings, containerId) {
        const listingsContainer = document.getElementById(containerId);
        if (listings.length === 0) {
            listingsContainer.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="height: 200px; width: 100%;">
                <h3 class="text-center text-muted">Not Found</h3>
            </div>`;
        } else {
            listingsContainer.innerHTML = listings
                .map(GeneralDashboard.createListingCard)
                .filter(card => card !== '') // Remove undefined results (from unverified listings)
                .join('');
        }
    }

    // Display listing details in a modal
    static displayListingDetails(listing) {
        const detailsContainer = document.getElementById('listing-details');
        if (!listing.image) {
            listing.image = "/images/pexels-markusspiske-102155.jpg";
        }
        detailsContainer.innerHTML = `
            <h3>${listing.title}</h3>
            <img src="${listing.image}" class="img-fluid mb-3" style="height: 500px; width: 100%; object-fit: cover">
            <p><strong>Price:</strong> $${listing.price}/month</p>
            <p><strong>Address:</strong> ${listing.address}
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}" target="_blank" rel="noopener noreferrer">
                    <br />Search in Google Maps
                </a>
            </p>
            <p><strong>Description:</strong> ${listing.description}</p>
            <p><strong>Contact:</strong> ${listing.contact}</p>
        `;

        const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
        detailsModal.show();
    }

    // Load listings from the server
    async loadListings(containerId) {
        try {
            const response = await fetch('/api/listings');
            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }
            this.allListings = await response.json(); // Save all listings globally
            const listingsContainer = document.getElementById(containerId);
            if (!listingsContainer) {
                console.error(`Container with ID "${containerId}" not found.`);
                return;
            }

            // Initially display all listings
            GeneralDashboard.displayListings(this.allListings, containerId);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load listings. Please try again.');
        }
    }

    // Submit form to compare selected listings
    static compareListingsFormSubmit(event) {
        event.preventDefault();
        if (this.selectedListings.length > 0) {
            localStorage.setItem("selectedListings", JSON.stringify(this.selectedListings));
            window.location.href = "/compare"; // Redirect to the comparison page
        }
    }

    // Initialize event listeners
    static initialize() {
        document.getElementById('create-post-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append("title", document.getElementById("post-title").value);
            formData.append("price", document.getElementById("post-price").value);
            formData.append("address", document.getElementById("post-address").value);
            formData.append("description", document.getElementById("post-description").value);
            formData.append("contact", document.getElementById("post-contact").value);
            formData.append("image", document.getElementById("post-image").files[0]);

            console.log("Creating post with values:", formData.entries());

            fetch('/api/create-post', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .catch(error => console.error('Error:', error));

            // Clear the form
            e.target.reset();

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
            modal.hide();
            location.reload();
        });

        // Filter event listener
        document.getElementById('filter-form').addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form submission
            GeneralDashboard.filterListings();
        });

        // Reset filter event listener
        document.getElementById('reset-filters').addEventListener('click', () => {
            document.getElementById('min-price').value = '';
            document.getElementById('max-price').value = '';
            GeneralDashboard.displayListings(GeneralDashboard.allListings, 'owner-listings-container');
        });

        // Comparison form submit event listener
        document.getElementById("compare-form").addEventListener("submit", (e) => {
            GeneralDashboard.compareListingsFormSubmit(e);
        });
    }
}

// Initialize dashboard after the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    OwnerDashboard.initialize();
});


