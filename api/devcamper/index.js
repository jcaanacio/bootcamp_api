const BootcampsRouter = require("../../routes/bootcamps.route");
const CoursesRouter = require("../../routes/courses.route");
const AuthRouter = require("../../routes/auth.route");
const UserRouter = require("../../routes/user.route");
const ReviewRouter = require("../../routes/review.route");

module.exports = (server) => {
  server.use("/api/v1/bootcamps", BootcampsRouter);
  server.use("/api/v1/courses", CoursesRouter);
  server.use("/api/v1/auth", AuthRouter);
  server.use("/api/v1/users", UserRouter);
  server.use("/api/v1/reviews", ReviewRouter);

  return function (req, res, next) {
    next();
  };
};
