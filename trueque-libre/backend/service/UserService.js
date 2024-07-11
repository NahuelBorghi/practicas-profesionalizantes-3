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
    
    async logInUser(userName, password) {
        try {
            const user = this.mysqlRepository.getUserByUserName(userName);
            if (!user.userName) {
                throw new Error('User not found');
            } else if (user.password !== password) {
                throw new Error('invalid password. the password for ' + user.userName + ' is ' + user.password);
            }

            const userLogged = await this.mysqlRepository.updateUserState(user.id)
            if (!user.userName) {
                throw new Error('User not found');
            } 
            return userLogged
        }catch (error) {
            console.error(error);
        }
    }
}

module.exports = UserService;