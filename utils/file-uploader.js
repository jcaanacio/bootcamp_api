module.exports = (server) => {
  server.use(require("express-fileupload")());
  return function (request, response, next) {
    next();
  };
};
