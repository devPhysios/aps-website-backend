const express = require("express");
const router = express.Router();
const { createBulkQuestions } = require("../controllers/bulkquestions");
const authenticateStudent = require("../middleware/authentication");

// Create bulk questions (requires student authentication)
router.post("/", authenticateStudent, createBulkQuestions);

module.exports = router;
