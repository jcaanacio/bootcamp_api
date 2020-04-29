const Controller = require("./Controller");

class TokenController extends Controller {
  /**
   * @description Private method send token response
   * @route N/A
   */
  sendTokenResponse = (user, statusCode, response) => {
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

module.exports = TokenController;
