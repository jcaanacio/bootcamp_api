const express = require("express");
const router = express.Router({ mergeParams: true });
const userModel = require("../models/Users.model");
const UserService = require("../services/user.service");
const Auth = require("../middleware/auth");
const userService = new UserService(userModel);
const auth = new Auth(userService);
const advanceResults = require("../middleware/advanced-request-results");
const reviewController = require("../controllers/review/index");
const reviewService = require("../services/reviews/index");

router.use(auth.protect);
router.use(auth.authorize("user", "admin"));

router
  .route("/:id")
  .get(reviewController.getById)
  .put(reviewController.updateById)
  .delete(reviewController.deleteById);

router
  .route("/")
  .get(advanceResults(reviewService), reviewController.get)
  .post(reviewController.createBootcampReview);

module.exports = router;
