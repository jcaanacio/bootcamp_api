
class BootcampController {

    constructor(model) {
        this._model = model;
    }

    get = async (request, response, next) => {
        try {
            const bootcamps = await this._model.find();
            response.status(200).json({
                success:true,
                message: `List of bootcamps`,
                body: bootcamps
            });
        } catch (err) {
            response.status(400).json({sucess: false});
        }
        
    }

    getById = async (request, response, next) => {
        try {
            const bootcamp = await this._model.findById(request.params.id);
            if (!bootcamp) {
                return response.status(400).json({sucess: false});
            }
            
            response.status(200).json({
                success:true,
                message: `List of bootcamps`,
                body: bootcamp
            });
        } catch (err) {
            response.status(400).json({sucess: false});
        }

        response.status(200).json({
            success: true,
            message: `Bootcamp ${request.params.id}`
        });
    };

    create = async (request, response, next) => {
        try {
            const bootcamp = await this._model.create(request.body);
            response.status(200).json({
                success: true,
                message: `Created new bootcamp`,
                body: bootcamp
            });
        } catch (err) {
            response.status(400).json({sucess: false});
        }
        
    };

    updateById = (request, response, next) => {
        response.status(200).json({
            success:true,
            message: `Updated Bootcamp ${request.params.id}`
        });
    };

    deleteById = async (request, response, next) => {
        try {
            const bootcamp = this._model.findByIdAndDelete(request.params.id);
            console.log(request.params.id);
            // console.log();
            if (!bootcamp) {
                return response.status(400).json({sucess: false , body: bootcamp});
            }

            response.status(200).json({
                success: true,
                message: `Deleted Bootcamp ${request.params.id}`,
                body: bootcamp
            });
        } catch (err) {
            response.status(400).json({sucess: false, error: err});
        }
    };
}

module.exports = BootcampController;