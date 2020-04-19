const express = require("express");
const router = express.Router();
const userModel = require("../models/Users.model");
const UserService = require("../services/user.service");
const UserController = require("../controllers/user.controller");
const userService = new UserService(userModel);
const userController = new UserController(userService);
const advanceResults = require("../middleware/advancedRequestResult");

router
  .route("/:id")
  .put(userController.updateDetails)
  .get(userController.getUserById)
  .delete(userController.deleteUser);

router
  .route("/")
  .get(advanceResults(userService, "bootcamp"), userController.getAllUsers);

module.exports = router;
