const ErrorResponse = require('../utils/ErrorResponse');
const AsyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/GeoCoder');
class BootcampController {

    constructor(bootcampService) {
        this._bootcampService = bootcampService;
    }

    get = AsyncHandler( async (request, response, next) => {
        const bootcamps = await this._bootcampService.getAllBootcamps();
        response.status(200).json({
            success:true,
            message: `List of bootcamps`,
            count: bootcamps.length,
            body: bootcamps
        });
    });

    getById = AsyncHandler(async (request, response, next) => {
        const bootcamp = await this._bootcampService.getBootcampById(request.params.id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with the id of ${request.params.id}`, 404));
        }
        
        return response.status(200).json({
            success:true,
            message: `List of bootcamp`,
            body: bootcamp
        });
    });

    create = AsyncHandler(async (request, response, next) => {
        const bootcamp = await this._bootcampService.create(request.body);
        response.status(200).json({
            success: true,
            message: `Created new bootcamp`,
            body: bootcamp
        });
    });

    updateById = AsyncHandler(async (request, response, next) => {
        const bootcamp = await this._bootcampService.updateById(request.params.id,request.body);
        if (!bootcamp) {
            return response.status(400).json({sucess: false , body: bootcamp});
        }

        response.status(200).json({
            success:true,
            message: `Updated Bootcamp ${request.params.id}`,
            body: bootcamp
        });
    });

    deleteById = AsyncHandler(async (request, response, next) => {
        const bootcamp = await this._bootcampService.deleteById(request.params.id);
        if (!bootcamp) {
            return response.status(400).json({sucess: false , body: bootcamp});
        }

        return response.status(200).json({
            success: true,
            message: `Deleted Bootcamp ${request.params.id}`,
            body: bootcamp
        });
    });

    getWithInRadius = AsyncHandler(async (request, response, next) => {
        const {zipcode, distance} = request.params;
        /**
         * get lat/lang from geocoder
         */

        const location = await geocoder.geocode(zipcode);
        const geocoded = location[0];
        const {longitude,latitude} = geocoded;
        
        /**
         * Earth Radius = 3963 mi/ 6,379 km
         */
        const radius = distance / 3963;
        
        const bootcamps = await this._bootcampService.getBootcampWithInRadius(longitude, latitude, radius);

        return response.status(200).json({
            sucess: true,
            message: `Bootcamps within the ${zipcode}`,
            body: bootcamps
        });
    });
}

module.exports = BootcampController;