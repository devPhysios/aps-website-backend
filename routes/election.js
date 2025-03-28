const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentByMatricNumber,
} = require("../controllers/election");

// Get all students for election
router.get("/students", getAllStudents);

// Get student by matric number
router.get("/students/:matricNumber", getStudentByMatricNumber);

module.exports = router;
