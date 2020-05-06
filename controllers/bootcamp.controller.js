const AsyncHandler = require("../middleware/async-handler");
const geocoder = require("../utils/geo-coder");
const Controller = require("../archetypes/Controller");
const path = require("path");
class BootcampController extends Controller {
  #bootcampService;
  constructor(bootcampService) {
    super();
    this.#bootcampService = bootcampService;
  }

  /**
   * @description Get bootcamps
   * @route  GET/api/v1/bootcamps
   * @route  GET/api/v1/courses/:bootcampId/
   * @access Public
   */
  get = AsyncHandler(async (request, response, next) => {
    response.status(200).json(response.advancedResults);
  });

  /**
   * @description Get bootcamp by id
   * @route GET/api/v1/bootcamps/:id
   * @access Public
   */
  getById = AsyncHandler(async (request, response, next) => {
    let query = this.#bootcampService.getById(request.params.id);
    query = query.populate({ path: "courses", select: "title description" });
    if (!query) {
      throw {
        message: `Bootcamp not found with the id of ${request.params.id}`,
        statusCode: 404,
      };
    }

    const bootcamp = await query;
    return response.status(200).json({
      success: true,
      message: `List of bootcamp`,
      body: bootcamp,
    });
  });

  /**
   * @description Create Bootcamp
   * @route POST/api/v1/bootcamps
   * @access Private
   */
  create = AsyncHandler(async (request, response, next) => {
    const bootcamp = await this.#bootcampService.createBootcamp(request);
    response.status(200).json({
      success: true,
      message: `Created new bootcamp`,
      body: bootcamp,
    });
  });

  /**
   * @description Update bootcamp by id
   * @route PUT/api/v1/bootcamps/:id
   * @access Private
   */
  updateById = AsyncHandler(async (request, response, next) => {
    const updatedBootcamp = await this.#bootcampService.updateBootcamp(request);
    response.status(200).json({
      success: true,
      message: `Updated Bootcamp ${request.params.id}`,
      body: updatedBootcamp,
    });
  });

  /**
   * @description Delete bootcamp by id
   * @route DELETE/api/v1/bootcamps/:id
   * @access Private
   */
  deleteById = AsyncHandler(async (request, response, next) => {
    const bootcamp = await this.#bootcampService.deleteBootcamp(request);
    return response.status(200).json({
      success: true,
      message: `Deleted Bootcamp ${request.params.id}`,
      body: bootcamp,
    });
  });

  /**
   * @description Get bootcamps with in radius
   * @route GET/api/v1/bootcamps/radius/:zipcode/:distance
   * @access Public
   */
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
    if (!request.files) {
      throw { message: `Please upload a file`, statusCode: 400 };
    }

    const file = request.files.file;

    if (!file.mimetype.startsWith("image")) {
      throw { message: "Please upload an image file", statusCode: 400 };
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      throw {
        message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        statusCode: 400,
      };
    }

    const bootcamp = await this.#bootcampService.validateOwnerBootcamp(request);
    //Create custome filname
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        throw {
          message: `Problem encountered while uploading photo`,
          statusCode: 500,
        };
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
