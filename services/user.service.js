const Service = require("../services/Service");

class UserService extends Service {
  #model;
  constructor(userModel) {
    super(userModel);
    this.#model = userModel;
  }

  register = async (request) => {
    const { name, email, password, role } = request.body;

    const user = this.#model.create({
      name,
      email,
      password,
      role,
    });

    return await user;
  };
}

module.exports = UserService;
