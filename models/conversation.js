const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema(
  {
    id_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    id_shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipper",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema, "conversation");
module.exports = Conversation;
