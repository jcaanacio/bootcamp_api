const ReviewModel = require("../../models/Review.model");
const BootcampModel = require("../../models/Bootcamp.model");
const BootcampService = require("../bootcamp.service");
const ReviewService = require("./review.service");
const bootcampService = new BootcampService(BootcampModel);
const reviewService = new ReviewService(ReviewModel, bootcampService);
module.exports = reviewService;
