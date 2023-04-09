const exprees = require("express");
const GoodsType = require("../models/goodsType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();
const mongoose = require("mongoose");

app.get("/register", async (req, res) => {
  try {
    const shp = await Shipper.find(
      { status: "Chưa duyệt" },
      {},
      { sort: { createdAt: -1 } }
    ).lean();
    if (shp.length > 0) {
      let shpRes = [];
      for (let index = 0; index < shp.length; index++) {
        let temp = shp[index];
        const truckShipper = await TruckShipper.findOne(
          {
            id_shipper: temp._id,
            deleted: false,
            status: "Chưa duyệt",
          },
          {},
          { sort: { createdAt: -1 } }
        )
          .populate("type_truck")
          .lean();

        if (truckShipper) {
          temp.typeTruck = truckShipper;
          shpRes.push(temp);
        }
        if (index === shp.length - 1) {
          res.status(200).send(shpRes);
        }
      }
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/register", async (req, res) => {
  try {
    const { data, type } = req.body;
    const shp = await Shipper.findByIdAndUpdate(
      data._id,
      {
        status: data.status,
      },
      { new: true }
    );

    if (type === "accept") {
      const truck = await TruckShipper.findByIdAndUpdate(
        data.typeTruck._id,
        {
          status: "Đã duyệt",
        },
        { new: true }
      );
    } else {
      const truck = await TruckShipper.findByIdAndUpdate(
        data.typeTruck._id,
        {
          status: "Từ chối",
        },
        { new: true }
      );
    }
    res.send(shp);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
