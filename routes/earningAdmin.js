const exprees = require("express");
const Earning = require("../models/earning");
const app = exprees();

// get earning today
app.get("/today", async (req, res) => {
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  try {
    const earning = await Earning.find({
      createdAt: {
        $gte: new Date(today.toISOString().slice(0, 10) + "T00:00:00.000Z"),
        $lt: new Date(tomorrow.toISOString().slice(0, 10) + "T00:00:00.000Z"),
      },
    });
    res.send(earning);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get earning week
app.get("/week", async (req, res) => {
  var today = new Date();
  today.setDate(today.getDate() + 1);
  var lastweek = new Date();
  lastweek.setDate(lastweek.getDate() - 6);
  try {
    const earning = await Earning.find({
      createdAt: {
        $gte: new Date(lastweek.toISOString().slice(0, 10) + "T00:00:00.000Z"),
        $lt: new Date(today.toISOString().slice(0, 10) + "T00:00:00.000Z"),
      },
    });
    res.send(earning);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get earning month
app.get("/month", async (req, res) => {
  var today = new Date();
  today.setDate(today.getDate() + 1);
  var lastmonth = new Date();
  lastmonth.setMonth(lastmonth.getMonth() - 1);
  try {
    const earning = await Earning.find({
      createdAt: {
        $gte: new Date(lastmonth.toISOString().slice(0, 10) + "T00:00:00.000Z"),
        $lte: new Date(today.toISOString().slice(0, 10) + "T00:00:00.000Z"),
      },
    });
    res.send(earning);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get earning specific
app.get("/specific", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const earning = await Earning.find({
      createdAt: {
        $gte: new Date(startDate + "T00:00:00.000Z"),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      },
    });
    res.send(earning);
  } catch (error) {
    res.status(500).send(error);
  }
});
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
