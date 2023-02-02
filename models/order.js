const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    id_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    id_shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipper",
    },
    list_shipper_cancel: [
      {
        id_shipper_cancel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shipper",
        },
        reason: {
          type: String,
        },
      },
    ],
    content: {
      type: String,
    },
    date_complete: {
      type: Date,
    },
    date_create: {
      type: Date,
    },
    status: {
      type: String,
    },
    fee: {
      type: Number,
    },
    total: {
      type: Number,
    },
    distance: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    note: {
      type: String,
    },
    from_address: {
      address: {
        type: String,
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    to_address: {
      address: {
        type: String,
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
    },

    rate_shipper: {
      type: Number,
    },
    list_image_from: [
      {
        type: String,
      },
    ],
    list_image_to: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "order");
module.exports = Order;
