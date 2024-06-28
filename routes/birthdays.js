const express = require("express");
const router = express.Router();
const {
  getStudentDetails,
  createStudentBirthday,
  updateStudentBirthday,
  getStudentBirthdays,
} = require("../controllers/birthdays");
const verifyToken = require("../middleware/authentication");
// router.post('/register', register)

router.get("/student/:studentMatricNumber", verifyToken, getStudentDetails);
router.get("/birthdayevents", getStudentBirthdays);
router.post("/create", verifyToken, createStudentBirthday);
router.patch("/update", verifyToken, updateStudentBirthday);

module.exports = router;
