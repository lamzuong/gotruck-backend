const exprees = require("express");
const app = exprees();
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();
app.use(exprees.json());
app.use(helmet());
app.use(cors());

const auth = require("./routes/auth");
const conversation = require("./routes/conversation");
const order = require("./routes/order");
const profile = require("./routes/profile");
const transportPrice = require("./routes/transportPrice");

const authShipper = require("./routes/authShipper");
const profileShipper = require("./routes/profileShipper");
const orderShipper = require("./routes/orderShipper");

const admin = require("./routes/admin");
const earningAdmin = require("./routes/earningAdmin");
const goodsType = require("./routes/goodsType");
const orderAdmin = require("./routes/orderAdmin");
const customer = require("./routes/customer");
const shipperAdmin = require("./routes/shipperAdmin");
const policy = require("./routes/policy");

const bank = require("./routes/bank");
const pageRegister = require("./routes/pageRegister");

app.use("/gotruck/auth", auth);
app.use("/gotruck/conversation", conversation);
app.use("/gotruck/order", order);
app.use("/gotruck/profile", profile);
app.use("/gotruck/transportPrice", transportPrice);

app.use("/gotruck/authshipper", authShipper);
app.use("/gotruck/profileshipper", profileShipper);
app.use("/gotruck/ordershipper", orderShipper);

app.use("/gotruck/admin", admin);
app.use("/gotruck/earning", earningAdmin);
app.use("/gotruck/goodsType", goodsType);
app.use("/gotruck/orderAdmin", orderAdmin);
app.use("/gotruck/customer", customer);
app.use("/gotruck/shipperAdmin", shipperAdmin);
app.use("/gotruck/policy", policy);

app.use("/gotruck/bank", bank);
app.use("/gotruck/pageregister", pageRegister);

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
    }, 900000);
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
    if (data.id_order) {
      io.emit(data.id_order + "", data.locationShipper);
    }
  });

  socket.on("send_message", (data) => {
    io.emit(data.id_receive + "message", data);
  });
});

server.listen(8000, () => {
  console.log("Backend is running");
});
