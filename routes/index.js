const express = require("express");
const Controller = require("../controllers");
const router = express.Router();

// USER API
router.post("/api/user/create", Controller.user.createUser);
router.post("/api/user/vote", Controller.user.doVoting);
router.get("/api/user/decodetoken", Controller.user.decodeToken);
router.get("/api/user/get", Controller.user.getUser);
router.get("/grant/entry/:id", Controller.user.grantEntry);

// PARTICIPANTS API
router.post("/api/participant/create", Controller.participant.addParticipants);

// PAYMENTS API
router.get("/api/payment/create", Controller.payments.createOrder);
router.post("/api/payment/callback", Controller.payments.paymentCallback);

module.exports = router;
