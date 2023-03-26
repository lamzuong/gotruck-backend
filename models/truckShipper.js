const mongoose = require("mongoose");
const truckShipperSchema = new mongoose.Schema(
  {
    id_shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipper",
    },
    license_plate: {
      type: String,
    },
    name: {
      type: String,
    },
    type_truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TruckType",
    },
    list_image_info: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Chưa duyệt", "Đã duyệt"],
    },
    default: {
      type: Boolean,
    },
    deleted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const TruckShipper = mongoose.model(
  "TruckShipper",
  truckShipperSchema,
  "truck_shipper"
);
module.exports = TruckShipper;
