const jwt = require("jsonwebtoken");
const AsyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

class Auth {
  #userService;
  constructor(userService) {
    this.#userService = userService;
  }

  protect = AsyncHandler(async (request, resonse, next) => {
    let token;
    const authorization = request.headers.authorization;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }

    //   else if (request.cookies.token) {
    //   }

    // Make sure token exists
    if (!token) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.user = await this.#userService.getById(decoded.id);
      next();
    } catch (error) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }
  });

  /**
   * Grant access to specific roles
   */
  authorize = (...roles) => {
    return (request, resonse, next) => {
      if (!roles.includes(request.user.role)) {
        return next(
          new ErrorResponse(
            `User role '${request.user.role}' is not authorized to access this route`,
            403
          )
        );
      }
      next();
    };
  };
}

module.exports = Auth;
