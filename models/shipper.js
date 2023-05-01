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
    expected_address: {
      address: {
        type: String,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      time_used: {
        type: Date,
      },
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    status: {
      type: String,
      enums: ["Đã duyệt", "Chưa duyệt", "Từ chối"],
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
    balance: {
      type: Number,
    },
    reason_cancel: {
      type: String,
    },
    last_active_date: {
      type: Date,
    },
    current_address: {
      address: {
        type: String,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

const Shipper = mongoose.model("Shipper", shipperSchema, "shipper");
module.exports = Shipper;
