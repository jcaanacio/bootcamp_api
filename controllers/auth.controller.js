const AsyncHandler = require("../middleware/asyncHandler");
const crypo = require("crypto");
const TokenController = require("../utils/TokenController");

class AuthController extends TokenController {
  #userService;
  #emailService;
  constructor(userService, emailService) {
    super();
    this.#userService = userService;
    this.#emailService = emailService;
  }

  /**
   * @description Register User
   * @route POST/api/v1/auth/register/
   * @access Public
   */
  register = AsyncHandler(async (request, response, next) => {
    const { name, email, password, role } = request.body;
    const user = { name, email, password, role };
    const registeredUser = await this.#userService.register(user);

    response.status(200).json({
      success: true,
      message: "User registered",
      body: registeredUser,
      token: registeredUser.getSignedJwtToken(),
    });
  });

  /**
   * @description Get current user
   * @route GET/api/v1/auth/
   * @access Public
   */
  getMe = AsyncHandler(async (request, response, next) => {
    const { id } = request.user;
    const user = await this.#userService.getUserById(id);
    return this.sendTokenResponse(user, 200, response);
  });

  /**
   * @description Login a user
   * @route /api/v1/auth/login
   * @access Public
   */
  login = AsyncHandler(async (request, response, next) => {
    const { email, password } = request.body;
    //check body parameters
    if (!email || !password) {
      throw { message: `Please provide an email & password`, statusCode: 400 };
    }

    const user = await this.#userService.login(email, password);
    return this.sendTokenResponse(user, 200, response);
  });

  /**
   * @description Forgot password
   * @route POST/api/v1/auth/forgotPassword
   * @access Public
   */
  forgotPassword = AsyncHandler(async (request, response, next) => {
    const user = await this.#userService.forgotPassword(request.body.email);
    const token = user.getResetPasswordToken();
    user.save();

    const resetUrl = `${request.protocol}://${request.get(
      "host"
    )}/api/v1/auth/resetpassword/${token}`;

    const message = `You're receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\ ${resetUrl}`;

    const email = {
      email: user.email,
      subject: "Password reset",
      message: message,
    };

    try {
      await this.#emailService(email);
      return response.status(200).json({
        success: true,
        data: `Email sent`,
      });
    } catch (error) {
      console.log(error);
      const rollBackForgotPasswordUser = await this.#userService.rollBackForgotPassword(
        user
      );

      throw {
        message: error.message,
        statusCode: 500,
      };
    }
  });

  /**
   * @description Reset Password
   * @route PUT/api/v1/auth/resetpassword/:resettoken
   */
  resetPassword = AsyncHandler(async (request, response, next) => {
    const token = crypo
      .createHash("sha256")
      .update(request.params.resettoken)
      .digest("hex");

    const query = {
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    };

    const user = await this.#userService.getOne(query);

    if (!user) {
      throw { message: `Invalid token`, statusCode: 400 };
    }

    // Set the new password
    user.password = request.body.password;
    const updatedUserPassword = await this.#userService.rollBackForgotPassword(
      user
    );

    return this.sendTokenResponse(updatedUserPassword, 200, response);
  });

  /**
   * @description Updates the user's details except the password field
   * @route PUT /api/v1/auth/:id
   * @access Private
   */
  updateDetails = AsyncHandler(async (request, response, next) => {
    const { body } = request;
    const userModel = {
      name: body.name,
      email: body.email,
    };

    const user = await this.#userService.updateUserDetails(
      request.user.id,
      userModel
    );

    return response.status(200).json({
      success: true,
      message: `User updated with the id of ${request.user.id}`,
      body: user,
    });
  });

  /**
   * @description Update the password of a user
   * @route PUT /api/v1/user/updatePassword
   * @acess Private
   */
  updatePassword = AsyncHandler(async (request, response, next) => {
    const { currentPassword, newPassword } = request.body;
    const updatedUserPassword = await this.#userService.updateUserPassword(
      request.user.id,
      currentPassword,
      newPassword
    );

    return this.sendTokenResponse(updatedUserPassword, 200, response);
  });

  /**
   * @description Logout
   * @route GET /api/av1/auth/logout
   * @access Private
   */
  logout = AsyncHandler(async (request, response, next) => {
    response
      .status(200)
      .cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
      });
  });
}

module.exports = AuthController;
