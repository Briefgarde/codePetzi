# Urbanisation des SI 
## Cas Case à Chocs

This project is a small-scale Proof of Concept intented to show how the Case a Chocs can integrate in their system the automatic update of any sales from their partner website Petzi. This project uses Firebase Function and Firestore for hanlding the webhook and data persistence, as well as Google Pub/Sub to allow for automatic update. 

## Project Structure

The project is structured as follows:

- `index.js`: This is the main file used to define the Firebase Functions. Those catches the webhook and handle the logic of persisting the data. 
- `validateSignature.js`: This file contains the logic for validating the signature of the incoming webhook.
- `website/`: This directory contains the static files for the website. It is run via the `app.js` file.  
- `postSimulator/petzi_simulator.py`: This is a Python script for simulating POST requests to the webhook.

## Requirement
1. Python 3.8 or above is required for the Google CLI

## Setup

1. Clone the repository.
2. Run `npm install` to install the necessary dependencies.
    - It might be necessary to run this command at two levels, both at the root and at `/functions`. 
3. Set up the Firebase CLI and log in to your Firebase account.
    - It is better to make sure the correct Firebase is linked to this project, and for this you need to have been added to the project. 
    - If this isn't the case, please email nemo.vollert@he-arc.ch with your firebase email so I can add you.
        - If you'd prefer to create your own firebase to test this POC, you may need to change some elements in the firebase.json among other things, as well as recreate the Google Pub/Sub topic. 
4. Deploy your Firestore rules and indexes with `firebase deploy --only firestore:rules,firestore:indexes`.
5. Deploy your Cloud Functions with `firebase deploy --only functions`.

## Running the Application

1. Start the website with `node app.js`.
2. Navigate to `http://localhost:8080` in your web browser to view the website.
3. Use the `petzi_simulator.py` script to simulate POST requests to the webhook.
    - The scripts take in three parameters : 
        - The URL for the webhook catcher
            - If you use the base Firebase, it is https://us-central1-codepetzi.cloudfunctions.net/webhook/webhookTestCatching
        - The secret code 
            - The base secret is "queenQuarter". Note the minuscule at the start. 
        - The number of time you'd like the POST call to be made. 
4. This website very simply display a counter for every message it receive while it is active. It is not intented to display any more advanced statistics. 

## Note

This is a proof of concept and is not intended for production use. Please ensure you understand the code and its implications before using it in a production environment.