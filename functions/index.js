/* eslint-disable require-jsdoc */
const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const {PubSub} = require("@google-cloud/pubsub");
const messageConsumer = require("./messageConsumer");
const validateSignature = require("./validateSignature");


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const pubsub = new PubSub();
const webhookPetziPubSubName = "projects/codepetzi/topics/webhookPetzi";

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({origin: true}));
/* ---------------------------*/
// this is needed to obtain the correct body for the validateSignature function
app.use(bodyParser.json());
/* ---------------------------*/
app.post("/webhookTestCatching", async (req, res) => {
  const ticketNumber = req.body.details.ticket.number;
  /* ----------------This vv section cover the receiving of the webhook, and writing it to the firestore-----------*/
  if (validateSignature.validateSignature(req.headers["petzi-signature"], req.rawBody)) {
    console.log("Signature is valid");
    const writeResult = await db
        .collection("webhookPetzi")
        .doc(ticketNumber)
        .set({ticketInfo: req.body,
          ticketNumber: ticketNumber});
    console.log("wrote result here:", writeResult.id);
    logger.log("wrote result here:", writeResult.id);
  } else {
    console.log("Signature is invalid");
    res
        .status(200)
        .send("Webhook received successfully, but the signature is invalid");
  }

  try {
    logger.log("Starting pubsub section");
    const dataBuffer = Buffer.from(JSON.stringify({ticketNumber: ticketNumber}));
    const messageID = await pubsub.topic(webhookPetziPubSubName).publishMessage({data: dataBuffer});
    logger.log("Message sent to pubsub", messageID);

    res.status(200).send("Message published successfully");
  } catch (error) {
    console.error("Could not publish message:", error);
    res.status(500).send("Publishing message to pubsub failed. Please retry when it's working");
  }
  /* ----------------------------^^-------------------------------------*/
});

exports.messageConsumer = messageConsumer.consumeMessage2;

exports.webhook = functions.https.onRequest(app);

