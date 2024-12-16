import express from 'express';
import bcrypt from 'bcrypt';

import UserController from '../entities/UserController.js';
import User from '../entities/User.js';

const router = express.Router();

// Hardcoded admin list (emails and hashed passwords)
const adminList = [
    { email: "admin1@example.com", password: bcrypt.hashSync("secureAdminPass1", 10) },
    { email: "admin2@example.com", password: bcrypt.hashSync("secureAdminPass2", 10) }
];
// To change the password for admin1@example.com:
const newPassword = "newAdminPass1";  // The new password you want to set
const hashedPassword = bcrypt.hashSync(newPassword, 10);  // Hash the new password

// Update the adminList
adminList[0].password = hashedPassword; 

// Register endpoint
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    // Check if the email is reserved for admins
    if (adminList.some(admin => admin.email === email)) {
        return res.status(400).send("This email is reserved for an admin account.");
    }

    // Check if the user already exists
    if (UserController.getUserByEmail(email)) {
        return res.status(400).send("User already exists with this email.");
    }

    // Register the user as a homeowner
    const hashedPassword = bcrypt.hashSync(password, 10);
    UserController.addUser(new User(firstName, lastName, email, hashedPassword));
    return res.status(201).send("User registered successfully!");
});

// Login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).send("Email and password are required.");
    }

    // Check if the user is an admin
    const admin = adminList.find(admin => admin.email === email);
    if (admin && bcrypt.compareSync(password, admin.password)) {
        return res.status(200).json({ message: "Login successful", role: "Admin" });
    }

    // Check if the user is a homeowner
    const user = UserController.getUserByEmail(email);
    if (!user) {
        return res.status(400).send("User does not exist.");
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send("Invalid password.");
    }

    return res.status(200).json({ message: "Login successful", role: "Owner" });
});

export default router;


