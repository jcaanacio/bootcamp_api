const express = require("express");
const router = express.Router();
const UserModel = require("../models/Users.model");
const UserService = require("../services/user.service");
const Auth = require("../middleware/auth");
const BootcampController = require("../controllers/bootcamp.controller");
const BootcampModel = require("./../models/Bootcamp.model");
const BootcampService = require("../services/bootcamp.service");
const bootcampService = new BootcampService(BootcampModel);
const bootcampController = new BootcampController(bootcampService);
const advanceResults = require("../middleware/advancedRequestResult");
const userService = new UserService(UserModel);
const auth = new Auth(userService);
/**
 * Include other resource routers
 */

const courseRouter = require("./courses.route");
/**
 * Re-route into other reource routers
 */
router.use("/:bootcampId/courses", courseRouter);
router
  .route("/radius/:zipcode/:distance")
  .get(bootcampController.getWithInRadius);

router.route("/:id/photo").put(bootcampController.photoUpload);

router
  .route("/")
  .get(advanceResults(bootcampService, "courses"), bootcampController.get)
  .post(auth.protect, bootcampController.create);

router
  .route("/:id")
  .get(advanceResults(bootcampService), bootcampController.getById)
  .delete(auth.protect, bootcampController.deleteById)
  .put(auth.protect, bootcampController.updateById);

module.exports = router;
