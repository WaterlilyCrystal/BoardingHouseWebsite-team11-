import { randomUUID } from 'crypto'

// attribute for verification
class Listing {
    constructor(title, price, address, description, contact, image = undefined, verified = false) {
        this.id = randomUUID();
        this.title = title;
        this.price = price;
        this.address = address,
        this.image = image;
        this.description = description;
        this.contact = contact;
        this.verified = verified;
    }
}

export default Listing;