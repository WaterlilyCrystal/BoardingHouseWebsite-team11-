class UserController {
  static users = [];
  static owners = [];
  static admins = [];

  static addUser(user) {
      this.users.push(user);
  }

  static addOwner(owner) {
      this.owners.push(owner);
  }

  static addAdmin(admin) {
      this.admins.push(admin);
  }

  static getUserByEmail(email) {
      return this.users.find(user => user.email === email);
  }

  static getOwnerByEmail(email) {
      return this.owners.find(owner => owner.email === email);
  }

  static getAdminByEmail(email) {
      return this.admins.find(admin => admin.email === email);
  }
}

export default UserController;


// class UserController {
//     static owners = [];
//     static admins = [];

//     static addOwner(owner) {
//       this.users.push(owner);
//     }

//     static addAdmin(admin) {
//       this.users.push(admin);
//     }
  
//     static getUsers() {
//       return this.users;
//     }

//     static getUserByEmail(email) {
//         for (const user of this.users) {
//             if (user.email === email) {
//                 return user
//             }
//         }
//     }
  
//   }
  
// export default UserController;