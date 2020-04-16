const ErrorResponse = require("../utils/ErrorResponse");

const ErrorHandler = (err, request, response, next) => {
  let error = { ...err };
  console.log(err.message.red);
  console.log(err);
  error.message = err.message;

  /**
   * Mongoose bad ObjectId
   */
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${error.value}`;
    error = new ErrorResponse(message, 404);
  }

  /**
   * Mongoose duplicate Key
   */
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  /**
   * Mongoose validation error
   */
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  response.status(error.statusCode || 500).json({
    success: false,
    error: error.message || `Server Error`,
  });
};

module.exports = ErrorHandler;
