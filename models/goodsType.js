const mongoose = require("mongoose");
const goodsTypeSchema = new mongoose.Schema(
  {
    value: { type: String },
    label: { type: String },
    history: [
      {
        oldValue: { type: String },
        newValue: { type: String },
        modifiedAt: { type: Date },
        modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      },
    ],
    deletedAt: { type: Date },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const GoodsType = mongoose.model("GoodsType", goodsTypeSchema, "goods_type");
module.exports = GoodsType;
