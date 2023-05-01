const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema(
  {
    id_form: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      refPath: "form_model",
    },
    form_model: {
      type: String,
      required: true,
      enum: ["Order", "FeedBack"],
    },
    disable: {
      type: Boolean,
      default: false,
    },
    id_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    id_shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipper",
    },
    id_admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema,
  "conversation"
);
module.exports = Conversation;
