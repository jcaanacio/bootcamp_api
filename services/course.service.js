const Service = require("../services/Service");
class CourseService extends Service {
  #bootcampService;
  constructor(model, bootcampService) {
    super(model);
    this.#bootcampService = bootcampService;
  }

  createCourse = async (request) => {
    const { body, user } = request;
    const bootcamp = await this.#bootcampService.validateOwnerBootcamp(
      body.bootcamp,
      user
    );
    body.user = bootcamp.user;
    return await this.create(body);
  };

  deleteCourse = async (request) => {
    const { user, params } = request;
    const course = await this.#validateCourseOwner(params.id, user);
    return await course.remove();
  };

  updateCourse = async (request) => {
    const { user, params, body } = request;
    await this.#validateCourseOwner(params.id, user);
    return await this.updateById(params.id, body);
  };

  #validateCourseOwner = async (courseId, user) => {
    const course = await this.getById(courseId);
    if (!course) {
      throw {
        message: `Course not found with the Id of ${courseId}`,
        statusCode: 403,
      };
    }

    await this.#bootcampService.validateOwnerBootcamp(course.bootcamp, user);

    return course;
  };
}

module.exports = CourseService;
