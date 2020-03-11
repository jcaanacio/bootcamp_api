class BootcampService {

    constructor (model) {
        this._model = model;
    }

    getAllBootcamps = () => {
        return this._model.find();
    }

    getBootcampById = (id) => {
        return this._model.findById(id);
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