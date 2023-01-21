const express = require("express");
const Controller = require("../controllers");
const router = express.Router();

// USER API
router.post("/api/user/create", Controller.user.createUser);
router.post("/api/user/vote", Controller.user.doVoting);
router.get("/api/user/decodetoken", Controller.user.decodeToken);
router.get("/api/user/get", Controller.user.getUser);
router.get("/grant/entry/:id", Controller.user.grantEntry);


module.exports = router;
