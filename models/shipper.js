const mongoose = require("mongoose");
const shipperSchema = new mongoose.Schema(
  {
    id_shipper: {
      type: String,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    list_image: {
      type: [String],
    },
    avatar: {
      type: String,
    },
    online: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    deleted: {
      type: Boolean,
    },
    block: {
      type: Boolean,
    },
    cmnd: {
      type: String,
    },
    infoXe: {
      bien_so: {
        type: String,
      },
      ten: {
        type: String,
      },
      loai_xe: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Shipper = mongoose.model("Shipper", shipperSchema, "shipper");
module.exports = Shipper;
