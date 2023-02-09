const exprees = require("express");
const app = exprees();
const dotenv = require('dotenv');
const helmet = require("helmet");

dotenv.config();
app.use(exprees.json());
app.use(helmet());

const auth = require("./routes/auth")
const conversation = require("./routes/conversation")
const order = require("./routes/order")
const profile = require("./routes/profile")
const transportPrice = require("./routes/transoprtPrice")

const demo = require("./routes/demo")



app.use("/gotruck/auth",auth);
app.use("/gotruck/conversation",conversation);
app.use("/gotruck/order",order);
app.use("/gotruck/profile",profile);
app.use("/gotruck/transportPrice",transportPrice);

app.use("/gotruck/demo",demo);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.URL_CONNECT_MONGODB, { useUnifiedTopology: true, useNewUrlParser: true });

app.get("/gotruck/", (req, res) => {
  try {
    res.send("Api gotruck onready");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
