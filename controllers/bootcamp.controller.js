const ErrorResponse = require('../utils/ErrorResponse');
class BootcampController {

    constructor(bootcampService) {
        this._bootcampService = bootcampService;
    }

    get = async (request, response, next) => {
        try {
            const bootcamps = await this._bootcampService.getAllBootcamps();
            response.status(200).json({
                success:true,
                message: `List of bootcamps`,
                count: bootcamps.length,
                body: bootcamps
            });
        } catch (err) {
            response.status(400).json({sucess: false});
        }
        
    }

    getById = async (request, response, next) => {
        try {
            const bootcamp = await this._bootcampService.getBootcampById(request.params.id);
            if (!bootcamp) {
                // return response.status(400).json({sucess: false});
                return next(new ErrorResponse(`Bootcamp not found with the id of ${request.params.id}`, 404));
            }
            
            return response.status(200).json({
                success:true,
                message: `List of bootcamp`,
                body: bootcamp
            });
        } catch (err) {
            // response.status(400).json({sucess: false});
            next(new ErrorResponse(err.message, 400));
        }
    };

    create = async (request, response, next) => {
        try {
            const bootcamp = await this._bootcampService.create(request.body);
            response.status(200).json({
                success: true,
                message: `Created new bootcamp`,
                body: bootcamp
            });
        } catch (err) {
            response.status(400).json({sucess: false});
        }
        
    };

    updateById = async (request, response, next) => {
        
        try {
            const bootcamp = await this._bootcampService.updateById(request.params.id,request.body);
            if (!bootcamp) {
                return response.status(400).json({sucess: false , body: bootcamp});
            }

            response.status(200).json({
                success:true,
                message: `Updated Bootcamp ${request.params.id}`,
                body: bootcamp
            });
        } catch (err) {
            return response.status(400).json({sucess: false , body: err});
        }
        
    };

    deleteById = async (request, response, next) => {
        try {
            const bootcamp = await this._bootcampService.deleteById(request.params.id);
            if (!bootcamp) {
                return response.status(400).json({sucess: false , body: bootcamp});
            }

            return response.status(200).json({
                success: true,
                message: `Deleted Bootcamp ${request.params.id}`,
                body: bootcamp
            });
        } catch (err) {
            return response.status(400).json({sucess: false, error: err});
        }
    };
}

module.exports = BootcampController;