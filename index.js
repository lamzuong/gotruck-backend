const exprees = require("express");
const app = exprees();
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();
app.use(exprees.json());
app.use(helmet());

const auth = require("./routes/auth");
const conversation = require("./routes/conversation");
const order = require("./routes/order");
const profile = require("./routes/profile");
const transportPrice = require("./routes/transportPrice");

const authShipper = require("./routes/authShipper");
const profileShipper = require("./routes/profileShipper");
const orderShipper = require("./routes/orderShipper");

app.use("/gotruck/auth", auth);
app.use("/gotruck/conversation", conversation);
app.use("/gotruck/order", order);
app.use("/gotruck/profile", profile);
app.use("/gotruck/transportPrice", transportPrice);

app.use("/gotruck/authshipper", authShipper);
app.use("/gotruck/profileshipper", profileShipper);
app.use("/gotruck/ordershipper", orderShipper);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.URL_CONNECT_MONGODB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.get("/gotruck/", (req, res) => {
  try {
    res.send("Api gotruck onready");
  } catch (error) {
    res.status(500).send(error);
  }
});

var server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("customer-has-new-order", (data) => {
    setTimeout(() => {
      io.emit(data.type_truck + "cancel", data.dataOrder);
    }, 10000);
    io.emit(data.type_truck + "", data.dataOrder);
  });

  socket.on("shipper_receive", (data) => {
    io.emit(data.id_customer + "", data);
    io.emit(data.truck_type + "received", data);
  });

  socket.on("shipper_cancel", (data) => {
    io.emit(data.id_customer + "", data);
  });

  socket.on("customer_cancel", (data) => {
    io.emit(data.truck_type + "cancel", data);
  });

  socket.on("customer_cancel_received", (data) => {
    io.emit(data.truck_type + "cancel_received", data);
  });

  socket.on("shipper_shipping", (data) => {
    io.emit(data.id_customer + "", data);
  });

  socket.on("shipper_completed", (data) => {
    io.emit(data.id_customer + "", data);
  });

  socket.on("location_shipper", (data) => {
    console.log(data.locationShipper?.address);
    io.emit(data.id_order + "", data.locationShipper);
  });
});

server.listen(8000, () => {
  console.log("Backend is running");
});
