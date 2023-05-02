const express = require("express");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const Order = require("../models/order");
const DistanceReceiveOrder = require("../models/distanceReceiveOrder");
const TransportPrice = require("../models/transportPrice");
const HistoryPrice = require("../models/historyPrice");

const app = express();

app.get("/", async (req, res) => {
  try {
    const transportPrice = await TransportPrice.find({}).populate(
      "id_truck_type id_distance"
    );
    if (transportPrice) {
      let dataTemp = [];
      let dataRes = [];
      let idTemp = 1;
      transportPrice.sort(
        (a, b) => Number(a.id_truck_type.name) - Number(b.id_truck_type.name)
      );
      transportPrice.map((item) => {
        const index = dataTemp.findIndex(
          (i) => i.id_truck_type._id === item.id_truck_type._id
        );

        if (index >= 0) {
          let price1; //price <= 2km
          let price2; //price >  2km
          let idPrice1;
          let idPrice2;
          if (dataTemp[index].id_distance.distance === "<=2") {
            price1 = dataTemp[index].price;
            price2 = item.price;
            idPrice1 = dataTemp[index]._id;
            idPrice2 = item._id;
          } else {
            price1 = item.price;
            price2 = dataTemp[index].price;
            idPrice1 = item._id;
            idPrice2 = dataTemp[index]._id;
          }

          dataRes.push({
            id: idTemp++,
            title: "Xe " + item.id_truck_type.name + " tấn",
            price1: price1,
            price2: price2,
            idPrice1: idPrice1,
            idPrice2: idPrice2,
          });
        } else {
          dataTemp.push(item);
        }
      });
      res.send(dataRes);
    } else {
      res.send({ notFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/", async (req, res) => {
  try {
    const data = req.body;
    data.map(async (item) => {
      const temp = await TransportPrice.findByIdAndUpdate(item.id, {
        price: item.priceNew,
        modifiedAt: new Date(),
      });
      const itemHistory = {
        old_price: item.priceOld,
        new_price: item.priceNew,
        modifiedBy: item.id_handler,
        start_date: temp.modifiedAt,
        end_date: new Date(),
      };
      let date = new Date().getFullYear();
      const checkHasHistory = await HistoryPrice.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );
      if (checkHasHistory) {
        let indexLastest = checkHasHistory.id_history_price;
        let idNew =
          parseInt(
            (date % 100) + "" + indexLastest.slice(5, indexLastest.length)
          ) + 1;
        itemHistory.id_history_price = "HRP" + idNew;
        id = "HRP" + idNew;
      } else {
        itemHistory.id_history_price = "HRP" + (date % 100) + "00001";
        id = "HRP" + (date % 100) + "00001";
      }
      const history = new HistoryPrice(itemHistory);
      await history.save();
    });
    res.send({ data: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/history/pagination", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const shipper = await HistoryPrice.find({}, {}, { sort: { createdAt: -1 } })
      .populate("modifiedBy")
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
