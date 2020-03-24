class BootcampService {

    constructor (model) {
        this._model = model;
    }

    getAllBootcamps = (params) => {
        let query = JSON.stringify(params);
        query = query.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        console.log(query);
        return this._model.find(JSON.parse(query));
    }

    getBootcampById = (id) => {
        return this._model.findById(id);
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

    create = (bootcamp) => {
        return this._model.create(bootcamp);
    }

    updateById = (id, bootcamp) => {
        return this._model.findByIdAndUpdate(id, bootcamp, {
            new: true,
            runValidators: true
        });
    }

    deleteById = (id) => {
        return this._model.findByIdAndDelete(id);
    }

}

module.exports = BootcampService;