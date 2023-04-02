const express = require("express");
const Shipper = require("../models/shipper");

const app = express();

app.get("/", async (req, res) => {
  try {
    const shipper = await Shipper.find({ status: "Đã duyệt" });
    res.send(shipper);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/byId/:id", async (req, res) => {
  try {
    const shipper = await Shipper.find({ id_shipper: req.params.id });
    res.send(shipper[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/pagination", async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    let queryStr =
      status === "Tất cả"
        ? { status: "Đã duyệt" }
        : status === "Đã khóa"
        ? { block: true, status: "Đã duyệt" }
        : { block: false, status: "Đã duyệt" };
    const shipper = await Shipper.find(queryStr)
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(shipper);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/search", async (req, res) => {
  const { page, limit, idShipper } = req.query;
  const queryArr = [{ $match: { status: "Đã duyệt" } }];
  if (idShipper !== "") {
    queryArr.push({
      $match: { id_cus: { $regex: ".*" + idShipper + ".*" } },
    });
  }
  if (page) {
    queryArr.push({ $skip: (page - 1) * limit });
    queryArr.push({ $limit: +limit });
  }

  const cus = await Shipper.aggregate(queryArr);
  res.send(cus);
});
app.put("/block/:idShipper", async (req, res) => {
  const resp = await Shipper.find({ id_shipper: req.params.idShipper });
  const shipper = await Shipper.findByIdAndUpdate(resp[0]._id, {
    block: !resp[0].block,
  });
  res.send(shipper);
});

module.exports = app;
