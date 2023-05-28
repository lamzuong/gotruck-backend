const exprees = require("express");
const GoodsType = require("../models/goodsType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();
const mongoose = require("mongoose");
const FormRegister = require("../models/formRegister");

app.get("/", async (req, res) => {
  try {
    const forms = await FormRegister.find(
      { status: "Chưa duyệt" },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("type_truck")
      .lean();
    if (forms.length > 0) {
      res.status(200).send(forms);
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
    const { data, id_handler, type } = req.body;

    const truckTemp = await TruckShipper.findById(data._id);
    if (truckTemp.status !== "Chưa duyệt") {
      res.send(truckTemp);
    } else {
      if (type === "denied") {
        const truck = await TruckShipper.findByIdAndUpdate(
          data._id,
          {
            status: "Từ chối",
            reason_cancel: data.reason_cancel,
            id_handler: id_handler,
            approval_date: new Date(),
          },
          { new: true }
        );

        res.send(truck);
      } else {
        const truck = await TruckShipper.findByIdAndUpdate(
          data._id,
          {
            status: "Đã duyệt",
            id_handler: id_handler,
            approval_date: new Date(),
          },
          { new: true }
        );

        res.send(truck);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/pagination", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const shipper = await TruckShipper.find(
      { status: "Chưa duyệt" },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("id_shipper type_truck")
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
    const { page, limit, idTruck } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "truck_type",
          localField: "type_truck",
          foreignField: "_id",
          as: "type_truck",
        },
      },
      { $unwind: "$type_truck" },
      {
        $lookup: {
          from: "shipper",
          localField: "id_shipper",
          foreignField: "_id",
          as: "id_shipper",
        },
      },
      { $unwind: "$id_shipper" },
      { $match: { status: "Chưa duyệt" } },
      { $sort: { createdAt: -1 } },
    ];
    if (idTruck !== "") {
      queryArr.push({
        $match: { id_truck: { $regex: ".*" + idTruck + ".*" } },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const resTruck = await TruckShipper.aggregate(queryArr);

    res.send(resTruck);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/history/pagination", async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const statusQuery =
      status === "Tất cả"
        ? {
            $or: [{ status: "Đã duyệt" }, { status: "Từ chối" }],
            id_handler: { $ne: null },
          }
        : { status: status, id_handler: { $ne: null } };
    const shipper = await TruckShipper.find(
      statusQuery,
      {},
      { sort: { approval_date: -1 } }
    )
      .populate("id_shipper type_truck id_handler")
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
    const { page, limit, idTruck } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "truck_type",
          localField: "type_truck",
          foreignField: "_id",
          as: "type_truck",
        },
      },
      { $unwind: "$type_truck" },
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
          from: "admin",
          localField: "id_handler",
          foreignField: "_id",
          as: "id_handler",
        },
      },
      { $unwind: "$id_handler" },
      {
        $match: {
          $or: [{ status: "Đã duyệt" }, { status: "Từ chối" }],
        },
      },
      { $sort: { approval_date: -1 } },
    ];
    if (idTruck !== "") {
      queryArr.push({
        $match: { id_truck: { $regex: ".*" + idTruck + ".*" } },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const resTruck = await TruckShipper.aggregate(queryArr);

    res.send(resTruck);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
