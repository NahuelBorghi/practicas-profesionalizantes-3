const routes = require("express").Router();
const UserController = require("./controller/UserController.js");
const ChatController = require("./controller/ChatController.js");
const OfferController = require("./controller/OfferController.js");
const PublicationController = require("./controller/PublicationController.js");

// // Routes for ChatController
// const chatRoutes = require("express").Router();
// chatRoutes.get("/", ChatController.get);
// chatRoutes.post("/", ChatController.create);
// chatRoutes.put("/", ChatController.update);
// chatRoutes.delete("/", ChatController.delete);

// // Routes for OfferController
// const offerRoutes = require("express").Router();
// offerRoutes.get("/", OfferController.get);
// offerRoutes.post("/", OfferController.create);
// offerRoutes.put("/", OfferController.update);
// offerRoutes.delete("/", OfferController.delete);

// // Routes for PublicationController
// const publicationRoutes = require("express").Router();
// publicationRoutes.get("/", PublicationController.get);
// publicationRoutes.post("/", PublicationController.create);
// publicationRoutes.put("/", PublicationController.update);
// publicationRoutes.delete("/", PublicationController.delete);

// // Routes for UserController
const userRoutes = require("express").Router();
const userController = new UserController();
userRoutes.post("/create", (req,res) => {userController.create(req, res)});
// userRoutes.post("/", UserController.create);
// userRoutes.put("/", UserController.update);
// userRoutes.delete("/", UserController.delete);

// // Export the routers
// routes.use("/chat", chatRoutes);
// routes.use("/offer", offerRoutes);
// routes.use("/publication", publicationRoutes);
routes.use("/user", userRoutes);

module.exports = routes;