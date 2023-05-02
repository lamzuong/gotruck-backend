const exprees = require("express");
const Earning = require("../models/earning");
const Order = require("../models/order");
const app = exprees();

// get earning today
app.get("/today", async (req, res) => {
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  try {
    const earning = await Order.find(
      {
        updatedAt: {
          $gte: new Date(today.toISOString().slice(0, 10) + "T00:00:00.000Z"),
          $lt: new Date(tomorrow.toISOString().slice(0, 10) + "T00:00:00.000Z"),
        },
        status: "Đã giao",
      },
      {},
      { sort: { updatedAt: 1 } }
    );
    let dataRes = { earnPerHour: [], total: 0 };

    for (let i = 0; i < earning.length; i++) {
      dataRes.total += (earning[i].total * earning[i].fee) / 100;
    }
    for (let i = 0; i < 24; i++) {
      const hour = earning.filter((item) => {
        if (new Date(item.updatedAt).getHours() === i) {
          return item;
        }
      });
      let subtotal = 0;
      hour.map((itemHour) => {
        subtotal += (itemHour.total * itemHour.fee) / 100;
      });
      dataRes.earnPerHour.push(subtotal);
    }
    res.send(dataRes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

// get earning week
app.get("/week", async (req, res) => {
  var today = new Date();
  today.setDate(today.getDate() + 1);

  var lastweek = new Date();
  lastweek.setDate(lastweek.getDate() - 6);
  try {
    const earning = await Order.find({
      updatedAt: {
        $gte: new Date(lastweek.toISOString().slice(0, 10) + "T00:00:00.000Z"),
        $lt: new Date(today.toISOString().slice(0, 10) + "T00:00:00.000Z"),
      },
      status: "Đã giao",
    });
    let dataRes = { earnPerDay: [], total: 0 };

    for (let i = 0; i < earning.length; i++) {
      dataRes.total += (earning[i].total * earning[i].fee) / 100;
    }

    for (let i = 7; i > 0; --i) {
      const dateTemp = earning.filter((item) => {
        let ms1 = item.updatedAt.getTime();
        let ms2 = new Date().getTime();
        let temp = Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
        if (temp == i) {
          return item;
        }
      });
      let subtotal = 0;
      dateTemp.map((itemWeek) => {
        subtotal += (itemWeek.total * itemWeek.fee) / 100;
      });
      dataRes.earnPerDay.push(subtotal);
    }
    res.send(dataRes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

// get earning month
app.get("/month", async (req, res) => {
  var lastmonth = new Date();
  lastmonth.setDate(lastmonth.getDate() - 29);

  var today = new Date();
  today.setDate(today.getDate() + 1);
  try {
    const earning = await Order.find({
      updatedAt: {
        $gte: new Date(lastmonth.toISOString().slice(0, 10) + "T00:00:00.000Z"),
        $lte: new Date(today.toISOString().slice(0, 10) + "T00:00:00.000Z"),
      },
      status: "Đã giao",
    });
    let dataRes = { earnPerDay: [], total: 0 };

    for (let i = 0; i < earning.length; i++) {
      dataRes.total += (earning[i].total * earning[i].fee) / 100;
    }
    for (let i = 30; i > 0; --i) {
      const dateTemp = earning.filter((item) => {
        let ms1 = item.updatedAt.getTime();
        let ms2 = new Date().getTime();
        let temp = Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
        if (temp == i) {
          return item;
        }
      });

      let subtotal = 0;
      dateTemp.map((itemWeek) => {
        subtotal += (itemWeek.total * itemWeek.fee) / 100;
      });

      dataRes.earnPerDay.push(subtotal);
    }
    res.send(dataRes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

// get earning specific
app.get("/specific", async (req, res) => {
  const { startDate, endDate } = req.query;
  var startDateTemp = new Date(startDate);
  startDateTemp.setDate(startDateTemp.getDate());

  var endDateTemp = new Date(endDate);
  endDateTemp.setDate(endDateTemp.getDate() + 1);

  let ms1Start = startDateTemp.getTime();
  let ms2End = endDateTemp.getTime();
  let tempCalc = Math.ceil((ms2End - ms1Start) / (24 * 60 * 60 * 1000));

  try {
    const earning = await Order.find({
      updatedAt: {
        $gte: new Date(
          startDateTemp.toISOString().slice(0, 10) + "T00:00:00.000Z"
        ),
        $lte: new Date(
          endDateTemp.toISOString().slice(0, 10) + "T00:00:00.000Z"
        ),
      },
      status: "Đã giao",
    });

    let dataRes = { earnPerDay: [], total: 0, earnPerHour: [] };

    for (let i = 0; i < earning.length; i++) {
      dataRes.total += (earning[i].total * earning[i].fee) / 100;
    }

    if (startDate === endDate) {
      for (let i = 0; i < 24; i++) {
        const hour = earning.filter((item) => {
          if (new Date(item.updatedAt).getHours() === i) {
            return item;
          }
        });
        let subtotal = 0;
        hour.map((itemHour) => {
          subtotal += (itemHour.total * itemHour.fee) / 100;
        });
        dataRes.earnPerHour.push(subtotal);
      }
    } else {
      for (let i = tempCalc; i > 0; i--) {
        const dateTemp = earning.filter((item) => {
          let ms1 = item.updatedAt.getTime();
          let ms2 = endDateTemp.getTime();
          let temp = Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
          if (temp == i) {
            return item;
          }
        });
        let subtotal = 0;
        dateTemp.map((itemWeek) => {
          subtotal += (itemWeek.total * itemWeek.fee) / 100;
        });

        dataRes.earnPerDay.push(subtotal);
      }
    }
    res.send(dataRes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.post("/", async (req, res) => {
  try {
    const earning = new Earning(req.body);
    await earning.save();
    res.send(earning);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
