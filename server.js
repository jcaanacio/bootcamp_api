const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
dotenv.config({ path: "./config/index.env" });
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

/**
 * Body parser
 */
app.use(express.json());
app.use(require("./utils/cookie-parser")(app));

/**
 * Loggers
 */
app.use(require("./utils/logger")(app));

/**
 * File upload
 */
app.use(require("./utils/file-uploader")(app));

/**
 * Sanitizer
 */
app.use(require("./utils/db-sanitizer")(app));

/**
 * Security headers
 */
app.use(require("./utils/security-headers")(app));

/**
 * Security XSS
 */
app.use(require("./utils/security-xss")(app));

/**
 * HTTP parameters polution
 */
app.use(require("./utils/hpp")(app));

/**
 * Request Rate Limiter
 */
const limitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};
app.use(require("./utils/rate-limit")(app, limitOptions));

/**
 * CORS
 */
app.use(require("./utils/cross-origin")(app));
/**
 * Set static folder
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * Api
 */
app.use(require("./api/devcamper/index")(app));

/**
 * Error Handler
 */
app.use(require("./middleware/errorHandler.middleware"));

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
