const exprees = require("express");
const GoodsType = require("../models/goodsType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();
const mongoose = require("mongoose");
const FormRegister = require("../models/formRegister");

app.get("/", async (req, res) => {
  try {
    const forms = await FormRegister.find(
      { status: "Chưa duyệt" },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("type_truck")
      .lean();
    if (forms.length > 0) {
      res.status(200).send(forms);
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/", async (req, res) => {
  try {
    const { data, id_handler, type } = req.body;
    if (type === "denied") {
      const form = await FormRegister.findByIdAndUpdate(
        data._id,
        {
          status: "Từ chối",
          reason_cancel: data.reason_cancel,
          id_handler: id_handler,
          approval_date: new Date(),
        },
        { new: true }
      );

      res.send({
        status: "ok",
        message: "Thành công",
        data: form,
      });
    } else {
      const shipperNew = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        avatar: data.avatar,
        status: "Đã duyệt",
        deleted: false,
        block: false,
        cmnd: data.cmnd,
        balance: 0,
        last_active_date: new Date(),
        current_address: {
          address: "RMCQ+72W, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh, Vietnam",
          latitude: 10.820685261169594,
          longitude: 106.68763093650341,
        },
      };
      const truckNew = {
        license_plate: data.license_plate,
        name: data.name_truck,
        type_truck: data.type_truck._id,
        list_image_info: data.list_image_info,
        status: "Đã duyệt",
        default: true,
        deleted: false,
        list_vehicle_registration: data.list_vehicle_registration,
      };

      let date = new Date().getFullYear();
      const checkHasShipper = await Shipper.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );
      if (checkHasShipper) {
        let indexShpLastest = checkHasShipper.id_shipper;
        let idShipperNew =
          parseInt(
            (date % 100) + "" + indexShpLastest.slice(5, indexShpLastest.length)
          ) + 1;
        shipperNew.id_shipper = "SPR" + idShipperNew;

        const shpNew = new Shipper(shipperNew);
        await shpNew.save();
      } else {
        shipperNew.id_shipper = "SPR" + (date % 100) + "00001";
        const shpNew = new Shipper(shipperNew);
        await shpNew.save();
      }

      const shipperNewAdd = await Shipper.findOne({
        id_shipper: shipperNew.id_shipper,
      });

      truckNew.id_shipper = shipperNewAdd._id;

      const checkHasTruck = await TruckShipper.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );
      if (checkHasTruck) {
        let indexLastest = checkHasTruck.id_truck;
        let idNew =
          parseInt(
            (date % 100) + "" + indexLastest.slice(5, indexLastest.length)
          ) + 1;
        truckNew.id_truck = "VHC" + idNew;
      } else {
        truckNew.id_truck = "VHC" + (date % 100) + "00001";
      }

      const tr = new TruckShipper(truckNew);
      await tr.save();

      const form = await FormRegister.findByIdAndUpdate(
        data._id,
        {
          status: "Đã duyệt",
          id_handler: id_handler,
          approval_date: new Date(),
        },
        { new: true }
      );

      res.send({
        status: "ok",
        message: "Thành công",
        data: form,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/pagination", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const shipper = await FormRegister.find(
      { status: "Chưa duyệt" },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("type_truck")
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(shipper);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const { page, limit, idForm } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "truck_type",
          localField: "type_truck",
          foreignField: "_id",
          as: "type_truck",
        },
      },
      { $unwind: "$type_truck" },
      { $match: { status: "Chưa duyệt" } },
      { $sort: { createdAt: -1 } },
    ];
    if (idForm !== "") {
      queryArr.push({
        $match: { id_form: { $regex: ".*" + idForm + ".*" } },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const resForms = await FormRegister.aggregate(queryArr);

    res.send(resForms);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/history/pagination", async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const statusQuery =
      status === "Tất cả"
        ? {
            $or: [{ status: "Đã duyệt" }, { status: "Từ chối" }],
          }
        : { status: status };
    const form = await FormRegister.find(
      statusQuery,
      {},
      { $sort: { approval_date: -1 } }
    )
      .populate("type_truck id_handler")
      .skip((page - 1) * limit)
      .limit(limit);
    res.send(form);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/history/search", async (req, res) => {
  try {
    const { page, limit, idForm } = req.query;
    const queryArr = [
      {
        $lookup: {
          from: "truck_type",
          localField: "type_truck",
          foreignField: "_id",
          as: "type_truck",
        },
      },
      { $unwind: "$type_truck" },
      {
        $lookup: {
          from: "admin",
          localField: "id_handler",
          foreignField: "_id",
          as: "id_handler",
        },
      },
      { $unwind: "$id_handler" },
      {
        $match: {
          $or: [{ status: "Đã duyệt" }, { status: "Từ chối" }],
        },
      },
      { $sort: { approval_date: -1 } },
    ];
    if (idForm !== "") {
      queryArr.push({
        $match: { id_form: { $regex: ".*" + idForm + ".*" } },
      });
    }
    if (page) {
      queryArr.push({ $skip: (page - 1) * limit });
      queryArr.push({ $limit: +limit });
    }
    const resForms = await FormRegister.aggregate(queryArr);
    res.send(resForms);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
