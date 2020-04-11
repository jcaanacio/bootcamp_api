const Service = require("../services/Service");
class CourseService extends Service {
  #bootcampService;
  constructor(model, bootcampService) {
    super(model);
    this.#bootcampService = bootcampService;
  }

  createCourse = async (model) => {
    const bootcamp = await this.#bootcampService.getById(model.bootcamp);

    if (!bootcamp) {
      return undefined;
    }

    return await this.create(model);
  };
}

module.exports = CourseService;
