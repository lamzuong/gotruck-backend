const express = require("express");
const Policy = require("../models/policy");
const app = express();

app.post("/", async (req, res) => {
  try {
    const policy = new Policy(req.body);
    await policy.save();
    res.send(policy);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.put("/", async (req, res) => {
  try {
    const policy = await Policy.findOneAndUpdate(
      { _id: req.body._id },
      req.body
    );
    res.send(policy);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.get("/byType/:type", async (req, res) => {
  try {
    const policy = await Policy.find({ type: req.params.type }).populate(
      "history.modifiedBy deletedBy"
    );
    res.send(policy);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/history/pagination", async (req, res) => {
  try {
    const { page, limit, type } = req.query;
    const policy = await Policy.find(
      { type: type },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("history.modifiedBy deletedBy")
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(policy);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
