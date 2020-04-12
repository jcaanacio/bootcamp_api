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
    response.status(200).json({
      success: true,
    });
  });
}

module.exports = AuthController;
