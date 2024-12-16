// Load selected listings for comparison
async function loadComparison() {
    const selectedListings = JSON.parse(localStorage.getItem("selectedListings"))

    if (!selectedListings || selectedListings.length === 0) {
        alert("No listings selected for comparison.")
        window.location.href = "/" // Redirect back to the dashboard
        return
    }

    try {
        // Fetch all listings from the backend
        const response = await fetch(`/api/listings`)
        if (!response.ok) {
            throw new Error("Failed to fetch listings")
        }

        const allListings = await response.json()

        // Filter selected listings
        const listingsToCompare = allListings.filter((listing) =>
            selectedListings.includes(listing.id)
        )

        // Populate the comparison table
        populateComparisonTable(listingsToCompare)
    } catch (error) {
        console.error("Error:", error)
        alert("Failed to load comparison data.")
    }
}

// Populate the comparison table dynamically
function populateComparisonTable(listings) {
    const tableBody = document.getElementById("comparison-table-body");
    const tableHeadRow = document.querySelector("thead tr");

    // Clear existing rows from the table (in case of re-rendering)
    tableBody.innerHTML = "";
    tableHeadRow.innerHTML = "";

    // Add the first column header for "Attribute"
    const attributeHeader = document.createElement("th");
    attributeHeader.textContent = "Attribute";
    tableHeadRow.appendChild(attributeHeader);

    // Add headers dynamically for each selected listing
    listings.forEach((listing, index) => {
        const listingHeader = document.createElement("th");
        listingHeader.textContent = `House ${index + 1}`;
        tableHeadRow.appendChild(listingHeader);
    });

    // Attributes to compare
    const attributes = ["title", "price", "address", "description", "contact"];

    // Loop through attributes and create rows
    attributes.forEach((attribute) => {
        const row = document.createElement("tr");
        const attributeCell = document.createElement("td");
        attributeCell.textContent = capitalize(attribute);
        row.appendChild(attributeCell);

        // Add data dynamically for each selected listing
        listings.forEach((listing) => {
            const listingCell = document.createElement("td");
            listingCell.textContent = listing[attribute] || "N/A";
            row.appendChild(listingCell);
        });

        tableBody.appendChild(row);
    });
}


// Capitalize attribute names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

window.redirectDependingOnUser = async function() {
    const data = await getCurrentUser()
    if (!data) {
        window.location.href = "/"
    }
    if (data.role === "Owner") {
        window.location.href = "/owner_dashboard"
    } else if (data.role === "Renter") {
        window.location.href = "/user_dashboard"
    } else if (data.role === "Admin") {
        window.location.href = "/admin_dashboard"
    }
}

// Initialize comparison page
document.addEventListener("DOMContentLoaded", loadComparison)