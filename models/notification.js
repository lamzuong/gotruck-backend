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
    type_notifi: {
      type: String,
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
