const Service = require("../services/Service");

class UserService extends Service {
  #model;
  constructor(userModel) {
    super(userModel);
    this.#model = userModel;
  }

  /**
   * @params User Object
   * @return User Object
   */
  register = async (user) => {
    const { name, email, password, role } = user;
    const newUser = this.#model.create({
      name,
      email,
      password,
      role,
    });

    return await newUser;
  };

  /**
   * @params email, password
   * @return User Object
   */
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

  /**
   * @params email
   * @return User Object
   */
  forgotPassword = async (email) => {
    const user = await this.getOne({ email });

    if (!user) {
      throw { message: `There is no user ${email}`, statusCode: 404 };
    }

    return user;
  };

  /**
   * @params User Object
   * @return User Object
   */
  rollBackForgotPassword = async (user) => {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    return await user.save({ validateBeforeSave: true });
  };

  /**
   * @params id, user object
   */
  updateUserDetails = async (id, user) => {
    if (!id) {
      throw { message: `Must login a user`, statusCode: 401 };
    }

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

  /**
   * @params Id, current password, new password
   */
  updateUserPassword = async (id, currentPassword, newPassword) => {
    if (!id) {
      throw { message: `User must have an Id`, statusCode: 401 };
    }

    if (!currentPassword) {
      throw {
        message: `Kindly enter the user's current password`,
        statusCode: 401,
      };
    }

    if (!newPassword) {
      throw {
        message: `Kindly enter the user's new password`,
        statusCode: 401,
      };
    }

    let user = await this.getById(id).select("+password");

    if (!user) {
      throw { message: `User not found with an id of ${id}`, statusCode: 404 };
    }

    if (!(await user.matchPassword(currentPassword))) {
      throw { message: `Password is incorrect`, statusCode: 401 };
    }

    user.password = newPassword;

    return await user.save();
  };

  /**
   * @params id
   * @return User Object
   */
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

  /**
   * @params id
   * @return User object
   */
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
