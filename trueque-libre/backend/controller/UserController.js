const BaseException = require('../exceptions/BaseException');
const UserService = require('../service/UserService');

class UserController {
    constructor() {
        this.setup();
    }
    setup() {
        const label = `-------------------- UserController setup - ${Date.now()}`;
        console.time(label);
        this.userService = new UserService();
        console.timeLog(label, 'UserService setup complete');
        console.timeEnd(label);
    }
    async create(req, res) {
        const label = `-------------------- User creation - ${Date.now()}`;
        console.time(label);
        try {
            const { userName, password, email } = req.body;
            const user = await this.userService.createUser(userName, password, email);
            console.timeLog(label, "user created successfully");
            console.timeEnd(label);
            return res.status(200).json(user);
        } catch (error) {
            console.timeLog(label, error.message);
            console.timeEnd(label);
            throw new BaseException(`/create: ${error.message}`, error.statusCode??400, "Bad Request", "UserCreationError");
        }
    }
    async login(req, res) {
        const label = `-------------------- User login - ${Date.now()}`;
        console.time(label);
        try {
            const { userName, password} = req.body;
            const flag = await this.userService.logInUser(userName, password);
            console.timeLog(label, "user logged in successfully");
            console.timeEnd(label);
            return res.status(200).send({ userID: flag.id, userName: flag.name });
        } catch (error) {
            console.timeEnd(label)
            throw new BaseException(`/login: ${error.message}`, error.statusCode??400, "Bad Request", "UserLoginError");
        }
    }
}

module.exports = UserController;