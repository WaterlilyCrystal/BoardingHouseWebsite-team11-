import User from './User.js';


class Owner extends User {
    constructor(firstName, lastName, email, password) {
        super(firstName, lastName, email, password)
        this.role = 'Owner';
    }
}

export default Owner;
