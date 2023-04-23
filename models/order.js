const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    id_order: {
      type: String,
    },
    id_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    shipper: {
      id_shipper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shipper",
      },
      truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TruckShipper",
      },
      date_receive: {
        type: Date,
      },
    },
    reason_cancel: {
      user_cancel: {
        type: String,
        enum: ["Customer", "Shipper", "AutoDelete"],
      },
      content: {
        type: String,
      },
      date_cancel: {
        type: Date,
      },
    },
    good_type: {
      type: String,
    },
    truck_type: {
      type: String,
    },
    payer: {
      type: String,
      enums: ["receive", "send"],
    },
    addressToOfShipper: {
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
    date_complete: {
      type: Date,
    },
    date_create: {
      type: Date,
    },
    status: {
      type: String,
      enums: ["Chưa nhận", "Đã nhận", "Đang giao", "Đã giao", "Đã hủy"],
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
    expectedTime: {
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
        type: Number,
      },
      longitude: {
        type: Number,
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
        type: Number,
      },
      longitude: {
        type: Number,
      },
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    rate_shipper: {
      content: {
        type: String,
      },
      star: {
        type: Number,
      },
      time: {
        type: Date,
      },
    },
    list_image_from: [
      {
        type: String,
      },
    ],
    list_image_from_of_shipper: [
      {
        type: String,
      },
    ],
    list_image_to_of_shipper: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "order");
module.exports = Order;
