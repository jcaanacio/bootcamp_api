class Service {
  #model;
  constructor(model) {
    this.#model = model;
  }

  getAll = (parameters) => {
    return this.#model.find(parameters);
  };

  getById = (id) => {
    return this.#model.findById(id);
  };

  create = (model) => {
    return this.#model.create(model);
  };

  updateById = (id, model) => {
    return this.#model.findByIdAndUpdate(id, model, {
      new: true,
      runValidators: true,
    });
  };

  deleteById = (id) => {
    return this.#model.findByIdAndDelete(id);
  };

  countDocuments = () => {
    return this.#model.countDocuments();
  };

  getModelName = () => {
    return this.#model.collection.collectionName;
  };

  getOne = (model) => {
    return this.#model.findOne(model);
  };
}

module.exports = Service;
