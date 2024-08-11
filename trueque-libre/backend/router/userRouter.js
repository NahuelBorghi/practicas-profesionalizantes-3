// // Routes for UserController
const userRoutes = require("express").Router();
const UserController = require("../controller/UserController.js");
const userController = new UserController();
userRoutes.post("/register", async (req, res, next) => {
    try {
        await userController.create(req, res);
    } catch (error) {
        next(error);
    }
});
userRoutes.post("/login", async (req, res, next) => {
    try {
        await userController.login(req, res);
    } catch (error) {
        next(error);
    }
});

// userRoutes.put("/", UserController.update);
// userRoutes.delete("/", UserController.delete);

module.exports = userRoutes;