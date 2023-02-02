const mongoose = require("mongoose");
const feeAppSchema = new mongoose.Schema(
  {
    fee: {
      type: Number,
    },
    dateCreate: {
      type: Date,
    },
    dateStart: {
      type: Date,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const FeeApp = mongoose.model("FeeApp", feeAppSchema, "fee_app");
module.exports = FeeApp;
