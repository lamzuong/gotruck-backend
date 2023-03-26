const exprees = require("express");
const mongoose = require("mongoose");

const TruckShipper = require("../models/truckShipper");

const app = exprees();

app.post("/vehicle", async (req, res) => {
  try {
    const checkExistTruck = await TruckShipper.find({
      license_plate: req.body.license_plate,
    });
    if (checkExistTruck.length > 0) {
      res.send({ isExist: true });
    } else {
      const tr = new TruckShipper(req.body);
      await tr.save();
      res.send(tr);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/vehicle", async (req, res) => {
  try {
    const tr = await TruckShipper.updateMany(
      {
        id_shipper: mongoose.Types.ObjectId(req.body.id_shipper),
        default: true,
      },
      { default: false }
    );
    const truckShipper = await TruckShipper.findOneAndUpdate(
      {
        id_shipper: mongoose.Types.ObjectId(req.body.id_shipper),
        name: req.body.name,
        default: false,
      },
      { default: true },
      { new: true }
    );
    res.send(truckShipper);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/vehicle/delete", async (req, res) => {
  try {
    const truckShipper = await TruckShipper.findOneAndUpdate(
      {
        id_shipper: mongoose.Types.ObjectId(req.body.id_shipper),
        name: req.body.name,
        license_plate: req.body.license_plate,
      },
      { deleted: true },
      { new: true }
    );
    res.send(truckShipper);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
