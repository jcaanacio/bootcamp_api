const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const BootcampsRouter = require("../bootcamp_api/routes/bootcamps.route");
const Courses = require("../bootcamp_api/routes/courses.route");
const Logger = require("./middleware/logger.middleware");
const Morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const fileupload = require("express-fileupload");
dotenv.config({ path: "./config/index.env" });
const app = express();
const PORT = process.env.PORT || 5000;
const ErrorHandler = require("./middleware/errorHandler.middleware");
app.use(express.json());

connectDB();

// app.use(Logger);

if (process.env.NODE_ENV === "development") {
  app.use(Morgan("dev"));
}
// File Upload
app.use(fileupload());

// Set Static folder

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", BootcampsRouter);
app.use("/api/v1/courses", Courses);
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
