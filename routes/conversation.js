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
    })
      .lean()
      .populate("id_customer id_shipper");

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
    listConversation.sort((a, b) => a.timeLastMess - b.timeLastMess);
    res.send(listConversation);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/shipper/:id_shipper", async (req, res) => {
  try {
    const listConversation = await Conversation.find({
      id_shipper: mongoose.Types.ObjectId(req.params.id_shipper),
    })
      .lean()
      .populate("id_customer id_shipper");

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
    listConversation.sort((a, b) => a.timeLastMess - b.timeLastMess);
    res.send(listConversation);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const haveConversation = await Conversation.findOne({
      id_customer: mongoose.Types.ObjectId(req.body.id_customer),
      id_shipper: mongoose.Types.ObjectId(req.body.id_shipper),
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
      })
        .lean()
        .populate("id_customer id_shipper");
      res.send(cvs);
    }
  } catch (error) {
    res.status(500).send(error);
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
    res.status(500).send(error);
  }
});

app.post("/message", async (req, res) => {
  try {
    const mess = new Message(req.body);
    await mess.save();
    res.send(mess);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
