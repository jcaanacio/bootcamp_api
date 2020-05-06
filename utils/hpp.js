module.exports = (server) => {
  server.use(require("hpp")());
  return (request, response, next) => {
    next();
  };
};
