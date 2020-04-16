const express = require("express");
const router = express.Router();
const userModel = require("../models/Users.model");
const UserService = require("../services/user.service");
const AuthController = require("../controllers/auth.controller");
const emailService = require("../utils/sendemail");

const userService = new UserService(userModel);
const authController = new AuthController(userService, emailService);

router.put("/resetpassword/:resettoken", authController.resetPassword);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.get("/", authController.getAll);
module.exports = router;
