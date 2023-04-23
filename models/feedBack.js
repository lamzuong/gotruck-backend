const mongoose = require("mongoose");
const feedBackSchema = new mongoose.Schema(
  {
    id_feedback: {
      type: String,
    },
    id_sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enums: ["Đã gửi", "Đã tiếp nhận", "Đã xong"],
    },
    list_image: [
      {
        type: String,
      },
    ],
    id_handler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const FeedBack = mongoose.model("FeedBack", feedBackSchema, "feed_back");
module.exports = FeedBack;
