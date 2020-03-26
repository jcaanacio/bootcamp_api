class BootcampService {

    constructor (model) {
        this._model = model;
    }

    getAllBootcamps = (parameters) => {
        const params = {...parameters};     
        /**
         * Fields to exclude 
         */

        const removeFields = ['select','sort','limit','page'];
        /**
         * Loop over removeFields and delete them from the query
         */
        removeFields.forEach(field => delete params[field]);


        let stringedParams = JSON.stringify(params);
        /**
         * Create Query Operators
         */
        stringedParams = stringedParams.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        /**
         * select fields
         */

        let bootcamps = this._model.find(JSON.parse(stringedParams));
        if (parameters.select) {
            const filterFields = parameters.select.split(',').join(' ');
            bootcamps = bootcamps.select(filterFields);
        }

        let orderBy ;
        if (parameters.sort) {
            orderBy = parameters.sort.split(',').join(' ');
        } else {
            orderBy = '-createAt';
        }

        /**
         * Pagination
         */
        const page = parseInt(parameters.page, 10) || 1;
        const limit = parseInt(parameters.limit, 10) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        // const totalDocuments = this._model.countDocuments();

        // /**
        //  * Pagination Results
        //  */
        // const pagination = {};
        // if (endIndex < totalDocuments) {
        //     pagination.next = {
        //         page: page + 1,
        //         limit
        //     }
        // }

        // if (startIndex > 0 ) {
        //     pagination.prev = {
        //         page: page - 1,
        //         limit
        //     }
        // }

        bootcamps = bootcamps.skip(startIndex).limit(limit);
        bootcamps.sort(orderBy);

        // const data = {
        //     data: bootcamps,
        //     page: pagination
        // }
        
        return bootcamps;
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