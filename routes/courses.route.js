const express = require("express");
const router = express.Router({ mergeParams: true });
const CourseController = require("../controllers/course.controller");
const CourseModel = require("./../models/Course.model");
const BootcampModel = require("./../models/Bootcamp.model");
const BootcampService = require("./../services/bootcamp.service");
const CourseService = require("../services/course.service");
const UserModel = require("../models/Users.model");
const UserService = require("../services/user.service");
const Auth = require("../middleware/auth");
const advanceResults = require("../middleware/advanced-request-results");
const userService = new UserService(UserModel);
const auth = new Auth(userService);

const bootcampService = new BootcampService(BootcampModel);
const courseService = new CourseService(CourseModel, bootcampService);
const courseController = new CourseController(courseService);

router
  .route("/")
  .get(
    advanceResults(courseService, {
      path: "bootcamp",
      select: "name description",
    }),
    courseController.get
  )
  .post(
    auth.protect,
    auth.authorize("publisher", "admin"),
    courseController.create
  );

router
  .route("/:id")
  .get(courseController.getById)
  .delete(
    auth.protect,
    auth.authorize("publisher", "admin"),
    courseController.deleteById
  )
  .put(
    auth.protect,
    auth.authorize("publisher", "admin"),
    courseController.updateById
  );

module.exports = router;
