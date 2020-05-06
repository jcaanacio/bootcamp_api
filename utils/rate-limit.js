const rateLimit = require("express-rate-limit");
module.exports = (server, options) => {
  //   const options = {
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   };
  const limiter = rateLimit(options);
  server.use(limiter);
  return (request, response, next) => {
    next();
  };
};
