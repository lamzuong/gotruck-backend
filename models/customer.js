const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
  },
  deleted: {
    type: Boolean,
  },
  block: {
    type: Boolean,
  }

},{ timestamps: true });

const Customer = mongoose.model("Customer", customerSchema,"customer");
module.exports = Customer;
