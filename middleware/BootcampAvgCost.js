const Bootcamp = require("../models/Bootcamp.model");
const BootcampAvgCost = (id, avgCost) => {
  return Bootcamp.findByIdAndUpdate(id, {
    averageCost: Math.ceil(avgCost / 10) * 10,
  });
};

module.exports = BootcampAvgCost;
