const express = require("express");
const router = express.Router({ mergeParams: true });
const CourseController = require("../controllers/course.controller");
const CourseModel = require("./../models/Course.model");
const BootcampModel = require("./../models/Bootcamp.model");
const BootcampService = require("./../services/bootcamp.service");
const CourseService = require("../services/course.service");
const advanceResults = require("../middleware/advancedRequestResult");
const protect = require("../middleware/auth");

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
  .post(protect, courseController.create);

router
  .route("/:id")
  .get(courseController.getById)
  .delete(protect, courseController.deleteById)
  .put(protect, courseController.updateById);

module.exports = router;
