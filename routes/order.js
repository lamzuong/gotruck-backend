const exprees = require("express");

const app = exprees();

app.get("/", async (req, res) => {
  try {
    res.send("Api order onready");
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = app;
