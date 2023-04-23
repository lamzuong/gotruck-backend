const exprees = require("express");
const SavedPlace = require("../models/savedPlace");
const FeedBack = require("../models/feedBack");
const mongoose = require("mongoose");
const app = exprees();

app.get("/", async (req, res) => {
  try {
    res.send("Api profile onready");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/savedplace/:id_customer", async (req, res) => {
  try {
    const savedPlace = await SavedPlace.find(
      {
        id_customer: mongoose.Types.ObjectId(req.params.id_customer),
      },
      {},
      { sort: { updatedAt: -1 } }
    );
    res.send(savedPlace);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.post("/savedplace", async (req, res) => {
  const savedPlace = new SavedPlace(req.body);
  try {
    await savedPlace.save();
    res.send(savedPlace);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/savedplace", async (req, res) => {
  try {
    const savedPlace = await SavedPlace.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );
    res.send(savedPlace);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/savedplace/:_id", async (req, res) => {
  try {
    const user = await SavedPlace.findByIdAndDelete(req.params);
    if (!user) res.status(404).send("No item founds");
    else res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/feedback/:id_customer", async (req, res) => {
  try {
    const feedBack = await FeedBack.find(
      {
        id_sender: mongoose.Types.ObjectId(req.params.id_customer),
      },
      {},
      { sort: { updatedAt: -1 } }
    );
    res.send(feedBack);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/feedback", async (req, res) => {
  try {
    const data = req.body;

    let date = new Date().getFullYear();
    const checkHasFeedback = await FeedBack.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (checkHasFeedback) {
      let indexFeedBackLastest = checkHasFeedback.id_feedback;
      let idFeedBackNew =
        parseInt(
          (date % 100) +
            "" +
            indexFeedBackLastest.slice(5, indexFeedBackLastest.length)
        ) + 1;
      data.id_feedback = "FFB" + idFeedBackNew;
    } else {
      data.id_feedback = "FFB" + (date % 100) + "00001";
    }

    const feedBack = new FeedBack(data);
    await feedBack.save();

    res.send(feedBack);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
