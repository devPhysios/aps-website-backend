const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authentication')

const { updateStudent, getStudentDetails } = require('../controllers/profile');

router.patch("/", verifyToken, updateStudent);
router.route("/:id").get(getStudentDetails);

module.exports = router