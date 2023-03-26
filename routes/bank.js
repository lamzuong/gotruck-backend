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
    const shipper = await Shipper.findById(req.body.id_shipper).lean();
    shipper.balance = Number(shipper.balance) - Number(req.body.money);
    const updateBalance = await Shipper.findByIdAndUpdate(
      shipper._id,
      shipper,
      { new: true }
    );
    const trsHtr = new TransactionHistory(req.body);
    await trsHtr.save();
    res.send(trsHtr);
  } catch (error) {
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
