const express = require("express");
const router = express.Router();
const BootcampController = require("../controllers/bootcamp.controller");
const BootcampModel = require("./../models/Bootcamp.model");
const BootcampService = require("../services/bootcamp.service");
const bootcampService = new BootcampService(BootcampModel);
const bootcampController = new BootcampController(bootcampService);
const advanceResults = require("../middleware/advancedRequestResult");
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
  .post(bootcampController.create);

router
  .route("/:id")
  .get(advanceResults(bootcampService), bootcampController.getById)
  .delete(bootcampController.deleteById)
  .put(bootcampController.updateById);

module.exports = router;
