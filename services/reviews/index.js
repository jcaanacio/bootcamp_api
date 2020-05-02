const ReviewModel = require("../../models/Review.model");
const ReviewService = require("./review.service");
const reviewService = new ReviewService(ReviewModel);

module.exports = reviewService;
