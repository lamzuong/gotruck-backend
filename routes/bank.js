const exprees = require("express");
const mongoose = require("mongoose");
const Bank = require("../models/bank");
const Shipper = require("../models/shipper");
const TransactionHistory = require("../models/transactionHistory");
const Order = require("../models/order");

const app = exprees();

//get all bank
app.get("/", async (req, res) => {
  try {
    const bank = await Bank.find({}, {}, { sort: { updatedAt: -1 } });
    res.send(bank);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

// add new bank
app.post("/", async (req, res) => {
  try {
    const bank = new Bank(req.body);
    await bank.save();
    res.send(bank);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

//add request withdraw
app.post("/withdraw", async (req, res) => {
  try {
    const data = req.body;
    const shipper = await Shipper.findById(data.id_shipper).lean();
    shipper.balance = Number(shipper.balance) - Number(data.money);
    const updateBalance = await Shipper.findByIdAndUpdate(
      shipper._id,
      shipper,
      { new: true }
    );

    let date = new Date().getFullYear();
    const checkHasForm = await TransactionHistory.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (checkHasForm) {
      let indexLastest = checkHasForm.id_transaction_history;
      let idNew =
        parseInt(
          (date % 100) + "" + indexLastest.slice(5, indexLastest.length)
        ) + 1;
      data.id_transaction_history = "TSH" + idNew;
    } else {
      data.id_transaction_history = "TSH" + (date % 100) + "00001";
    }
    const trsHtr = new TransactionHistory(data);
    await trsHtr.save();
    res.send(trsHtr);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

//get transaction history shipper
app.get("/history/:id_shipper", async (req, res) => {
  try {
    const history = await TransactionHistory.find(
      {
        id_shipper: mongoose.Types.ObjectId(req.params.id_shipper),
      },
      {},
      { sort: { updatedAt: -1 } }
    ).lean();
    const resOrder = await Order.find({
      "shipper.id_shipper": req.params.id_shipper,
      status: "Đã giao",
    });
    if (resOrder.length > 0) {
      let feeOrder = [];
      resOrder.map((item) => {
        const moneyTemp = (item.total * item.fee) / 100;
        const temp = {
          type: "Order",
          status: "Đã xử lý",
          money: moneyTemp,
          createdAt: item.updatedAt,
          id_order: item.id_order,
        };
        feeOrder.push(temp);
      });
      const resHistory = history.concat(feeOrder);
      resHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.send(resHistory);
    } else {
      res.send(history);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
