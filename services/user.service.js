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

  updateUserDetails = async (id, user) => {
    if (!user.email) {
      throw { message: `Must enter a user's email`, statusCode: 401 };
    }

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!user.email.match(mailFormat)) {
      throw { message: `Must enter a valid user's email`, statusCode: 401 };
    }

    if (!user.name) {
      throw { message: `Must enter a user's name`, statusCode: 401 };
    }

    const userToUpdate = await this.getById(id);

    if (!userToUpdate) {
      throw { message: `User not found with the id of ${id}`, statusCode: 404 };
    }

    return await this.updateById(id, user);
  };

  deleteUser = async (id) => {
    if (!id) {
      throw { message: `Must enter a user's id`, statusCode: 401 };
    }

    const user = await this.getById(id);

    if (!user) {
      throw { message: `User not found with the id of ${id}`, statusCode: 404 };
    }

    return await user.remove();
  };

  getUserById = async (id) => {
    if (!id) {
      throw { message: `Must enter a user's id`, statusCode: 401 };
    }

    const user = await this.getById(id);
    if (!user) {
      throw { message: `User not found with the id of ${id}`, statusCode: 404 };
    }

    return user;
  };
}

module.exports = UserService;
