const exprees = require("express");
const TruckType = require("../models/truckType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();

// get all truck type
app.get("/trucktype", async (req, res) => {
  try {
    const trucktype = await TruckType.find({});
    trucktype.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    res.send(trucktype);
  } catch (error) {
    res.status(500).send(error);
  }
});

//check exist phone of shipper and license_plate of truck
// save shipper after save truck
app.post("/register", async (req, res) => {
  const truckPost = req.body.truck;
  const shipperPost = req.body.shipper;

  const checkUser = await Shipper.findOne({ phone: shipperPost.phone });
  const checkTruck = await TruckShipper.findOne({
    license_plate: truckPost.license_plate,
  });

  try {
    if (checkTruck) {
      res.send({
        status: "error",
        message: "Phương tiện này đã được sử dụng bởi tài xế khác",
        data: {},
      });
    } else {
      if (checkUser) {
        res.send({
          status: "error",
          message: "Số điện thoại đã được sử dụng bởi tài xế khác",
          data: {},
        });
      } else {
        let date = new Date().getFullYear();
        const checkHasShipper = await Shipper.findOne(
          {},
          {},
          { sort: { createdAt: -1 } }
        );

        if (checkHasShipper) {
          let indexShpLastest = checkHasShipper.id_shipper;
          let idShipperNew =
            parseInt(
              (date % 100) +
                "" +
                indexShpLastest.slice(5, indexShpLastest.length)
            ) + 1;
          shipperPost.id_shipper = "SPR" + idShipperNew;

          const shpNew = new Shipper(shipperPost);
          await shpNew.save();
        } else {
          shipperPost.id_shipper = "SPR" + (date % 100) + "00001";
          const shpNew = new Shipper(shipperPost);
          await shpNew.save();
        }

        const shipperNew = await Shipper.findOne({
          id_shipper: shipperPost.id_shipper,
        });
        truckPost.id_shipper = shipperNew._id;
        const tr = new TruckShipper(truckPost);
        await tr.save();

        res.send({
          status: "ok",
          message: "Thành công",
          data: {},
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
