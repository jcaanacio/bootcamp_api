const Bootcamp = require("../models/Bootcamp.model");
const BootcampAvgRating = (id, avgRating) => {
  return Bootcamp.findByIdAndUpdate(id, {
    averageRating: avgRating,
  });
};

module.exports = BootcampAvgRating;
