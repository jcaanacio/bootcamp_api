const express = require('express');
const dotenv = require('dotenv');
const BootcampsRouter = require('../bootcamp_api/routes/bootcamps.route');
const Logger = require('./middleware/logger.middleware');
const Morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
dotenv.config({path: './config/index.env'});
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

connectDB();

app.use(Logger);

if (process.env.NODE_ENV === "development") {
    app.use(Morgan('dev'));
}

app.use('/api/v1/bootcamps',BootcampsRouter);
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
});

//Handle Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});