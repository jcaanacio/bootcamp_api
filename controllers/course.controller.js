const AsyncHandler = require("../middleware/async-handler");
const Controller = require("../archetypes/Controller");
class CourseController extends Controller {
  #courseService;
  constructor(courseService) {
    super();
    this.#courseService = courseService;
  }

  /**
   * @description Get Courses
   * @route GET/api/v1/courses
   * @route GET/api/v1/bootcamps/:bootcampId/courses
   * @access public
   */
  get = AsyncHandler(async (request, response, next) => {
    let query;
    const bootcampId = request.query.bootcampId || request.params.bootcampId;

    if (!bootcampId) {
      return response.status(200).json(response.advancedResults);
    }

    const courses = await this.#courseService.getAll({
      bootcamp: bootcampId,
    });

    if (!courses) {
      throw {
        message: `No Courses found under the bootcamp id of ${bootcampId}`,
        statusCode: 404,
      };
    }

    return response.status(200).json({
      success: true,
      message: `List of courses`,
      count: courses.length,
      body: courses,
    });
  });

  /**
   * @description Get Single Course
   * @route GET/api/v1/course/:courseId
   * @acess Public
   */
  getById = AsyncHandler(async (request, response, next) => {
    let query = this.#courseService.getById(request.params.id);

    query.populate({ path: "bootcamp", select: "name description" });
    const courses = await query;

    if (!courses) {
      throw {
        message: `Course not found with the id of ${request.params.id}`,
        statusCode: 404,
      };
    }

    response.status(200).json({
      success: true,
      message: `List of courses`,
      count: courses.length,
      body: courses,
    });
  });

  /**
   * @description Get Single Course
   * @route POST/api/v1/bootcamps/:bootcampId/courses
   * @acess Private
   */
  create = AsyncHandler(async (request, response, next) => {
    request.body.bootcamp = request.params.bootcampId;
    const course = await this.#courseService.createCourse(request);
    response.status(200).json({
      success: true,
      message: `Created new course`,
      body: course,
    });
  });

  /**
   * @description Delete Single Course
   * @route GET/api/v1/bootcamps/:courseId
   * @acess private
   */
  deleteById = AsyncHandler(async (request, response, next) => {
    const course = await this.#courseService.deleteCourse(request);
    response.status(200).json({
      sucess: true,
      message: `Course deleted ${request.params.id}`,
      body: course,
    });
  });

  /**
   * @description Update Single Course
   * @route GET/api/v1/course/:courseId
   * @acess private
   */
  updateById = AsyncHandler(async (request, response, next) => {
    const course = await this.#courseService.updateCourse(request);
    response.status(200).json({
      sucess: true,
      message: `Course uppdated ${request.params.id}`,
      body: course,
    });
  });
}

module.exports = CourseController;
