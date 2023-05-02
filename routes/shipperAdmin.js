const express = require("express");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const Order = require("../models/order");
const TransactionHistory = require("../models/transactionHistory");

const app = express();

app.get("/", async (req, res) => {
  try {
    const shipper = await Shipper.find(
      { status: "Đã duyệt" },
      {},
      { sort: { last_active_date: -1 } }
    );
    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.get("/byId/:id", async (req, res) => {
  try {
    const shipper = await Shipper.findOne({ id_shipper: req.params.id }).lean();
    if (shipper) {
      const truckShipper = await TruckShipper.find(
        {
          id_shipper: shipper._id,
          deleted: false,
        },
        {},
        { sort: { createdAt: -1 } }
      )
        .populate("type_truck")
        .lean();

      const truckSort = [];

      truckShipper.map((item) => {
        if (item.default === true) truckSort.push(item);
      });
      truckShipper.map((item) => {
        if (item.status === "Đã duyệt" && item.default === false)
          truckSort.push(item);
      });
      shipper.infoAllTruck = truckSort;

      const countCancel = await Order.find({
        "shipper.id_shipper": shipper._id,
        status: "Đã hủy",
      }).countDocuments();

      const countCompleted = await Order.find({
        "shipper.id_shipper": shipper._id,
        status: "Đã giao",
      });

      let sum = 0;
      let avg = 0;
      if (countCompleted.length > 0) {
        for (const a of countCompleted) {
          if (a.rate_shipper) {
            sum += a.rate_shipper.star;
          }
        }
        svg = sum / countCompleted.length;
      }
      shipper.countCancel = countCancel?.length;
      shipper.countCompleted = countCompleted?.length;
      shipper.rateShipper = avg;
    } else {
      res.send({ notFound: true });
    }
    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.get("/pagination", async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    let queryStr =
      status === "Tất cả"
        ? { status: "Đã duyệt" }
        : status === "Đã khóa"
        ? { block: true, status: "Đã duyệt" }
        : { block: false, status: "Đã duyệt" };
    const shipper = await Shipper.find(
      queryStr,
      {},
      { sort: { last_active_date: -1 } }
    )
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.get("/search", async (req, res) => {
  try {
    const { page, limit, idShipper } = req.query;
    const queryArr = [
      { $match: { status: "Đã duyệt" } },
      { $sort: { last_active_date: -1 } },
    ];
    if (idShipper !== "") {
      queryArr.push({
        $match: { id_shipper: { $regex: ".*" + idShipper + ".*" } },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }

    const cus = await Shipper.aggregate(queryArr);
    res.send(cus);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/block/:idShipper", async (req, res) => {
  try {
    const resp = await Shipper.find({ id_shipper: req.params.idShipper });
    const shipper = await Shipper.findByIdAndUpdate(resp[0]._id, {
      block: !resp[0].block,
    });
    res.send(shipper);
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
