const express = require("express");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const Order = require("../models/order");
const DistanceReceiveOrder = require("../models/distanceReceiveOrder");
const FeeApp = require("../models/feeApp");

const app = express();

app.get("/", async (req, res) => {
  try {
    const feeapp = await FeeApp.find(
      {},
      {},
      { sort: { createdAt: -1 } }
    ).populate("modifyBy");
    if (feeapp) {
      res.send(feeapp);
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
    const { id_modify, fee } = req.body;
    const feeCurrent = await FeeApp.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (feeCurrent) {
      await FeeApp.findByIdAndUpdate(feeCurrent._id, { dateEnd: new Date() });
    }
    const feeApp = new FeeApp({
      fee: fee,
      modifyBy: id_modify,
      dateStart: new Date(),
      content: "Phí app " + fee + "%",
    });

    await feeApp.save();
    res.send(feeApp);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
