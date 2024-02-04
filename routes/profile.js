const express = require('express');
const router = express.Router();

const { updateStudent, getStudentDetails } = require('../controllers/profile');

router.route("/:id").patch(updateStudent);
router.route("/:id").get(getStudentDetails);

module.exports = router