const BaseException = require('../exceptions/BaseException');
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
        try {
            return this.mysqlRepository.createUser(userName, password, email);
        } catch (error) {
            throw new BaseException(`createUserService: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }
    
    async logInUser(userName, password) {
        try {
            const user = this.mysqlRepository.getUserByUserName(userName);
            if (!user.userName) {
                throw new BaseException('User not found', 404, "Not Found", "UserNotFoundError");
            } else if (user.password !== password) {
                throw new BaseException(`Invalid password. The password for ${user.userName} is ${user.password}`, error.statusCode??400, "Bad Request", "UserLoginError");
            }
            const userLogged = await this.mysqlRepository.updateUserState(user.id);
            return userLogged
        }catch (error) {
            throw new BaseException(`loginUserService: ${error.message}`, error.statusCode??400, "Bad Request", "UserCreationError");
        }
    }
}

module.exports = UserService;