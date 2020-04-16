const AsyncHandler = require("../middleware/asyncHandler");
const Controller = require("../utils/Controller");
const crypo = require("crypto");

class AuthController extends Controller {
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
    const user = await this.#userService.register(request);

    response.status(200).json({
      success: true,
      message: "User registered",
      body: user,
      token: user.getSignedJwtToken(),
    });
  });

  /**
   * @description Get all user
   * @route GET/api/v1/auth/
   * @access Public
   */
  getAll = AsyncHandler(async (request, response, next) => {
    const users = await this.#userService.getAll(request.params);

    response.status(200).json({
      success: true,
      body: users,
    });
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
    return this.#sendTokenResponse(user, 200, response);
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

    return this.#sendTokenResponse(updatedUserPassword, 200, response);
  });

  /**
   * @description Private method send token response
   * @route N/A
   */
  #sendTokenResponse = (user, statusCode, response) => {
    const token = user.getSignedJwtToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
      options.secure = true;
    }

    response.status(statusCode).cookie("token", token, options).json({
      success: true,
      body: user,
      token,
    });
  };
}

module.exports = AuthController;
