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
    const totalItem = await Notification.find({
      id_handler: { $exists: true },
    });
    const notification = await Notification.find(
      { id_handler: { $exists: true } },
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

app.get("/customer/:id_customer", async (req, res) => {
  try {
    const { id_customer } = req.params;
    const notification = await Notification.find(
      {
        $or: [
          { type_send: "All" },
          { type_send: "AllCustomer" },
          { type_send: "Specific", id_receiver: id_customer },
        ],
      },
      {},
      { sort: { createdAt: -1 } }
    ).populate("id_handler id_receiver");

    if (notification.length > 0) {
      const listNoRead = notification.filter(
        (item) => item.read.indexOf(id_customer) === -1
      );
      const listRead = notification.filter(
        (item) => item.read.indexOf(id_customer) > -1
      );
      const listRes = listNoRead.concat(listRead);
      res.send(listRes);
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/shipper/:id_shipper", async (req, res) => {
  try {
    const { id_shipper } = req.params;
    const notification = await Notification.find(
      {
        $or: [
          { type_send: "All" },
          { type_send: "AllShipper" },
          { type_send: "Specific", id_receiver: id_shipper },
        ],
      },
      {},
      { sort: { createdAt: -1 } }
    ).populate("id_handler id_receiver");

    if (notification.length > 0) {
      const listNoRead = notification.filter(
        (item) => item.read.indexOf(id_shipper) === -1
      );
      const listRead = notification.filter(
        (item) => item.read.indexOf(id_shipper) > -1
      );
      const listRes = listNoRead.concat(listRead);
      res.send(listRes);
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.body._id,
      {
        read: req.body.read,
      },
      { new: true }
    );

    res.send({ data: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.post("/shipper", async (req, res) => {
  try {
    const data = req.body;

    let getIDReceiver = "";
    if (data.type_send === "Specific") {
      if (data.userModel === "Customer") {
        getIDReceiver = await Customer.findOne({
          _id: mongoose.Types.ObjectId(data.id_receiver),
        }).lean();
      } else if (data.userModel === "Shipper") {
        getIDReceiver = await Shipper.findOne({
          _id: mongoose.Types.ObjectId(data.id_receiver),
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
