const mongoose = require("mongoose");
const goodsTypeSchema = new mongoose.Schema(
  {
    value: { type: String },
    label: { type: String },
  },
  { timestamps: true }
);

const GoodsType = mongoose.model("GoodsType", goodsTypeSchema, "goods_type");
module.exports = GoodsType;
