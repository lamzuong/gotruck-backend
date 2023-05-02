const exprees = require("express");
const TruckType = require("../models/truckType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const FormRegister = require("../models/formRegister");
const app = exprees();

// get all truck type
app.get("/trucktype", async (req, res) => {
  try {
    const trucktype = await TruckType.find({});
    trucktype.sort((a, b) => Number(a.name) - Number(b.name));
    res.send(trucktype);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

//check exist phone of shipper and license_plate of truck
// save shipper after save truck
app.post("/register", async (req, res) => {
  const shipperRegister = req.body;
  const checkUser = await Shipper.findOne({ phone: shipperRegister.phone });
  const checkTruck = await TruckShipper.findOne({
    license_plate: shipperRegister.license_plate,
  });

  const checkTruckInFormRegister = await FormRegister.findOne({
    license_plate: shipperRegister.license_plate,
  });
  const checkUserInFormRegister = await FormRegister.findOne({
    phone: shipperRegister.phone,
  });

  try {
    if (checkTruck || checkTruckInFormRegister) {
      res.send({
        status: "error",
        message: "Phương tiện này đã được sử dụng bởi tài xế khác",
        data: {},
      });
    } else {
      if (checkUser || checkUserInFormRegister) {
        res.send({
          status: "error",
          message: "Số điện thoại đã được sử dụng bởi tài xế khác",
          data: {},
        });
      } else {
        let date = new Date().getFullYear();
        const checkHasForm = await FormRegister.findOne(
          {},
          {},
          { sort: { createdAt: -1 } }
        );
        if (checkHasForm) {
          let indexFormLastest = checkHasForm.id_form;
          let idFormNew =
            parseInt(
              (date % 100) +
                "" +
                indexFormLastest.slice(5, indexFormLastest.length)
            ) + 1;
          shipperRegister.id_form = "RGT" + idFormNew;
        } else {
          shipperRegister.id_form = "RGT" + (date % 100) + "00001";
        }
        const formNew = new FormRegister(shipperRegister);
        await formNew.save();

        res.send({
          status: "ok",
          message: "Thành công",
          data: {},
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
