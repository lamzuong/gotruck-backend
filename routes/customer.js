const express = require("express");
const Customer = require("../models/customer");
const app = express();

app.get("/", async (req, res) => {
  try {
    const customer = await Customer.find({});
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/byId/:id", async (req, res) => {
  try {
    const customer = await Customer.find({ id_cus: req.params.id });
    res.send(customer[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/pagination", async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    let queryStr =
      status === "Tất cả"
        ? {}
        : status === "Đã khóa"
        ? { block: true }
        : { block: false };
    const customer = await Customer.find(queryStr)
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/search", async (req, res) => {
  const { page, limit, idCustomer } = req.query;
  const queryArr = [];
  if (idCustomer !== "") {
    queryArr.push({
      $match: { id_cus: { $regex: ".*" + idCustomer + ".*" } },
    });
  }
  if (page) {
    queryArr.push({ $skip: (page - 1) * limit });
    queryArr.push({ $limit: +limit });
  }

  const cus = await Customer.aggregate(queryArr);
  res.send(cus);
});
app.put("/block/:idCustomer", async (req, res) => {
  const cus = await Customer.find({ id_cus: req.params.idCustomer });
  const customer = await Customer.findByIdAndUpdate(cus[0]._id, {
    block: !cus[0].block,
  });
  res.send(customer);
});

module.exports = app;
