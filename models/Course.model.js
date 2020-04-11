const Mongoose = require("mongoose");
const bootcampAvgCost = require("../middleware/BootcampAvgCost");

const CourseSchema = new Mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
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
  //   user: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'User',
  //     required: true
  //   }
});

/**
 * Static Method to get avg of course tuitions
 */

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log(`Calculating avg cost...`.blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await bootcampAvgCost(bootcampId, obj[0].averageCost);
  } catch (error) {
    console.log(`${error}`.red);
  }
};

/**
 *  Call getAverageCost after save
 */
CourseSchema.post("save", function () {
  const self = this;
  self.constructor.getAverageCost(self.bootcamp);
});

/**
 *  Call getAverageCost after save
 */
CourseSchema.pre("remove", function () {
  const self = this;
  self.constructor.getAverageCost(self.bootcamp);
});

module.exports = Mongoose.model("Course", CourseSchema);
