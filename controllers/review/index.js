const ReviewController = require("./review.controller");
const reviewService = require("../../services/reviews/index");
const reviewController = new ReviewController(reviewService);

module.exports = reviewController;
