const generateId = require('../utils/UUID.js');

class User {
    constructor(userName, email, password, state = true, id = null) {
        this.id = id || generateId();
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.state = state;
    }
}

module.exports = User;