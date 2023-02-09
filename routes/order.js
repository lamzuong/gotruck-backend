const exprees = require("express");
const FeeApp = require("../models/feeApp");

const app = exprees();

app.get("/", async (req, res) => {
  try {
    res.send("Api order onready");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/feeapp", async (req, res) => {
  try {
    const fee_app = await FeeApp.find({});
    fee_app.sort((a, b) => b.dateStart.getTime() - a.dateStart.getTime());
    res.send(fee_app[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/feeapp", async (req, res) => {
  try {
    const feeapp = new FeeApp(req.body);
    await feeapp.save();
    res.send(feeapp);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
