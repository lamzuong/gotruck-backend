const exprees = require("express");
const Customer = require("../models/customer");
const SavedPlace = require("../models/savedPlace")
const app = exprees();

app.post("/customer", async (req, res) => {
  const c = new SavedPlace(req.body);

  try {
    await c.save();
    res.send(c);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/customer", async (req, res) => {
  const users = await SavedPlace.find({}).populate("id_customer");
  try {
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id); //Full info
    // const users = await userModel.findById(req.params.id,"name phone");    // info : name,phon
    if (!user) res.status(404).send("No item founds");
    else res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body);
    await userModel.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id, req.body);
    if (!user) res.status(404).send("No item founds");
    else res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
