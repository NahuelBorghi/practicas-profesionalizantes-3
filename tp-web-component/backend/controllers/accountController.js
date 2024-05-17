const path = require("path");
const fs = require("fs");
const { type } = require("os");

class AccountController {
    constructor() {
        const accountsPath = path.resolve(__dirname, "../cuentas.json");
        const accountsData = fs.readFileSync(accountsPath, "utf8");
        this.accounts = JSON.parse(accountsData);
    }

    // Método para obtener todas las cuentas
    getAllAccounts(req, res) {
        res.json(this.accounts);
    }

    // Método para obtener una cuenta por su ID
    getAccountById(req, res) {
        const accountId = parseInt(req.params.id);
        const account = this.accounts["cuentas"].find((acc) => acc.id === accountId);

        if (!account) {
            res.status(404).json({ error: "Cuenta no encontrada" });
        } else {
            res.json(account);
        }
    }

    // Método para crear una nueva cuenta
    createAccount(req, res) {
        const { id, username, saldo } = req.body;
        const newAccount = { id: parseInt(id), username, saldo };

        this.accounts["cuentas"].push(newAccount);

        // Guardar los nuevos datos en el archivo JSON
        const accountsPath = path.resolve(__dirname, "../cuentas.json");
        const cuentasData = JSON.stringify(this.accounts);
        fs.writeFileSync(accountsPath, cuentasData, "utf8");

        res.status(201).json(newAccount);
    }

    // Método para actualizar una cuenta existente
    updateAccount(req, res) {
        const { id, username, saldo } = req.body;
        const index = this.accounts["cuentas"].findIndex((acc) => acc.id == parseInt(id));
        if (index != -1) {
            this.accounts["cuentas"][index] = {
                id: parseInt(id),
                username,
                saldo: saldo,
            };
            const accountsPath = path.resolve(__dirname, "../cuentas.json");
            const cuentasData = JSON.stringify(this.accounts);
            fs.writeFileSync(accountsPath, cuentasData, "utf8");
            res.status(200).json(this.accounts["cuentas"][index]);
        }
        else{
            res.status(404).json({ error: "Cuenta no encontrada" });
        }
    }

    // Método para eliminar una cuenta
    deleteAccount(req, res) {
        const { id } = req.body;
        const accountIndex = this.accounts["cuentas"].findIndex(
            (acc) => acc.id == id
        );
        if (accountIndex == -1) {
            res.status(404).json({ error: "Cuenta no encontrada" });
        } else {
            const deletedAccount = this.accounts["cuentas"].splice(accountIndex, 1)[0];

            // Guardar los datos actualizados en el archivo JSON
            const accountsPath = path.resolve(__dirname, "../cuentas.json");
            const cuentasData = JSON.stringify(this.accounts);
            fs.writeFileSync(accountsPath, cuentasData, "utf8");

            res.json(deletedAccount);
        }
    }
}

module.exports = AccountController;
