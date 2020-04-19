const AsyncHandler = require("../middleware/asyncHandler");
const Controller = require("../utils/Controller");
class UserController extends Controller {
  #userService;
  constructor(userService) {
    super(userService);
    this.#userService = userService;
  }
  /**
   * @description Updates the user's details except the password field
   * @route PUT /api/v1/user/:id
   * @access Private
   */
  updateDetails = AsyncHandler(async (request, response, next) => {
    const { body } = request;
    const userModel = {
      name: body.name,
      email: body.email,
    };

    // const user = await this.#userService.updateById(request.params.id, fields);
    const user = await this.#userService.updateUserDetails(
      request.params.id,
      userModel
    );

    return response.status(200).json({
      success: true,
      message: `User updated with the id of ${request.params.id}`,
      body: user,
    });
  });

  /**
   * @description Delete's a single user in the database
   * @route DELETE /api/v1/user/:id
   * @access Private
   */
  deleteUser = AsyncHandler(async (request, response, next) => {
    const { id } = request.params;
    const user = await this.#userService.deleteUser(id);

    return response.status(200).json({
      success: true,
      message: `User delete with the id of ${id}`,
      body: user,
    });
  });

  /**
   * @description Get single user from the database
   * @route GET /api/v1/user/:id
   * @access Public
   */
  getUserById = AsyncHandler(async (request, response, next) => {
    const { id } = request.params;
    const user = await this.#userService.getUserById(id);

    return response.status(200).json({
      sucess: true,
      message: `User found`,
      body: user,
    });
  });

  /**
   * @description Get all user from the database
   * @route GET /api/v1/user/
   * @access Public
   */
  getAllUsers = AsyncHandler(async (request, response, next) => {
    return response.status(200).json(response.advancedResults);
  });
}

module.exports = UserController;
