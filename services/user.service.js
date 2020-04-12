const Service = require("../services/Service");

class UserService extends Service {
  #model;
  constructor(userModel) {
    super(userModel);
    this.#model = userModel;
  }
}

module.exports = UserService;
