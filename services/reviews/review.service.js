const Service = require("../Service");

class ReviewService extends Service {
  #reviewModel;
  #bootcampService;
  constructor(reviewModel, bootcampService) {
    super(reviewModel);
    this.#reviewModel = reviewModel;
    this.#bootcampService = bootcampService;
  }

  getAllReviewsByBootcampId = async (bootcampId) => {
    if (!bootcampId) {
      throw {
        message: `BootcampId is invalid`,
        statusCode: 412,
      };
    }

    const params = { bootcamp: bootcampId };
    const reviews = await this.getAll(params);

    if (!reviews) {
      throw {
        message: `No Reviews found under the bootcamp id of ${bootcampId}`,
        status: 404,
      };
    }

    return reviews;
  };

  getReviewById = async (id) => {
    if (!id) {
      throw { message: `Review id is required`, statusCode: 412 };
    }

    const review = await this.getById(id);

    if (!review) {
      throw {
        message: `Review not found with the id of ${id}`,
        statusCode: 404,
      };
    }

    return review;
  };

  createBootcampReview = async (review, bootcampId, user) => {
    if (!bootcampId) {
      throw { message: `Bootcamp Id required `, statusCode: 412 };
    }

    if (!user) {
      throw { message: `User required `, statusCode: 412 };
    }

    if (!review.title) {
      throw { message: `Review title required `, statusCode: 412 };
    }

    if (!review.text) {
      throw { message: `Review description required `, statusCode: 412 };
    }

    if (!review.rating) {
      throw { message: `Review rating required `, statusCode: 412 };
    }

    review.user = user.id;
    review.bootcamp = bootcampId;

    const bootcamp = await this.#bootcampService.getById(review.bootcamp);

    if (!bootcamp) {
      throw {
        message: `Bootcamp not found with the id of ${review.bootcamp}`,
      };
    }
    const createdReview = await this.create(review);

    return createdReview;
  };

  updateBootcampReview = async () => {};
}

module.exports = ReviewService;
