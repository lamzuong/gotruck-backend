const exprees = require("express");
const GoodsType = require("../models/goodsType");
const app = exprees();

app.post("/", async (req, res) => {
  try {
    const goodsType = new GoodsType(req.body);
    await goodsType.save();
    res.send(goodsType);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/", async (req, res) => {
  try {
    const goodsType = await GoodsType.find({});
    res.send(goodsType);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/pagination", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const goodsType = await GoodsType.find({})
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(goodsType);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/search/:keyword", async (req, res) => {
  try {
    const goodsType = await GoodsType.find({
      label: { $regex: ".*" + req.params.keyword + ".*" },
    });
    res.send(goodsType);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.delete("/:label", async (req, res) => {
  try {
    const goodsType = await GoodsType.findOneAndDelete({
      label: req.params.label,
    });

    res.send(goodsType);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
