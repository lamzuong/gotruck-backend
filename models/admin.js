const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema, "admin");
module.exports = Admin;
