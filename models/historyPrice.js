const mongoose = require("mongoose");
const historyPriceSchema = new mongoose.Schema(
  {
    id_history_price: {
      type: String,
    },
    old_price: {
      type: Number,
    },
    new_price: {
      type: Number,
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const HistoryPrice = mongoose.model(
  "HistoryPrice",
  historyPriceSchema,
  "history_price"
);
module.exports = HistoryPrice;
