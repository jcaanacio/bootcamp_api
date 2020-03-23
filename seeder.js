const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors');


/**
 * Load Env vars
 */

dotenv.config({path: './config/index.env'});

/** 
 * Load models
 */

const Bootcamp = require('./models/Bootcamp.model');

 /** 
  * Connect to DB
  */

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});


/**
 * Read JSON Files
 */

const bootcamps = JSON.parse(fs.readFileSync(
    `${__dirname}/_data/bootcamps.json`,
    'utf-8'
));

/**
 * Import into DB
 */

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log(`Data Imported`.green.inverse);
        process.exit();
    } catch (error) {
        console.log(`Error: ${error}`.red);
    }
}

const destroyData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log(`Data Destroyed`.red.inverse);
        process.exit();
    } catch (error) {
        console.log(`Error: ${error}`.red);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    destroyData();
}