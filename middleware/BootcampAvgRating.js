const Bootcamp = require("../models/Bootcamp.model");
const BootcampAvgRating = async (id, avgRating) => {
  return await Bootcamp.findByIdAndUpdate(id, {
    averageRating: avgRating,
  });
};

module.exports = BootcampAvgRating;
