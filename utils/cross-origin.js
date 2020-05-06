module.exports = (server) => {
  server.use(require("cors")());
  return (request, response, next) => {
    next();
  };
};
