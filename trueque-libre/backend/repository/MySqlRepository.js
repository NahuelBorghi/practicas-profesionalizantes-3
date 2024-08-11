const BaseException = require('../exceptions/BaseException');
const User = require('../model/UserModel');
const { createConnection } = require("mysql2/promise");
const { hashPassword } = require('../utils/hash');


class MySqlRepository {
    constructor() {
        this.setup();
    }

    async setup() {
        console.time('MySqlRepository setup');
        const env = {
            host: process.env.DATABASE_HOST || "FALTA VARIABLE DE ENTORNO DATABASE_HOST",
            user: process.env.DATABASE_USER || "FALTA VARIABLE DE ENTORNO DATABASE_USER",
            password: process.env.DATABASE_PASSWORD || "FALTA VARIABLE DE ENTORNO MYSQL_PASSWORD",
            database: process.env.MYSQL_DATABASE || "FALTA VARIABLE DE ENTORNO MYSQL_DATABASE",
        };
        try {
            this.connection = await createConnection(env);
            console.timeLog('MySqlRepository setup', 'MySqlConnection setup complete');
            console.timeEnd('MySqlRepository setup');
        } catch (error) {
            console.error(error);
            console.timeEnd('MySqlRepository setup');
        }
    }
    
    async createUser(userName, password, email) {
        const { hash, salt } = hashPassword(password);
        const newUser = new User(userName, hash, salt, email);
        const query = `INSERT INTO Users (id, userName, password, salt, email, state) VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            const [[result]] = await this.connection.execute(query, [newUser.id, newUser.userName, newUser.password, newUser.salt, newUser.email, newUser.state]);
            return result.insertId;
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.createUser: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }
    
    async getUserById(id) {
        const query = `SELECT * FROM Users WHERE id = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            const user = new User(result.userName, result.password, result.salt, result.email, result.state, result.id);
            return user;
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserById: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }

    async getUserLoggedById(id) {
        const query = `SELECT * FROM Users WHERE id = ? AND state = 1`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            const user = new User(result.userName, result.password, result.salt, result.email, result.state, result.id);
            return user;
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserLoggedById: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }

    async getUserByUserName(userName) {
        const query = `SELECT * FROM Users WHERE userName = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [userName]);
            const user = new User(result.userName, result.password, result.salt, result.email, result.setup, result.id);
            return user;
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserByUserName: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }

    async updateUserState(id, state) {
        const query = `UPDATE Users SET state = ? WHERE id = ?`;
        try{
            await this.connection.execute(query, [state, id])
            const user = await this.getUserLoggedById(id);
            return user
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.updateUserState: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }
}

module.exports = MySqlRepository;