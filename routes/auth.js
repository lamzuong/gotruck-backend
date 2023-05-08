const exprees = require("express");
const Customer = require("../models/customer");

const app = exprees();

app.get("/", async (req, res) => {
  try {
    res.send("Api auth onready");
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.post("/register", async (req, res) => {
  const filter = { phone: req.body.phone };
  const checkUser = await Customer.findOne(filter);
  const c = new Customer(req.body);
  try {
    if (checkUser) {
      let cus = await Customer.findOneAndUpdate(filter, req.body, {
        new: true,
      });
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
        const cusNew = new Customer(req.body);
        await cusNew.save();
        res.send(cusNew);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/user/:phone", async (req, res) => {
  try {
    let cus = await Customer.findOne(req.params);
    if (cus) {
      let cusNew = await Customer.findByIdAndUpdate(
        cus._id,
        {
          last_active_date: new Date(),
        },
        { new: true }
      );
      res.send(cusNew);
    } else {
      res.send({ notFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/user", async (req, res) => {
  try {
    let cus = await Customer.findOneAndUpdate(
      { phone: req.body.phone },
      req.body,
      {
        new: true,
      }
    );
    res.send(cus);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/user/edituser", async (req, res) => {
  let phoneOld = req.body.phoneInit;

  try {
    let cus = await Customer.findOneAndUpdate(
      { phone: phoneOld },
      req.body.user,
      {
        new: true,
      }
    );
    res.send(cus);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/block/:id_customer", async (req, res) => {
  let id_customer = req.params.id_customer;
  try {
    let cus = await Customer.findById(id_customer);
    res.send(cus);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
