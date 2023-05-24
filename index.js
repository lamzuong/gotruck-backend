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
const notify = require("./routes/notify");
const form = require("./routes/form");
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
const formRegister = require("./routes/formRegister");
const radius = require("./routes/radius");
const priceAdmin = require("./routes/priceAdmin");
const formWithDraw = require("./routes/formWithDraw");
const formVehicle = require("./routes/formVehicle");
const formFeedback = require("./routes/formFeedBack");
const feeAdmin = require("./routes/feeAdmin");

const bank = require("./routes/bank");
const pageRegister = require("./routes/pageRegister");

const dataDemo = require("./routes/datademo");

app.use("/gotruck/auth", auth);
app.use("/gotruck/conversation", conversation);
app.use("/gotruck/order", order);
app.use("/gotruck/profile", profile);
app.use("/gotruck/transportPrice", transportPrice);
app.use("/gotruck/notify", notify);
app.use("/gotruck/form", form);

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
app.use("/gotruck/formregister", formRegister);
app.use("/gotruck/radius", radius);
app.use("/gotruck/priceadmin", priceAdmin);
app.use("/gotruck/formwithdraw", formWithDraw);
app.use("/gotruck/formvehicle", formVehicle);
app.use("/gotruck/formfeedback", formFeedback);
app.use("/gotruck/feeadmin", feeAdmin);

app.use("/gotruck/bank", bank);
app.use("/gotruck/pageregister", pageRegister);

app.use("/gotruck/datademo", dataDemo);

const mongoose = require("mongoose");
const Order = require("./models/order");
const Notification = require("./models/notification");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.URL_CONNECT_MONGODB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.get("/gotruck/", (req, res) => {
  try {
    res.send("Api gotruck onready");
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
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

const cancelOrder = async (data) => {
  try {
    const checkCancel = await Order.findById(data._id);
    if (checkCancel.status === "Chưa nhận") {
      const dateTemp = data;
      dateTemp.reason_cancel = {};
      dateTemp.reason_cancel.date_cancel = new Date();
      dateTemp.reason_cancel.user_cancel = "AutoDelete";
      dateTemp.reason_cancel.content = "Tự động xóa";
      dateTemp.status = "Đã hủy";
      await Order.findByIdAndUpdate(dateTemp._id, dateTemp, {
        new: true,
      });
      const notifyData = {
        title: "Thông báo đơn hàng " + data.id_order,
        content: "Đơn hàng đã tự động bị hủy vì quá thời hạn nhận đơn",
        type_notify: "Order",
        type_send: "Specific",
        id_receiver: data.id_customer?._id || data.id_customer,
        userModel: "Customer",
      };

      let date = new Date().getFullYear();
      const checkHasNotify = await Notification.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );

      if (checkHasNotify) {
        let indexLastest = checkHasNotify.id_notify;
        let indexNew =
          parseInt(
            (date % 100) + "" + indexLastest.slice(5, indexLastest.length)
          ) + 1;
        notifyData.id_notify = "NTF" + indexNew;
      } else {
        notifyData.id_notify = "NTF" + (date % 100) + "00001";
      }

      const notify = new Notification(notifyData);
      await notify.save();
    }
  } catch (error) {
    console.log(error);
  }
};

io.on("connection", (socket) => {
  socket.on("customer-has-new-order", (data) => {
    setTimeout(async () => {
      cancelOrder(data.dataOrder);
      io.emit("cancel" + data.type_truck, data.dataOrder);
    }, 900000);
    io.emit("data" + data.type_truck, data.dataOrder);
  });

  socket.on("shipper_receive", (data) => {
    io.emit("data" + data.id_customer, data);
    io.emit("received" + data.truck_type, data);
  });

  socket.on("shipper_cancel", (data) => {
    io.emit("data" + data.id_customer, data);
  });

  socket.on("customer_cancel", (data) => {
    io.emit("cancel" + data.truck_type, data);
  });

  socket.on("customer_cancel_received", (data) => {
    io.emit("cancel_received" + data.truck_type, data);
  });

  socket.on("shipper_shipping", (data) => {
    io.emit("data" + data.id_customer, data);
  });

  socket.on("shipper_completed", (data) => {
    io.emit("data" + data.id_customer, data);
  });

  socket.on("location_shipper", (data) => {
    if (data.id_order) {
      io.emit("data" + data.id_order, data.locationShipper);
    }
  });

  socket.on("send_message", (data) => {
    io.emit("message" + data.id_receive, data);
  });
});

server.listen(8000, () => {
  console.log("Backend is running");
});
