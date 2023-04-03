const mongoose = require("mongoose");
const truckTypeSchema = new mongoose.Schema(
  {
    name: {
      type: Number,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

const TruckType = mongoose.model("TruckType", truckTypeSchema, "truck_type");
module.exports = TruckType;
