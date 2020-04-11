const ErrorResponse = require("../utils/ErrorResponse");
const AsyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../utils/GeoCoder");
const Controller = require("../utils/Controller");
const path = require("path");
class BootcampController extends Controller {
  #bootcampService;
  constructor(bootcampService) {
    super();
    this.#bootcampService = bootcampService;
  }

  get = AsyncHandler(async (request, response, next) => {
    // const bootcamps = await this.#bootcampService.getAllBootcamps(request.query);
    const query = this.parseQueryOperators({ ...request.query });
    const filterFields = this.selectFields(request.query.select);

    let bootcamps = this.#bootcampService.getAll(query);
    bootcamps = bootcamps.populate({
      path: "courses",
      select: "title description",
    });
    bootcamps = bootcamps.select(filterFields);
    bootcamps = bootcamps.sort(this.orderBy(request.query.sort));

    const totalDocuments = await this.#bootcampService.countDocuments();
    const pagination = this.pagination(
      request.query.pageIndex,
      request.query.limit,
      totalDocuments
    );
    bootcamps = bootcamps.skip(pagination.startIndex).limit(pagination.limit);
    bootcamps = await bootcamps;

    response.status(200).json({
      success: true,
      message: `List of bootcamps`,
      count: bootcamps.length,
      pagination: pagination,
      body: bootcamps,
    });
  });

  getById = AsyncHandler(async (request, response, next) => {
    let query = this.#bootcampService.getById(request.params.id);
    query = query.populate({ path: "courses", select: "title description" });
    if (!query) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with the id of ${request.params.id}`,
          404
        )
      );
    }

    const bootcamp = await query;
    return response.status(200).json({
      success: true,
      message: `List of bootcamp`,
      body: bootcamp,
    });
  });

  create = AsyncHandler(async (request, response, next) => {
    const bootcamp = await this.#bootcampService.create(request.body);
    response.status(200).json({
      success: true,
      message: `Created new bootcamp`,
      body: bootcamp,
    });
  });

  updateById = AsyncHandler(async (request, response, next) => {
    const bootcamp = await this.#bootcampService.updateById(
      request.params.id,
      request.body
    );
    if (!bootcamp) {
      return response.status(400).json({ sucess: false, body: bootcamp });
    }

    response.status(200).json({
      success: true,
      message: `Updated Bootcamp ${request.params.id}`,
      body: bootcamp,
    });
  });

  deleteById = AsyncHandler(async (request, response, next) => {
    const bootcamp = await this.#bootcampService.getById(request.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with the id of ${request.params.id}`,
          404
        )
      );
    }

    bootcamp.remove();

    return response.status(200).json({
      success: true,
      message: `Deleted Bootcamp ${request.params.id}`,
      body: bootcamp,
    });
  });

  getWithInRadius = AsyncHandler(async (request, response, next) => {
    const { zipcode, distance } = request.params;
    /**
     * get lat/lang from geocoder
     */

    const location = await geocoder.geocode(zipcode);
    const geocoded = location[0];
    const { longitude, latitude } = geocoded;

    /**
     * Earth Radius = 3963 mi/ 6,379 km
     */
    const radius = distance / 3963;

    const bootcamps = await this.#bootcampService.getBootcampWithInRadius(
      longitude,
      latitude,
      radius
    );

    return response.status(200).json({
      sucess: true,
      message: `Bootcamps within the ${zipcode}`,
      body: bootcamps,
    });
  });

  /**
   * @desc Upload photo for bootcamp
   * @route Put /api/v1/bootcamps/:id/photo
   * @access Private
   */

  photoUpload = AsyncHandler(async (request, response, next) => {
    const bootcamp = await this.#bootcampService.getById(request.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with id of ${request.params.id}`,
          404
        )
      );
    }

    if (!request.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = request.files.file;

    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse("Please upload an image file", 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    //Create custome filname
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return next(
          new ErrorResponse(`Problem encountered while uploading photo`, 500)
        );
      }

      const photo = {
        photo: file.name,
      };

      const bootcamp = await this.#bootcampService.updateById(
        request.params.id,
        photo
      );

      return response.status(200).json({
        sucess: true,
        message: `Sucessfully upload photo of bootcamp ${request.params.id}`,
        body: bootcamp,
      });
    });
  });
}

module.exports = BootcampController;
