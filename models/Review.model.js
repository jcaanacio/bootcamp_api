const Mongoose = require("mongoose");
const bootcampAvgRating = require("../middleware/BootcampAvgRating");

const ReviewSchema = new Mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add a some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: Mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: Mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

//Prevent User submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

/**
 * Static Method to get avg rating and save
 */

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  console.log(`Calculating avg rating...`.blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await bootcampAvgRating(bootcampId, obj[0].averageRating);
  } catch (error) {
    console.log(`${error}`.red);
  }
};

/**
 *  Call getAverageRating after save
 */
ReviewSchema.post("save", function () {
  const self = this;
  self.constructor.getAverageRating(self.bootcamp);
});

/**
 *  Call getAverageRating after save
 */
ReviewSchema.pre("remove", function () {
  const self = this;
  self.constructor.getAverageRating(self.bootcamp);
});

module.exports = Mongoose.model("Review", ReviewSchema);
