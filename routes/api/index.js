const express = require("express");
const router = express.Router();

// For Authentication
router.use("/user", require("./user"));

module.exports = router;