const mongoose = require("mongoose");
const feedBackSchema = new mongoose.Schema(
  {
    id_feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
    },
    email:{
      type:String,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
    },
    list_image: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const FeedBack = mongoose.model("FeedBack", feedBackSchema, "feed_back");
module.exports = FeedBack;
