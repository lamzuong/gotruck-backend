const exprees = require("express");
const FeeApp = require("../models/feeApp");
const Order = require("../models/order");
const mongoose = require("mongoose");
const app = exprees();

app.get("/", async (req, res) => {
  try {
    const order = await Order.find({}).populate(
      "id_customer shipper.id_shipper shipper.truck"
    );
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/pagination", async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    let queryStr = status === "Tất cả" ? {} : { status };
    const order = await Order.find(queryStr)
      .populate("id_customer shipper.id_shipper shipper.truck")
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/search", async (req, res) => {
  try {
    const { page, limit, idCustomer, idShipper, idOrder } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "customer",
          localField: "id_customer",
          foreignField: "_id",
          as: "id_customer",
        },
      },
      {
        $lookup: {
          from: "shipper",
          localField: "shipper.id_shipper",
          foreignField: "_id",
          as: "shipper.id_shipper",
        },
      },
      {
        $addFields: {
          "shipper.id_shipper": { $arrayElemAt: ["$shipper.id_shipper", 0] },
        },
      },
      {
        $lookup: {
          from: "truck_shipper",
          localField: "shipper.truck",
          foreignField: "_id",
          as: "shipper.truck",
        },
      },
      {
        $addFields: {
          "shipper.truckr": { $arrayElemAt: ["$shipper.truck", 0] },
        },
      },
      { $unwind: "$id_customer" },
      // { $unwind: "$shipper.id_shipper" },
      // { $unwind: "$shipper.truck" },
    ];
    if (idCustomer !== "") {
      queryArr.push({
        $match: { "id_customer.id_cus": { $regex: ".*" + idCustomer + ".*" } },
      });
    }
    if (idShipper !== "") {
      queryArr.push({
        $match: { "shipper.id_shipper": { $regex: ".*" + idShipper + ".*" } },
      });
    }
    if (idOrder !== "") {
      queryArr.push({
        $match: { id_order: { $regex: ".*" + idOrder + ".*" } },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }

    const order = await Order.aggregate(queryArr);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
