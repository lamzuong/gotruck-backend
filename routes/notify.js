const exprees = require("express");
const GoodsType = require("../models/goodsType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();
const mongoose = require("mongoose");
const FormRegister = require("../models/formRegister");
const Notification = require("../models/notification");
const Customer = require("../models/customer");

app.get("/", async (req, res) => {
  try {
    let { page, limit } = req.query;
    const totalItem = await Notification.find({});
    const notification = await Notification.find(
      {},
      {},
      { sort: { createdAt: -1 } }
    )
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("id_handler id_receiver");

    if (notification.length > 0) {
      res.send({
        data: notification,
        totalPage: totalItem,
      });
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.post("/", async (req, res) => {
  try {
    const data = req.body;

    let getIDReceiver = "";
    if (data.type_send === "Specific") {
      if (data.userModel === "Customer") {
        getIDReceiver = await Customer.findOne({
          id_cus: data.id_receiver,
        }).lean();
      } else if (data.userModel === "Shipper") {
        getIDReceiver = await Shipper.findOne({
          id_shipper: data.id_receiver,
        }).lean();
      }
      if (!getIDReceiver) {
        res.send({ isNotFound: true, data: "Mã người dùng không tồn tại" });
        return;
      } else {
        data.id_receiver = getIDReceiver._id;
      }
    }

    let date = new Date().getFullYear();
    const checkHasNotify = await Notification.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (checkHasNotify) {
      let indexLastest = checkHasNotify.id_notify;
      let indexNew =
        parseInt(
          (date % 100) + "" + indexLastest.slice(5, indexLastest.length)
        ) + 1;
      data.id_notify = "NTF" + indexNew;
    } else {
      data.id_notify = "NTF" + (date % 100) + "00001";
    }
    const notify = new Notification(data);
    await notify.save();
    res.send(notify);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
