/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
const express = require("express");
const {PubSub} = require("@google-cloud/pubsub");
const app = express();
const port = 3000;

// eslint-disable-next-line no-unused-vars
const projectId = "codepetzi";
// eslint-disable-next-line no-unused-vars
const topicName = "projects/codepetzi/topics/webhookPetzi";
// eslint-disable-next-line no-unused-vars
const subscriptionNameOrId = "projects/codepetzi/subscriptions/webhookPetzi-sub";
// eslint-disable-next-line no-unused-vars
const timeout = 60;
let counter = 0;
let messageContent = null;

const pubSubClient = new PubSub();

function listenForMessages(subscriptionNameOrId, timeout) {
  //
  const subscription = pubSubClient.subscription(subscriptionNameOrId);

  const messageHandler = (message) => {
    counter += 1;
    messageContent = message.data;

    message.ack();
  };

  subscription.on("message", messageHandler);
}

listenForMessages(subscriptionNameOrId, timeout);

app.get("/", (req, res) => {
  res.send(`Counter: ${counter} Message: ${messageContent}`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
