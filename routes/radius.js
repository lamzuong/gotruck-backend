const express = require("express");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const Order = require("../models/order");
const DistanceReceiveOrder = require("../models/distanceReceiveOrder");

const app = express();

app.get("/", async (req, res) => {
  try {
    const distanceReceiveOrder = await DistanceReceiveOrder.find(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (distanceReceiveOrder) {
      res.send(distanceReceiveOrder);
    } else {
      res.send({ notFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/", async (req, res) => {
  try {
    const { nameUserChange, radius } = req.body;
    const distanceReceiveOrder = new DistanceReceiveOrder({
      distance_receive_order: radius,
      nameUserChange: nameUserChange,
    });
    await distanceReceiveOrder.save();
    res.send(distanceReceiveOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
