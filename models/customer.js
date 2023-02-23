const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  id_cus:{
    type: String,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
    default: "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/defaultAvatar.png?alt=media&token=8b04dd31-d894-4b58-ab60-1dfc9e850cca"
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
