const AsyncHandler = require("../../middleware/async-handler");

class ReviewController {
  #reviewService;
  constructor(reviewService) {
    this.#reviewService = reviewService;
  }

  /**
   * @description Get All reviews
   * @route GET/api/v1/reviews/
   * @route GET/api/v1/bootcamps/:bootcampId/reviews
   * @access Public
   */
  get = AsyncHandler(async (request, response, next) => {
    const bootcampId = request.query.bootcampId || request.params.bootcampId;
    if (!bootcampId) {
      return response.status(200).json(response.advancedResults);
    }

    const reviews = await this.#reviewService.getAllReviewsByBootcampId(
      bootcampId
    );

    return response.status(200).json({
      success: true,
      message: `List of reviews`,
      count: reviews.length,
      body: reviews,
    });
  });

  /**
   * @description Get a single review by id
   * @route GET/api/v1/reviews/:id
   * @access Public
   */
  getById = AsyncHandler(async (request, response, next) => {
    const review = await this.#reviewService.getReviewById(request.params.id);

    return response.status(200).json({
      success: true,
      body: review,
    });
  });

  /**
   * @description Update a single review by id
   * @route PUT/api/v1/reviews/:id
   * @access Private
   */
  updateById = AsyncHandler(async (request, response, next) => {
    const review = request.body;
    const reviewId = request.params.id;
    const user = request.user;

    const updatedReview = await this.#reviewService.updateBootcampReview(
      reviewId,
      review,
      user
    );

    response.status(200).json({
      success: true,
      message: `Successfully updated review ${updatedReview._id}`,
      body: updatedReview,
    });
  });

  /**
   * @description Delete a single review by id
   * @route DELETE/api/v1/reviews/:id
   * @access Private
   */
  deleteById = AsyncHandler(async (request, response, next) => {
    const { id } = request.params;
    const { user } = request;

    const review = await this.#reviewService.deleteBootcampReview(id, user);

    response.status(200).json({
      success: true,
      message: `Successfully deleted review ${review._id}`,
      body: review,
    });
  });

  /**
   * @description Create a review for a specific bootcamp
   * @route POST/api/v1/bootcamps/:id/reviews
   * @access Private
   */
  createBootcampReview = AsyncHandler(async (request, response, next) => {
    const review = request.body;

    const createdReview = await this.#reviewService.createBootcampReview(
      review,
      request.params.bootcampId,
      request.user
    );

    response.status(201).json({
      success: true,
      message: `Review posted for bootcamp ${createdReview.bootcamp}`,
      body: createdReview,
    });
  });
}

module.exports = ReviewController;
