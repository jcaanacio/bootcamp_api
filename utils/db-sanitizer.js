module.exports = function (server) {
  server.use(require("express-mongo-sanitize")());
  return function (req, res, next) {
    next();
  };
};
