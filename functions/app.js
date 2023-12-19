const express = require("express");
const {PubSub} = require("@google-cloud/pubsub");
const app = express();
const pubSubClient = new PubSub();
const subscriptionName = "projects/codepetzi/subscriptions/webhookPetzi-sub"; // replace with your subscription name

const clients = [];

app.use(express.static("website")); // serve your HTML file

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  clients.push(res);
});
let count = 0;

const messageHandler = (message) => {
  count += 1;
  clients.forEach((res) =>
    res.write(`data: ${JSON.stringify({count, message: message.data.toString()})}\n\n`),
  );
  message.ack();
};

const subscription = pubSubClient.subscription(subscriptionName);
subscription.on("message", messageHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
