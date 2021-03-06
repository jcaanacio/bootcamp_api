const AsyncHandler = require("../middleware/async-handler");
const TokenController = require("../archetypes/TokenController");
class UserController extends TokenController {
  #userService;
  constructor(userService) {
    super(userService);
    this.#userService = userService;
  }

  /**
   * @description Delete's a single user in the database
   * @route DELETE /api/v1/user/:id
   * @access Private
   */
  deleteUserById = AsyncHandler(async (request, response, next) => {
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
   * @access Private/admin
   */
  getAllUsers = AsyncHandler(async (request, response, next) => {
    return response.status(200).json(response.advancedResults);
  });

  /**
   * @description Create a single user
   * @route POST /api/v1/user/
   * @access Private/admin
   */
  createUser = AsyncHandler(async (request, response, next) => {
    const { name, email, password, role } = request.body;
    const user = { name, email, password, role };
    const registeredUser = await this.#userService.register(user);

    response.status(201).json({
      success: true,
      message: "User created",
      body: registeredUser,
      token: registeredUser.getSignedJwtToken(),
    });
  });

  /**
   * @description Update a single user
   * @route PUT /api/v1/user/:id
   * @access Private/adim
   */
  updateUserById = AsyncHandler(async (request, response, next) => {
    const { id } = request.params;
    const user = request.body;
    const updatedUser = await this.#userService.updateUserDetails(id, user);

    response.status(201).json({
      success: true,
      message: "User updated",
      body: updatedUser,
    });
  });
}

module.exports = UserController;
