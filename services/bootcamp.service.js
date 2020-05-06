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
      throw {
        message: `The user ${bootcamp.user.email} has already published a bootcamp`,
        statusCode: 400,
      };
    }

    return await this.create(bootcamp.body);
  };

  updateBootcamp = async (request) => {
    const { body, user, params } = request;
    const bootcamp = await this.validateOwnerBootcamp(params.id, user);
    return await this.updateById(params.id, body);
  };

  deleteBootcamp = async (request) => {
    const { user, params } = request;
    const bootcamp = await this.validateOwnerBootcamp(params.id, user);
    return await bootcamp.remove();
  };

  validateOwnerBootcamp = async (bootcampId, user) => {
    const bootcamp = await this.getById(bootcampId);

    if (!bootcamp) {
      throw {
        message: `Bootcamp not found with the Id of ${bootcampId}`,
        statusCode: 404,
      };
    }

    if (bootcamp.user.toString() !== user.id && user.role !== "admin") {
      throw {
        message: `User ${user.email} is not authorized to make changes to this bootcamp`,
        statusCode: 403,
      };
    }

    return await bootcamp;
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
