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
const advanceResults = require("../middleware/advanced-request-results");
const userService = new UserService(UserModel);
const auth = new Auth(userService);
/**
 * Include other resource routers
 */

const courseRouter = require("./courses.route");
const reviewRouter = require("./review.route");
/**
 * Re-route into other reource routers
 */
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);
router
  .route("/radius/:zipcode/:distance")
  .get(bootcampController.getWithInRadius);

router
  .route("/:id/photo")
  .put(
    auth.protect,
    auth.authorize("publisher", "admin"),
    bootcampController.photoUpload
  );

router
  .route("/")
  .get(advanceResults(bootcampService, "courses"), bootcampController.get)
  .post(
    auth.protect,
    auth.authorize("publisher", "admin"),
    bootcampController.create
  );

router
  .route("/:id")
  .get(advanceResults(bootcampService), bootcampController.getById)
  .delete(
    auth.protect,
    auth.authorize("publisher", "admin"),
    bootcampController.deleteById
  )
  .put(
    auth.protect,
    auth.authorize("publisher", "admin"),
    bootcampController.updateById
  );

module.exports = router;
