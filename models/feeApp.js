const mongoose = require("mongoose");
const feeAppSchema = new mongoose.Schema(
  {
    fee: {
      type: Number,
    },
    dateEnd: {
      type: Date,
    },
    dateStart: {
      type: Date,
    },
    content: {
      type: String,
    },
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const FeeApp = mongoose.model("FeeApp", feeAppSchema, "fee_app");
module.exports = FeeApp;
