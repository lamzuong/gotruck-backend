const exprees = require("express");
const TruckType = require("../models/truckType");
const TransportPrice = require("../models/transportPrice");
const Distance = require("../models/distance");

const app = exprees();

// get all transport price
app.get("/", async (req, res) => {
  try {
    const transport_price = await TransportPrice.find({}).populate(
      "id_truck_type id_distance"
    );
    res.send(transport_price);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
// get transport price by id_truck_type
app.get("/byId/:id", async (req, res) => {
  try {
    const transport_price = await TransportPrice.find({
      id_truck_type: req.params.id,
    });
    res.send(transport_price);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
// add transport price
app.post("/", async (req, res) => {
  try {
    const transportPrice = new TransportPrice(req.body);
    await transportPrice.save();
    res.send(transportPrice);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
// delete transport price
app.delete("/delete/:id", async (req, res) => {
  try {
    const truckPrice = await TransportPrice.findOneAndDelete({
      _id: req.params.id,
    });
    res.send(truckPrice);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

// get all truck type
app.get("/trucktype", async (req, res) => {
  try {
    const trucktype = await TruckType.find({}).populate("createdBy");
    trucktype.sort((a, b) => Number(a.name) - Number(b.name));
    res.send(trucktype);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
// get truck type by name
app.get("/trucktype/byname/:name", async (req, res) => {
  try {
    const trucktype = await TruckType.findOne({
      name: req.params.name,
    }).populate("createdBy");
    res.send(trucktype);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
// get all truck type with pagination
app.get("/trucktype/pagination", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const truckType = await TruckType.find({})
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("createdBy");
    res.send(truckType);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
// add truck type
app.post("/trucktype", async (req, res) => {
  try {
    const trucktype = new TruckType(req.body);
    await trucktype.save();
    res.send(trucktype);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
// delete truck type by name
app.delete("/trucktype/:name", async (req, res) => {
  try {
    const truckType = await TruckType.findOneAndDelete({
      name: req.params.name,
    });
    res.send(truckType);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

// get all distance
app.get("/distance", async (req, res) => {
  try {
    const distance = await Distance.find({});
    res.send(distance);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
// add distance
app.post("/distance", async (req, res) => {
  try {
    const distance = new Distance(req.body);
    await distance.save();
    res.send(distance);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
