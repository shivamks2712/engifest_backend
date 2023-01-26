const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Middleware = require("./middleware/middleware");

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(Middleware.authChecker);

// All Routes
app.use("/", require("./routes"));

//Default Route
app.get("/", (req, res) => {
  return res.status(200).json({ working: true });
});

//Incase of Invalid route
app.get("/*", (req, res) => {
  return res.status(401).json({ message: "Route does not exist :(" });
});

const port = process.env.PORT;
//Server
app.listen(port, () => {
  console.log("Server started at port", port);
});

exports.app = functions.https.onRequest(app);