const AccountController = require("./controllers/accountController");

const routes = require("express").Router();

// Creamos una instancia del controlador
const accountController = new AccountController();

routes.get("/get", (req, res) => accountController.getAllAccounts(req, res));

routes.get("/get/:id", (req,res) => accountController.getAccountById(req, res));

routes.post("/create", (req, res) => accountController.createAccount(req, res));

routes.put("/edit", (req, res) => accountController.updateAccount(req, res));

routes.delete("/delete", (req,res) => accountController.deleteAccount(req, res));

module.exports = routes;