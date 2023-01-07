const express = require("express");
const Controller = require("../controllers");
const router = express.Router();

// USER API
router.post("/api/user/create", Controller.user.createUser);
router.get("/api/user/decodetoken", Controller.user.decodeToken);
router.get("/api/user/get", Controller.user.getUser);

// PARTICIPANTS API
router.post("/api/participant/create", Controller.participant.addParticipants);

// PAYMENTS API
router.get("/api/payment/create", Controller.payments.createOrder);

module.exports = router;
