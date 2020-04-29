const express = require("express");
const router = express.Router();
const userModel = require("../models/Users.model");
const UserService = require("../services/user.service");
const AuthController = require("../controllers/auth.controller");
const emailService = require("../utils/sendemail");
const Auth = require("../middleware/auth");

const userService = new UserService(userModel);
const auth = new Auth(userService);
const authController = new AuthController(userService, emailService);

router.put("/resetpassword/:resettoken", authController.resetPassword);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.get("/", auth.protect, authController.getMe);
router.put("/updatedetails", auth.protect, authController.updateDetails);
router
  .route("/updatePassword")
  .patch(auth.protect, authController.updatePassword);
module.exports = router;
