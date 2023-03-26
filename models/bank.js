const mongoose = require("mongoose");
const bankSchema = new mongoose.Schema(
  {
    name_full: {
      type: String,
    },
    name_short: {
      type: String,
    },    
  },
  { timestamps: true }
);

const Bank = mongoose.model(
  "Bank",
  bankSchema,
  "bank"
);
module.exports = Bank;
