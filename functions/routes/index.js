const express = require("express");
const Controller = require("../controllers");
const router = express.Router();

// USER API
router.post("/api/user/create", Controller.user.createUser);
router.post("/api/user/vote", Controller.user.doVoting);
router.post("/api/user/ticket", Controller.user.sendEmail);
router.get("/api/user/decodetoken", Controller.user.decodeToken);
router.get("/api/user/sendemail", Controller.user.sendEmail);
router.get("/api/user/get", Controller.user.getUser);
router.post("/api/user/readqr", Controller.user.readQr);
router.get("/grant/entry/:id", Controller.user.grantEntry);

//ACC API
router.post("/api/accommodation/create", Controller.acc.accCreate);
router.get("/api/acc/get/data", Controller.acc.getAll);

module.exports = router;
