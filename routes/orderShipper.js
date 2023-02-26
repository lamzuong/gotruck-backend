const exprees = require("express");
const DistanceReceiveOrder = require("../models/distanceReceiveOrder");
const Order = require("../models/order");

const app = exprees();

app.get("/distancereceive", async (req, res) => {
  try {
    const distance = await DistanceReceiveOrder.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (distance) {
      res.send(distance);
    } else {
      res.send(null);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/", async (req, res) => {
  try {
    if (req.body.status === "Đã hủy") {
      req.body.reason_cancel.date_cancel = new Date();
      const order = await Order.findByIdAndUpdate(req.body._id, req.body);
      res.send(order);
    } else {
      const checkHasShipper = await Order.findById(req.body._id);
      if (checkHasShipper.status === "Đã nhận") {
        res.send(checkHasShipper);
      } else {
        req.body.shipper.date_receive = new Date();
        const order = await Order.findByIdAndUpdate(req.body._id, req.body);
        res.send(order);
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
