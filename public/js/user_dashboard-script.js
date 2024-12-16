class GeneralDashboard {
    constructor() {
        this.selectedListings = [];
        this.allListings = [];
        this.loadListings('listings-container');
    }

    static createListingCard(listing) {
        if (!listing.verified) {
            return;
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
                            <input 
                                class="form-check-input compare-checkbox" 
                                type="checkbox" 
                                value="${listing.id}" 
                                id="compare-${listing.id}"
                                onchange="dashboard.handleSelection('${listing.id}')"
                            >
                            <label class="form-check-label" for="compare-${listing.id}">
                                Select for Comparison
                            </label>
                        </div>
                        <a onclick="dashboard.viewDetails('${listing.id}')" class="btn btn-primary mt-2">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Handle checkbox selection
    handleSelection(listingId) {
        const checkbox = document.getElementById(`compare-${listingId}`);
        
        if (checkbox.checked) {
            // Add listing ID to the selected array
            if (this.selectedListings.length < 4) {
                this.selectedListings.push(listingId);
            } else {
                checkbox.checked = false;
                alert("You can only compare up to 4 listings.");
            }
        } else {
            // Remove listing ID from the selected array
            this.selectedListings = this.selectedListings.filter((id) => id !== listingId);
        }
    
        // Enable/disable the "Compare Selected" button
        const compareButton = document.getElementById("compare-selected");
        compareButton.disabled = this.selectedListings.length === 0;
    }

    // Submit form to compare selected listings
    submitCompareForm(e) {
        e.preventDefault();
    
        if (this.selectedListings.length > 0) {
            // Store selected listing IDs in localStorage and navigate to the comparison page
            localStorage.setItem("selectedListings", JSON.stringify(this.selectedListings));
            window.location.href = "/compare"; // Redirect to the comparison page
        }
    }

    // Load listings from the server and initialize the global `allListings`
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
            this.displayListings(this.allListings, containerId);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load listings. Please try again.');
        }
    }

    // Display listings dynamically in the container
    displayListings(listings, containerId) {
        const listingsContainer = document.getElementById(containerId);
        if (listings.length === 0) {
            listingsContainer.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="height: 200px; width: 100%;">
                <h3 class="text-center text-muted">Not Found</h3>
            </div>`;
        } else {
            listingsContainer.innerHTML = listings
                .map(GeneralDashboard.createListingCard)
                .filter((card) => card !== undefined) // Remove undefined results (from unverified listings)
                .join('');
        }
    }

    // Filter listings based on the price range
    filterListings() {
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;
    
        // Convert input values to numbers
        const min = minPrice ? parseFloat(minPrice) : 0; // Default to 0 if no value
        const max = maxPrice ? parseFloat(maxPrice) : Infinity; // Default to Infinity if no value
    
        // Filter listings based on price range
        const filteredListings = this.allListings.filter((listing) => {
            return listing.price >= min && listing.price <= max;
        });
    
        // Redisplay the filtered listings
        this.displayListings(filteredListings, 'listings-container');
    }

    // Event listener for the filter form
    filterFormSubmit(e) {
        e.preventDefault(); // Prevent form submission
        this.filterListings();
    }

    // Event listener for the reset button
    resetFilters() {
        // Clear input fields
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
    
        // Redisplay all listings
        this.displayListings(this.allListings, 'listings-container');
    }

    async viewDetails(listingId) {
        try {
            const response = await fetch(`/api/listings/${listingId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch listing details');
            }
            const listingDetails = await response.json();
            this.displayListingDetails(listingDetails);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load listing details. Please try again.');
        }
    }

    displayListingDetails(listing) {
        const detailsContainer = document.getElementById('listing-details');
        if (!listing.image) {
            listing.image = "/images/pexels-markusspiske-102155.jpg";
        }
        detailsContainer.innerHTML = `
            <h3>${listing.title}</h3>
            <img src="${listing.image}" class="img-fluid mb-3" style="height: 500px; width: 100%; object-fit: cover">
            <p><strong>Price:</strong> $${listing.price}/month</p>
            <p><strong>Address:</strong> ${listing.address}
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}" 
                    target="_blank" 
                    rel="noopener noreferrer">
                    <br />
                    Search in Google Maps
                </a>
            </p>
            <p><strong>Description:</strong> ${listing.description}</p>
            <p><strong>Contact:</strong> ${listing.contact}</p>
        `;
        
        const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
        detailsModal.show();
    }

    // Initialize listings on page load
    static initialize() {
        const dashboard = new GeneralDashboard();
        
        // Event listeners
        document.getElementById('filter-form').addEventListener('submit', (e) => dashboard.filterFormSubmit(e));
        document.getElementById('reset-filters').addEventListener('click', () => dashboard.resetFilters());
        document.getElementById('compare-form').addEventListener('submit', (e) => dashboard.submitCompareForm(e));
    }
}

// Initialize dashboard after the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    GeneralDashboard.initialize();
});
