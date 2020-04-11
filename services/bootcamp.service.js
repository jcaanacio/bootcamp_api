const Service = require("../services/Service");
class BootcampService extends Service {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  getBootcampWithInRadius = (longitude, latitude, radius) => {
    return this.#model.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius],
        },
      },
    });
  };
}

module.exports = BootcampService;
