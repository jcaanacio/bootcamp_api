const ErrorHandler = (error, request, response, next) => {
    console.log(error.stack.red);
    response.status(error.statusCode || 500 ).json(
        {
            success: false,
            error: error.message || `Server Error`
        }
    );
}

module.exports = ErrorHandler;