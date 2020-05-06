module.exports = (server) => {
  server.use(require("cookie-parser")());
  return function (request, response, next) {
    next();
  };
};
