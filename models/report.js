const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema(
  {
    id_report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    content: {
      type: String,
    },
    status: {
      type: String,
    },
    list_image: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema, "report");
module.exports = Report;
