const Service = require("../services/Service");
class BootcampService extends Service {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  createBootcamp = async (bootcamp) => {
    bootcamp.body.user = bootcamp.user;
    const publishedBootcamp = await this.getOne({ user: bootcamp.user });

    if (publishedBootcamp && bootcamp.user.role !== "admin") {
      return false;
    }

    return await this.create(bootcamp.body);
  };

  getBootcampWithInRadius = async (longitude, latitude, radius) => {
    return await this.#model.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius],
        },
      },
    });
  };
}

module.exports = BootcampService;
