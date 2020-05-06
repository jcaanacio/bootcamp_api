module.exports = (server) => {
  server.use(require("helmet")());
  return (request, response, next) => {
    next();
  };
};
