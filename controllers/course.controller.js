const AsyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Controller = require('../utils/Controller');
class CourseController extends Controller {

    constructor(courseService) {
        super();
        this._courseService = courseService;
    }

    /**
     * @description Get Courses
     * @route GET/api/v1/courses
     * @route GET/api/v1/bootcamps/:bootcampId/courses
     * @access public
     */
    get = AsyncHandler( async (request, response, next) => {
        let query;
        const bootcampId = request.query.bootcampId || request.params.bootcampId;
        if (bootcampId) {
            query = this._courseService.getAll( { bootcamp: bootcampId } );
        } else {
            query = this._courseService.getAll();
        }

        const courses = await query;

        response.status(200).json({
            success:true,
            message: `List of courses`,
            count: courses.length,
            body: courses
        });
    });
}


module.exports = CourseController;