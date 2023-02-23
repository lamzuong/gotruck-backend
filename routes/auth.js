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
      let date = new Date().getFullYear();
      const checkHasCustomer = await Customer.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );

      if (checkHasCustomer) {
        let indexCusLastest = checkHasCustomer.id_cus;
        let indexNewCus =
          parseInt(
            (date % 100) + "" + indexCusLastest.slice(5, indexCusLastest.length)
          ) + 1;
        req.body.id_cus = "CTM" + indexNewCus;

        const cusNew = new Customer(req.body);
        await cusNew.save();
        res.send(cusNew);
      } else {
        req.body.id_cus = "CTM" + (date % 100) + "00001";
        const cusNew = new Order(req.body);
        await cusNew.save();
        res.send(cusNew);
      }
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
    let cus = await Customer.findOneAndUpdate(
      { phone: req.body.phone },
      req.body
    );
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
    let cus = await Customer.findOneAndUpdate(
      { phone: req.body.phone },
      req.body
    );
    res.send(cus);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
