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
    email: {
      type: String,
    },
    address: {
      type: String,
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
  },
  { timestamps: true }
);

const Shipper = mongoose.model("Shipper", shipperSchema, "shipper");
module.exports = Shipper;
