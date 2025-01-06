const express = require("express");
const router = express.Router();
const { uptimeCheck } = require("../controllers/uptime");

router.head("/", uptimeCheck);

module.exports = router;
