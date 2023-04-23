const mongoose = require("mongoose");
const formRegisterSchema = new mongoose.Schema(
  {
    id_form: {
      type: String,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    cmnd: {
      type: String,
    },
    list_vehicle_registration: [{ type: String }],
    list_image_info: [
      {
        type: String,
      },
    ],
    type_truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TruckType",
    },
    status: {
      type: String,
      enums: ["Chưa duyệt", "Đã duyệt", "Từ chối"],
    },
    reason_cancel: {
      type: String,
    },
    license_plate: {
      type: String,
    },
    name_truck: {
      type: String,
    },
    id_handler:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    }
  },
  { timestamps: true }
);

const FormRegister = mongoose.model(
  "FormRegister",
  formRegisterSchema,
  "form_register"
);
module.exports = FormRegister;
