const mongoose = require("mongoose");
const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    content: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      enum: ["Customer", "Shipper", "Security", "Regulation"],
    },
    history: {
      oldValue: {
        title: {
          type: String,
        },
        content: [
          {
            type: String,
          },
        ],
      },
      modifiedAt: { type: Date },
      modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    },
    deletedAt: { type: Date },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    hide: { type: Boolean },
  },
  { timestamps: true }
);

const Policy = mongoose.model("Policy", policySchema, "policy");
module.exports = Policy;
