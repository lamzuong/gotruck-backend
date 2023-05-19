const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    id_conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    message: {
      type: String,
    },
    id_sender: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      refPath: "userSendModel",
    },
    userSendModel: {
      type: String,
      required: true,
      enum: ["Customer", "Shipper", "Admin"],
    },
    read: [{ type: String }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema, "message");
module.exports = Message;
