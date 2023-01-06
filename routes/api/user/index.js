const express = require("express");
const router = express.Router();
const userApi = require('../../../controllers/api/user/user')

// For Authentication
router.post("/auth", userApi.auth);

module.exports = router;