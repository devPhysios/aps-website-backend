const express = require("express");
const router = express.Router();
const {
  getStudentDetails,
  createStudentBirthday,
  updateStudentBirthday,
  getStudentBirthdays,
  getAllBirthdayEvents,
  deleteStudentBirthday,
  getBirthdaysByMonth,
  getStudentBirthdaysByMatricNumber,
} = require("../controllers/birthdays");
const verifyToken = require("../middleware/authentication");
// router.post('/register', register)

router.get("/student/:studentMatricNumber", verifyToken, getStudentDetails);
router.get("/allevents", verifyToken, getAllBirthdayEvents);
router.get("/birthdayevents", getStudentBirthdays);
router.get("/bymonth/:month", getBirthdaysByMonth);
router.get("/birthdayevents/:matricNumber", getStudentBirthdaysByMatricNumber);
router.post("/create", verifyToken, createStudentBirthday);
router.patch("/update", verifyToken, updateStudentBirthday);
router.delete("/delete", verifyToken, deleteStudentBirthday);

module.exports = router;
