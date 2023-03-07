const mongoose = require("mongoose");
const earningSchema = new mongoose.Schema(
  {
    earnPerHour: [{ type: Number }],
    total: { type: Number },
  },
  { timestamps: true }
);

const Earning = mongoose.model("Earning", earningSchema, "earning");
module.exports = Earning;
