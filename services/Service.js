class Service {

    constructor (model) {
        this._model = model;
    }

    getAll = (parameters) => {
        return this._model.find(parameters);
    }

    getById = (id) => {
        return this._model.findById(id);
    }

    create = (model) => {
        return this._model.create(model);
    }

    updateById = (id, model) => {
        return this._model.findByIdAndUpdate(id, model, {
            new: true,
            runValidators: true
        });
    }

    deleteById = (id) => {
        return this._model.findByIdAndDelete(id);
    }

    countDocuments = () => {
        return this._model.countDocuments();
    }
    
}

module.exports = Service;