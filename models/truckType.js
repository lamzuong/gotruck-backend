const mongoose = require("mongoose");
const truckTypeSchema = new mongoose.Schema(
  {
    name: {
      type: Number,
    },
  },
  { timestamps: true }
);

const TruckType = mongoose.model("TruckType", truckTypeSchema, "truck_type");
module.exports = TruckType;
