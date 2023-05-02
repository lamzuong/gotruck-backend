const exprees = require("express");
const GoodsType = require("../models/goodsType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();
const mongoose = require("mongoose");
const FormRegister = require("../models/formRegister");
const TransactionHistory = require("../models/transactionHistory");

app.get("/", async (req, res) => {
  try {
    const withDraw = await TransactionHistory.find(
      { status: "Đang xử lý" },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("id_shipper id_bank")
      .lean();
    if (withDraw.length > 0) {
      res.status(200).send(withDraw);
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/", async (req, res) => {
  try {
    const data = req.body;
    const transaction_history = await TransactionHistory.findByIdAndUpdate(
      data._id,
      {
        status: data.status,
        id_handler: data.id_handler,
        image_proof: data.image_proof,
        approval_date: new Date(),
      },
      { new: true }
    );
    res.status(200).send(transaction_history);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/pagination", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const shipper = await TransactionHistory.find(
      { status: "Đang xử lý" },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("id_shipper id_bank")
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
    const { page, limit, idTransactionHistory } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "shipper",
          localField: "id_shipper",
          foreignField: "_id",
          as: "id_shipper",
        },
      },
      { $unwind: "$id_shipper" },
      {
        $lookup: {
          from: "bank",
          localField: "id_bank",
          foreignField: "_id",
          as: "id_bank",
        },
      },
      { $unwind: "$id_bank" },
      { $match: { status: "Đang xử lý" } },
      { $sort: { createdAt: -1 } },
    ];
    if (idTransactionHistory !== "") {
      queryArr.push({
        $match: {
          id_transaction_history: {
            $regex: ".*" + idTransactionHistory + ".*",
          },
        },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const resForms = await TransactionHistory.aggregate(queryArr);
    res.send(resForms);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/history/pagination", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const shipper = await TransactionHistory.find(
      { status: "Đã xử lý", type: "Rút tiền" },
      {},
      { sort: { approval_date: -1 } }
    )
      .populate("id_shipper id_bank id_handler")
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/history/search", async (req, res) => {
  try {
    const { page, limit, idTransactionHistory } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "shipper",
          localField: "id_shipper",
          foreignField: "_id",
          as: "id_shipper",
        },
      },
      { $unwind: "$id_shipper" },
      {
        $lookup: {
          from: "bank",
          localField: "id_bank",
          foreignField: "_id",
          as: "id_bank",
        },
      },
      { $unwind: "$id_bank" },
      {
        $lookup: {
          from: "admin",
          localField: "id_handler",
          foreignField: "_id",
          as: "id_handler",
        },
      },
      { $unwind: "$id_handler" },
      { $match: { status: "Đã xử lý" } },
      { $match: { type: "Rút tiền" } },
      { $sort: { approval_date: -1 } },
    ];
    if (idTransactionHistory !== "") {
      queryArr.push({
        $match: {
          id_transaction_history: {
            $regex: ".*" + idTransactionHistory + ".*",
          },
        },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const resForms = await TransactionHistory.aggregate(queryArr);

    res.send(resForms);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
module.exports = app;
