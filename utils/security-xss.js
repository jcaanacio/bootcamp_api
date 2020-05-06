module.exports = (server) => {
  server.use(require("xss-clean")());
  return (request, response, next) => {
    next();
  };
};
