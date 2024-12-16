class ListingController {
    static listings = [];
  
    static addListing(listing) {
      this.listings.push(listing);
    }

    static deleteListing(listing) {
      const index = this.listings.indexOf(listing)
      if (index > -1) {
        this.listings.splice(index, 1); 
      }
    }
  
    static getListings() {
      return this.listings;
    }

    static getListingById(id) {
        for (const l of this.listings) {
            if (l.id === id) {
                return l
            }
        }
    }
  
  }
  
export default ListingController;