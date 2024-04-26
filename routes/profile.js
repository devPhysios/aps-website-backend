const express = require('express');
const router = express.Router();

const { updateStudent, getStudentDetails } = require('../controllers/profile');
const verifyToken = require('../middleware/authentication')

router.patch('/profile', verifyToken, updateStudent)
router.route("/:id").get(getStudentDetails);

module.exports = router
