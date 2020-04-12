const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },

  email: {
    type: String,
    required: [true, "Please add an email"],
    uniqure: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },

  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 6,
    select: false,
  },

  resetPasswordToken: String,

  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("User", UserSchema);
