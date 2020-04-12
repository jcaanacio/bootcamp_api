const express = require("express");
const router = express.Router();
const userModel = require("../models/Users.model");
const UserService = require("../services/user.service");
const AuthController = require("../controllers/auth.controller");

const userService = new UserService(userModel);
const authController = new AuthController(userService);

router.post("/register", authController.register);

module.exports = router;
