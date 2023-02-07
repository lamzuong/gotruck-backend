const exprees = require("express");
const Customer = require("../models/customer");

const app = exprees();

app.get("/", async (req, res) => {
  try {
    res.send("Api auth onready");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/register", async (req, res) => {
  const filter = { phone: req.body.phone };
  const checkUser = await Customer.findOne(filter);
  const c = new Customer(req.body);
  try {
    if (checkUser) {
      let cus = await Customer.findOneAndUpdate(filter, req.body);
      res.send(cus);
    } else {
      await c.save();
      res.send(c);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/user/:phone", async (req, res) => {
  try {
    let cus = await Customer.findOne(req.params);
    res.send(cus);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/user", async (req, res) => {
  try {
    let cus = await Customer.findOneAndUpdate(req.body.phone, req.body);
    res.send(cus);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/user/:phone", async (req, res) => {
  let phoneFilter;
  if (req.params == null) phoneFilter = req.body.phone;
  else phoneFilter = req.params;
  try {
    let cus = await Customer.findOneAndUpdate(req.body.phone, req.body);
    res.send(cus);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
