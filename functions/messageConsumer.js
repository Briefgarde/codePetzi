/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");

exports.consumeMessage2 = functions.pubsub.topic("webhookPetzi").onPublish((message) => {
  let ticketNumber = null;
  try {
    ticketNumber = message.json.ticketNumber;
    logger.log("Message received : ", ticketNumber);
    return Promise.resolve();
  } catch (e) {
    logger.error("PubSub message was not JSON", e);
    return Promise.reject(e);
  }
});
