const express = require("express");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const Order = require("../models/order");
const DistanceReceiveOrder = require("../models/distanceReceiveOrder");
const TransportPrice = require("../models/transportPrice");

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
      transportPrice.map((item) => {
        const index = dataTemp.findIndex(
          (i) => i.id_truck_type._id === item.id_truck_type._id
        );
        if (index >= 0) {
          let price1; //price <= 2km
          let price2; //price >  2km
          if (dataTemp[index].id_distance.distance === "<=2") {
            price1 = dataTemp[index].price;
            price2 = item.price;
          } else {
            price1 = item.price;
            price2 = dataTemp[index].price;
          }

          dataRes.push({
            id: idTemp++,
            title: "Xe " + item.id_truck_type.name + " tấn",
            price1: price1,
            price2: price2,
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
    res.status(500).send(error);
  }
});

module.exports = app;
