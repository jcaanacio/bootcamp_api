const ErrorResponse = require("../utils/ErrorResponse");
const AsyncHandler = require("../middleware/asyncHandler");
const Controller = require("../utils/Controller");

class AuthController extends Controller {
  #userService;
  constructor(userService) {
    super();
    this.#userService = userService;
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
      return next(new ErrorResponse(`Please provide an email & password`, 400));
    }

    const user = await this.#userService.login(email, password);

    //Check if user exist or password is match
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    return this.#sendTokenResponse(user, 200, response);
  });

  /**
   * @description Forgot password
   * @route POST/api/v1/auth/forgotPassword
   * @access Public
   */
  forgotPassword = AsyncHandler(async (request, response, next) => {
    const resetToken = await this.#userService.forgotPassword(
      request.body.email
    );

    return response.status(200).json({
      success: true,
      resetToken,
    });
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
