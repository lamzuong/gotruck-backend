const mongoose = require("mongoose");
const savedPlaceSchema = new mongoose.Schema(
  {
    address: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    id_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  { timestamps: true }
);

const SavedPlace = mongoose.model(
  "SavedPlace",
  savedPlaceSchema,
  "saved_place"
);
module.exports = SavedPlace;
