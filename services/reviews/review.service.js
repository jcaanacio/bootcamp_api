const Service = require("../Service");

class ReviewService extends Service {
  #reviewModel;
  constructor(reviewModel) {
    super(reviewModel);
    this.#reviewModel = reviewModel;
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
}

module.exports = ReviewService;
