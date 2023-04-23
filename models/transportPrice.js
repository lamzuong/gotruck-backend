const mongoose = require("mongoose");
const transportPriceSchema = new mongoose.Schema(
  {
    id_truck_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TruckType",
    },
    id_distance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distance",
    },
    price: {
      type: Number,
    },
    modifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const TransportPrice = mongoose.model(
  "TransportPrice",
  transportPriceSchema,
  "transport_price"
);
module.exports = TransportPrice;
