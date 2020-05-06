const dotenv = require("dotenv");
const fs = require("fs");
const colors = require("colors");
const connectDB = require("./config/db.js");

/**
 * Load Env vars
 */

dotenv.config({ path: "./config/index.env" });

/**
 * Load models
 */

const Bootcamp = require("./models/Bootcamp.model");
const Course = require("./models/Course.model");
const Users = require("./models/Users.model");
const Reviews = require("./models/Review.model");

/**
 * Connect to DB
 */
connectDB();

/**
 * Read JSON Files
 */

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

/**
 * Import into DB
 */

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await Users.create(users);
    await Reviews.create(reviews);
    console.log(`Data Imported`.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error}`.red);
  }
};

const destroyData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await Users.deleteMany();
    await Reviews.deleteMany();
    console.log(`Data Destroyed`.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error}`.red);
  }
};

const destroyUsers = async () => {
  try {
    await Users.deleteMany();
    console.log(`Users Data Destroyed`.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error}`.red);
  }
};

const command = process.argv[2];

if (command === "-i") {
  importData();
}

if (command === "-d") {
  destroyData();
}
