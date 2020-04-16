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

  login = async (email, password) => {
    //check user
    const model = { email: email };
    const user = await this.getOne(model).select("+password");

    if (!user) {
      throw { message: `Invalid Credentials`, statusCode: 401 };
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw { message: `Invalid Credentials`, statusCode: 401 };
    }

    return user;
  };

  forgotPassword = async (email) => {
    const user = await this.getOne({ email });

    if (!user) {
      throw { message: `There is no user ${email}`, statusCode: 404 };
    }

    return user;
  };

  rollBackForgotPassword = async (user) => {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    return await user.save({ validateBeforeSave: true });
  };
}

module.exports = UserService;
