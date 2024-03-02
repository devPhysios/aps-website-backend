const express = require('express');
const router = express.Router();

const { updateStudent, getStudentDetails } = require('../controllers/profile');
const verifyToken = require('../middleware/authentication')

router.patch('/:id', verifyToken, updateStudent)
router.post('/:id', verifyToken, getStudentDetails)

module.exports = router