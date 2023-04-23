const exprees = require("express");
const GoodsType = require("../models/goodsType");
const Shipper = require("../models/shipper");
const TruckShipper = require("../models/truckShipper");
const app = exprees();
const mongoose = require("mongoose");
const FormRegister = require("../models/formRegister");
const TransactionHistory = require("../models/transactionHistory");
const FeedBack = require("../models/feedBack");
const Order = require("../models/order");

app.get("/shipperdemo", async (req, res) => {
  try {
    for (let i = 0; i < 10; i++) {
      const shipperNew = {
        name: "name" + i,
        phone: "035943472" + i,
        email: "email" + i,
        address: "address" + i,
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/11f8f118-ec36-2704-b33d-7f8b2a126190?alt=media&token=cc694fd1-eaa2-4501-aff8-e7bf5a9417fc",
        status: "Đã duyệt",
        deleted: false,
        block: false,
        cmnd: "12345678" + i,
        balance: 100000 * i,
      };
      const truckNew = {
        license_plate: "44K.1234" + i,
        name: "demo" + i,
        type_truck:
          i > 5
            ? i > 8
              ? "64340fb7403c61857add126e"
              : "64328d2437431c47c96fa555"
            : i > 2
            ? "64328d0637431c47c96fa534"
            : "64328d1937431c47c96fa54a",
        list_image_info: [
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/7306c754-8160-e29d-38c9-819063804b8a?alt=media&token=5d2da878-a600-4957-9aef-6f92c69748d3",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/d18c4da5-e25c-be59-222f-2ed11f62237f?alt=media&token=b8f3c2bc-d1b3-4995-84b2-6c10e8b8a392",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/fcd1d65d-a70d-554e-d811-777333e5cc77?alt=media&token=2d0ee3b6-5305-4771-8f7f-59b141a39ef4",
        ],

        status: "Đã duyệt",
        default: true,
        deleted: false,
        list_vehicle_registration: [
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/aefa602e-df8d-345d-491b-67a183b0c08c?alt=media&token=5806efd9-4eff-4f7a-a3ba-13028e8da83e",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/e9f4fe31-c3c5-193f-6d0d-01ee41850aa4?alt=media&token=3a2b4f08-db21-4f46-95e6-cd50a11ba9ad",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/b177cab2-ca62-b98f-8e3c-a6449dcb3dfe?alt=media&token=c84346da-c4a6-4fad-acfc-6c102a9f2ac0",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/c9c50f06-8aa0-4178-87ed-0bf66fb7215b?alt=media&token=029289d2-4aa3-41cf-9672-dfb85086b632",
        ],
      };
      //id_shipper
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

      // id_truck
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
      truckNew.id_shipper = shipperNewAdd._id;
      const tr = new TruckShipper(truckNew);
      await tr.save();
    }
    res.send({
      status: "ok",
      message: "Thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/formregister", async (req, res) => {
  try {
    for (let i = 0; i < 25; i++) {
      const shipperRegister = {
        name: "name1" + i,
        phone: i < 10 ? "035943455" + i : "03594345" + i,
        email: "email1" + i,
        address: "address1" + i,
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/11f8f118-ec36-2704-b33d-7f8b2a126190?alt=media&token=cc694fd1-eaa2-4501-aff8-e7bf5a9417fc",
        status: "Chưa duyệt",

        cmnd: i < 10 ? "78965412" + i : "7896542" + i,
        type_truck:
          i > 5
            ? i > 8
              ? "64340fb7403c61857add126e"
              : "64328d2437431c47c96fa555"
            : i > 2
            ? "64328d0637431c47c96fa534"
            : "64328d1937431c47c96fa54a",
        license_plate: i < 10 ? "55K.1234" + i : "55K.123" + i,
        name_truck: "demotruck1" + i,

        list_image_info: [
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/7306c754-8160-e29d-38c9-819063804b8a?alt=media&token=5d2da878-a600-4957-9aef-6f92c69748d3",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/d18c4da5-e25c-be59-222f-2ed11f62237f?alt=media&token=b8f3c2bc-d1b3-4995-84b2-6c10e8b8a392",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/fcd1d65d-a70d-554e-d811-777333e5cc77?alt=media&token=2d0ee3b6-5305-4771-8f7f-59b141a39ef4",
        ],
        list_vehicle_registration: [
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/aefa602e-df8d-345d-491b-67a183b0c08c?alt=media&token=5806efd9-4eff-4f7a-a3ba-13028e8da83e",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/e9f4fe31-c3c5-193f-6d0d-01ee41850aa4?alt=media&token=3a2b4f08-db21-4f46-95e6-cd50a11ba9ad",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/b177cab2-ca62-b98f-8e3c-a6449dcb3dfe?alt=media&token=c84346da-c4a6-4fad-acfc-6c102a9f2ac0",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/c9c50f06-8aa0-4178-87ed-0bf66fb7215b?alt=media&token=029289d2-4aa3-41cf-9672-dfb85086b632",
        ],
      };
      const checkUser = await Shipper.findOne({ phone: shipperRegister.phone });
      const checkTruck = await TruckShipper.findOne({
        license_plate: shipperRegister.license_plate,
      });

      const checkTruckInFormRegister = await FormRegister.findOne({
        license_plate: shipperRegister.license_plate,
      });
      const checkUserInFormRegister = await FormRegister.findOne({
        phone: shipperRegister.phone,
      });

      if (checkTruck || checkTruckInFormRegister) {
        res.send({
          status: "error",
          message: "Phương tiện này đã được sử dụng bởi tài xế khác",
          data: {},
        });
      } else {
        if (checkUser || checkUserInFormRegister) {
          res.send({
            status: "error",
            message: "Số điện thoại đã được sử dụng bởi tài xế khác",
            data: {},
          });
        } else {
          let date = new Date().getFullYear();
          const checkHasForm = await FormRegister.findOne(
            {},
            {},
            { sort: { createdAt: -1 } }
          );
          if (checkHasForm) {
            let indexFormLastest = checkHasForm.id_form;
            let idFormNew =
              parseInt(
                (date % 100) +
                  "" +
                  indexFormLastest.slice(5, indexFormLastest.length)
              ) + 1;
            shipperRegister.id_form = "RGT" + idFormNew;
          } else {
            shipperRegister.id_form = "RGT" + (date % 100) + "00001";
          }
          const formNew = new FormRegister(shipperRegister);
          await formNew.save();
        }
      }
    }
    res.send({
      status: "ok",
      message: "Thành công",
      data: {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/withdraw", async (req, res) => {
  try {
    for (let index = 0; index < 25; index++) {
      const data = {
        id_shipper: "6439f2668d7fc50f4ba74a87",
        money: "123789",
        id_bank: "6415d600aae2f23c4c2788b5",
        account_number: 2143876543,
        account_name: "demo withdraw",
        status: "Đang xử lý",
        type: "Rút tiền",
      };
      const shipper = await Shipper.findById(data.id_shipper).lean();
      shipper.balance = Number(shipper.balance) - Number(data.money);
      const updateBalance = await Shipper.findByIdAndUpdate(
        shipper._id,
        shipper,
        { new: true }
      );

      let date = new Date().getFullYear();
      const checkHasForm = await TransactionHistory.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );
      if (checkHasForm) {
        let indexLastest = checkHasForm.id_transaction_history;
        let idNew =
          parseInt(
            (date % 100) + "" + indexLastest.slice(5, indexLastest.length)
          ) + 1;
        data.id_transaction_history = "TSH" + idNew;
      } else {
        data.id_transaction_history = "TSH" + (date % 100) + "00001";
      }
      const trsHtr = new TransactionHistory(data);
      await trsHtr.save();
    }
    res.send({ data: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/vehicle", async (req, res) => {
  try {
    for (let i = 0; i < 25; i++) {
      const data = {
        license_plate: i < 10 ? "27T.1234" + i : "27T.233" + i,
        id_shipper: "6439f2668d7fc50f4ba74a87",
        name: "demo truck" + i,
        type_truck: "64340fb7403c61857add126e",
        list_image_info: [
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/7306c754-8160-e29d-38c9-819063804b8a?alt=media&token=5d2da878-a600-4957-9aef-6f92c69748d3",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/d18c4da5-e25c-be59-222f-2ed11f62237f?alt=media&token=b8f3c2bc-d1b3-4995-84b2-6c10e8b8a392",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/fcd1d65d-a70d-554e-d811-777333e5cc77?alt=media&token=2d0ee3b6-5305-4771-8f7f-59b141a39ef4",
        ],
        list_vehicle_registration: [
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/aefa602e-df8d-345d-491b-67a183b0c08c?alt=media&token=5806efd9-4eff-4f7a-a3ba-13028e8da83e",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/e9f4fe31-c3c5-193f-6d0d-01ee41850aa4?alt=media&token=3a2b4f08-db21-4f46-95e6-cd50a11ba9ad",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/b177cab2-ca62-b98f-8e3c-a6449dcb3dfe?alt=media&token=c84346da-c4a6-4fad-acfc-6c102a9f2ac0",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/c9c50f06-8aa0-4178-87ed-0bf66fb7215b?alt=media&token=029289d2-4aa3-41cf-9672-dfb85086b632",
        ],
        status: "Chưa duyệt",
        default: false,
        deleted: false,
      };
      const checkExistTruck = await TruckShipper.find({
        license_plate: data.license_plate,
      });
      if (checkExistTruck.length > 0) {
        res.send({ isExist: true });
      } else {
        let date = new Date().getFullYear();
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
          data.id_truck = "VHC" + idNew;
        } else {
          data.id_truck = "VHC" + (date % 100) + "00001";
        }

        const tr = new TruckShipper(data);
        await tr.save();
      }
    }
    res.send({ data: "ok" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/feedback", async (req, res) => {
  try {
    for (let i = 0; i < 25; i++) {
      const data = {
        subject: "subject" + i,
        description: "description" + i,
        list_image: [
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/7306c754-8160-e29d-38c9-819063804b8a?alt=media&token=5d2da878-a600-4957-9aef-6f92c69748d3",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/d18c4da5-e25c-be59-222f-2ed11f62237f?alt=media&token=b8f3c2bc-d1b3-4995-84b2-6c10e8b8a392",
          "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/fcd1d65d-a70d-554e-d811-777333e5cc77?alt=media&token=2d0ee3b6-5305-4771-8f7f-59b141a39ef4",
        ],
        id_sender: "63e1d1112b67035bb9634dae",
        status: "Đã gửi",
      };

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
    }
    res.send({ data: "ok" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/orderdemo", async (req, res) => {
  try {
    // Chưa nhận
    // for (let i = 1; i < 15; i++) {
    //   const data = {
    //     id_order: "ODR230000" + i,
    //     id_customer: "63f786dd27c666036e4e7193",
    //     payer: "send",
    //     from_address: {
    //       address: "RMCQ+72W, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh, Vietnam",
    //       latitude: 10.820685261169594,
    //       longitude: 106.68763093650341,
    //       name: "Quoc",
    //       phone: "092364334532",
    //     },
    //     to_address: {
    //       address: "58/5K Truông Tre, Linh Xuân, Thủ Đức, Bình Dương, Việt Nam",
    //       latitude: 10.890244509604937,
    //       longitude: 106.7674527621348,
    //       name: "fdfsdfs",
    //       phone: "098763453454",
    //     },
    //     fee: 10,
    //     note: "nádasdas",
    //     status: "Chưa nhận",
    //     date_create: new Date(),
    //     distance: Number(13.4),
    //     total: Number(2894400),
    //     expectedTime: Number(18),
    //     good_type: "Nội thất",
    //     truck_type: 20,
    //     list_image_from: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //   };
    //   const order = new Order(data);
    //   await order.save();
    // }

    // Đã nhận
    // for (let i = 15; i < 30; i++) {
    //   const data = {
    //     id_order: "ODR23000" + i,
    //     id_customer: "63f786dd27c666036e4e7193",
    //     payer: "send",
    //     from_address: {
    //       address: "RMCQ+72W, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh, Vietnam",
    //       latitude: 10.820685261169594,
    //       longitude: 106.68763093650341,
    //       name: "Quoc",
    //       phone: "092364334532",
    //     },
    //     to_address: {
    //       address: "58/5K Truông Tre, Linh Xuân, Thủ Đức, Bình Dương, Việt Nam",
    //       latitude: 10.890244509604937,
    //       longitude: 106.7674527621348,
    //       name: "fdfsdfs",
    //       phone: "098763453454",
    //     },
    //     fee: 10,
    //     note: "nádasdas",
    //     status: "Đã nhận",
    //     date_create: new Date(),
    //     distance: Number(13.4),
    //     total: Number(2894400),
    //     expectedTime: Number(18),
    //     good_type: "Nội thất",
    //     truck_type: 20,
    //     list_image_from: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //     shipper: {
    //       id_shipper: "6439f2668d7fc50f4ba74a87",
    //       truck: "643a0a17a3ad43497f0907c0",
    //     },
    //   };
    //   const order = new Order(data);
    //   await order.save();
    // }

    //Đang giao
    // for (let i = 30; i < 45; i++) {
    //   const data = {
    //     id_order: "ODR23000" + i,
    //     id_customer: "63f786dd27c666036e4e7193",
    //     payer: "send",
    //     from_address: {
    //       address: "RMCQ+72W, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh, Vietnam",
    //       latitude: 10.820685261169594,
    //       longitude: 106.68763093650341,
    //       name: "Quoc",
    //       phone: "092364334532",
    //     },
    //     to_address: {
    //       address: "58/5K Truông Tre, Linh Xuân, Thủ Đức, Bình Dương, Việt Nam",
    //       latitude: 10.890244509604937,
    //       longitude: 106.7674527621348,
    //       name: "fdfsdfs",
    //       phone: "098763453454",
    //     },
    //     fee: 10,
    //     note: "nádasdas",
    //     status: "Đang giao",
    //     date_create: new Date(),
    //     distance: Number(13.4),
    //     total: Number(2894400),
    //     expectedTime: Number(18),
    //     good_type: "Nội thất",
    //     truck_type: 20,
    //     list_image_from: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //     shipper: {
    //       id_shipper: "6439f2668d7fc50f4ba74a87",
    //       truck: "643a0a17a3ad43497f0907c0",
    //     },
    //     list_image_from_of_shipper: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //   };
    //   const order = new Order(data);
    //   await order.save();
    // }

    //Đã giao
    // for (let i =45; i <60; i++) {
    //   const data = {
    //     id_order: "ODR23000" + i,
    //     id_customer: "63f786dd27c666036e4e7193",
    //     payer: "send",
    //     from_address: {
    //       address: "RMCQ+72W, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh, Vietnam",
    //       latitude: 10.820685261169594,
    //       longitude: 106.68763093650341,
    //       name: "Quoc",
    //       phone: "092364334532",
    //     },
    //     to_address: {
    //       address: "58/5K Truông Tre, Linh Xuân, Thủ Đức, Bình Dương, Việt Nam",
    //       latitude: 10.890244509604937,
    //       longitude: 106.7674527621348,
    //       name: "fdfsdfs",
    //       phone: "098763453454",
    //     },
    //     fee: 10,
    //     note: "nádasdas",
    //     status: "Đã giao",
    //     date_create: new Date(),
    //     distance: Number(13.4),
    //     total: Number(2894400),
    //     expectedTime: Number(18),
    //     good_type: "Nội thất",
    //     truck_type: 20,
    //     list_image_from: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //     shipper: {
    //       id_shipper: "6439f2668d7fc50f4ba74a87",
    //       truck: "643a0a17a3ad43497f0907c0",
    //     },
    //     list_image_from_of_shipper: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //     list_image_to_of_shipper: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //     rate_shipper: {
    //       content: "cvbcvbcvb",
    //       star: 5,
    //       time: new Date(),
    //     },
    //     addressToOfShipper: {
    //       address: "58/5K Truông Tre, Linh Xuân, Thủ Đức, Bình Dương, Việt Nam",
    //       latitude: 10.890244509604937,
    //       longitude: 106.7674527621348,
    //       name: "fdfsdfs",
    //       phone: "098763453454",
    //     },
    //   };

    //   const order = new Order(data);
    //   await order.save();
    // }

    //Đã hủy
    // for (let i = 60; i < 75; i++) {
    //   const data = {
    //     id_order: "ODR23000" + i,
    //     id_customer: "63f786dd27c666036e4e7193",
    //     payer: "send",
    //     from_address: {
    //       address: "RMCQ+72W, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh, Vietnam",
    //       latitude: 10.820685261169594,
    //       longitude: 106.68763093650341,
    //       name: "Quoc",
    //       phone: "092364334532",
    //     },
    //     to_address: {
    //       address: "58/5K Truông Tre, Linh Xuân, Thủ Đức, Bình Dương, Việt Nam",
    //       latitude: 10.890244509604937,
    //       longitude: 106.7674527621348,
    //       name: "fdfsdfs",
    //       phone: "098763453454",
    //     },
    //     fee: 10,
    //     note: "nádasdas",
    //     status: "Đã hủy",
    //     date_create: new Date(),
    //     distance: Number(13.4),
    //     total: Number(2894400),
    //     expectedTime: Number(18),
    //     good_type: "Nội thất",
    //     truck_type: 20,
    //     list_image_from: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //     shipper: {
    //       id_shipper: "6439f2668d7fc50f4ba74a87",
    //       truck: "643a0a17a3ad43497f0907c0",
    //     },
    //     list_image_from_of_shipper: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //     list_image_to_of_shipper: [
    //       "https://firebasestorage.googleapis.com/v0/b/kltn-5be2b.appspot.com/o/36863895-9eaa-7c93-398a-167d5f5301d6?alt=media&token=8f6bb608-4fd8-42b5-896f-535c532be6e4",
    //     ],
    //     rate_shipper: {
    //       content: "cvbcvbcvb",
    //       star: 5,
    //       time: new Date(),
    //     },
    //     addressToOfShipper: {
    //       address: "58/5K Truông Tre, Linh Xuân, Thủ Đức, Bình Dương, Việt Nam",
    //       latitude: 10.890244509604937,
    //       longitude: 106.7674527621348,
    //       name: "fdfsdfs",
    //       phone: "098763453454",
    //     },
    //     reason_cancel: {
    //       user_cancel: "AutoDelete",
    //       content: "huy",
    //       date_cancel: new Date(),
    //     },
    //   };
    //   const order = new Order(data);
    //   await order.save();
    // }

    res.send({
      status: "ok",
      message: "Thành công",
      data: {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = app;
