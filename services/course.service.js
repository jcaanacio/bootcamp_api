const Service = require('../services/Service');
class CourseService extends Service {
    constructor (model, bootcampService) {
        super(model);
        this._bootcampService = bootcampService;
    }

    createCourse = async (model) => {
        const bootcamp = await this._bootcampService.getById(model.bootcamp);
        
        if (!bootcamp) {
            return undefined;
        }

        return await this.create(model);
    }
}

module.exports = CourseService;