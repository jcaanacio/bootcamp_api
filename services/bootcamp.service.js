const Service = require('../services/Service');
class BootcampService extends Service {

    constructor (model) {
        super(model);
    }

    getBootcampWithInRadius = (longitude, latitude, radius) => {
        return this._model.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [longitude, latitude],
                        radius
                    ]
                }

            }
        });
    }
}

module.exports = BootcampService;