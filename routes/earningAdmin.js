const exprees = require("express");
const Earning = require("../models/earning");
const app = exprees();

app.post("/", async (req, res) => {
  try {
    const earning = new Earning(req.body);
    await earning.save();
    res.send(earning);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
