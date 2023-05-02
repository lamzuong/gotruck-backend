const express = require("express");
const Admin = require("../models/admin");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcryptjs");

app.post("/", async (req, res) => {
  const { fullname, username, password } = req.body;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  let admin = new Admin({
    fullname,
    username,
    password: hash,
  });
  try {
    await admin.save();
    res.send(admin);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.get("/", async (req, res) => {
  const { username, password } = req.query;
  try {
    const res1 = await Admin.find({ username: username });
    if (res1.length > 0) {
      let check = bcrypt.compareSync(password, res1[0].password);
      if (check) res.status(200).send(res1[0]);
      else res.send("000");
      return;
    }
    res.send("000");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});
app.put("/", async (req, res) => {
  const { id, newPassword } = req.query;
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(newPassword, salt);
    const res1 = await Admin.findByIdAndUpdate(id, {
      password: hash,
    });
    res.send(res1);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
