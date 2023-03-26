const mongoose = require("mongoose");
const transactionHistorySchema = new mongoose.Schema(
  {
    id_shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipper",
    },
    money: {
      type: Number,
    },
    id_bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
    account_number: {
      type: String,
    },
    account_name: {
      type: String,
    },
    status: {
      type: String,
      enums: ["Đang xử lý", "Đã xử lý"],
    },
    type: {
      type: String,
      enums: ["Rút tiền", "Nạp tiền"],
    },
  },
  { timestamps: true }
);

const TransactionHistory = mongoose.model(
  "TransactionHistory",
  transactionHistorySchema,
  "transaction_history"
);
module.exports = TransactionHistory;