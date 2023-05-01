const express = require("express");
const Customer = require("../models/customer");
const Order = require("../models/order");
const app = express();

app.get("/", async (req, res) => {
  try {
    const customer = await Customer.find(
      {},
      {},
      { sort: { last_active_date: -1 } }
    );
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/byId/:id", async (req, res) => {
  try {
    const customer = await Customer.findOne({ id_cus: req.params.id }).lean();
    if (customer) {
      const countCancel = await Order.find({
        id_customer: customer._id,
        status: "Đã hủy",
      }).countDocuments();

      const countCompleted = await Order.find({
        id_customer: customer._id,
        status: "Đã giao",
      }).countDocuments();

      customer.countCancel = countCancel;
      customer.countCompleted = countCompleted;
    }
    res.send(customer);
  } catch (error) {
    console.log(error);
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
    const customer = await Customer.find(
      queryStr,
      {},
      { sort: { last_active_date: -1 } }
    )
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/search", async (req, res) => {
  const { page, limit, idCustomer } = req.query;
  const queryArr = [{ $sort: { last_active_date: -1 } }];
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
