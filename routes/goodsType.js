const exprees = require("express");
const GoodsType = require("../models/goodsType");
const app = exprees();

app.post("/", async (req, res) => {
  try {
    const goodsType = new GoodsType(req.body);
    await goodsType.save();
    res.send(goodsType);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.put("/", async (req, res) => {
  try {
    const { id_good_update, goodNew } = req.body;

    const goodTemp = await GoodsType.findById(id_good_update).lean();

    const history = goodTemp.history || [];
    history.push(goodNew.history);

    goodTemp.value = goodNew.value;
    goodTemp.label = goodNew.label;
    goodTemp.history = history;

    const temp = await GoodsType.findByIdAndUpdate(id_good_update, goodTemp, {
      new: true,
    }).lean();

    res.send(temp);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.get("/", async (req, res) => {
  try {
    const goodsType = await GoodsType.find({ deletedAt: { $eq: null } });
    res.send(goodsType);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.get("/pagination", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const goodsType = await GoodsType.find({ deletedAt: { $eq: null } })
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(goodsType);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.get("/search/:keyword", async (req, res) => {
  try {
    const goodsType = await GoodsType.find({
      label: { $regex: ".*" + req.params.keyword + ".*" },
      deletedAt: { $eq: null },
    });
    res.send(goodsType);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.put("/delete", async (req, res) => {
  try {
    const { valueDeleteGoods, deletedAt, deletedBy } = req.body;
    const goodsType = await GoodsType.findOneAndUpdate(
      {
        value: valueDeleteGoods,
      },
      { deletedAt: deletedAt, deletedBy: deletedBy },
      { new: true }
    );
    res.send(goodsType);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
