const mongoose = require("mongoose");
const distanceSchema = new mongoose.Schema(
  {
    distance: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Distance = mongoose.model(
  "Distance",
  distanceSchema,
  "distance"
);
module.exports = Distance;
