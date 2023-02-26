const exprees = require("express");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truck_shipper");

const app = exprees();

app.get("/", async (req, res) => {
  try {
    const truck = await TruckShipper.find({});
    res.send(truck);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/user/:phone", async (req, res) => {
  try {
    const shipper = await Shipper.findOne(req.params).lean();
    if (shipper) {
      const truckShipper = await TruckShipper.find({
        id_shipper: shipper._id,
      }).populate("type_truck");
      shipper.infoAllTruck = truckShipper
    }
    res.send(shipper);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = app;
