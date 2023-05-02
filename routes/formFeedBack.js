const exprees = require("express");
const GoodsType = require("../models/goodsType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();
const mongoose = require("mongoose");
const FormRegister = require("../models/formRegister");
const TransactionHistory = require("../models/transactionHistory");
const FeedBack = require("../models/feedBack");
const Conversation = require("../models/conversation");

app.get("/id/:id_feedback", async (req, res) => {
  try {
    const idTemp = req.params.id_feedback;
    const feed_back = await FeedBack.findById(idTemp)
      .populate("id_sender id_handler")
      .lean();
    res.status(200).send(feed_back);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/", async (req, res) => {
  try {
    const data = req.body;
    if (data.status === "Đã tiếp nhận") {
      const feed_back = await FeedBack.findByIdAndUpdate(
        data._id,
        {
          status: data.status,
          id_handler: data.id_handler,
          date_receive: new Date(),
        },
        { new: true }
      );
      res.status(200).send(feed_back);
    } else if (data.status === "Đã xong") {
      const feed_back = await FeedBack.findByIdAndUpdate(
        data._id,
        {
          status: data.status,
          id_handler: data.id_handler,
          date_complete: new Date(),
        },
        { new: true }
      );
      await Conversation.findOneAndUpdate(
        {
          id_form: feed_back._id,
        },
        { disable: true }
      );
      res.status(200).send(feed_back);
    } else {
      res.status(200).send({ data: "ok" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
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
      { $unwind: "$id_sender" },
      { $sort: { createdAt: -1 } }
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
    res.status(500).send({ data: "error" });
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
      { $sort: { createdAt: -1 } },
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
    res.status(500).send({ data: "error" });
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
      { $unwind: "$id_handler" },
      { $sort: { date_complete: -1 } }
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
    res.status(500).send({ data: "error" });
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
      { $sort: { date_complete: -1 } },
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
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
