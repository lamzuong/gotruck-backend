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
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/user/:phone", async (req, res) => {
  try {
    const shipper = await Shipper.findOne(req.params).lean();
    if (shipper) {
      await Shipper.findByIdAndUpdate(
        shipper._id,
        {
          last_active_date: new Date(),
        },
        { new: true }
      );
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
    console.log(error);
    res.status(500).send({ data: "error" });
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
    console.log(error);
    res.status(500).send({ data: "error" });
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
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/block/:id_shipper", async (req, res) => {
  let id_shipper = req.params.id_shipper;
  try {
    let shp = await Shipper.findById(id_shipper);
    res.send(shp);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
