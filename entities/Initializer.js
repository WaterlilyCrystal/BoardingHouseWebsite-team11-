import ListingController from "./PostListingController.js";
import Listing from "./Post.js";
import User from "./User.js";
import Owner from "./Owner.js";
import Admin from "./Admin.js";
import UserController from './UserController.js';
import bcrypt from 'bcrypt';  // Import bcrypt for password hashing

export function initializeData() {
  // Create listings with associated owners
  const listing1 = new Listing('Cozy Apartment', 1000.00, 'Some address', 'A comfortable apartment in the heart of the city.', 'owner1@example.com', '/images/pexels-charlotte-may-5824531.jpg', true);
  const listing2 = new Listing('Spacious House', 2000.00, 'Address 2', 'A large family home with a beautiful garden.', 'owner2@example.com', '/images/pexels-jonathanborba-5570224.jpg', true);
  const listing3 = new Listing('Modern Loft', 1500.00, 'Address 3', 'A stylish loft apartment with great views.', 'owner3@example.com', '/images/pexels-zvolskiy-3581753.jpg', true);

  // Add listings to ListingController
  ListingController.addListing(listing1);
  ListingController.addListing(listing2);
  ListingController.addListing(listing3);

  // Create users with hashed passwords
  const user1 = new User('Test', 'User', 'user@user.com', bcrypt.hashSync('123', 10));  // Hashing password
  UserController.addUser(user1);

  // Create owners with hashed passwords
  const owner1 = new Owner('Test', 'Owner', 'owner@owner.com', bcrypt.hashSync('123', 10));  // Hashing password
  UserController.addOwner(owner1);

  // Create admins with hashed passwords
  const admin1 = new Admin('Test', 'Admin', 'admin@admin.com', bcrypt.hashSync('123', 10));  // Hashing password
  UserController.addAdmin(admin1);
}



