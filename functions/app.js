/* eslint-disable no-unused-vars */
const express = require("express");
const {PubSub} = require("@google-cloud/pubsub");
const app = express();
const pubSubClient = new PubSub();
const subscriptionName = "projects/codepetzi/subscriptions/webhookPetzi-sub";
//  ----------Part 2: Firestore----------------
const {initializeApp, applicationDefault, cert} = require("firebase-admin/app");
const {getFirestore, Timestamp, FieldValue, Filter} = require("firebase-admin/firestore");

const serviceAccount = require("../keys/keysFirestore.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
//  ------------------------------------------

const clients = [];

app.use(express.static("website"));

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  clients.push(res);
});
let count = 0;

const messageHandler = (message) => {
  count += 1;
  clients.forEach(async (res) =>{
    // get ticket number from json
    const ticketNumber = JSON.parse(message.data.toString()).ticketNumber;
    const cityRef = db.collection("webhookPetzi").doc(ticketNumber);
    const result = await cityRef.get();
    console.log(result.data().ticketInfo);


    res.write(`data: ${JSON.stringify({count: count, message: result.data().ticketInfo})}\n\n`);
  });
  message.ack();
};

const subscription = pubSubClient.subscription(subscriptionName);
subscription.on("message", messageHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
