const exprees = require("express");
const mongoose = require("mongoose");
const Bank = require("../models/bank");
const Shipper = require("../models/shipper");
const TransactionHistory = require("../models/transactionHistory");

const app = exprees();

//get all bank
app.get("/", async (req, res) => {
  try {
    const bank = await Bank.find({}, {}, { sort: { updatedAt: -1 } });
    res.send(bank);
  } catch (error) {
    res.status(500).send(error);
  }
});

// add new bank
app.post("/", async (req, res) => {
  try {
    const bank = new Bank(req.body);
    await bank.save();
    res.send(bank);
  } catch (error) {
    res.status(500).send(error);
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
    res.status(500).send(error);
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
    );
    res.send(history);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
