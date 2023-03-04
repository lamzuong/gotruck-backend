const exprees = require("express");

const TruckShipper = require("../models/truck_shipper");

const app = exprees();

app.get("/vehicle/:id_shipper", async (req, res) => {
  try {
   const truckShipper = await TruckShipper.find(req.params).populate("id_shipper");
   res.send(truckShipper);
  } catch (error) {
    res.status(500).send(error);
  }
});




module.exports = app;
