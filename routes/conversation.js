const exprees = require("express");
const { default: mongoose } = require("mongoose");
const Conversation = require("../models/conversation");

const Message = require("../models/message");
const Shipper = require("../models/shipper");
const app = exprees();

app.get("/:id_customer", async (req, res) => {
  try {
    const listConversation = await Conversation.find({
      id_customer: mongoose.Types.ObjectId(req.params.id_customer),
    }).lean()
    .populate("id_customer id_shipper");


    for (let i = 0; i < listConversation.length; i++) {
      const lastMessage = await Message.findOne(
        { id_conversation: listConversation[i]._id },
        {},
        { sort: { createdAt: -1 } }
      );
      listConversation[i].lastMess = lastMessage.message;
    }
    
    res.send(listConversation);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const checkHaveConversation = await Conversation.find({
      id_customer: mongoose.Types.ObjectId(req.body.id_customer),
      id_shipper: mongoose.Types.ObjectId(req.body.id_shipper),
    });
    if (checkHaveConversation.length == 0) {
      const conversation = new Conversation(req.body);
      await conversation.save();
      res.send(conversation);
    } else {
      res.send(checkHaveConversation);
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
