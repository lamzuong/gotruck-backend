const exprees = require("express");
const TruckType = require("../models/truckType");
const TransportPrice = require("../models/transportPrice");
const Distance = require("../models/distance");

const app = exprees();

app.get("/", async (req, res) => {
  try {
    const transport_price = await TransportPrice.find({});
    res.send(transport_price);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const transportPrice = new TransportPrice(req.body);
    res.send(transportPrice);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/trucktype", async (req, res) => {
  try {
    const trucktype = await TruckType.find({});
    res.send(trucktype);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/trucktype", async (req, res) => {
  try {
    const trucktype = new TruckType(req.body);
    await trucktype.save();
    res.send(trucktype);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/distance", async (req, res) => {
  try {
    const distance = await Distance.find({});
    res.send(distance);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.post("/distance", async (req, res) => {
  try {
    const distance = new Distance(req.body);
    await distance.save();
    res.send(distance);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
