const express = require("express");
const router = express.Router();
const userModel = require("../models/Users.model");
const UserService = require("../services/user.service");
const UserController = require("../controllers/user.controller");
const Auth = require("../middleware/auth");
const userService = new UserService(userModel);
const userController = new UserController(userService);
const auth = new Auth(userService);
const advanceResults = require("../middleware/advancedRequestResult");

router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUserById)
  .delete(userController.deleteUserById);

router
  .route("/")
  .get(
    auth.protect,
    auth.authorize("admin"),
    advanceResults(userService, "bootcamp"),
    userController.getAllUsers
  )
  .post(userController.createUser);

module.exports = router;
