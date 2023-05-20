const exprees = require("express");
const mongoose = require("mongoose");

const TruckShipper = require("../models/truckShipper");
const Shipper = require("../models/shipper");
const TransactionHistory = require("../models/transactionHistory");
const app = exprees();

app.post("/vehicle", async (req, res) => {
  try {
    const data = req.body;
    const checkExistTruck = await TruckShipper.find({
      license_plate: data.license_plate,
    });
    const checkTruckInFormRegister = await FormRegister.find({
      license_plate: data.license_plate,
    });
    if (checkExistTruck.length > 0 || checkTruckInFormRegister.length > 0) {
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

app.put("/recharge/:idShipper", async (req, res) => {
  try {
    const { shipperSend, id_handler } = req.body;
    const resp = await Shipper.find({ id_shipper: req.params.idShipper });
    const shipper = await Shipper.findByIdAndUpdate(resp[0]._id, {
      balance: shipperSend.balance,
    });

    const trAdd = {
      id_shipper: shipper._id,
      money: shipperSend.balance - resp[0].balance,
      status: "Đã xử lý",
      type: "Nạp tiền",
      id_handler: id_handler,
      approval_date: new Date(),
    };

    let date = new Date().getFullYear();
    const checkHasTransactionHistory = await TransactionHistory.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (checkHasTransactionHistory) {
      let indexLastest = checkHasTransactionHistory.id_transaction_history;
      let idNew =
        parseInt(
          (date % 100) + "" + indexLastest.slice(5, indexLastest.length)
        ) + 1;
      trAdd.id_transaction_history = "TSH" + idNew;
    } else {
      trAdd.id_transaction_history = "TSH" + (date % 100) + "00001";
    }
    const trsHtr = new TransactionHistory(trAdd);
    await trsHtr.save();

    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
