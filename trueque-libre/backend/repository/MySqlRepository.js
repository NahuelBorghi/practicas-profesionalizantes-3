const User = require('../model/UserModel');
const { createConnection } = require("mysql2/promise");


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
        console.log("env: ", env);
        this.connection = await createConnection(env);
        console.timeLog('MySqlRepository setup', 'MySqlConnection setup complete');
        console.timeEnd('MySqlRepository setup');
    }
    
    async createUser(userName, password, email) {
        const newUser = new User(userName, password, email);
        console.log("newUser: ", newUser);
        const query = `INSERT INTO Users (id, userName, password, email, state) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await this.connection.execute(query, [newUser.id, newUser.userName, newUser.password, newUser.email, newUser.state]);
        return result.insertId;
    }
    
    async findUser(id) {
        const query = `SELECT * FROM Users WHERE id = ?`;
        const [result] = await this.connection.execute(query, [id]);
        const user = new User(result.userName, result.password, result.email, result.state, result.id);
        return user;
    }
}

module.exports = MySqlRepository;