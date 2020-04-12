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
   * @route POST/api/v1/register/
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

  getAll = AsyncHandler(async (request, response, next) => {
    const users = await this.#userService.getAll(request.params);

    response.status(200).json({
      success: true,
      body: users,
    });
  });
}

module.exports = AuthController;
