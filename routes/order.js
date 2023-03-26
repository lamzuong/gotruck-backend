const exprees = require("express");
const FeeApp = require("../models/feeApp");
const Order = require("../models/order");
const mongoose = require("mongoose");
const app = exprees();

app.get("/", async (req, res) => {
  try {
    res.send("Api order onready");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/notshipper/order", async (req, res) => {
  try {
    const order = await Order.find(
      { status: "Chưa nhận" },
      {},
      { sort: { updatedAt: -1 } }
    );
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/user/:id_user", async (req, res) => {
  try {
    const order = await Order.find(
      {
        id_customer: mongoose.Types.ObjectId(req.params.id_user),
      },
      {},
      { sort: { updatedAt: -1 } }
    ).populate("shipper.id_shipper shipper.truck");

    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/", async (req, res) => {
  try {
    let date = new Date().getFullYear();
    const checkHasOrder = await Order.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (checkHasOrder) {
      let indexOrderLastest = checkHasOrder.id_order;
      let indexNewOrder =
        parseInt(
          (date % 100) +
            "" +
            indexOrderLastest.slice(5, indexOrderLastest.length)
        ) + 1;
      req.body.id_order = "ODR" + indexNewOrder;
      const order = new Order(req.body);
      await order.save();
      res.send(order);
    } else {
      req.body.id_order = "ODR" + (date % 100) + "00001";
      const order = new Order(req.body);
      await order.save();
      res.send(order);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    res.send(order);
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

app.post("/review", async (req, res) => {
  try {
    req.body.order.rate_shipper.time = new Date();
    const order = await Order.findByIdAndUpdate(
      req.body.order._id,
      req.body.order,
      {
        new: true,
      }
    );
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
