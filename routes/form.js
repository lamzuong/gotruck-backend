const exprees = require("express");
const TruckType = require("../models/truckType");
const TransportPrice = require("../models/transportPrice");
const Distance = require("../models/distance");
const FeedBack = require("../models/feedBack");
const FormRegister = require("../models/formRegister");
const TransactionHistory = require("../models/transactionHistory");
const TruckShipper = require("../models/truckShipper");

const app = exprees();

// get all transport price
app.get("/:type", async (req, res) => {
  try {
    const type = req.params.type;
    let total = 0;
    if (type === "feedback") {
      total = await FeedBack.find({
        $or: [{ status: "Đã gửi" }, { status: "Đã tiếp nhận" }],
      }).countDocuments();
    } else if (type === "register") {
      total = await FormRegister.find({
        status: "Chưa duyệt",
      }).countDocuments();
    } else if (type === "withdraw") {
      total = await TransactionHistory.find({
        status: "Đang xử lý",
      }).countDocuments();
    } else if (type === "vehicle") {
      total = await TruckShipper.find({
        status: "Chưa duyệt",
      }).countDocuments();
    }
    res.send({ total: total });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = app;
