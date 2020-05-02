const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const BootcampsRouter = require("../bootcamp_api/routes/bootcamps.route");
const CoursesRouter = require("../bootcamp_api/routes/courses.route");
const AuthRouter = require("../bootcamp_api/routes/auth.route");
const UserRouter = require("../bootcamp_api/routes/user.route");
const ReviewRouter = require("../bootcamp_api/routes/review.route");
const Logger = require("./middleware/logger.middleware");
const Morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config/index.env" });
const app = express();
const PORT = process.env.PORT || 5000;
const ErrorHandler = require("./middleware/errorHandler.middleware");

connectDB();

//body parser
app.use(express.json());
app.use(cookieParser());

// app.use(Logger);

if (process.env.NODE_ENV === "development") {
  app.use(Morgan("dev"));
}
// File Upload
app.use(fileupload());

// Set Static folder

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", BootcampsRouter);
app.use("/api/v1/courses", CoursesRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use(ErrorHandler);
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

//Handle Unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
