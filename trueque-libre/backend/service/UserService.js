const MySqlRepository = require('../repository/MySqlRepository');

class UserService {
    constructor() {
        this.setup();
    }
    setup() {
        console.time('UserService setup');
        this.mysqlRepository = new MySqlRepository();
        console.timeLog('UserService setup', 'MySqlRepository setup complete');
        console.timeEnd('UserService setup');
    }

    async createUser(userName, password, email) {
        return this.mysqlRepository.createUser(userName, password, email);
    }
}

module.exports = UserService;