const exprees = require("express");
const mongoose = require("mongoose");
const Conversation = require("../models/conversation");

const Message = require("../models/message");
const Shipper = require("../models/shipper");
const app = exprees();

app.get("/:id_customer", async (req, res) => {
  try {
    const listConversation = await Conversation.find({
      id_customer: mongoose.Types.ObjectId(req.params.id_customer),
      form_model: "Order",
      // disable: false,
    })
      .lean()
      .populate("id_customer id_shipper id_form");
    for (let i = 0; i < listConversation.length; i++) {
      const lastMessage = await Message.findOne(
        { id_conversation: listConversation[i]._id },
        {},
        { sort: { createdAt: -1 } }
      );
      if (lastMessage) {
        listConversation[i].lastMess = lastMessage.message;
        listConversation[i].timeLastMess = lastMessage.createdAt;
      } else {
        listConversation[i].lastMess = "";
        listConversation[i].timeLastMess = new Date();
      }
    }
    listConversation.sort(
      (a, b) => new Date(b.timeLastMess) - new Date(a.timeLastMess)
    );
    res.send(listConversation);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/shipper/:id_shipper", async (req, res) => {
  try {
    const listConversation = await Conversation.find({
      id_shipper: mongoose.Types.ObjectId(req.params.id_shipper),
      form_model: "Order",
      // disable: false,
    })
      .lean()
      .populate("id_customer id_shipper id_form");

    for (let i = 0; i < listConversation.length; i++) {
      try {
        const lastMessage = await Message.findOne(
          { id_conversation: listConversation[i]._id },
          {},
          { sort: { createdAt: -1 } }
        );
        listConversation[i].lastMess = lastMessage.message;
        listConversation[i].timeLastMess = lastMessage.createdAt;
      } catch (error) {
        listConversation[i].lastMess = "";
        listConversation[i].timeLastMess = new Date();
      }
    }
    listConversation.sort(
      (a, b) => new Date(b.timeLastMess) - new Date(a.timeLastMess)
    );
    res.send(listConversation);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.post("/", async (req, res) => {
  try {
    const haveConversation = await Conversation.findOne({
      id_customer: mongoose.Types.ObjectId(req.body.id_customer),
      id_shipper: mongoose.Types.ObjectId(req.body.id_shipper),
      id_form: req.body.id_form,
    })
      .lean()
      .populate("id_customer id_shipper");
    if (haveConversation) {
      res.send(haveConversation);
    } else {
      const conversation = new Conversation(req.body);
      await conversation.save();
      const cvs = await Conversation.findOne({
        id_customer: mongoose.Types.ObjectId(req.body.id_customer),
        id_shipper: mongoose.Types.ObjectId(req.body.id_shipper),
        id_form: req.body.id_form,
      })
        .lean()
        .populate("id_customer id_shipper");
      res.send(cvs);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/admin/conversation", async (req, res) => {
  try {
    const { id_form, form_model, id_customer, id_admin } = req.query;
    const haveConversation = await Conversation.findOne({
      id_form: mongoose.Types.ObjectId(id_form),
    })
      .lean()
      .populate("id_form id_customer id_admin");
    if (haveConversation) {
      res.send(haveConversation);
    } else {
      const conversation = new Conversation({
        id_form: id_form,
        form_model: form_model,
        id_customer: id_customer,
        id_admin: id_admin,
        disable: false,
      });
      await conversation.save();
      const cvs = await Conversation.findById(conversation._id)
        .lean()
        .populate("id_form id_customer id_admin");
      res.send(cvs);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/message/:id_conversation", async (req, res) => {
  try {
    const listMessage = await Message.find({
      id_conversation: mongoose.Types.ObjectId(req.params.id_conversation),
    }).populate("id_sender");

    listMessage.sort((a, b) => a.createdAt - b.createdAt);

    res.send(listMessage);
  } catch (error) {
    res.status(500).send({ data: "error" });
  }
});

app.post("/message", async (req, res) => {
  try {
    const mess = new Message(req.body);
    await mess.save();
    res.send(mess);
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.put("/disable", async (req, res) => {
  try {
    console.log(req.body);
    const cvs = await Conversation.findOneAndUpdate(
      { id_form: req.body._id },
      {
        disable: true,
      },
      { new: true }
    );
    console.log(cvs);
    if (cvs) {
      res.send(cvs);
    } else {
      res.send({ data: "Không có cuộc hội thoại" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

app.get("/form/:id_form", async (req, res) => {
  try {
    const { id_form } = req.params;
    const haveConversation = await Conversation.findOne({
      id_form: mongoose.Types.ObjectId(id_form),
    })
      .lean()
      .populate("id_form id_customer id_admin");
    if (haveConversation && haveConversation._id) {
      res.send(haveConversation);
    } else {
      res.send({ isNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: "error" });
  }
});

module.exports = app;
