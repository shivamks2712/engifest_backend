const express = require("express");
const Controller = require("../controllers");
const router = express.Router();

// //USER API
// router.post("/api/user/create", Controller.user.createUser);
// router.get("/api/user/get", Controller.user.getUser);

// //PARTICIPANTS API
// router.post("/api/participant/create", Controller.participant.addParticipants);

router.use("/api", require("./api"));

module.exports = router;
