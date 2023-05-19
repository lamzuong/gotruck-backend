const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    id_notify: {
      type: String,
    },
    id_receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      enum: ["Customer", "Shipper"],
    },
    content: {
      type: String,
    },
    title: {
      type: String,
    },
    image: [{ type: String }],
    type_notify: {
      type: String,
      enum: ["Normal", "Warning", "Order", "Discount"],
    },
    type_send: {
      type: String,
      enum: ["All", "AllCustomer", "AllShipper", "Specific"],
    },
    id_handler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    default: false,
    read: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
  "notification"
);
module.exports = Notification;
