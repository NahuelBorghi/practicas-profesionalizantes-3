const UserService = require('../service/UserService');

class UserController {
    constructor() {
        this.setup();
    }
    setup() {
        console.time('UserController setup');
        this.userService = new UserService();
        console.timeLog('UserController setup', 'UserService setup complete');
        console.timeEnd('UserController setup');
    }
    async create(req, res) {
        console.time('createUser');
        try {
            const { userName, password, email } = req.body;
            const user = await this.userService.createUser(userName, password, email);
            console.timeLog('createUser', "user created successfully");
            console.timeEnd('createUser');
            return res.status(200).json(user);
        } catch (error) {
            console.timeLog('createUser', error.message);
            console.timeEnd('createUser');
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;