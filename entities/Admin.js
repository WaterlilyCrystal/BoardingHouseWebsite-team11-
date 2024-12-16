import User from './User.js';


class Admin extends User {
    constructor(firstName, lastName, email, password) {
        super(firstName, lastName, email, password)
        this.role = 'Admin';
    }
}

export default Admin;
