const exprees = require("express");
const mongoose = require("mongoose");

const TruckShipper = require("../models/truckShipper");

const app = exprees();

app.post("/vehicle", async (req, res) => {
  try {
    const data = req.body;
    const checkExistTruck = await TruckShipper.find({
      license_plate: data.license_plate,
    });
    if (checkExistTruck.length > 0) {
      res.send({ isExist: true });
    } else {
      let date = new Date().getFullYear();
      const checkHasTruck = await TruckShipper.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );
      if (checkHasTruck) {
        let indexLastest = checkHasTruck.id_truck;
        let idNew =
          parseInt(
            (date % 100) + "" + indexLastest.slice(5, indexLastest.length)
          ) + 1;
        data.id_truck = "VHC" + idNew;
      } else {
        data.id_truck = "VHC" + (date % 100) + "00001";
      }

      const tr = new TruckShipper(data);
      await tr.save();
      res.send(tr);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
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
    console.log(error);
    res.status(500).send({ data: "error" });
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
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
