const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
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
      enum: ["Warning", "Order"],
    },
    type_send: {
      type: String,
      enum: ["All", "AllCustomer", "AllShipper", "Specific"],
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
  "notification"
);
module.exports = Notification;
