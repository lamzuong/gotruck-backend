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
      const checkCancel = await Order.findById(req.body._id);
      if (checkCancel.status === "Đã hủy") {
        res.send(checkCancel);
      } else {
        req.body.reason_cancel.date_cancel = new Date();
        const order = await Order.findByIdAndUpdate(req.body._id, req.body, {
          new: true,
        });
        res.send(order);
      }
    } else {
      const checkStatus = await Order.findById(req.body._id);
      if (checkStatus.status === "Đã hủy") {
        res.send(checkStatus);
      } else if (checkStatus.status === "Đã nhận") {
        res.send(checkStatus);
      } else {
        req.body.shipper.date_receive = new Date();
        const order = await Order.findByIdAndUpdate(req.body._id, req.body, {
          new: true,
        });
        res.send(order);
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/receivegoods", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
