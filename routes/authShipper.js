const exprees = require("express");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");

const app = exprees();

app.get("/", async (req, res) => {
  try {
    const truck = await TruckShipper.find({}).lean();
    const truckSort = [];
    truck.map((item) => {
      if (item.default === true) truckSort.push(item);
    });
    truck.map((item) => {
      if (item.status === "Đã duyệt" && item.default === false)
        truckSort.push(item);
    });
    truck.map((item) => {
      if (item.status === "Chưa duyệt" && item.default === false)
        truckSort.push(item);
    });

    res.send(truckSort);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/user/:phone", async (req, res) => {
  try {
    const shipper = await Shipper.findOne(req.params).lean();
    if (shipper) {
      const truckShipper = await TruckShipper.find(
        {
          id_shipper: shipper._id,
          deleted: false,
        },
        {},
        { sort: { createdAt: -1 } }
      )
        .populate("type_truck")
        .lean();

      const truckSort = [];

      truckShipper.map((item) => {
        if (item.default === true) truckSort.push(item);
      });
      truckShipper.map((item) => {
        if (item.status === "Đã duyệt" && item.default === false)
          truckSort.push(item);
      });
      truckShipper.map((item) => {
        if (item.status === "Chưa duyệt" && item.default === false)
          truckSort.push(item);
      });

      shipper.infoAllTruck = truckSort;
    } else {
      res.send({ notFound: true });
    }
    res.send(shipper);
  } catch (error) {
    res.send({ notFound: true });
  }
});

app.put("/user", async (req, res) => {
  try {
    let shp = await Shipper.findOneAndUpdate(
      { phone: req.body.phone },
      req.body,
      {
        new: true,
      }
    );
    res.send(shp);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/user/edituser", async (req, res) => {
  let phoneOld = req.body.phoneInit;
  try {
    let shp = await Shipper.findOneAndUpdate(
      { phone: phoneOld },
      req.body.user,
      {
        new: true,
      }
    );
    res.send(shp);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
