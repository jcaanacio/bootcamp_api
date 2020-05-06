module.exports = (server) => {
  server.use(require("../middleware/logger.middleware"));

  if (process.env.NODE_ENV === "development") {
    server.use(require("morgan")("dev"));
  }

  return (request, response, next) => {
    next();
  };
};
