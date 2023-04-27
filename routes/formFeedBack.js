const exprees = require("express");
const GoodsType = require("../models/goodsType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();
const mongoose = require("mongoose");
const FormRegister = require("../models/formRegister");
const TransactionHistory = require("../models/transactionHistory");
const FeedBack = require("../models/feedBack");

app.get("/id/:id_feedback", async (req, res) => {
  try {
    const idTemp = req.params.id_feedback;
    const feed_back = await FeedBack.findById(idTemp)
      .populate("id_sender id_handler")
      .lean();
    res.status(200).send(feed_back);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/", async (req, res) => {
  try {
    const data = req.body;
    const feed_back = await FeedBack.findByIdAndUpdate(
      data._id,
      {
        status: data.status,
        id_handler: data.id_handler,
      },
      { new: true }
    );
    res.status(200).send(feed_back);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/pagination", async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    let queryArr =
      status === "Tất cả"
        ? [
            {
              $match: {
                $or: [{ status: "Đã gửi" }, { status: "Đã tiếp nhận" }],
              },
            },
          ]
        : status === "Đã tiếp nhận"
        ? [{ $match: { status: "Đã tiếp nhận" } }]
        : [
            {
              $match: {
                $or: [{ status: "Đã gửi" }, { status: "Đã tiếp nhận" }],
              },
            },
          ]; // case default

    queryArr.push(
      {
        $lookup: {
          from: "customer",
          localField: "id_sender",
          foreignField: "_id",
          as: "id_sender",
        },
      },
      { $unwind: "$id_sender" }
    );
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const feedBack = await FeedBack.aggregate(queryArr);
    // let temp = feedBack;
    // temp.sort((a, b) => (a.status > b.status ? -1 : b.status > a.status ? 1 : 0));
    res.send(feedBack);
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
  }
});

app.get("/search", async (req, res) => {
  try {
    const { page, limit, idFeedback } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "customer",
          localField: "id_sender",
          foreignField: "_id",
          as: "id_sender",
        },
      },
      { $unwind: "$id_sender" },
      {
        $match: {
          $or: [{ status: "Đã gửi" }, { status: "Đã tiếp nhận" }],
        },
      },
    ];
    if (idFeedback !== "") {
      queryArr.push({
        $match: {
          id_feedback: { $regex: ".*" + idFeedback + ".*" },
        },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const resFeedback = await FeedBack.aggregate(queryArr);
    res.send(resFeedback);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/history/pagination", async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    let queryArr = [{ $match: { status: "Đã xong" } }];

    queryArr.push(
      {
        $lookup: {
          from: "customer",
          localField: "id_sender",
          foreignField: "_id",
          as: "id_sender",
        },
      },
      { $unwind: "$id_sender" },
      {
        $lookup: {
          from: "admin",
          localField: "id_handler",
          foreignField: "_id",
          as: "id_handler",
        },
      },
      { $unwind: "$id_handler" }
    );
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const feedBack = await FeedBack.aggregate(queryArr);
    // let temp = feedBack;
    // temp.sort((a, b) => (a.status > b.status ? -1 : b.status > a.status ? 1 : 0));
    res.send(feedBack);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/history/search", async (req, res) => {
  try {
    const { page, limit, idFeedback } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "customer",
          localField: "id_sender",
          foreignField: "_id",
          as: "id_sender",
        },
      },
      { $unwind: "$id_sender" },
      {
        $lookup: {
          from: "admin",
          localField: "id_handler",
          foreignField: "_id",
          as: "id_handler",
        },
      },
      { $unwind: "$id_handler" },
      { $match: { status: "Đã xong" } },
    ];
    if (idFeedback !== "") {
      queryArr.push({
        $match: {
          id_feedback: { $regex: ".*" + idFeedback + ".*" },
        },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const resFeedback = await FeedBack.aggregate(queryArr);
    res.send(resFeedback);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = app;
