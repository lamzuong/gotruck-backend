const mongoose = require("mongoose");
const distanceReceiveOrderSchema = new mongoose.Schema(
  {
    distance_receive_order: {
      type: Number,
    },
    nameUserChange: {
      type: String,
    },
  },
  { timestamps: true }
);

const DistanceReceiveOrder = mongoose.model(
  "DistanceReceiveOrder",
  distanceReceiveOrderSchema,
  "distance_receive_order"
);
module.exports = DistanceReceiveOrder;
