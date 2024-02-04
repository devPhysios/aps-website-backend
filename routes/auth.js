const express = require('express')
const router = express.Router()
// const { register, login, registerMultipleStudents } = require('../controllers/auth');
router.post('/register', register)
router.post('/login', login)

// router.post('/populate', registerMultipleStudents)

module.exports = router