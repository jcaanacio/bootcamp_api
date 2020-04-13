const Mongoose = require("mongoose");
const Slugify = require("slugify");
const geoCoder = require("../utils/GeoCoder");

const BootcampSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name field is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Name cannot be more then 100 characters"],
    },
    slug: String,
    description: {
      type: String,
      require: [true, "description field is required"],
      trim: true,
      maxlength: [500, "description cannot be more then 500 characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Create bootcamp slug from name
 */
BootcampSchema.pre("save", function (next) {
  this.slug = Slugify(this.name, { lower: true });
  next();
});

/**
 * Geocode & create location field
 */
BootcampSchema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);
  const geoCoded = loc[0];
  this.location = {
    type: "point",
    coordinates: [geoCoded.longitude, geoCoded.latitude],
    formattedAddress: geoCoded.formattedAddress,
    street: geoCoded.streetName,
    city: geoCoded.city,
    state: geoCoded.stateCode,
    zipcode: geoCoded.zipcode,
    country: geoCoded.countryCode,
  };

  // Do not save address in DB
  this.address = undefined;
  next();
});

/**
 * Cascade delete courses when a bootcamp deleted
 */

BootcampSchema.pre("remove", async function (next) {
  console.log(`Courses being removed from bootcam ${this._id}`.green.bold);
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});
/**
 * Reverse populate with virtuals
 */

BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = Mongoose.model("Bootcamp", BootcampSchema);
