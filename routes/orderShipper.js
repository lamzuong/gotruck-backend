const exprees = require("express");
const mongoose = require("mongoose");
const DistanceReceiveOrder = require("../models/distanceReceiveOrder");
const Order = require("../models/order");
const Shipper = require("../models/shipper");

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
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/shipper/:id_shipper", async (req, res) => {
  try {
    const order = await Order.find(
      {
        "shipper.id_shipper": mongoose.Types.ObjectId(req.params.id_shipper),
      },
      {},
      { sort: { updatedAt: -1 } }
    ).populate("shipper.id_shipper shipper.truck id_customer");
    res.send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/", async (req, res) => {
  try {
    if (req.body.status === "Đã hủy") {
      const checkCancel = await Order.findById(req.body._id);
      if (
        checkCancel.status === "Đã hủy" ||
        checkCancel.status === "Đang giao"
      ) {
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
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/receivegoods", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    if (req.body.status === "Đã giao") {
      const charge = (req.body.total * req.body.fee) / 100;
      const id_shipper = req.body.shipper.id_shipper;
      const shp = await Shipper.findById(id_shipper).lean();
      const newBalance = shp.balance - charge;
      shp.balance = newBalance;
      const newShp = await Shipper.findByIdAndUpdate(id_shipper, shp);
    }
    res.send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/review/:id_shipper", async (req, res) => {
  try {
    const order = await Order.find(
      {
        "shipper.id_shipper": mongoose.Types.ObjectId(req.params.id_shipper),
        status: "Đã giao",
        rate_shipper: { $ne: null },
      },
      "rate_shipper",
      { sort: { updatedAt: -1 } }
    );
    const data = order.map((item) => {
      return item.rate_shipper;
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.post("/expectedaddress", async (req, res) => {
  try {
    const shipper = await Shipper.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/expectedaddress", async (req, res) => {
  try {
    req.body.expected_address.time_used = new Date();
    const shipper = await Shipper.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/shipping/:id_shipper", async (req, res) => {
  try {
    const order = await Order.findOne({
      "shipper.id_shipper": mongoose.Types.ObjectId(req.params.id_shipper),
      status: ["Đã nhận", "Đang giao"],
    });
    if (order) {
      res.send(order);
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.send({ isNotFound: true });
  }
});

app.put("/location", async (req, res) => {
  try {
    const shipperNew = req.body;
    const shp = await Shipper.findByIdAndUpdate(
      shipperNew._id,
      {
        last_active_date: new Date(),
        current_address: shipperNew.current_address,
      },
      { new: true }
    );
    res.send(shp);
  } catch (error) {
    console.log(error);
    res.send({ isNotFound: true });
  }
});

app.get("/ordercurrent/:id_shipper", async (req, res) => {
  try {
    const id_shipper = req.params.id_shipper;
    const order = await Order.findOne(
      {
        "shipper.id_shipper": mongoose.Types.ObjectId(id_shipper),
        $or: [{ status: "Đã nhận" }, { status: "Đang giao" }],
      },
      {},
      { sort: { updatedAt: -1 } }
    ).populate("shipper.id_shipper shipper.truck id_customer");
    if (order) {
      res.send(order);
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.send({ isNotFound: true });
  }
});

module.exports = app;
